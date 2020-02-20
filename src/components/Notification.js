import React from 'react';
import { useRouter } from 'next/router';
import { IoMdCheckmarkCircle, IoMdClose } from 'react-icons/io';

import Button from './Button';

export default function Notification() {
  const {
    pathname,
    query: { message },
  } = useRouter();
  const [closed, setClosed] = React.useState({});

  if (!message) return null;
  if (closed[pathname + message]) return null;

  function closeMessage() {
    setClosed({
      ...closed,
      [pathname + message]: true,
    });
  }

  return (
    <div className="notification">
      <div className="layout__content">
        <div className="notification__content">
          <IoMdCheckmarkCircle style={{ fontSize: 24, marginRight: 8 }} />
          {message}

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
}
