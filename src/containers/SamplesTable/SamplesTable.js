import React from 'react';
import RefineTable from '../../components/RefineTable';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { getAllDetailedSamples } from '../../api/samples';

import InfoIcon from '../../common/icons/info-badge.svg';

import { PAGE_SIZES } from '../../constants/table';
import ProcessingInformationCell from './ProcessingInformationCell';
import DataSetSampleActions from '../DataSetSampleActions';
import './SamplesTable.scss';
import HorizontalScroll from '../../components/HorizontalScroll';
import isEqual from 'lodash/isEqual';

import uniq from 'lodash/uniq';
import union from 'lodash/union';
import MetadataAnnotationsCell from './MetadataAnnotationsCell';
import { InputClear } from '../../components/Input';
import debounce from 'lodash/debounce';
import Button from '../../components/Button';
import SampleDetailsLoader from './SampleDetailsLoader';
import { formatSentenceCase } from '../../common/helpers';

class SamplesTable extends React.Component {
  static defaultProps = {
    pageSizeDropdown: ({ dropdown, totalSamples }) => (
      <React.Fragment>
        Show {dropdown} of {totalSamples} Samples
      </React.Fragment>
    ),
    sampleMetadataFields: []
  };

  columns = this._getColumns();

  render() {
    const { pageActionComponent } = this.props;

    return (
      <SampleDetailsLoader fetchSampleParams={this.props.fetchSampleParams}>
        {state => {
          // Calculate page size options to exclude ones greater than the number of samples.
          const pageSizes = PAGE_SIZES.filter(
            size => size <= state.totalSamples
          );
          if (pageSizes.length === 0) pageSizes.push(state.totalSamples);

          return (
            <RefineTable
              manual={true}
              onFetchData={tableState =>
                state.onUpdate({
                  isLoading: true,
                  orderBy: this._getSortParam(tableState)
                })
              }
              loading={state.isLoading}
              pages={state.totalPages}
              data={state.samples}
              page={state.page}
              pageSize={state.pageSize}
              className="samples-table"
              showPageSizeOptions={false}
              showPagination={false}
              columns={this.columns}
              ThComponent={ThComponent}
              minRows={0}
              noDataText={this.props.noDataText}
              NoDataComponent={NoDataComponent}
              getNoDataProps={() => ({
                hasError: state.hasError,
                // send a callback to allow retrying
                fetchData: null // TODO
              })}
            >
              {(tableState, makeTable, instance) => (
                <div className="samples-table-layout">
                  <div className="samples-table-layout__header">
                    <div className="experiment__sample-commands">
                      <div className="experiment__per-page-dropdown">
                        {this.props.pageSizeDropdown({
                          dropdown: (
                            <Dropdown
                              options={pageSizes}
                              selectedOption={state.pageSize}
                              onChange={pageSize =>
                                state.onUpdate({ pageSize })
                              }
                            />
                          ),
                          totalSamples: state.totalSamples
                        })}
                      </div>
                      {pageActionComponent &&
                        pageActionComponent(state.samples)}
                    </div>
                    <div className="samples-table__filter">
                      <div>Filter</div>
                      <div className="samples-table__filter-input">
                        <InputClear
                          value={state.filterBy || ''}
                          onChange={filterBy => state.onUpdate({ filterBy })}
                        />
                      </div>
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
                        <a
                          href="http://docs.refine.bio/en/latest/main_text.html#refine-bio-harmonized-metadata"
                          target="_blank"
                          className="link"
                          rel="noopener noreferrer"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>

                    <Pagination
                      onPaginate={page => state.onUpdate({ page })}
                      totalPages={state.totalPages}
                      currentPage={state.page + 1}
                    />
                  </div>
                </div>
              )}
            </RefineTable>
          );
        }}
      </SampleDetailsLoader>
    );
  }

  /**
   * Returns the columns that should be displayed in the table
   */
  _getColumns() {
    // Get the headers that do not depend on isImmutable first
    return [
      {
        Header: 'Add/Remove',
        id: 'add_remove',
        sortable: false,
        Cell: ({ original: sample }) => (
          <AddRemoveCell
            sample={sample}
            experimentAccessionCodes={Object.keys(
              this.props.experimentSampleAssociations
            ).filter(experimentAccessionCode =>
              this.props.experimentSampleAssociations[
                experimentAccessionCode
              ].includes(sample.accession_code)
            )}
          />
        ),
        width: 190,
        className: 'samples-table__add-remove',
        show: !this.props.isImmutable
      },
      {
        id: 'id',
        accessor: d => d.id,
        show: false
      },
      {
        Header: 'Accession Code',
        id: 'accession_code',
        accessor: d => d.accession_code,
        minWidth: 160,
        width: 175,
        style: { textAlign: 'right' },
        Cell: CustomCell
      },
      {
        Header: 'Title',
        id: 'title',
        accessor: d => d.title,
        minWidth: 180,
        Cell: CustomCell
      },
      // list the columns in the experiment's metadata
      ...this.props.sampleMetadataFields.map(field => ({
        id: field,
        accessor: d => d[field],
        Header: formatSentenceCase(field),
        minWidth: 160,
        Cell: CustomCell
      })),
      {
        Header: 'Processing Information',
        id: 'processing_information',
        sortable: false,
        Cell: ProcessingInformationCell,
        width: 200
      },
      {
        Header: 'Additional Metadata',
        id: 'additional_metadata',
        sortable: false,
        Cell: MetadataAnnotationsCell,
        width: 200
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
export default SamplesTable;

const NoDataComponent = ({ hasError, children, fetchData }) =>
  hasError ? (
    <div className="samples-table__message samples-table__message--error ">
      Temporarily under heavy traffic load. Please{' '}
      <Button
        text="try again"
        buttonStyle="link"
        onClick={fetchData}
        className="color-error"
      />{' '}
      later.
    </div>
  ) : (
    <div className="samples-table__message">{children}</div>
  );

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

function AddRemoveCell({ sample, experimentAccessionCodes }) {
  // Create a dataset slice, where we include all experiments that are referencing this sample
  // that way when it gets added/removed it will impact all those experiments
  const dataSetSlice = experimentAccessionCodes.reduce(
    (result, accessionCode) => {
      result[accessionCode] = [sample.accession_code];
      return result;
    },
    {}
  );

  if (!sample.is_processed) {
    return (
      <div className="sample-not-processed info">
        <img className="info__icon" src={InfoIcon} alt="" />
        <div>
          <div className="nowrap">Sample not processed</div>
          <a
            href="http://docs.refine.bio/en/latest/faq.html#why-can-t-i-add-certain-samples-to-my-dataset"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <DataSetSampleActions
      dataSetSlice={dataSetSlice}
      meta={{ addText: 'Add', buttonStyle: 'secondary' }}
    />
  );
}
