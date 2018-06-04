import React from 'react';
import Button from '../../components/Button';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { RemoveFromDatasetButton } from '../Results/Result';
import { getAllDetailedSamples } from '../../api/samples';
import { AnonymousSubject } from 'rxjs';
import ModalManager from '../../components/Modal/ModalManager';

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

  render() {
    const { samples, dataSet, pageActionComponent } = this.props;
    // `pageActionComponent` is a render prop to add a component at the top right of the table
    // Good for a add/remove samples button. It's a function that receives the currently displayed
    // samples as an argument
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
    const sampleIds = this.props.samples.map(sample => sample.id);
    const { page, pageSize } = this.state;
    // get the backend ready `order_by` param, based on the sort options from the table
    let orderBy = this._getSortParam(tableState);

    this.setState({ loading: true, orderBy });

    let offset = page * pageSize;

    const data = await getAllDetailedSamples({
      ids: sampleIds,
      orderBy,
      offset,
      limit: pageSize
    });

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
    let page = this.state.page;
    // check if the page is outside of the new page range
    if ((page + 1) * pageSize > this.props.samples.length) {
      // set the page to the last one
      page = Math.floor(this.props.samples.length / pageSize);
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
    let columns = [
      {
        Header: 'Accession Code',
        id: 'accession_code',
        accessor: d => d.accession_code,
        minWidth: 160
      },
      {
        Header: 'Sex',
        id: 'sex',
        accessor: d => d.sex,
        minWidth: 160
      },
      {
        Header: 'Age',
        id: 'age',
        accessor: d => d.age,
        minWidth: 160
      },
      {
        Header: 'Specimen Part',
        id: 'specimen_part',
        accessor: d => d.specimen_part,
        minWidth: 160
      },
      {
        Header: 'Genotype',
        id: 'genotype',
        accessor: d => d.genotype,
        minWidth: 160
      },
      {
        Header: 'Disease',
        id: 'disease',
        accessor: d => d.disease,
        minWidth: 160
      },
      {
        Header: 'Disease Stage',
        id: 'disease_stage',
        accessor: d => d.disease_stage,
        minWidth: 160
      },
      {
        Header: 'Cell line',
        id: 'cell_line',
        accessor: d => d.cell_line,
        minWidth: 160
      },
      {
        Header: 'Treatment',
        id: 'treatment',
        accessor: d => d.treatment,
        minWidth: 160
      },
      {
        Header: 'Race',
        id: 'race',
        accessor: d => d.race,
        minWidth: 160
      },
      {
        Header: 'Subject',
        id: 'subject',
        accessor: d => d.subject,
        minWidth: 160
      },
      {
        Header: 'Compound',
        id: 'compound',
        accessor: d => d.compound,
        minWidth: 160
      },
      {
        Header: 'Time',
        id: 'time',
        accessor: d => d.time,
        minWidth: 160
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
        minWidth: 180
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

function ProcessingInformationCell({ original: sample, ...props }) {
  let { annotations } = sample;

  // If the sample is marked with `is_ccdl = false` then this sample is "Submitter Processed"
  if (annotations.length > 0 && !annotations[0].is_ccdl) {
    return <SumitterProcessedModal sample={sample} />;
  }

  // TODO add other types of processing information modals

  return <div />;
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
