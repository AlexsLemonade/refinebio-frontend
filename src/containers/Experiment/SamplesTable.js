import React from 'react';
import Button from '../../components/Button';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { RemoveFromDatasetButton } from '../Results/Result';
import { getAllDetailedSamples } from '../../api/samples';

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

  fetchData = async (tableState = false) => {
    const { page, pageSize } = this.state;

    let orderBy = undefined;
    if (tableState) {
      const { sorted } = tableState;
      // check table sort
      if (sorted && sorted.length > 0) {
        // we don't support sorting by multiple columns, so only consider the first one
        const { id, desc } = sorted[0];
        orderBy = `${desc ? '-' : ''}${id}`;
      } else {
        orderBy = undefined;
      }
    } else {
      orderBy = this.state.orderBy;
    }

    this.setState({ loading: true, orderBy });
    const sampleIds = this.props.samples.map(sample => sample.id);

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
        sortable: false
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
