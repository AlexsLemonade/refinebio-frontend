import React from 'react';
import NoMatch from '../src/components/NoMatch';

function Error({ statusCode }) {
  return (
    <div className="layout__content">
      <NoMatch statusCode={statusCode} />
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
