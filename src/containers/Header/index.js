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
            mobile={() => <HeaderLinksMobile />}
            desktop={() => <HeaderLinks />}
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

let HeaderLinks = ({ itemClicked, totalSamples, fetchDataSet }) => {
  return (
    <ul className="header__menu">
      <li className="header__link">
        <Link to="/" onClick={itemClicked}>
          Search
        </Link>
      </li>
      <li className="header__link">
        <Link to="/api" onClick={itemClicked}>
          API
        </Link>
      </li>
      <li className="header__link">
        <Link to="/docs" onClick={itemClicked}>
          Docs
        </Link>
      </li>
      <li className="header__link">
        <Link to="/about" onClick={itemClicked}>
          About
        </Link>
      </li>
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

/**
 * On mobile the links should appear on a menu at the top. This component adds that functionality
 * while reusing `HeaderLinks`
 */
function HeaderLinksMobile() {
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
          <HeaderLinks itemClicked={hideMenu} />

          <div className="header__menu-close">
            <button onClick={hideMenu}>&times;</button>
          </div>
        </div>
      )}
    </SideMenu>
  );
}
