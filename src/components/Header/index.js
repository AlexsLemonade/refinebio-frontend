import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Link from 'next/link';
import { IoMdMenu } from 'react-icons/io';
import { withRouter, useRouter } from 'next/router';

import logo from '../../common/icons/logo.svg';
import { fetchDataSet } from '../../state/download/actions';
import { getTotalSamplesAdded } from '../../state/download/reducer';

import Loader from '../Loader';
import SideMenu from '../SideMenu';
import ResponsiveSwitch from '../ResponsiveSwitch';
import githubCorner from './github-corner.svg';

import { useTheme } from '../../common/ThemeContext';

let Header = ({ router: location }) => {
  const [theme] = useTheme();
  return (
    <header
      className={classnames('header', 'js-header', {
        'header--inverted header--scroll': theme.header === 'inverted',
        'header--light header--scroll': theme.header === 'light',
      })}
    >
      <div className="header__container">
        <Link href="/index" as="/">
          <a>
            <img src={logo} alt="refine.bio" className="header__logo" />
          </a>
        </Link>

        <ResponsiveSwitch
          break="mobile"
          mobile={() => <HeaderLinksMobile location={location} />}
          desktop={() => <HeaderLinks location={location} />}
        />
      </div>

      <GithubCorner />
    </header>
  );
};

Header = withRouter(Header);
export default Header;

let HeaderLinks = ({ itemClicked, totalSamples, fetchDataSet, location }) => {
  return (
    <ul className="header__menu">
      <HeaderLink
        href="/index"
        as="/"
        onClick={itemClicked}
        location={location}
        activePath={['/search']}
      >
        Search
      </HeaderLink>{' '}
      <HeaderDropDownLink
        href={[
          {
            title: 'Normalized Compendia',
            location: {
              pathname: '/compendia',
              query: { c: 'normalized' },
            },
          },
          {
            title: 'RNA-seq Sample Compendia',
            location: {
              pathname: '/compendia',
              query: { c: 'rna-seq-sample' },
            },
          },
        ]}
        replace
        onClick={itemClicked}
        location={location}
        activePath={['/compendia']}
      >
        Compendia
      </HeaderDropDownLink>
      <li className="header__link">
        <a href="//docs.refine.bio" target="_blank" rel="noopener noreferrer">
          Docs
        </a>
      </li>
      <HeaderLink href="/about" onClick={itemClicked} location={location}>
        About
      </HeaderLink>
      <li className="header__link header__link--button-wrap">
        <Link href="/download" as="/download">
          <a
            className="button button--secondary header__link-button"
            onClick={itemClicked}
            role="button"
            tabIndex={0}
          >
            My Dataset
            <Loader fetch={fetchDataSet}>
              {({ isLoading }) =>
                !isLoading && (
                  <div className="header__dataset-count">{totalSamples}</div>
                )
              }
            </Loader>
          </a>
        </Link>
      </li>
    </ul>
  );
};
HeaderLinks = connect(
  ({ download: { dataSet } }) => ({
    totalSamples: getTotalSamplesAdded(dataSet),
  }),
  {
    fetchDataSet,
  }
)(HeaderLinks);

const HeaderLink = ({
  href,
  as: asPath,
  onClick,
  children,
  activePath = [],
}) => {
  const router = useRouter();
  const isActive =
    router.pathname === asPath || activePath.includes(router.pathname);

  return (
    <li
      className={classnames('header__link', {
        'header__link--active': isActive,
      })}
    >
      <Link href={href} as={asPath || href}>
        <a onClick={onClick} role="button" tabIndex={0}>
          {children}
        </a>
      </Link>
    </li>
  );
};

const HeaderDropDownLink = ({
  href = [],
  onClick,
  children,
  location,
  activePath = [],
  push,
  replace,
}) => {
  const [open, setOpen] = React.useState(false);
  const openDropdown = () => setOpen(true);
  const closeDropdown = () => setOpen(false);

  return (
    <li
      className="header__dropdown"
      onMouseOver={openDropdown}
      onMouseOut={closeDropdown}
      onFocus={openDropdown}
      onBlur={closeDropdown}
      onClick={openDropdown}
    >
      <ul>
        <li
          className={classnames('header__link', {
            'header__link--active':
              location && activePath.includes(location.pathname),
          })}
        >
          <button type="button">
            {children}
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z" />
            </svg>
          </button>
        </li>
        <li>
          <ul
            className={classnames('header__dropdown--links', {
              'header__dropdown--open': open,
            })}
          >
            {href.map(({ title, location: toLocation }) => (
              <li key={title}>
                <Link href={toLocation} as={toLocation} replace={replace}>
                  <a
                    onClick={(...click) => {
                      closeDropdown();
                      if (onClick) onClick(...click);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </li>
  );
};

/**
 * On mobile the links should appear on a menu at the top. This component adds that functionality
 * while reusing `HeaderLinks`
 */
function HeaderLinksMobile({ location }) {
  return (
    <SideMenu
      orientation="top"
      component={showMenu => (
        <button onClick={showMenu} type="button">
          <IoMdMenu className="header__burger" />
        </button>
      )}
    >
      {({ hideMenu }) => (
        <div>
          <HeaderLinks itemClicked={hideMenu} location={location} />

          <div className="header__menu-close">
            <button onClick={hideMenu} type="button">
              &times;
            </button>
          </div>
        </div>
      )}
    </SideMenu>
  );
}

function GithubCorner() {
  return (
    <a
      href="https://github.com/AlexsLemonade"
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="github-corner"
    >
      <img src={githubCorner} alt="github link" />
    </a>
  );
}
