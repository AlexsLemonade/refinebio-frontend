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
