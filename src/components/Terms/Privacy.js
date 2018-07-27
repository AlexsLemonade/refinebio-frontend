import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import './Terms.scss';

const Privacy = () => (
  <div className="terms">
    <Helmet>
      <title>refine.bio - Privacy</title>
    </Helmet>
    <h1 className="terms__title">Privacy Policy</h1>
    <p>
      This database and websites, located at{' '}
      <a
        href="https://www.ccdatalab.org"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        https://www.ccdatalab.org
      </a>,{' '}
      <a
        href="https://cognoma.org"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        https://cognoma.org
      </a>, and{' '}
      <a
        href="http://www.refine.bio"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        http://www.refine.bio
      </a>{' '}
      or any subdomains thereof (the <strong>"CCDL"</strong>), is supported by
      Alex’s Lemonade Stand Foundation (<strong>"we,"</strong>{' '}
      <strong>"our,"</strong> or <strong>"us"</strong>).
    </p>
    <p>
      Your access to, and use of, the CCDL is subject to our Terms of Use,
      located at{' '}
      <Link className="link" to="/terms">
        http://refine.bio/terms
      </Link>{' '}
      (the <strong>"Terms of Use"</strong>). We have created this Privacy Policy
      (this <strong>"Privacy Policy"</strong>) to explain what information we
      gather when you visit or interact with the CCDL, how we and others may use
      your information, and the security approaches we use to protect your
      information. This Privacy Policy is incorporated into and made part of the
      Terms of Use. Capitalized terms used but not defined in this Privacy
      Policy have the meanings given to them in the Terms of Use.
    </p>
    <p>
      By using the CCDL, you consent to the collection and use of your
      information in accordance with this Privacy Policy. If we decide to change
      this Privacy Policy, we will post the updated version on this page.
      Changes to this Privacy Policy will apply only to information collected
      after the date of the change.
    </p>
    <ol className="terms__list--bold">
      <li>
        What information is gathered?
        <p>
          We may collect and retain information from or about you when you
          register on the CCDL, seek authentication, send or respond to
          communications, or participate in another CCDL feature. Here are the
          types of personal information we gather:
        </p>
        <ul className="terms__list">
          <li>
            <strong>Information You Give Us:</strong> When registering or
            seeking authentication, or otherwise communicating with us, we may
            ask you for your name, email address, mailing address, phone number,
            credentials or other similar information.
          </li>
          <li>
            <strong>Automatic Information:</strong> We receive and store certain
            types of information whenever you interact with us, including IP
            addresses and session identifiers. We may use "cookies" or other
            tracking tools to enhance your experience and gather information
            about Users and visits to the CCDL. Please refer to the "May we use
            'cookies' or other tracking tools?" section below for information
            about cookies and how we may use them.
          </li>
          <li>
            <strong>Information from Other Sources:</strong> For purposes such
            as authentication, monitoring, completeness or accuracy, we may
            receive information about you from other sources, including third
            parties you have authorized to share information with us, and we may
            add or relate such information to your account.
          </li>
        </ul>
      </li>
      <li>
        How do we respond to "Do Not Track" signals?
        <p>
          Because there is not yet a common understanding of how to interpret
          web browser-based "Do Not Track" (<strong>"DNT"</strong>) signals
          other than cookies, we do not currently respond to, or provide Users
          with a different CCDL experience based on, undefined "DNT" signals to
          the CCDL.
        </p>
      </li>
      <li>
        How do we use your personal information?
        <p>
          We may use your personal information in any of the following ways:
        </p>
        <ul className="terms__list">
          <li>To authenticate or update your information.</li>
          <li>To administer your account or profile.</li>
          <li>
            To respond to your support requests or otherwise communicate with
            you.
          </li>
          <li>
            To provide or facilitate any services or transactions associated
            with your account.
          </li>
          <li>
            To personalize and optimize your CCDL experience and to learn about
            your preferences.
          </li>
          <li>
            To monitor your compliance with the Terms of Use and all applicable
            Policies.
          </li>
          <li>To prevent or remedy any unauthorized or disruptive activity.</li>
          <li>To administer a survey or other CCDL feature.</li>
          <li>
            To operate, maintain, analyze, improve, control, or customize the
            CCDL.
          </li>
        </ul>
      </li>
      <li>
        Do we disclose the information we collect?
        <p>
          We generally do not sell, trade, or otherwise transfer personal
          information to outside parties unless we provide you with advance
          notice. However, we may disclose personal information as described
          below:
        </p>
        <ul className="terms__list">
          <li>
            <strong>Agents and Contractors:</strong> We may contract with other
            companies and individuals to operate the CCDL and to perform
            functions on our behalf. Examples include maintaining and hosting
            the CCDL, analyzing data, and providing support. Our agents and
            contractors have access to personal information needed to perform
            their functions, but they must reasonably safeguard such information
            and they may not use it or disclose it for other purposes.
          </li>
          <li>
            <strong>Authentication:</strong> We may disclose your personal
            information to third parties as reasonably necessary to authenticate
            you and your information, as applicable.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event that we sell or
            otherwise transfer our assets, or reorganize, merge or transfer our
            entity, we may provide your information to the purchaser to enable
            continued use of the CCDL. We will take reasonable steps to seek
            similar treatment of your information, but the purchaser might
            operate under a different privacy policy.
          </li>
          <li>
            <strong>Protection of Us and Others:</strong> We release personal
            information when we believe it is appropriate to comply with law;
            enforce or apply the Terms of Use or our other applicable Policies
            or agreements; or protect the rights, privacy, property, or safety
            of us, Users or others. We may share information regarding
            unauthorized or suspicious activity with affected Users, an
            independent Institutional Review Board or other ethics board, or
            institutional authorities, as applicable.
          </li>
        </ul>
        <p>
          Subject to applicable law, we may share aggregated and statistical
          information with third parties.
        </p>
      </li>
      <li>
        How is personal information corrected or updated?
        <p>
          You can correct or update your personal information by re-registering,
          updating your profile, or by contacting us at{' '}
          <a
            href="mailto:ccdl@alexslemonade.org"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            ccdl@alexslemonade.org
          </a>. You can also request that we delete your personal information or
          remove you from our communications.
        </p>
      </li>
      <li>
        May we use "cookies" or other tracking tools?
        <p>
          Yes. We may use web tracking tools such as cookies and web beacons. A
          cookie is a small data file that certain websites write to your hard
          drive when you visit those pages, but the only personal information a
          cookie can contain is information you supply yourself. We may use
          cookies to track User traffic patterns when you click on various links
          throughout the CCDL to help us understand your preferences and to
          offer better experiences and tools on the CCDL.
        </p>
        <p>
          We may contract with third party service providers to assist us in
          better understanding our Users, including tracking User clicks and
          recording anonymized User sessions. These service providers are not
          permitted to use the information collected on our behalf, except to
          help us conduct and improve the CCDL.
        </p>
        <p>
          You can choose to have your computer warn you each time a cookie is
          being sent, or you can choose to turn off all cookies, through your
          browser settings. Each browser is a little different, so look at your
          browser Help menu to learn the correct way to modify your cookies. If
          you turn cookies off, you might not be able to access or use certain
          CCDL services, features or functionality.
        </p>
      </li>
      <li>
        How secure is personal information?
        <p>
          We follow generally accepted industry security standards to safeguard
          and help prevent unauthorized access, maintain data security, and
          properly use your personal information. However, no commercial method
          of information transfer over the Internet or electronic data storage
          is known to be 100% secure. As a result, we cannot guarantee the
          absolute security of that information during its transmission or its
          storage in our systems.
        </p>
        <p>
          It is important for you to protect against unauthorized access to your
          password, API keys and other identifying tokens, and to your computer.
          Be sure to sign off when you are finished using the CCDL.
        </p>
      </li>
      <li>
        Third Party Links
        <p>
          In an attempt to provide you with increased value, we may include
          third party links on the CCDL. These linked sites have separate and
          independent privacy policies, which we encourage you to review. We
          therefore have no responsibility or liability for the content and
          activities of these linked sites. Nonetheless, we seek to protect the
          integrity of the CCDL and welcome any feedback about these linked
          sites (including if a specific link does not work).
        </p>
      </li>
      <li>
        Questions and Feedback
        <p>
          Any questions or feedback about the CCDL or this Privacy Policy should
          be directed to{' '}
          <a
            href="mailto:ccdl@alexslemonade.org"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            ccdl@alexslemonade.org
          </a>.
        </p>
      </li>
      <li>
        Important Notices to Non-United States Residents
        <p>
          It is important to note that the CCDL is operated in the United
          States. If you are located outside of the United States, please be
          aware that any personal information you provide to us will be
          transferred to the United States. By using the CCDL and/or providing
          us with your personal information, you consent to this transfer.
        </p>
      </li>
      <li>
        Children's Privacy
        <p>
          We do not knowingly intend to collect personal information from
          children under 13 years of age. If a child has provided us with
          personal information, a parent or guardian of that child may send an
          email message to{' '}
          <a
            href="mailto:ccdl@alexslemonade.org"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            ccdl@alexslemonade.org
          </a>{' '}
          with "Request for Child Information Removal" in the subject line and
          the name and age of the child in the body of the message. After
          confirmation, we will make reasonable efforts to delete the child’s
          information from the database that stores information for the CCDL.
        </p>
      </li>
    </ol>
    <p>Last Updated: March 2, 2018</p>
  </div>
);

export default Privacy;
