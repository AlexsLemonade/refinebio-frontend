import React from 'react';
import { SpeciesSamples, ExperimentsView } from '../DownloadDetails';
import DownloadFileSummary from '../DownloadFileSummary';
import DownloadDatasetSummary from '../DownloadDatasetSummary';
import { formatSentenceCase } from '../../../common/helpers';
import { getTransformationOptionFromName } from '../transformation';
import TabControl from '../../../components/TabControl';
import Button from '../../../components/Button';

export default function DatasetDetails({ dataSet }) {
  return (
    <div>
      <h2>Download Files Summary</h2>

      <DatasetRegenerateOptions dataSet={dataSet} />

      <DownloadFileSummary dataSet={dataSet} />
      <DownloadDatasetSummary dataSet={dataSet} />

      <section className="downloads__section">
        <div className="downloads__sample-header">
          <h2>Samples</h2>
        </div>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <SpeciesSamples dataSet={dataSet} isImmutable />
          <ExperimentsView dataSet={dataSet} isImmutable />
        </TabControl>
      </section>
    </div>
  );
}

function DatasetRegenerateOptions({ dataSet }) {
  const [editable, setEditable] = React.useState(false);

  if (editable) {
    return <DataSetRegenerateForm dataSet={dataSet} />;
  }

  return (
    <div>
      <div className="downloads__file-modifier">
        Aggregated by: {formatSentenceCase(dataSet.aggregate_by)}
      </div>
      <div className="downloads__file-modifier">
        Transformation:{' '}
        {formatSentenceCase(getTransformationOptionFromName(dataSet.scale_by))}
      </div>
      {!dataSet.quantile_normalize && (
        <div className="downloads__file-modifier">
          Quantile Normailzation Skipped for RNA-seeq samples
        </div>
      )}
      <div className="downloads__file-modifier">
        <Button
          text="Change"
          buttonStyle="link"
          onClick={() => setEditable(true)}
        />
      </div>
    </div>
  );
}

function DataSetRegenerateForm({ dataSet }) {
  return <h1>Regenerate options</h1>;
}
