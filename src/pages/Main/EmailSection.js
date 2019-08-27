import React from 'react';
import { Ajax } from '../../common/helpers';

export default function EmailSection() {
  const [email, setEmail] = React.useState(null);
  const [subscribed, setSubscribed] = React.useState(null);

  const portalId = '5187852';
  const formGuid = '2a5f706e-eca8-45c0-a9f4-b1584c8c160a';
  const formUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const getFormData = () => ({
    fields: [
      {
        name: 'email',
        value: email,
      },
    ],
    // "context": {
    // "hutk": ":hutk",
    // "pageUri": window.location.host + window.location.pathname,
    // "pageName": document.title,
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const result = await Ajax.post(formUrl, getFormData());
      setSubscribed(result.inlineMessage);
    } catch (err) {
      // Show error message setError(true); "Please submit a valid e-mail address."
      // console.log(err);
    }
  };

  return (
    <div className="main__container">
      <div className="main__heading-1">
        {!subscribed && 'Sign Up for Updates'}
        {subscribed && 'Thanks!'}
      </div>
      <div className="main__blurp-text">
        {!subscribed &&
          'Be the first to know about new features, compendia releases, and more!'}
        {subscribed}
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
          onSubmit={handleSubmit}
          noValidate
        >
          <div id="hs_embed_signup_scroll" className="main__email-section-form">
            <input
              type="email"
              name="email"
              className="input-text main__email-section-input"
              id="email"
              placeholder="email address"
              onChange={e => setEmail(e.target.value)}
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
