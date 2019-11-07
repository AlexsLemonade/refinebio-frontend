import React from 'react';
import moment from 'moment';
import { Ajax } from '../../common/helpers';
import { useLoader } from '../../components/Loader';
import { getDetailedSample } from '../../api/samples';

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
      {children}
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
    Ajax.get('/v1/original_files/', {
      samples: sample.id,
    }),
    Ajax.get('/v1/computed_files/', {
      samples: sample.id,
    }),
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
    isRunning: runningJobs.includes(job.nomad_job_id),
  }));
  const downloaderJobsResult = downloaderJobs.map(job => ({
    ...job,
    type: 'downloader',
    isRunning: runningJobs.includes(job.nomad_job_id),
  }));

  return [...processorJobsResult, ...downloaderJobsResult].sort(
    (job1, job2) => {
      const date1 = job1.start_time || job1.created_at;
      const date2 = job2.start_time || job2.created_at;
      return moment(date1).isBefore(date2) ? 1 : -1;
    }
  );
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

async function getRunningJobs(accessionCode) {
  const [processorJobs, downloaderJobs] = await Promise.all([
    Ajax.get(`/v1/jobs/downloader/`, {
      sample_accession_code: accessionCode,
      nomad: true,
    }),
    Ajax.get(`/v1/jobs/processor/`, {
      sample_accession_code: accessionCode,
      nomad: true,
    }),
  ]);

  return [
    ...processorJobs.results.map(job => job.nomad_job_id),
    ...downloaderJobs.results.map(job => job.nomad_job_id),
  ];
}
