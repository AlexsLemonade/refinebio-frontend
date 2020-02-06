import React from 'react';
import { connect } from 'react-redux';
import { getDataSet, getDataSetDetails } from '../../../api/dataSet';
import Loader from '../../../components/Loader';
import { timeout } from '../../../common/helpers';

class DataSetLoader extends React.Component {
  _loader = React.createRef();

  _liveUpdate = true;

  state = {
    dataSet: {},
    firstUpdate: true,
  };

  componentWillUnmount() {
    // disable live updates after the component is unmounted
    this._liveUpdate = false;
  }

  async _fetchDataSet() {
    const { dataSetId } = this.props;

    const dataSet = this.state.firstUpdate
      ? await getDataSetDetails(dataSetId, this.props.token)
      : await getDataSet(dataSetId, this.props.token);

    if (dataSet.is_processing) {
      this._startLiveUpdate();
    }

    // override the current dataset with the newest state
    this.setState(state => ({
      firstUpdate: false,
      dataSet: { ...state.dataSet, ...dataSet },
    }));
  }

  async _startLiveUpdate() {
    await timeout(20000); // wait 20 secs

    if (this._liveUpdate) {
      this._loader.current.refresh();
    }
  }

  render() {
    const { dataSetId } = this.props;

    return (
      <Loader
        ref={this._loader}
        updateProps={dataSetId}
        fetch={() => this._fetchDataSet()}
      >
        {({ isLoading, hasError }) =>
          this.props.children({
            isLoading: isLoading && this.state.firstUpdate,
            hasError,
            dataSet: this.state.dataSet,
          })
        }
      </Loader>
    );
  }
}
DataSetLoader = connect(({ token }) => ({ token }))(DataSetLoader);
export default DataSetLoader;
