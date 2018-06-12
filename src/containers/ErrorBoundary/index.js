import React from 'react';
import { connect } from 'react-redux';
import AppError from '../AppError';
import Layout from '../../components/Layout';
import reportError from '../../state/reportError';
import { withRouter } from 'react-router';

declare var Raven: any;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidUpdate(prevProps) {
    // if the location is updated, reset the `hasError` state, so that the app can recover
    if (prevProps.location !== this.props.location) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    this.props.reportError(error, { extra: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="layout__content">
          <AppError />
        </div>
      );
    }

    return this.props.children;
  }
}
ErrorBoundary = connect(state => ({}), { reportError })(ErrorBoundary);
ErrorBoundary = withRouter(ErrorBoundary);

export default ErrorBoundary;
