import React from 'react';
import Button from '../../components/Button';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { RemoveFromDatasetButton } from '../Results/Result';

const PAGE_SIZES = [10, 20, 50];

export default class SamplesTable extends React.Component {
  state = {
    page: 0,
    pageSize: 10
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
        className="samples-table"
        showPageSizeOptions={false}
        showPagination={false}
        data={samples}
        page={this.state.page}
        pageSize={this.state.pageSize}
        columns={this._getColumns()}
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
                    onChange={pageSize => this.setState({ pageSize })}
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

  handlePagination = page => {
    this.setState({ page: page - 1 });
  };

  _getColumns() {
    return [
      {
        Header: 'Sample ID',
        accessor: 'id'
      },
      {
        Header: 'Title',
        accessor: 'title',
        minWidth: 240
      },
      {
        Header: 'Age'
      },
      {
        Header: 'Gender'
      },
      {
        Header: 'Processing Information'
      },
      {
        Header: 'Add/Remove'
      }
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
