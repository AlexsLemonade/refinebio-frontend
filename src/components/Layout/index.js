import React from 'react';
import Header from '../../containers/Header';
import Footer from '../Footer';
import './Layout.scss';
import { withRouter } from 'react-router';

let Layout = ({ children, location }) => {
  // in some cases it's useful to mark the root object with a class to identify the current page, in case
  // some pages want to make modifications to the layout object
  const pageClass =
    location.pathname !== '/'
      ? `page-${location.pathname.substr(1)}`
      : 'page-home';

  return (
    <div className={`layout ${pageClass}`}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
Layout = withRouter(Layout);

export default Layout;
