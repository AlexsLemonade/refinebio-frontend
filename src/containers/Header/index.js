import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import logo from '../../common/icons/logo.svg';
import { fetchDataSet } from '../../state/download/actions';
import { getTotalSamplesAdded } from '../../state/download/reducer';
import './Header.scss';

class Header extends React.Component {
  componentDidMount() {
    this.props.fetchDataSet();
  }

  render() {
    return (
      <header className="header js-header">
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
            <Link className="header__link header__link--button" to="/download">
              Download Dataset
              {this.props.isLoading ? null : (
                <div className="header__dataset-count">
                  {this.props.totalSamples}
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  const { download: { isLoading } } = state;
  return {
    totalSamples: getTotalSamplesAdded(state),
    isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDataSet }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
