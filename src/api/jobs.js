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
      limit: 500,
    }),
    Ajax.get(`/v1/jobs/processor/`, {
      sample_accession_code: accessionCode,
      limit: 500,
    }),
  ]);

  const jobs = [processorJobs, downloaderJobs];

  // filter out non-running jobs
  return jobs.filter(job => job.is_queued).map(job => job.batch_job_id);
}
