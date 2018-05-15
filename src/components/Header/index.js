import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../common/icons/logo.svg';
import './Header.scss';

const Header = props => {
  return (
    <header>
      <div className="header__container">
        <div className="header__logo">
          <img src={logo} alt="refine.bio" />
        </div>
        <div>
          <Link className="header__link" to="/">
            Search
          </Link>
          <Link className="header__link" to="/api">
            API
          </Link>
          <Link className="header__link" to="/docs">
            Docs
          </Link>
          <Link className="header__link" to="/about">
            About
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
