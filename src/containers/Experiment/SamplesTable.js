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

  fetchData = async () => {
    const { page, pageSize } = this.state;
    this.setState({ loading: true });
    const samples = this.props.samples
      .slice(page * pageSize, (page + 1) * pageSize)
      .map(sample => sample.id);

    const data = await getAllDetailedSamples(samples);

    this.setState({
      data,
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
