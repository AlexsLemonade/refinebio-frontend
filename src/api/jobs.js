import { Ajax } from '../common/helpers';

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

export async function getRunningJobs(accessionCode) {
  const [processorJobs, downloaderJobs] = await Promise.all([
    Ajax.get(`/v1/jobs/downloader/`, {
      sample_accession_code: accessionCode,
      is_queued: true,
    }),
    Ajax.get(`/v1/jobs/processor/`, {
      sample_accession_code: accessionCode,
      is_queued: true,
    }),
  ]);

  return [
    ...processorJobs.results.map(job => job.batch_job_id),
    ...downloaderJobs.results.map(job => job.batch_job_id),
  ];
}
