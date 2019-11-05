import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Ajax } from '../../common/helpers';
import './sample.scss';
import SampleDebugContext, { SampleDebugProvider } from './SampleDebugContext';

const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export default function Sample({ match }) {
  const accessionCode = match.params.id;

  // const { data, isLoading } = useLoader(() => getSample(accessionCode), [
  //   accessionCode,
  // ]);

  return (
    <div>
      <h1>Sample {accessionCode}</h1>

      <SampleDebugProvider accessionCode={accessionCode}>
        <h3>Downloader and Processor Job Info</h3>
        <JobTable />
      </SampleDebugProvider>
    </div>
  );
}

function JobTable({}) {
  const { data } = React.useContext(SampleDebugContext);
  const { jobs } = data || {};

  return (
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
        {jobs && jobs.map(job => <JobRow key={job.id} job={job} />)}
      </tbody>
    </table>
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
              'Looks like the job was OOM-Killed (no failure_reason)'
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
