import React from 'react';
import ResponsiveSwitch from './ResponsiveSwitch';
import './InfoBox.scss';
import Button from './Button';

function InfoBoxDesktop({ onClose }) {
  return (
    <div className="info-box">
      <div className="info-box__inner">
        <div className="info-box__title">
          Build and Download Custom Datasets
        </div>
        <div>
          Choose from a collection of multi-species samples of uniformly
          processed and normalized transcriptome data.
        </div>
      </div>

      <Button
        className="info-box__close"
        onClick={onClose}
        buttonStyle="transparent"
      >
        <i className="icon ion-close" />
      </Button>
    </div>
  );
}

function InfoBoxMobile({ onClose }) {
  return (
    <div className="info-box">
      Browse the collection of harmonized transcriptome data.
      <Button
        className="info-box__close"
        onClick={onClose}
        buttonStyle="transparent"
      >
        <i className="icon ion-close" />
      </Button>
    </div>
  );
}

const VISITED_BEFORE = 'firstTimeVisitor';

/**
 * Returns true if this is the first time an user is visiting us
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
    showInfoBox: firstTimeUser()
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
