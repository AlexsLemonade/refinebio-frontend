import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../common/icons/logo.svg';
import { fetchDataSet } from '../../state/download/actions';
import { getTotalSamplesAdded } from '../../state/download/reducer';
import { withRouter } from 'react-router';
import './Header.scss';

class Header extends React.Component {
  state = {
    isMobileMenuOpen: false
  };

  componentDidMount() {
    this.props.fetchDataSet();
  }

  openMenu = () => {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
    document.body.classList.add('no-scroll');
  };

  closeMenu = () => {
    this.setState({ isMobileMenuOpen: false });
    document.body.classList.remove('no-scroll');
  };

  render() {
    return (
      <header
        className={`header js-header ${
          this.invertColors() ? 'header--inverted header--scroll' : ''
        }`}
      >
        <div className="header__container">
          <Link to="/">
            <img src={logo} alt="refine.bio" className="header__logo" />
          </Link>
          <button onClick={this.openMenu}>
            <i className="ion-navicon header__burger" />
          </button>
          <ul
            className={`header__menu ${
              this.state.isMobileMenuOpen ? 'header__menu--open' : ''
            }`}
          >
            <li className="header__link">
              <Link to="/">
                <span onClick={this.closeMenu}>Search</span>
              </Link>
            </li>
            <li className="header__link">
              <Link to="/api">
                <span onClick={this.closeMenu}>API</span>
              </Link>
            </li>
            <li className="header__link">
              <Link to="/docs">
                <span onClick={this.closeMenu}>Docs</span>
              </Link>
            </li>
            <li className="header__link">
              <Link to="/about">
                <span onClick={this.closeMenu}>About</span>
              </Link>
            </li>
            <li className="header__link">
              <Link
                className="header__link header__link--button"
                to="/download"
              >
                <span onClick={this.closeMenu}>Download Dataset</span>
                {this.props.isLoading ? null : (
                  <div className="header__dataset-count">
                    {this.props.totalSamples}
                  </div>
                )}
              </Link>
            </li>
            <li className="header__menu-close">
              <button onClick={this.closeMenu}>&times;</button>
            </li>
          </ul>
        </div>
      </header>
    );
  }

  /**
   * In general this is a bad approach, where the header component knows about other pages.
   * But in the future we'll unify the header styles and have a single color. So it doesn't make
   * much sense to invest a lot of time improving this.
   */
  invertColors() {
    return ['/', '/about'].includes(this.props.location.pathname);
  }
}

Header = connect(
  ({ download: { dataSet, isLoading } }) => ({
    totalSamples: getTotalSamplesAdded({ dataSet }),
    isLoading
  }),
  {
    fetchDataSet
  }
)(Header);
Header = withRouter(Header);
export default Header;
