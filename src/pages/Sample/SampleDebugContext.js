import React from 'react';
import moment from 'moment';
import { useLoader } from '../../components/Loader';
import Spinner from '../../components/Spinner';
import {
  getDownloaderJobs,
  getProcessorJobs,
  getRunningJobs,
  getComputedFiles,
  getOriginalFiles,
  getDetailedSample,
} from '../../api';

const SampleDebugContext = React.createContext({});

export const SampleDebugConsumer = SampleDebugContext.Consumer;

export default SampleDebugContext;

export function SampleDebugProvider({ accessionCode, children }) {
  const { data, isLoading } = useLoader(() => loadData(accessionCode), [
    accessionCode,
  ]);
  const [selectedOriginalFiles, setSelectedOriginalFiles] = React.useState({});
  const contextValue = {
    data: data || {},
    isLoading,
    isFileSelected: id => selectedOriginalFiles[id],
    toggleFile: id =>
      setSelectedOriginalFiles({
        ...selectedOriginalFiles,
        [id]: !selectedOriginalFiles[id],
      }),
  };

  return (
    <SampleDebugContext.Provider value={contextValue}>
      {isLoading ? <Spinner /> : children}
    </SampleDebugContext.Provider>
  );
}

export async function loadData(accessionCode) {
  const sample = await getDetailedSample(accessionCode);

  const [
    originalFiles,
    computedFiles,
    processorJobs,
    downloaderJobs,
    runningJobs,
  ] = await Promise.all([
    getOriginalFiles(sample.id),
    getComputedFiles(sample.id),
    getProcessorJobs(accessionCode),
    getDownloaderJobs(accessionCode),
    getRunningJobs(accessionCode),
  ]);

  return {
    sample,
    originalFiles: originalFiles.results,
    computedFiles: computedFiles.results,
    jobs: mergeJobs(processorJobs.results, downloaderJobs.results, runningJobs),
  };
}

export function mergeJobs(processorJobs, downloaderJobs, runningJobs) {
  const processorJobsResult = processorJobs.map(job => ({
    ...job,
    type: 'processor',
    isRunning: runningJobs.includes(job.batch_job_id),
  }));
  const downloaderJobsResult = downloaderJobs.map(job => ({
    ...job,
    type: 'downloader',
    isRunning: runningJobs.includes(job.batch_job_id),
  }));

  return [...processorJobsResult, ...downloaderJobsResult].sort(
    (job1, job2) => {
      const date1 = job1.start_time || job1.created_at;
      const date2 = job2.start_time || job2.created_at;
      return moment(date1).isBefore(date2) ? 1 : -1;
    }
  );
}
