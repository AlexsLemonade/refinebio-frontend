import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppError from './AppError';
import reportError from '../../state/reportError';

/**
 * This component wraps the entire application, and shows the `AppError` page in order to recover
 * from errors in the component render lifecycle.
 *
 * https://reactjs.org/docs/error-boundaries.html
 *
 * Important: It won't catch errors in event handlers, just in the render methods.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidUpdate(prevProps) {
    // if the location is updated, reset the `hasError` state, so that the app can recover
    if (prevProps.location !== this.props.location) {
      // todo remove this https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#alternative-1-reset-uncontrolled-component-with-an-id-prop
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
ErrorBoundary = connect(
  null,
  { reportError }
)(ErrorBoundary);
ErrorBoundary = withRouter(ErrorBoundary);

export default ErrorBoundary;
