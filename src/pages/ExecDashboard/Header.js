import React from 'react';
import logo from '../../common/icons/logo-beta.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="exec-dash__header header--inverted">
      <Link to="/">
        <img src={logo} alt="refine.bio" className="header__logo" />
      </Link>
      | Executive Dashboard
    </header>
  );
}
