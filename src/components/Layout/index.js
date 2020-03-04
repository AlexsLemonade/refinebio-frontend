import React from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import Footer from '../Footer';
import Notification from '../Notification';

export default function Layout({ children }) {
  // in some cases it's useful to mark the root object with a class to identify the current page, in case
  // some pages want to make modifications to the layout object
  const location = useRouter();
  const pageClass =
    location.pathname !== '/'
      ? `page-${location.pathname.substr(1)}`
      : 'page-home';

  return (
    <div className={`layout ${pageClass}`}>
      <Notification />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
