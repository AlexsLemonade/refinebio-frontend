import React from 'react';
import { connect } from 'react-redux';
import { getDataSet, getDataSetDetails } from '../../api/dataSet';
import Loader from '../../components/Loader';
import { timeout } from '../../common/helpers';

let DataSetLoader = ({ dataSetId, token, children }) => {
  const loader = React.createRef();
  let liveUpdate = true;

  const [dataSet, setDataSet] = React.useState({});
  const [firstUpdate, setFirstUpdate] = React.useState(true);

  const fetchDataSet = async () => {
    const freshDataSet = firstUpdate
      ? await getDataSetDetails(dataSetId, token)
      : await getDataSet(dataSetId, token);

    if (freshDataSet.is_processing) {
      startLiveUpdate();
    }

    // override the current dataset with the newest state
    setDataSet({ ...dataSet, ...freshDataSet });
    setFirstUpdate(false);
  };

  const startLiveUpdate = async () => {
    await timeout(20000); // wait 20 secs

    if (liveUpdate) {
      loader.current.refresh();
    }
  };

  React.useEffect(() => {
    return () => {
      // disable live updates after the component is unmounted
      liveUpdate = false;
    };
  });

  return (
    <Loader ref={loader} updateProps={dataSetId} fetch={() => fetchDataSet()}>
      {({ isLoading, hasError }) =>
        children({
          isLoading: isLoading && firstUpdate,
          hasError,
          dataSet,
        })
      }
    </Loader>
  );
};

DataSetLoader = connect(({ token }) => ({ token }))(DataSetLoader);
export default DataSetLoader;
