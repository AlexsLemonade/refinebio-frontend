import React from 'react';
import Button from '../../components/Button';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { RemoveFromDatasetButton } from '../Results/Result';
import { getAllDetailedSamples } from '../../api/samples';
import ModalManager from '../../components/Modal/ModalManager';
import FileIcon from './file.svg';
import ProcessIcon from './process.svg';

import './SamplesTable.scss';

const PAGE_SIZES = [10, 20, 50];

export default class SamplesTable extends React.Component {
  state = {
    page: 0,
    pages: -1,
    pageSize: 10,
    columns: this._getColumns(),
    data: []
  };

  handleAddSamplesToDataset = samples => {
    const { accessionCode: accession_code, addSamplesToDataset } = this.props;
    addSamplesToDataset([{ accession_code, samples }]);
  };

  handleRemoveSamplesFromDataset = sampleIds => {
    const { accessionCode, removeSamplesFromDataset } = this.props;
    removeSamplesFromDataset(accessionCode, sampleIds);
  };

  render() {
    const { samples, dataSet, accessionCode } = this.props;
    const totalPages = Math.ceil(samples.length / this.state.pageSize);

    return (
      <ReactTable
        manual={true}
        onFetchData={this.fetchData}
        loading={this.state.loading}
        pages={this.state.pages}
        data={this.state.data}
        page={this.state.page}
        pageSize={this.state.pageSize}
        className="samples-table"
        showPageSizeOptions={false}
        showPagination={false}
        columns={this.state.columns}
        ThComponent={ThComponent}
      >
        {(state, makeTable, instance) => {
          const samplesNotInDataset = state.pageRows.filter(x => {
            if (!dataSet[accessionCode]) return true;
            return dataSet[accessionCode].indexOf(x.id) === -1;
          });

          return (
            <div>
              <div className="experiment__sample-commands">
                <div>
                  Show
                  <Dropdown
                    options={PAGE_SIZES}
                    selectedOption={this.state.pageSize}
                    onChange={this.handlePageSizeChange}
                  />
                  of {samples.length} Samples
                </div>
                {samplesNotInDataset.length === 0 ? (
                  <RemoveFromDatasetButton
                    handleRemove={() =>
                      this.handleRemoveSamplesFromDataset(
                        state.pageRows.map(sample => sample.id)
                      )
                    }
                  />
                ) : (
                  <Button
                    text="Add Page to Dataset"
                    buttonStyle="secondary"
                    onClick={() =>
                      this.handleAddSamplesToDataset(state.pageRows)
                    }
                  />
                )}
              </div>
              <div className="experiment__table-container">{makeTable()}</div>

              <Pagination
                onPaginate={this.handlePagination}
                totalPages={totalPages}
                currentPage={this.state.page + 1}
              />
            </div>
          );
        }}
      </ReactTable>
    );
  }

  fetchData = async () => {
    const { page, pageSize } = this.state;
    this.setState({ loading: true });
    const samples = this.props.samples
      .slice(page * pageSize, (page + 1) * pageSize)
      .map(sample => sample.id);

    // TODO Right now we're paginating using the ids of the samples associated with the details of
    // the current experiment, and with those ids, this is fetching detailed information for each one
    // of them in a sepparate request.
    // We'll change this to use a single endpoint from the server and sort the samples information.
    const data = await getAllDetailedSamples(samples);

    // Customize the columns and their order depending on de data
    let columns = this._getColumns(data);

    this.setState({
      data,
      columns,
      pages: Math.ceil(this.props.samples.length / pageSize),
      loading: false
    });
  };

  handlePagination = page => {
    // Set the current page, and update the data afterwards
    this.setState({ page: page - 1 }, () => this.fetchData());
  };

  handlePageSizeChange = pageSize => {
    this.setState({ pageSize }, () => this.fetchData());
  };

  /**
   * Returns a custom column specification depending on the data passed.
   * - Empty Columns are hidden
   * - Columns with more values have higher priority
   * @param {Array} data Data that should be displayed in the table
   */
  _getColumns(data = []) {
    // 1. define all columns
    let columns = [
      {
        Header: 'Accession Code',
        id: 'accession_code',
        accessor: d => d.accession_code
      },
      {
        Header: 'Sex',
        id: 'sex',
        accessor: d => d.sex
      },
      {
        Header: 'Age',
        id: 'age',
        accessor: d => d.age
      },
      {
        Header: 'Specimen Part',
        id: 'specimen_part',
        accessor: d => d.specimen_part
      },
      {
        Header: 'Genotype',
        id: 'genotype',
        accessor: d => d.genotype
      },
      {
        Header: 'Disease',
        id: 'disease',
        accessor: d => d.disease
      },
      {
        Header: 'Disease Stage',
        id: 'disease_stage',
        accessor: d => d.disease_stage
      },
      {
        Header: 'Cell line',
        id: 'cell_line',
        accessor: d => d.cell_line
      },
      {
        Header: 'Treatment',
        id: 'treatment',
        accessor: d => d.treatment
      },
      {
        Header: 'Race',
        id: 'race',
        accessor: d => d.race
      },
      {
        Header: 'Subject',
        id: 'subject',
        accessor: d => d.subject
      },
      {
        Header: 'Compound',
        id: 'compound',
        accessor: d => d.compound
      },
      {
        Header: 'Time',
        id: 'time',
        accessor: d => d.time
      }
    ];

    // 2. count the number of samples that have a value for each column
    for (let column of columns) {
      column.__totalValues = data.reduce(
        (total, sample) => total + (!!column.accessor(sample) ? 1 : 0),
        0
      );
    }
    columns = columns.sort(
      (column1, column2) => column2.__totalValues - column1.__totalValues
    );

    // 3. Filter out the columns that don't have a value
    columns = columns.filter(column => column.__totalValues > 0);

    // Return the final list of columns, the last two are always the same
    return [
      {
        id: 'id',
        accessor: d => d.id,
        show: false
      },
      {
        Header: 'Title',
        id: 'title',
        accessor: d => d.title,
        minWidth: 140
      },
      ...columns,
      {
        Header: 'Processing Information',
        id: 'processing_information',
        sortable: false,
        Cell: ProcessingInformationCell
      }
      // {
      //   Header: 'Add/Remove',
      //   id: 'add_remove'
      // }
    ];
  }
}

/**
 * Component used for the cells of the header in the SamplesTable
 * Used the default value as guide here https://github.com/react-tools/react-table/blob/8f062550aad1377618b30f4a4f129a6b1012acf8/src/defaultProps.js#L199-L212
 */
function ThComponent({ toggleSort, className, children, ...rest }) {
  return (
    <div
      className={`rt-th ${className} samples-table__th`}
      onClick={e => toggleSort && toggleSort(e)}
      role="columnheader"
      {...rest}
    >
      {children}

      <div className="samples-table__sort">
        <i className="ion-chevron-up samples-table__sort-icon" />
        <i className="ion-chevron-down samples-table__sort-icon" />
      </div>

      <div className="samples-table__sort-desc">
        <i className="ion-chevron-down samples-table__sort-icon" />
      </div>

      <div className="samples-table__sort-asc">
        <i className="ion-chevron-up samples-table__sort-icon" />
      </div>
    </div>
  );
}

// Pipeline names ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/22#issuecomment-394010812
const PIPELINES = {
  SubmitterProcessed: 'Submitter-processed',
  AffymetrixSCAN: 'Affymetrix SCAN',
  Salmontools: 'Salmontools',
  AgilentSCANTwoColor: 'Agilent SCAN TwoColor',
  IlluminaSCAN: 'Illumina SCAN',
  tximport: 'tximport',
  Salmon: 'Salmon',
  MultiQC: 'MultiQC'
};

function ProcessingInformationCell({ original: sample, ...props }) {
  let { pipelines } = sample;

  const pipelineString = pipelines.join(', ');

  // Logic to decide which pipeline modal dialog should be displayed. On Keytar Kurt we're only supporting 4 types of
  // pipelines. In the future when we add more, we might want to refactor these modal dialogs
  // ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/22#issuecomment-394408631
  const pipelineFactory = {
    'Affymetrix SCAN': () => (
      <ScanModal sample={sample} scanType={PIPELINES.AffymetrixSCAN} />
    ),
    'Illumina SCAN': () => (
      <ScanModal sample={sample} scanType={PIPELINES.IlluminaSCAN} />
    ),
    'Submitter-processed': () => <SumitterProcessedModal sample={sample} />,
    'tximport, Salmon': () => <SalmonTximportModal sample={sample} />,
    'Salmon, tximport': () => <SalmonTximportModal sample={sample} />
  };

  if (pipelineFactory[pipelineString]) {
    return pipelineFactory[pipelineString]();
  } else {
    return <div>{pipelineString}</div>;
  }
}

function SumitterProcessedModal({ sample }) {
  return (
    <ModalManager
      component={showModal => (
        <Button
          text="Submitter-processed"
          buttonStyle="link"
          onClick={showModal}
        />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <div>
          <h1 className="processing-info-modal__title">
            Processing Information
          </h1>
          <div className="dot-label dot-label--submitter">
            Submitter processed
          </div>

          <SubmitterSuppliedProtocol />

          <section className="processing-info-modal__section">
            <GeneIdentifierConversion />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function SubmitterSuppliedProtocol() {
  return (
    <div>
      <h3>Submitter Supplied Protocol</h3>
      <p>
        These tissues samples were obtained at surgery and stored at -80C until
        use., These tissues samples were obtained at surgery without any other
        pretreatment., Acid guanidinium thiocyanate-phenol-chloroform extraction
        of total RNA was performed according to the previous report (Anal.
        Biochem, 162: 156,1987)., Biotinylated cRNA were prepared according to
        the standard Affymetrix protocol from 2 ug total RNA (Expression
        Analysis Technical Manual, 2001, Affymetrix)., Title: Affymetrix CEL
        analysis. Description:, The data were analyzed with Microarray Suite
        version 5.0 (MAS 5.0) using Affymetrix default analysis settings and
        global scaling as normalization method.
      </p>
    </div>
  );
}

function GeneIdentifierConversion() {
  return (
    <div>
      <h3>Gene Identifier Conversion</h3>
      <p>
        The gene identifiers were converted to Ensembl Gene Identifiers using
        g:Profiler (version 2.0.1)
      </p>
    </div>
  );
}

function ScanModal({ sample, scanType }) {
  return (
    <ModalManager
      component={showModal => (
        <Button text={scanType} buttonStyle="link" onClick={showModal} />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <div>
          <h1 className="processing-info-modal__title">
            Processing Information
          </h1>
          <div className="dot-label">refine.bio processed</div>

          <h3>{scanType}</h3>

          <div className="pipeline">
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Input File</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={ProcessIcon} alt="" />
              <div>SCAN</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Gene Expression Matrix</div>
            </div>
          </div>

          <ScanProtocol />

          <section className="processing-info-modal__section">
            <SubmitterSuppliedProtocol />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function ScanProtocol() {
  return (
    <div>
      <h3>SCAN</h3>
      <p>
        SCAN (Single Channel Array Normalization) is a normalization method for
        single channel (Affymetrix) microarrays that allows us to process
        individual samples. SCAN models and corrects for the effect of technical
        bias, such as GC content, using a mixture-modeling approach. For more
        information about this approach, see the primary publication (Piccolo,
        et al. Genomics. 2012.{' '}
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>) and the SCAN.UPC bioconductor package documentation (<a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          DOI: 10.18129/B9.bioc.SCAN.UPC
        </a>)
      </p>

      <h3 className="processing-info-modal__subtitle">Version Information</h3>
      <table>
        <tbody>
          <tr>
            <td className="processing-info-modal__version">SCAN</td>
            <td>0.2</td>
          </tr>
          <tr>
            <td className="processing-info-modal__version">BrainArray</td>
            <td>0.4.1</td>
          </tr>
          <tr>
            <td className="processing-info-modal__version">Platform Design</td>
            <td>1.3</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SalmonTximportModal({ sample }) {
  return (
    <ModalManager
      component={showModal => (
        <Button
          text="Salmon and tximport"
          buttonStyle="link"
          onClick={showModal}
        />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <div>
          <h1 className="processing-info-modal__title">
            Processing Information
          </h1>
          <div className="dot-label">refine.bio processed</div>

          <h3>Salmon and tximport</h3>

          <div className="pipeline">
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Input File</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={ProcessIcon} alt="" />
              <div>Salmon</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={ProcessIcon} alt="" />
              <div>tximport</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Gene Expression Matrix</div>
            </div>
          </div>

          <SalmonProtocol />

          <TxtimportProtocol />

          <h3 className="processing-info-modal__subtitle">
            Version Information
          </h3>
          <table>
            <tbody>
              <tr>
                <td className="processing-info-modal__version">Salmon</td>
                <td>0.9.1</td>
              </tr>
              <tr>
                <td className="processing-info-modal__version">txtimport</td>
                <td>1.8</td>
              </tr>
              <tr>
                <td className="processing-info-modal__version">Geonme Build</td>
                <td>1.3</td>
              </tr>
            </tbody>
          </table>

          <section className="processing-info-modal__section">
            <SubmitterSuppliedProtocol />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function SalmonProtocol() {
  return (
    <div>
      <h3>Salmon</h3>
      <p>
        Salmon is an alignment-free method for estimating transcript abundances
        from RNA-seq data. We use it in quasi-mapping mode, which is
        significantly faster than alignment-based approaches and requires us to
        build a Salmon transcriptome index. We build a custom reference
        transcriptome (using RSEM rsem-prepare-reference) by filtering the
        Ensembl genomic DNA assembly to remove pseudogenes, which we expect
        could negatively impact the quantification of protein-coding genes. This
        means we're obtaining abundance estimates for coding as well as
        non-coding transcripts. We include the flags <i>--seqBias</i> to correct
        for random hexamer priming and, if this is a paired-end experiment,{' '}
        <i>--gcBias</i> to correct for GC content when running{' '}
        <i>salmon quant</i>.{' '}
        <a
          href="https://combine-lab.github.io/salmon/"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          Learn more
        </a>
      </p>
    </div>
  );
}

function TxtimportProtocol() {
  return (
    <div>
      <h3 className="processing-info-modal__subtitle">tximport</h3>

      <p>
        <i>tximport</i> imports transcript (tx)-level abundance estimates
        generated by
        <i>salmon quant</i> and summarizes them to the gene-level. We use the tx
        to gene mapping generated as part of our reference transcriptome
        processing pipeline. Our tximport implementation generates{' '}
        <a
          href="https://www.rdocumentation.org/packages/tximport/versions/1.0.3/topics/tximport"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          "lengthScaledTPM"
        </a>, which are gene-level counts that are generated by scaling TPM
        using the average transcript length across samples and to the library
        size. Note that tximport is applied at the <em>experiment-level</em>{' '}
        rather than to single samples. For additional information, see the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/html/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          tximport Bioconductor page
        </a>, the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/vignettes/tximport/inst/doc/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          tximport tutorial{' '}
          <em>Importing transcript abundance datasets with tximport</em>
        </a>, and{' '}
        <a
          href="http://dx.doi.org/10.12688/f1000research.7563.1"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          Soneson, et al. <em>F1000Research.</em> 2015.
        </a>
      </p>
    </div>
  );
}
