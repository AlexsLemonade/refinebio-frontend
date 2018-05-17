import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import logo from '../../common/icons/logo.svg';
import * as downloadActions from '../../state/download/actions';
import './Header.scss';

class Header extends React.Component {
  componentWillMount() {
    this.props.fetchDataSet();
  }

  render() {
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
            <Link className="header__link" to="/download">
              Download Dataset ({
                Object.keys(this.props.download.experiments).length
              })
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  const { download } = state;
  return {
    download
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(downloadActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
