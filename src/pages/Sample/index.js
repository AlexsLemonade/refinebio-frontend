import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Ajax } from '../../common/helpers';
import { useLoader } from '../../components/Loader';
import './sample.scss';

const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export default function Sample({ match }) {
  const accessionCode = match.params.id;

  // const { data, isLoading } = useLoader(() => getSample(accessionCode), [
  //   accessionCode,
  // ]);

  const { data: jobs } = useLoader(() => loadJobs(accessionCode));

  return (
    <div>
      <h1>Sample {accessionCode}</h1>

      <div>
        <h3>Downloader and Processor Job Info</h3>
        <table className="jobs-table">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col" />
              <th scope="col">num retries</th>
              <th scope="col">retried</th>
              <th scope="col">worker_version</th>
              <th scope="col">created at</th>
              <th scope="col">running time</th>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.map(job => <JobRow id={job.id} job={job} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobRow({ job }) {
  const jobOomKilled = job.start_time && !job.end_time && !job.failure_reason;

  return (
    <>
      <tr
        key={job.id}
        className={classnames({
          'jobs-table__job': true,
          error: job.success === false,
          'color-success': job.success === true,
        })}
      >
        <td>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={
              job.type === 'processor'
                ? `https://api.refine.bio/v1/jobs/processor/?format=json&id=${
                    job.id
                  }`
                : `https://api.refine.bio/v1/jobs/downloader/?format=json&id=${
                    job.id
                  }`
            }
          >
            {job.id}
          </a>
        </td>
        <td>
          {job.type === 'processor'
            ? `${job.pipeline_applied} (${job.ram_amount})`
            : job.downloader_task}
        </td>
        <td>{job.num_retries}</td>
        <td>{job.retried ? 'yes' : 'no'}</td>
        <td>{job.worker_version}</td>
        <td>{job.created_at && moment(job.created_at).format(DATE_FORMAT)}</td>
        <td>
          {job.start_time
            ? moment(job.start_time).format(DATE_FORMAT)
            : '(no start_time)'}
          {job.start_time && job.end_time
            ? ` (${moment
                .duration(moment(job.end_time).diff(job.start_time))
                .humanize()})`
            : ' (no end_time)'}
        </td>
      </tr>
      {(job.failure_reason || job.success === false) && (
        <tr
          className={classnames({
            error: job.success === false,
            'color-success': job.success === true,
          })}
        >
          <td />
          <td colSpan="8">
            {jobOomKilled ? (
              'Looks like the job was OOM-Killed?'
            ) : (
              <p>{job.failure_reason || 'No failure reason'}</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export async function getSample(accessionCode) {
  return Ajax.get(`/v1/samples/${accessionCode}/`);
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
