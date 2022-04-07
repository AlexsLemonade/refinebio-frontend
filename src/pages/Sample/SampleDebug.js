import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { IoMdSync } from 'react-icons/io';
import { Ajax } from '../../common/helpers';

import SampleDebugContext, { SampleDebugProvider } from './SampleDebugContext';
import Checkbox from '../../components/Checkbox';

const DATE_FORMAT = 'MM/DD/YYYY HH:mm';

export default function SampleDebug({ accessionCode }) {
  return (
    <SampleDebugProvider accessionCode={accessionCode}>
      <div className="flex-row flex-row--top">
        <OriginalFileFilters />
        <ComputedFiles />
      </div>
      <JobTable />
    </SampleDebugProvider>
  );
}

function OriginalFileFilters() {
  const {
    data: { originalFiles },
    isFileSelected,
    toggleFile,
  } = React.useContext(SampleDebugContext);

  return (
    <div className="sample-debug-section">
      <h3>Original Files</h3>
      {originalFiles && originalFiles.length > 0
        ? originalFiles.map(file => (
            <Checkbox
              key={file.id}
              name={file.id}
              onChange={() => toggleFile(file.id)}
              checked={isFileSelected(file.id)}
              className={classnames({
                'sample-debug__cancel':
                  file.processor_jobs.length + file.downloader_jobs.length ===
                  0,
              })}
            >
              {file.filename}
              {file.filename !== file.source_filename
                ? ' (from archive) '
                : ' '}
              <a href={file.source_url} className="link">
                download
              </a>
            </Checkbox>
          ))
        : 'None'}
    </div>
  );
}

function ComputedFiles() {
  const {
    data: { computedFiles },
  } = React.useContext(SampleDebugContext);

  return (
    <div className="sample-debug-section">
      <h3>Computed Files</h3>
      {computedFiles && computedFiles.length > 0
        ? computedFiles.map(file => <div>{file.filename}</div>)
        : 'None'}
    </div>
  );
}

function JobTable() {
  const {
    data: { jobs },
  } = React.useContext(SampleDebugContext);

  return (
    <div className="sample-debug-section">
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
          {jobs && jobs.map(job => <JobRow key={job.id} job={job} />)}
        </tbody>
      </table>
    </div>
  );
}

function JobRow({ job }) {
  const { isFileSelected } = React.useContext(SampleDebugContext);
  const jobOomKilled = job.start_time && !job.end_time && !job.failure_reason;

  return (
    <>
      <tr
        key={job.id}
        className={classnames({
          'jobs-table__job': true,
          error: job.success === false,
          'color-success': job.success === true,
          'jobs-table__job--select': job.original_files.some(isFileSelected),
        })}
      >
        <td>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={
              job.type === 'processor'
                ? `https://api.refine.bio/v1/jobs/processor/${job.id}`
                : `https://api.refine.bio/v1/jobs/downloader/${job.id}`
            }
          >
            {job.id}
          </a>
        </td>
        <td title={job.is_queued ? 'This job is currently running' : null}>
          {job.type === 'processor'
            ? `${job.pipeline_applied} (${job.ram_amount})`
            : job.downloader_task}{' '}
          {job.is_queued ? <IoMdSync /> : null}
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
            'jobs-table__job--select': job.original_files.some(isFileSelected),
          })}
        >
          <td />
          <td colSpan="8">
            {jobOomKilled ? (
              'Looks like the job was OOM-Killed (no failure_reason)'
            ) : (
              <p>
                {job.failure_reason
                  ? job.failure_reason
                      .split('\\n')
                      .map(fragment => <div>{fragment}</div>)
                  : 'No failure reason'}
              </p>
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
