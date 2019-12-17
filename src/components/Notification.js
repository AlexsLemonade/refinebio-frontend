import React from 'react';
import { withRouter } from 'react-router-dom';
import { IoMdCheckmarkCircle, IoMdClose } from 'react-icons/io';

import Button from './Button';

import './Notification.scss';

let Notification = ({ location: { pathname, state } }) => {
  const [closed, setClosed] = React.useState({});

  if (!state || !state.message) return null;
  if (closed[pathname + state.message]) return null;

  function closeMessage() {
    setClosed({
      ...closed,
      [pathname + state.message]: true,
    });
  }

  return (
    <div className="notification">
      <div className="layout__content">
        <div className="notification__content">
          <IoMdCheckmarkCircle style={{ fontSize: 24, marginRight: 8 }} />
          {state.message}

          <Button
            className="notification__close"
            onClick={closeMessage}
            buttonStyle="transparent"
          >
            <IoMdClose className="icon" />
          </Button>
        </div>
      </div>
    </div>
  );
};
Notification = withRouter(Notification);
export default Notification;
