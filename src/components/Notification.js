import React from 'react';
import { withRouter } from 'react-router';
import Button from './Button';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';

import './Notification.scss';

function Notification({ location: { search, state } }) {
  const [closed, setClosed] = React.useState(false);

  if (closed || !state || !state.message) return null;

  return (
    <div className="notification">
      <div className="layout__content">
        <div className="notification__content">
          <IoMdCheckmarkCircle style={{ fontSize: 24 }} />
          {state.message}

          <Button
            className="notification__close"
            onClick={() => setClosed(true)}
            buttonStyle="transparent"
          >
            <IoMdClose className="icon" />
          </Button>
        </div>
      </div>
    </div>
  );
}
Notification = withRouter(Notification);
export default Notification;
