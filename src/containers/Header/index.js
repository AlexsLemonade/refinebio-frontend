import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../common/icons/logo.svg';
import { fetchDataSet } from '../../state/download/actions';
import { getTotalSamplesAdded } from '../../state/download/reducer';
import { withRouter } from 'react-router';
import './Header.scss';
import classnames from 'classnames';
import Loader from '../../components/Loader';
import SideMenu from '../../components/SideMenu';
import ResponsiveSwitch from '../../components/ResponsiveSwitch';

class Header extends React.Component {
  render() {
    return (
      <header
        className={classnames('header', {
          'header--inverted header--scroll': this._invertColors()
        })}
      >
        <div className="header__container">
          <Link to="/">
            <img src={logo} alt="refine.bio" className="header__logo" />
          </Link>

          <ResponsiveSwitch
            break="mobile"
            mobile={() => <HeaderLinksMobile location={this.props.location} />}
            desktop={() => <HeaderLinks location={this.props.location} />}
          />
        </div>
      </header>
    );
  }

  /**
   * In general this is a bad approach, where the header component knows about other pages.
   * But in the future we'll unify the header styles and have a single color. So it doesn't make
   * much sense to invest a lot of time improving this.
   */
  _invertColors() {
    return ['/', '/about'].includes(this.props.location.pathname);
  }
}
Header = withRouter(Header);
export default Header;

let HeaderLinks = ({ itemClicked, totalSamples, fetchDataSet, location }) => {
  return (
    <ul className="header__menu">
      <HeaderLink
        to="/"
        onClick={itemClicked}
        location={location}
        activePath={['/results']}
      >
        Search
      </HeaderLink>
      <HeaderLink to="/api" onClick={itemClicked} location={location}>
        API
      </HeaderLink>
      <HeaderLink to="/docs" onClick={itemClicked} location={location}>
        Docs
      </HeaderLink>
      <HeaderLink to="/about" onClick={itemClicked} location={location}>
        About
      </HeaderLink>
      <li className="header__link">
        <Link
          className="button button--secondary header__link-button"
          to="/download"
          onClick={itemClicked}
        >
          Download Dataset
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
    totalSamples: getTotalSamplesAdded({ dataSet })
  }),
  {
    fetchDataSet
  }
)(HeaderLinks);

let HeaderLink = ({ to, onClick, children, location, activePath = [] }) => {
  return (
    <li
      className={classnames('header__link', {
        'header__link--active':
          location &&
          (location.pathname === to ||
            activePath.some(x => location.pathname === x))
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
        <button onClick={showMenu}>
          <i className="ion-navicon header__burger" />
        </button>
      )}
    >
      {({ hideMenu }) => (
        <div>
          <HeaderLinks itemClicked={hideMenu} location={location} />

          <div className="header__menu-close">
            <button onClick={hideMenu}>&times;</button>
          </div>
        </div>
      )}
    </SideMenu>
  );
}
