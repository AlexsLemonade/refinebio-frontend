import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = props => {
  return (
    <header>
      <div className={styles.container}>
        <div className={styles.logo}>refine.bio</div>
        <div>
          <Link className={styles.link} to="/">
            Search
          </Link>
          <Link className={styles.link} to="/api">
            API
          </Link>
          <Link className={styles.link} to="/docs">
            Docs
          </Link>
          <Link className={styles.link} to="/about">
            About
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
