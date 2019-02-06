import React from 'react';
import { getAllDetailedSamples } from '../../api/samples';
import isEqual from 'lodash/isEqual';
import Loader from '../../components/Loader';

/**
 * Takes care of loading a set of samples
 */
export default class SampleDetailsLoader extends React.Component {
  static defaultProps = {
    fetchSampleParams: {}
  };

  state = {
    page: 0,
    pageSize: 10,
    filterBy: undefined,
    orderBy: undefined,

    totalSamples: 0,
    samples: [],
    isLoading: false
  };

  render() {
    return (
      <Loader
        fetch={this.fetchSamples}
        updateProps={this.getParameterSnapshot()}
      >
        {({ isLoading, hasError }) =>
          this.props.children({
            ...this.state,
            totalPages: Math.ceil(
              this.state.totalSamples / this.state.pageSize
            ),
            isLoading,
            hasError,

            // Use this callback to update parameters like: page, pageSize, filter, orderBy
            onUpdate: params => this.setState(params)
          })
        }
      </Loader>
    );
  }

  /**
   * Given the current state, returns the parameters that should be used
   */
  getParameterSnapshot() {
    const { page, pageSize, orderBy, filterBy } = this.state;
    const offset = page * pageSize;

    return {
      ...this.props.fetchSampleParams,
      orderBy,
      offset,
      limit: pageSize,
      filterBy
    };
  }

  fetchSamples = async () => {
    const detailedSamplesParams = this.getParameterSnapshot();
    const { count: totalSamples, data: samples } = await getAllDetailedSamples(
      detailedSamplesParams
    );

    this.setState({
      totalSamples,
      samples
    });
  };
}
