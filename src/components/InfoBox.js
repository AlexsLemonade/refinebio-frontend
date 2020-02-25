import React from 'react';
import { IoMdClose } from 'react-icons/io';
import ResponsiveSwitch from './ResponsiveSwitch';
import { isServer } from '../common/helpers';
import Button from './Button';

function InfoBoxDesktop({ onClose }) {
  return (
    <div className="info-box">
      <div className="info-box__inner">
        <div className="info-box__title">
          Build and Download Custom Datasets
        </div>
        <div>
          refine.bio helps you build ready-to-use datasets with normalized
          transcriptome data from all of the world’s genetic databases.
        </div>
      </div>

      <Button
        className="info-box__close"
        onClick={onClose}
        buttonStyle="transparent"
      >
        <IoMdClose className="icon" />
      </Button>
    </div>
  );
}

function InfoBoxMobile({ onClose }) {
  return (
    <div className="info-box">
      Search and download from a collection of normalized transcriptome data.
      <Button
        className="info-box__close"
        onClick={onClose}
        buttonStyle="transparent"
      >
        <IoMdClose className="icon" />
      </Button>
    </div>
  );
}

const VISITED_BEFORE = 'firstTimeVisitor';

const LANDING_PAGE = !isServer && window.location.href;

/**
 * Returns true if this is the first time a user is visiting us
 */
function firstTimeUser() {
  const isFirstTimeVisitor = !localStorage.getItem(VISITED_BEFORE);
  if (isFirstTimeVisitor) {
    localStorage.setItem(VISITED_BEFORE, true);
  }
  return isFirstTimeVisitor;
}

class InfoBox extends React.Component {
  state = {
    // The infobox should only be displayed when it's first loaded, on the page where the user landed initially
    showInfoBox:
      !isServer && firstTimeUser() && LANDING_PAGE === window.location.href,
  };

  render() {
    if (!this.state.showInfoBox) {
      return null;
    }

    return (
      <ResponsiveSwitch
        break="mobile"
        mobile={() => (
          <InfoBoxMobile
            onClose={() => this.setState({ showInfoBox: false })}
          />
        )}
        desktop={() => (
          <InfoBoxDesktop
            onClose={() => this.setState({ showInfoBox: false })}
          />
        )}
      />
    );
  }
}

export default InfoBox;
