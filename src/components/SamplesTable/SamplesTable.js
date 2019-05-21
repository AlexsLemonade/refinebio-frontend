import React from 'react';
import RefineTable from '../RefineTable';
import 'react-table/react-table.css';

import Pagination from '../Pagination';
import Dropdown from '../Dropdown';

import InfoIcon from '../../common/icons/info-badge.svg';

import { PAGE_SIZES } from '../../common/constants';
import ProcessingInformationCell from './ProcessingInformationCell';
import DataSetSampleActions from '../DataSetSampleActions';
import './SamplesTable.scss';
import HorizontalScroll from '../HorizontalScroll';

import MetadataAnnotationsCell from './MetadataAnnotationsCell';
import { InputClear } from '../Input';
import Button from '../Button';
import SampleDetailsLoader from './SampleDetailsLoader';
import { formatSentenceCase } from '../../common/helpers';
import debounce from 'lodash/debounce';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import apiData from '../../apiData.json';
import { Hightlight, HText } from '../HighlightedText';

class SamplesTable extends React.Component {
  static defaultProps = {
    pageSizeDropdown: ({ dropdown, totalSamples }) => (
      <React.Fragment>
        Show {dropdown} of {totalSamples} Samples
      </React.Fragment>
    ),
    sampleMetadataFields: [],
  };

  columns = this._getColumns();

  get totalColumns() {
    return this.columns.length;
  }

  render() {
    const { pageActionComponent, filterActionComponent } = this.props;

    return (
      <SampleDetailsLoader fetchSampleParams={this.props.fetchSampleParams}>
        {state => {
          // Calculate page size options to exclude ones greater than the number of samples.
          const pageSizes =
            state.totalSamples < 10
              ? [state.totalSamples]
              : PAGE_SIZES.filter(size => size <= state.totalSamples);

          return (
            <RefineTable
              manual
              onFetchData={tableState =>
                state.onUpdate({
                  isLoading: true,
                  orderBy: this._getSortParam(tableState),
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
                fetchData: state.refresh,
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
                          totalSamples: state.totalSamples,
                        })}
                      </div>
                      {pageActionComponent &&
                        pageActionComponent(state.samples)}
                      <SamplesTableFilter
                        onChange={filterBy => state.onUpdate({ filterBy })}
                      />
                      {filterActionComponent && filterActionComponent()}
                    </div>
                  </div>
                  <div className="samples-table-layout__main">
                    <HorizontalScroll targetSelector=".rt-table">
                      <Hightlight match={state.filterBy}>
                        {makeTable()}
                      </Hightlight>
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
                      currentPage={state.page}
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
        show: !this.props.isImmutable,
      },
      {
        id: 'id',
        accessor: d => d.id,
        show: false,
      },
      {
        Header: 'Accession Code',
        id: 'accession_code',
        accessor: d => d.accession_code,
        minWidth: 160,
        width: 175,
        style: { textAlign: 'right' },
        Cell: CustomCell,
      },
      {
        Header: 'Title',
        id: 'title',
        accessor: d => d.title,
        minWidth: 180,
        Cell: CustomCell,
      },
      // list the columns in the experiment's metadata
      ...this.props.sampleMetadataFields.map(field => ({
        id: field,
        accessor: d => d[field],
        Header: formatSentenceCase(field),
        minWidth: 160,
        Cell: CustomCell,
      })),
      {
        Header: 'Processing Information',
        id: 'processing_information',
        sortable: false,
        Cell: ProcessingInformationCell,
        width: 200,
      },
      {
        Header: 'Additional Metadata',
        id: 'additional_metadata',
        sortable: false,
        Cell: MetadataAnnotationsCell,
        width: 200,
      },
    ];
  }

  /**
   * Returns the sort parameter as required from the backend
   * @param {*} tableState State from the table, as given to `fetchData`
   */
  _getSortParam(tableState) {
    let orderBy;

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

  return <HText>{value}</HText>;
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
      tabIndex={0}
      {...rest}
    >
      {children}

      <div className="samples-table__sort">
        <IoIosArrowUp />
        <IoIosArrowDown />
      </div>

      <div className="samples-table__sort-desc">
        <IoIosArrowDown />
      </div>

      <div className="samples-table__sort-asc">
        <IoIosArrowUp />
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

  // ensure the samples have qn targets associated
  if (
    !sample.is_processed ||
    (apiData.qnTargets && !apiData.qnTargets[sample.organism.name])
  ) {
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

class SamplesTableFilter extends React.Component {
  state = {
    filterBy: '',
  };

  onChangeDebounced = debounce(this.props.onChange, 400);

  render() {
    return (
      <div className="samples-table__filter">
        <div>Filter</div>
        <div className="samples-table__filter-input">
          <InputClear
            value={this.state.filterBy}
            onChange={filterBy => {
              this.setState({ filterBy });
              this.onChangeDebounced(filterBy);
            }}
          />
        </div>
      </div>
    );
  }
}
