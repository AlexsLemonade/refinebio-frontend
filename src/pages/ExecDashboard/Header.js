import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import logo from '../../common/icons/logo.svg';

export default function Header({ isTv }) {
  return (
    <header
      className={classnames({
        'exec-dash__header': true,
        'header--inverted': !isTv,
      })}
    >
      <Link legacyBehavior href="/index" as="/">
        <a>
          <Image src={logo} alt="refine.bio" className="header__logo" />
        </a>
      </Link>
      | Executive Dashboard
    </header>
  );
}
