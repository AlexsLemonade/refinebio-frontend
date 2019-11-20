import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { IoMdMenu } from 'react-icons/io';

import logo from '../../common/icons/logo.svg';
import { fetchDataSet } from '../../state/download/actions';
import { getTotalSamplesAdded } from '../../state/download/reducer';
import './Header.scss';
import Loader from '../Loader';
import SideMenu from '../SideMenu';
import ResponsiveSwitch from '../ResponsiveSwitch';
import { searchUrl } from '../../routes';
import githubCorner from './github-corner.svg';

/**
 * In general this is a bad approach, where the header component knows about other pages.
 * But in the future we'll unify the header styles and have a single color. So it doesn't make
 * much sense to invest a lot of time improving this.
 */
function shouldInvertColors(pathname) {
  return ['/', '/about', '/species-compendia'].includes(pathname);
}

let Header = ({ location }) => {
  return (
    <header
      className={classnames('header', 'js-header', {
        'header--inverted header--scroll': shouldInvertColors(
          location.pathname
        ),
      })}
    >
      <div className="header__container">
        <Link to="/">
          <img src={logo} alt="refine.bio" className="header__logo" />
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
        to="/"
        onClick={itemClicked}
        location={location}
        activePath={[searchUrl()]}
      >
        Search
      </HeaderLink>{' '}
      <HeaderLink
        to="/species-compendia"
        onClick={itemClicked}
        location={location}
      >
        Species Compendia
      </HeaderLink>
      <li className="header__link">
        <a
          href="http://docs.refine.bio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </li>
      <HeaderLink to="/about" onClick={itemClicked} location={location}>
        About
      </HeaderLink>
      <li className="header__link header__link--button-wrap">
        <Link
          className="button button--secondary header__link-button"
          to="/download"
          onClick={itemClicked}
        >
          My Dataset
          <Loader fetch={fetchDataSet}>
            {({ isLoading }) =>
              !isLoading && (
                <div className="header__dataset-count">{totalSamples}</div>
              )
            }
          </Loader>
        </Link>
      </li>
    </ul>
  );
};
HeaderLinks = connect(
  ({ download: { dataSet } }) => ({
    totalSamples: getTotalSamplesAdded({ dataSet }),
  }),
  {
    fetchDataSet,
  }
)(HeaderLinks);

const HeaderLink = ({ to, onClick, children, location, activePath = [] }) => {
  return (
    <li
      className={classnames('header__link', {
        'header__link--active':
          location &&
          (location.pathname === to || activePath.includes(location.pathname)),
      })}
    >
      <Link to={to} onClick={onClick}>
        {children}
      </Link>
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
