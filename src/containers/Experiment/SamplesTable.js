import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { getAllDetailedSamples } from '../../api/samples';
import ModalManager from '../../components/Modal/ModalManager';
import FileIcon from './file.svg';
import ProcessIcon from './process.svg';
import { PAGE_SIZES } from '../../constants/table';
import SampleFieldMetadata from './SampleFieldMetadata';
import { RemoveFromDatasetButton } from '../../containers/Results/Result';
import {
  addExperiment,
  removeExperiment,
  removeSamplesFromExperiment
} from '../../state/download/actions';

import './SamplesTable.scss';

class SamplesTable extends React.Component {
  state = {
    page: 0,
    pages: -1,
    pageSize: 10,
    columns: this._getColumns(),
    data: []
  };

  get totalSamples() {
    return this.props.accessionCodes.length;
  }

  removeRow = rowId => {
    const arrayCopy = this.state.data.filter(row => row.id !== rowId);
    this.setState({ data: arrayCopy });
  };

  render() {
    const { pageActionComponent } = this.props;
    // `pageActionComponent` is a render prop to add a component at the top right of the table
    // Good for a add/remove samples button. It's a function that receives the currently displayed
    // samples as an argument
    const totalPages = Math.ceil(this.totalSamples / this.state.pageSize);
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
                  of {this.totalSamples} Samples
                </div>
                {pageActionComponent &&
                  pageActionComponent(state.pageRows.map(x => x._original))}
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

  fetchData = async (tableState = false) => {
    const { accessionCodes, experimentAccessionCodes = [] } = this.props;
    const { page, pageSize } = this.state;
    // get the backend ready `order_by` param, based on the sort options from the table
    let orderBy = this._getSortParam(tableState);

    this.setState({ loading: true, orderBy });

    let offset = page * pageSize;

    let data = await getAllDetailedSamples({
      accessionCodes,
      orderBy,
      offset,
      limit: pageSize
    });

    if (experimentAccessionCodes.length === 1) {
      const experimentAccessionCode = experimentAccessionCodes[0];

      data = data.map(sample => {
        return { ...sample, experimentAccessionCode };
      });
    } else if (experimentAccessionCodes.length > 1) {
      data = data.map((sample, i) => {
        const experimentAccessionCode = experimentAccessionCodes[i];
        return { ...sample, experimentAccessionCode };
      });
    }

    // Customize the columns and their order depending on de data
    let columns = this._getColumns(data);

    this.setState({
      data,
      columns,
      pages: Math.ceil(this.totalSamples / pageSize),
      loading: false
    });
  };

  handlePagination = page => {
    // Set the current page, and update the data afterwards
    this.setState({ page: page - 1 }, () => this.fetchData());
  };

  handlePageSizeChange = pageSize => {
    let page = this.state.page;
    // check if the page is outside of the new page range
    if ((page + 1) * pageSize > this.totalSamples) {
      // set the page to the last one
      page = Math.floor(this.totalSamples / pageSize);
    }

    this.setState({ page, pageSize }, () => this.fetchData());
  };

  /**
   * Returns a custom column specification depending on the data passed.
   * - Empty Columns are hidden
   * - Columns with more values have higher priority
   * @param {Array} data Data that should be displayed in the table
   */
  _getColumns(data = []) {
    // 1. define all columns
    // 2. count the number of samples that have a value for each column
    let columns = SampleFieldMetadata.map(column => ({
      ...column,
      __totalValues: data.reduce(
        (total, sample) => total + (!!column.accessor(sample) ? 1 : 0),
        0
      )
    }));

    columns = columns.sort(
      (column1, column2) => column2.__totalValues - column1.__totalValues - 1
    );

    // 3. Filter out the columns that don't have a value
    columns = columns.filter(column => column.__totalValues > 0);

    // Return the final list of columns, the last two are always the same
    return [
      {
        Header: 'Add/Remove',
        id: 'add_remove',
        Cell: AddRemoveCell.bind(this),
        width: 190,
        className: 'samples-table__add-remove'
      },
      {
        id: 'id',
        accessor: d => d.id,
        show: false
      },
      ...columns,
      {
        Header: 'Processing Information',
        id: 'processing_information',
        sortable: false,
        Cell: ProcessingInformationCell
      }
    ];
  }

  /**
   * Returns the sort parameter as required from the backend
   * @param {*} tableState State from the table, as given to `fetchData`
   */
  _getSortParam(tableState) {
    let orderBy = undefined;
    if (tableState) {
      const { sorted } = tableState;
      // check table sort
      if (sorted && sorted.length > 0) {
        // we don't support sorting by multiple columns, so only consider the first one
        const { id, desc } = sorted[0];
        // ref: https://github.com/AlexsLemonade/refinebio/pull/298
        orderBy = `${desc ? '-' : ''}${id}`;
      } else {
        orderBy = undefined;
      }
    } else {
      orderBy = this.state.orderBy;
    }
    return orderBy;
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

  // Logic to decide which pipeline modal dialog should be displayed. On Keytar Kurt we're only supporting 4 types of
  // pipelines. In the future when we add more, we might want to refactor these modal dialogs
  // ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/22#issuecomment-394408631
  if (pipelines.length === 1) {
    if (pipelines.includes(PIPELINES.AffymetrixSCAN)) {
      return <ScanModal sample={sample} scanType={PIPELINES.AffymetrixSCAN} />;
    } else if (pipelines.includes(PIPELINES.IlluminaSCAN)) {
      return <ScanModal sample={sample} scanType={PIPELINES.IlluminaSCAN} />;
    } else if (pipelines.includes(PIPELINES.SubmitterProcessed)) {
      return <SumitterProcessedModal sample={sample} />;
    }
  } else if (pipelines.length === 2) {
    if (
      pipelines.includes(PIPELINES.tximport) &&
      pipelines.includes(PIPELINES.Salmon)
    ) {
      return <SalmonTximportModal sample={sample} />;
    }
  }

  return <div>{pipelines.join(', ')}</div>;
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
        The gene identifiers were detected and converted to Ensembl gene IDs
        using our{' '}
        <a
          href="https://github.com/AlexsLemonade/identifier-refinery"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          custom mappings
        </a>{' '}
        and pipeline.
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

          <ScanProtocol scanType={scanType} />

          <section className="processing-info-modal__section">
            <SubmitterSuppliedProtocol />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function ScanProtocol({ scanType }) {
  const versionInfo = _getScanVersionInfo(scanType);
  return (
    <div>
      <h3>SCAN</h3>
      <p>
        {scanType === PIPELINES.AffymetrixSCAN
          ? 'SCAN (Single Channel Array Normalization) is a normalization method for single channel (Affymetrix) microarrays that allows us to process individual samples. SCAN models and corrects for the effect of technical bias, such as GC content, using a mixture-modeling approach. For more information about this approach, see the primary publication (Piccolo, et al. Genomics. 2012.'
          : 'SCAN (Single Channel Array Normalization) is a normalization method for single channel microarrays that allows us to process individual samples. It was originally developed for Affymetrix microarrays. In our system, it has been adapted for Illumina BeadArrays. SCAN models and corrects for the effect of technical bias, such as GC content, using a mixture-modeling approach. For more information about this approach, see the primary publication (Piccolo, et al. Genomics. 2012. '}
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>){' '}
        {scanType === PIPELINES.AffymetrixSCAN ? (
          <span>
            and the SCAN.UPC bioconductor package documentation (<a
              href="http://doi.org/10.1016/j.ygeno.2012.08.003"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--link"
            >
              DOI: 10.18129/B9.bioc.SCAN.UPC
            </a>).
          </span>
        ) : (
          '.'
        )}
      </p>

      <h3 className="processing-info-modal__subtitle">Version Information</h3>
      <table>
        <tbody>
          {Object.keys(versionInfo).map(packageName => (
            <tr>
              <td className="processing-info-modal__version">{packageName}</td>
              <td>{versionInfo[packageName]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function _getScanVersionInfo(scanType) {
  if (scanType === PIPELINES.AffymetrixSCAN) {
    return {
      'SCAN.UPC': '2.20.0',
      Brainarray: '22.0.0'
    };
  } else if (scanType === PIPELINES.IlluminaSCAN) {
    return {
      'Illumina Bioconductor annotation packages': '1.26.0'
    };
  }
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
                <td>1.6.0</td>
              </tr>
              <tr>
                <td className="processing-info-modal__version">Genome build</td>
                <td>GRCh38.p12</td>
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

function AddRemoveCell({ original: sample, row: { id: rowId } }) {
  const { experimentAccessionCode, accession_code } = sample;
  const { removeRow } = this;
  const {
    addExperiment,
    removeSamplesFromExperiment,
    dataSet,
    isRowRemovable = false
  } = this.props;
  const isAdded =
    dataSet[experimentAccessionCode] &&
    dataSet[experimentAccessionCode].includes(accession_code);

  if (!isAdded) {
    return (
      <Button
        buttonStyle="secondary"
        onClick={() =>
          addExperiment([
            {
              accession_code: experimentAccessionCode,
              samples: [accession_code]
            }
          ])
        }
      >
        Add
      </Button>
    );
  }

  return (
    <RemoveFromDatasetButton
      handleRemove={() => {
        if (isRowRemovable) removeRow(rowId);
        removeSamplesFromExperiment(experimentAccessionCode, [accession_code]);
      }}
    />
  );
}

export default (SamplesTable = connect(
  ({ download: { dataSet } }) => ({
    dataSet
  }),
  {
    addExperiment,
    removeSamplesFromExperiment
  }
)(SamplesTable));
