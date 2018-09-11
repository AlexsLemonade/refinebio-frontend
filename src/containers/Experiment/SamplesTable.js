import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import RefineTable from '../../components/RefineTable';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { getAllDetailedSamples } from '../../api/samples';

import ModalManager from '../../components/Modal/ModalManager';
import Button from '../../components/Button';
import InfoIcon from '../../common/icons/info-badge.svg';

import { PAGE_SIZES } from '../../constants/table';
import SampleFieldMetadata from './SampleFieldMetadata';
import { addExperiment, removeSamples } from '../../state/download/actions';
import ProcessingInformationCell from './ProcessingInformationCell';
import DataSetSampleActions from './DataSetSampleActions';
import './SamplesTable.scss';
import HorizontalScroll from '../../components/HorizontalScroll';
import isEqual from 'lodash/isEqual';

class SamplesTable extends React.Component {
  state = {
    page: 0,
    pages: -1,
    pageSize: 10,
    columns: this._getColumns(),
    data: []
  };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.accessionCodes, this.props.accessionCodes)) {
      this.fetchData({ setPage: 0 });
    }
  }

  get totalSamples() {
    return this.props.accessionCodes.length;
  }

  render() {
    const { pageActionComponent } = this.props;
    // `pageActionComponent` is a render prop to add a component at the top right of the table
    // Good for a add/remove samples button. It's a function that receives the currently displayed
    // samples as an argument
    const totalPages = Math.ceil(this.totalSamples / this.state.pageSize);

    // Calculate page size options to exclude ones greater than the number of
    // samples.
    const pageSizes = PAGE_SIZES.filter(size => size <= this.totalSamples);
    if (pageSizes.length === 0) pageSizes.push(this.totalSamples);

    return (
      <RefineTable
        manual={true}
        onFetchData={tableState => this.fetchData({ tableState })}
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
        minRows={0}
        noDataText={this.props.noDataText}
      >
        {(state, makeTable, instance) => {
          return (
            <div className="samples-table-layout">
              <div className="samples-table-layout__header">
                <div className="experiment__sample-commands">
                  <div className="experiment__per-page-dropdown">
                    Show{' '}
                    <Dropdown
                      options={pageSizes}
                      selectedOption={this.state.pageSize}
                      onChange={this.handlePageSizeChange}
                    />{' '}
                    of {this.totalSamples} Samples
                  </div>
                  {pageActionComponent &&
                    pageActionComponent(state.pageRows.map(x => x._original))}
                </div>
              </div>
              <div className="samples-table-layout__main">
                <HorizontalScroll targetSelector=".rt-table">
                  {makeTable()}
                </HorizontalScroll>
              </div>
              <div className="samples-table-layout__footer">
                <div className="samples-table__notice info">
                  <img className="info__icon" src={InfoIcon} alt="" />
                  <div>
                    Some fields may be harmonized.{' '}
                    <Link to="/docs" className="link">
                      Learn more
                    </Link>
                  </div>
                </div>

                <Pagination
                  onPaginate={this.handlePagination}
                  totalPages={totalPages}
                  currentPage={this.state.page + 1}
                />
              </div>
            </div>
          );
        }}
      </RefineTable>
    );
  }

  fetchData = async ({ tableState = false, setPage = undefined } = {}) => {
    const { accessionCodes, experimentAccessionCodes = [] } = this.props;
    let { page, pageSize } = this.state;
    // get the backend ready `order_by` param, based on the sort options from the table
    let orderBy = this._getSortParam(tableState);

    if (setPage >= 0) {
      page = setPage;
    }

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
      data = data.map(sample => {
        const experimentAccessionCode =
          experimentAccessionCodes[
            accessionCodes.indexOf(sample.accession_code)
          ];
        return { ...sample, experimentAccessionCode };
      });
    }

    // Customize the columns and their order depending on de data
    let columns = this._getColumns(data);

    this.setState({
      data,
      page,
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
    const isImmutable = this.props.isImmutable;
    // 1. define all columns
    // 2. count the number of samples that have a value for each column
    let columns = SampleFieldMetadata.map(column => ({
      ...column,
      __totalValues: data.reduce(
        (total, sample) => total + (!!column.accessor(sample) ? 1 : 0),
        0
      ),
      Cell: CustomCell
    }));

    columns = columns.sort(
      (column1, column2) => column2.__totalValues - column1.__totalValues - 1
    );

    // 3. Filter out the columns that don't have a value
    columns = columns.filter(column => column.__totalValues > 0);

    // Get the headers that do not depend on isImmutable first
    let headers = [
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
      },
      {
        Header: 'Additional Metadata',
        id: 'additional_metadata',
        sortable: false,
        Cell: MetadataCell
      }
    ];

    // In some instances like the DataSet page we want to hide the Add/Remove
    // buttons, but otherwise the Add/Remove column should be the first one.
    // If the list is not immutable, prepend the Add/Remove column to headers
    if (!isImmutable) {
      headers = [
        {
          Header: 'Add/Remove',
          id: 'add_remove',
          sortable: false,
          Cell: AddRemoveCell.bind(this),
          width: 190,
          className: 'samples-table__add-remove',
          show: !!this.props.experimentAccessionCodes.length
        },
        ...headers
      ];
    }

    // Return the final list of columns
    return headers;
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
SamplesTable = connect(
  ({ download: { dataSet } }) => ({
    dataSet
  }),
  {
    addExperiment,
    removeSamples
  }
)(SamplesTable);
export default SamplesTable;

/**
 * Custom cell component used to display N/A when there's no value
 */
function CustomCell({ value }) {
  if (!value) {
    return <div className="experiment__not-provided">NA</div>;
  }

  return value;
}

/**
 * Component that renders the content in "Additional Metadata" column
 */
function MetadataCell({ original: sample }) {
  if (sample.annotations.length === 0) {
    return CustomCell({});
  }

  let annotations = sample.annotations.map(entry =>
    JSON.stringify(entry.data, null, 2)
  );
  return (
    <ModalManager
      component={showModal => (
        <Button text="View" buttonStyle="link" onClick={showModal} />
      )}
      modalProps={{ className: 'metadata-modal' }}
    >
      {() => (
        <section>
          <h1 className="metadata-modal__title">Additional Metadata</h1>
          <div className="metadata-modal__subtitle">
            <img className="info-icon" src={InfoIcon} alt="" /> Included in
            Download
          </div>
          <div className="metadata-modal__annotations">
            {annotations.map((meta, index) => (
              <div key={index}>
                <pre>{meta}</pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </ModalManager>
  );
}

/**
 * Component used for the cells of the header in the SamplesTable
 * Used the default value as guide here:
 * https://github.com/react-tools/react-table/blob/8f062550aad1377618b30f4a4f129a6b1012acf8/src/defaultProps.js#L199-L212
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

function AddRemoveCell({ original: sample, row: { id: rowId } }) {
  const { experimentAccessionCode } = sample;

  if (!sample.is_processed) {
    return (
      <div className="sample-not-processed info">
        <img className="info__icon" src={InfoIcon} alt="" />
        <div>
          <div className="nowrap">Sample not processed</div>
          <a href="/docs" className="link" target="_blank">
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <DataSetSampleActions
      data={{
        [experimentAccessionCode]: [sample]
      }}
      meta={{ addText: 'Add', buttonStyle: 'secondary' }}
    />
  );
}
