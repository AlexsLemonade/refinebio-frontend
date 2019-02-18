import React from 'react';

export default function EmailSection() {
  return (
    <div className="main__container">
      <div className="main__heading-1">Sign Up for Updates</div>
      <div className="main__blurp-text">
        Be the first to know about new features, compendia releases, and more!
      </div>
      {/* Mailchimp Form Embed */}
      <div id="mc_embed_signup">
        <form
          action="https://ccdatalab.us14.list-manage.com/subscribe/post?u=1ed0ac5b8f11380ee862cf278&amp;id=074bca87ce"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="mc_embed_signup_scroll" className="main__mailchimp-form">
            <input
              type="email"
              name="EMAIL"
              className="input-text main__mailchimp-input"
              id="mce-EMAIL"
              placeholder="email address"
              required
            />
            <div
              style={{ position: 'absolute', left: '-5000px' }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_1ed0ac5b8f11380ee862cf278_074bca87ce"
                tabIndex="-1"
                value=""
              />
            </div>
            <div className="flex-button-container">
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button main__mailchimp-button"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
