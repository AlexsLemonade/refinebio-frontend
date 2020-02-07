import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Loader from '../../../components/Loader';
import Button from '../../../components/Button';
import ExpandButton from './ExpandButton';
import {
  formatSentenceCase,
  truncateOnWord,
  maxTableWidth,
} from '../../../common/helpers';
import slugify from '../../../common/slugify';
import './Experiment.scss';

import AccessionIcon from '../../../common/icons/accession.svg';
import SampleIcon from '../../../common/icons/sample.svg';
import OrganismIcon from '../../../common/icons/organism.svg';
import BackToTop from '../../../components/BackToTop';

import Anchor from '../../../components/Anchor';
import Spinner from '../../../components/Spinner';
import InfoBox from '../../../components/InfoBox';
import Checkbox from '../../../components/Checkbox';
import { goBack } from '../../../state/routerActions';
import DataSetStats from '../../../common/DataSetStats';
import Technology, { getTechnologies } from './Technology';
import { NDownloadableSamples } from '../../../components/Strings';
import ScrollTopOnMount from '../../../components/ScrollTopOnMount';
import DataSetSampleActions from '../../../components/DataSetSampleActions';

import * as routes from '../../../routes';
import { getExperiment } from '../../../api/experiments';
import NoMatch from '../../../components/NoMatch';
import { ServerError } from '../../../common/errors';
import ServerErrorPage from '../../ServerError';
import { Hightlight, HText } from '../../../components/HighlightedText';
import RequestExperimentButton from './RequestExperimentButton';
import SamplesTable from '../../../components/SamplesTable/SamplesTable';

const { searchUrl } = routes;

const DatabaseNames = {
  GEO: 'Gene Expression Omnibus (GEO)',
  SRA: 'Sequence Read Archive (SRA)',
  ARRAY_EXPRESS: 'ArrayExpress',
};

let Experiment = ({
  // location: { state },
  goBack,
  hasError,
  error,
  experiment,
}) => {
  const router = useRouter();
  const state = {}; // TODO REMOVE
  // check for the parameter `ref=search` to ensure that the previous page was the search
  const comesFromSearch = state && state.ref === 'search';
  const { accessionCode } = router.query;

  if (hasError) {
    return (
      <div className="layout__content">
        {error && error instanceof ServerError && error.status === 404 ? (
          <NoMatch />
        ) : (
          <ServerErrorPage />
        )}
      </div>
    );
  }

  let displaySpinner = false; // isLoading;
  let experimentData = experiment || { samples: [] };
  let totalSamples = experimentData.samples.length;
  const numDownloadableSamples = experimentData['num_downloadable_samples'];

  // for users coming from the search, see if there's any experiment's data in the url state
  if (comesFromSearch && state.result) {
    displaySpinner = false;
    experimentData = {
      ...state.result,
      samples: [],
    };
    totalSamples = state.result.total_samples_count;
  }

  return displaySpinner ? (
    <div className="layout__content">
      <Spinner />
    </div>
  ) : (
    <Hightlight match={comesFromSearch && state.query}>
      <div className="layout__content">
        <InfoBox />

        <ScrollTopOnMount />
        {comesFromSearch && (
          <Button
            text="Back to Results"
            buttonStyle="secondary"
            onClick={goBack}
          />
        )}

        <div className="experiment">
          <ExperimentHelmet experiment={experimentData} />
          <BackToTop />
          <div className="experiment__accession">
            <img
              src={AccessionIcon}
              className="experiment__stats-icon"
              alt="Accession Icon"
            />
            <HText>{experimentData.accession_code}</HText>
          </div>

          <div className="experiment__header">
            <h1 className="experiment__header-title mobile-p">
              <HText>{experimentData.title || 'No Title.'}</HText>
            </h1>
            <div>
              {numDownloadableSamples === 0 ? (
                <RequestExperimentButton accessionCode={accessionCode} />
              ) : (
                <DataSetSampleActions
                  dataSetSlice={{
                    [experimentData.accession_code]: {
                      all: true,
                      total: numDownloadableSamples,
                    },
                  }}
                />
              )}
            </div>
          </div>

          <div className="experiment__stats">
            <div className="experiment__stats-item">
              <img
                src={OrganismIcon}
                className="experiment__stats-icon"
                alt="Organism Icon"
              />{' '}
              {experimentData.organism_names.length
                ? experimentData.organism_names
                    .map(organism => formatSentenceCase(organism))
                    .join(', ')
                : 'No species.'}
            </div>
            <div className="experiment__stats-item">
              <img
                src={SampleIcon}
                className="experiment__stats-icon"
                alt="Sample Icon"
              />{' '}
              <NDownloadableSamples total={numDownloadableSamples} />
            </div>

            <div
              className={classnames('experiment__stats-item', {
                'experiment__stats-item--lg':
                  getTechnologies(experimentData.samples).length > 3,
              })}
            >
              <Technology samples={experimentData.samples} />
            </div>
          </div>

          <h4 className="experiment__title">Submitter Supplied Information</h4>

          <div>
            <ExperimentHeaderRow label="Description">
              <HText>{experimentData.description}</HText>
            </ExperimentHeaderRow>
            <ExperimentHeaderRow label="PubMed ID">
              {(experimentData.pubmed_id && (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                    experimentData.pubmed_id
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {experimentData.pubmed_id}
                </a>
              )) || (
                <i className="experiment__not-provided">
                  No associated PubMed ID
                </i>
              )}
            </ExperimentHeaderRow>
            <ExperimentHeaderRow label="Publication Title">
              {(experimentData.publication_title && (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                    experimentData.pubmed_id
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  <HText>{experimentData.publication_title}</HText>
                </a>
              )) || (
                <i className="experiment__not-provided">
                  No associated publication
                </i>
              )}
            </ExperimentHeaderRow>
            <ExperimentHeaderRow label="Total Samples">
              {totalSamples}
            </ExperimentHeaderRow>
            <ExperimentHeaderRow label="Submitter’s Institution">
              {(experimentData.submitter_institution && (
                <Link
                  href={searchUrl({
                    q: `submitter_institution: ${
                      experimentData.submitter_institution
                    }`,
                  })}
                >
                  <a className="link">
                    <HText>{experimentData.submitter_institution}</HText>
                  </a>
                </Link>
              )) || (
                <i className="experiment__not-provided">
                  No associated institution
                </i>
              )}
            </ExperimentHeaderRow>
            <ExperimentHeaderRow label="Authors">
              {experimentData.publication_authors.length > 0 ? (
                experimentData.publication_authors
                  .map(author => (
                    <Link
                      href={searchUrl({
                        q: `publication_authors:${author}`,
                      })}
                    >
                      <a className="link">
                        <HText>{author}</HText>
                      </a>
                    </Link>
                  ))
                  .reduce((previous, current) => (
                    <React.Fragment>
                      {previous}
                      {', '}
                      {current}
                    </React.Fragment>
                  ))
              ) : (
                <i className="experiment__not-provided">
                  No associated authors
                </i>
              )}
            </ExperimentHeaderRow>
            {experimentData.source_database && (
              <ExperimentHeaderRow label="Source Repository">
                <a
                  href={experimentData.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {DatabaseNames[experimentData.source_database]}
                </a>
              </ExperimentHeaderRow>
            )}
          </div>
        </div>
      </div>
      <SamplesTableBlock experiment={experimentData} />
    </Hightlight>
  );
};
Experiment = connect(
  null,
  { goBack }
)(Experiment);
Experiment.getInitialProps = async ctx => {
  const { accessionCode } = ctx.query;
  let experiment;
  try {
    experiment = await getExperiment(accessionCode);
  } catch (error) {
    ctx.res.statusCode = error.status;
    return { hasError: true, error };
  }

  return { experiment };
};

export default Experiment;

function experimentSlugMatches(slug, experimentTitle) {
  if (!slug) return false;
  // since the slug is the last parameter it can contain a hash, ensure that's not considered
  const slugWithoutHash = slug.split('#')[0];
  return slugWithoutHash === slugify(experimentTitle);
}

function ExperimentHelmet({ experiment }) {
  return (
    <Helmet>
      {experiment.title && <title>{experiment.title} - refine.bio</title>}
      {experiment.description && (
        <meta
          name="description"
          content={truncateOnWord(experiment.description, 160)}
        />
      )}
      <link
        rel="canonical"
        href={`https://www.refine.bio${routes.experiments(experiment)}`}
      />
    </Helmet>
  );
}

function ExperimentHeaderRow({ label, children }) {
  return (
    <div className="experiment__row">
      <div className="experiment__row-label">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function SamplesTableBlock({ experiment }) {
  const [expanded, setExpanded] = React.useState(false);
  const totalColumns = 4 + (experiment ? experiment.sample_metadata.length : 0);
  const style = expanded
    ? { maxWidth: Math.max(1175, maxTableWidth(totalColumns)) }
    : {};
  const totalProcessedSamples = experiment
    ? experiment.samples.filter(x => x.is_processed).length
    : 0;

  return (
    <div
      className="layout__content experiment__samples-table-block"
      style={style}
    >
      <div className="experiment">
        <Anchor name="samples">
          <div className="experiment__header">
            <h2 className="experiment__title mobile-p">Samples</h2>
            <div>
              {experiment && (
                <DataSetSampleActions
                  dataSetSlice={{
                    [experiment.accession_code]: {
                      all: true,
                      total: totalProcessedSamples,
                    },
                  }}
                />
              )}
            </div>
          </div>
          {!experiment ? (
            <div className="experiment__sample-table-loading-wrap">
              <Spinner />
            </div>
          ) : (
            <ExperimentSamplesTable
              experiment={experiment}
              filterActionComponent={() =>
                totalColumns > 5 && (
                  <div className="experiment__sample-table-expand">
                    <ExpandButton
                      expanded={expanded}
                      onClick={() => setExpanded(!expanded)}
                    />
                  </div>
                )
              }
            />
          )}
        </Anchor>
      </div>
    </div>
  );
}

class ExperimentSamplesTable extends React.Component {
  state = {
    showOnlyAddedSamples: false,
  };

  /**
   * Builds a dataset slice, that only contains the current experiment accession code
   * with it's processed samples
   */
  getDataSetSlice() {
    const { experiment } = this.props;

    return {
      [experiment.accession_code]: DataSetStats.mapAccessions(
        experiment.samples
      ),
    };
  }

  render() {
    const { experiment } = this.props;

    return (
      <SamplesTable
        sampleMetadataFields={this.props.experiment.sample_metadata}
        experimentSampleAssociations={{
          [experiment.accession_code]: this.props.experiment.samples.map(
            x => x.accession_code
          ),
        }}
        fetchSampleParams={{
          experiment_accession_code: experiment.accession_code,
          dataset_id: this.state.showOnlyAddedSamples
            ? this.props.dataSetId
            : undefined,
        }}
        pageSizeDropdown={({ dropdown, totalSamples }) => (
          <React.Fragment>
            Show {dropdown} of {totalSamples} Total Samples
          </React.Fragment>
        )}
        filterActionComponent={this.props.filterActionComponent}
        // Render prop for the button that adds the samples to the dataset
        pageActionComponent={() => {
          const stats = new DataSetStats(
            this.props.dataSet,
            this.getDataSetSlice()
          );
          return (
            <div className="experiment__sample-actions">
              <div className="mobile-p">
                <Checkbox
                  name="samples-dataset"
                  checked={this.state.showOnlyAddedSamples}
                  onChange={() =>
                    this.setState(state => ({
                      showOnlyAddedSamples: !state.showOnlyAddedSamples,
                    }))
                  }
                  disabled={
                    !this.state.showOnlyAddedSamples &&
                    !stats.anyProcessedInDataSet()
                  }
                >
                  Show only samples in current dataset
                </Checkbox>
              </div>
            </div>
          );
        }}
      />
    );
  }
}

ExperimentSamplesTable = connect(({ download: { dataSetId, dataSet } }) => ({
  dataSetId,
  dataSet,
}))(ExperimentSamplesTable);
