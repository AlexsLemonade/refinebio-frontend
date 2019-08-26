import React from 'react';

export default function EmailSection() {
  return (
    <div className="main__container">
      <div className="main__heading-1">Sign Up for Updates</div>
      <div className="main__blurp-text">
        Be the first to know about new features, compendia releases, and more!
      </div>
      {/* Email Subscribe Form */}
      <div id="email-form">
        <form
          action="https://share.hsforms.com/1ZSsctZ2VT-y_dwRbTZ13Aw336z0"
          method="get"
          id="embedded-subscribe-form"
          name="embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="hs_embed_signup_scroll" className="main__email-section-form">
            <input
              type="email"
              name="email"
              className="input-text main__email-section-input"
              id="email"
              placeholder="email address"
              required
            />
            <div className="flex-button-container">
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="hs-embedded-subscribe"
                className="button main__email-section-button"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
