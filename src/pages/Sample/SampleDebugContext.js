import React from 'react';
import moment from 'moment';
import { Ajax } from '../../common/helpers';
import { useLoader } from '../../components/Loader';

const SampleDebugContext = React.createContext({});

export const SampleDebugConsumer = SampleDebugContext.Consumer;

export default SampleDebugContext;

export function SampleDebugProvider({ accessionCode, children }) {
  const { data, isLoading } = useLoader(() => loadData(accessionCode));
  return (
    <SampleDebugContext.Provider value={{ data, isLoading }}>
      {children}
    </SampleDebugContext.Provider>
  );
}

export async function loadData(accessionCode) {
  return {
    jobs: await loadJobs(accessionCode),
  };
}

export async function loadJobs(accessionCode) {
  const processorJobs = (await getProcessorJobs(accessionCode)).results.map(
    job => ({ ...job, type: 'processor' })
  );
  const downloaderJobs = (await getDownloaderJobs(accessionCode)).results.map(
    job => ({ ...job, type: 'downloader' })
  );
  return [...processorJobs, ...downloaderJobs].sort((job1, job2) => {
    const date1 = job1.start_time || job1.created_at;
    const date2 = job2.start_time || job2.created_at;
    return moment(date1).isBefore(date2) ? 1 : -1;
  });
}

export async function getDownloaderJobs(accessionCode) {
  return Ajax.get(`/v1/jobs/downloader/`, {
    sample_accession_code: accessionCode,
  });
}

export async function getProcessorJobs(accessionCode) {
  return Ajax.get(`/v1/jobs/processor/`, {
    sample_accession_code: accessionCode,
  });
}
