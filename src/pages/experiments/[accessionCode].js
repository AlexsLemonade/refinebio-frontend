import React from 'react';
import Router, { useRouter } from 'next/router';
import { getExperiment } from '../../api/experiments';
import { experiments } from '../../routes';
import NoMatch from '../../components/NoMatch';

function redirect(params) {
  const { ctx, location, status = 302 } = params;

  if (ctx.res) {
    // Seems to be the version used by zeit
    ctx.res.writeHead(status, {
      Location: location,
      // Add the content-type for SEO considerations
      'Content-Type': 'text/html; charset=utf-8',
    });
    ctx.res.end();
    return;
  }

  Router.replace(location);
}

/**
 * We need to do a permanent redirect to the experiment page with the slug
 * or return 404 if the experiment isn't found.
 */
export default class ExperimentRedirect extends React.Component {
  static async getInitialProps(ctx) {
    const { accessionCode } = ctx.query;
    let experiment;
    try {
      experiment = await getExperiment(accessionCode);
    } catch {
      // return 404 if the experiment wasn't found
      if (ctx.res) {
        ctx.res.statusCode = 404;
      }
      return { notFound: true };
    }

    redirect({
      ctx,
      location: experiments({
        accession_code: accessionCode,
        title: experiment.title,
      }),
      status: 301,
    });
    return {};
  }

  render() {
    if (this.props.notFound) {
      return (
        <div className="layout__content">
          <NoMatch />
        </div>
      );
    }

    return null;
  }
}
