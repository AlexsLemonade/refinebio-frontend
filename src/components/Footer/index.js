import React from 'react';
import FundIcon from '../../common/icons/fund-icon.svg';
import './Footer.scss';

const Footer = () => (
  <footer className="footer">
    <div className="footer__container footer__container--main footer__flex">
      <div className="footer__left">
        <p>
          refine.bio is a repository of harmonized, ready-to-use transcriptome
          data from publicly available sources. refine.bio is a project of the{' '}
          <a
            className="link"
            href="https://www.ccdatalab.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Childhood Cancer Data Lab (CCDL)
          </a>
        </p>
      </div>
      <div className="footer__right">
        <div className="footer__flex footer__flex--v-centered">
          <a
            href="https://secure.squarespace.com/checkout/donate?donatePageId=5b046884575d1f9eea37935b"
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={FundIcon} className="footer__icon" alt="fund-icon" /> Fund
            the CCDL
          </a>
          <a
            href="https://twitter.com/CancerDataLab"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="ion-social-twitter footer__social" />
          </a>
          <a
            href="https://github.com/AlexsLemonade/refinebio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="ion-social-github footer__social" />
          </a>
        </div>
        <p className="footer__author">
          Developed by the{' '}
          <a
            className="link"
            href="https://www.ccdatalab.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Childhood Cancer Data Lab
          </a>
        </p>
        <p>
          Powered by{' '}
          <a
            className="link"
            href="https://www.alexslemonade.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alex's Lemonade Stand Foundation
          </a>
        </p>
      </div>
    </div>
    <div className="footer__container footer__flex footer__flex--v-centered">
      <div className="footer__left">
        <ul className="footer__links">
          <li className="footer__link">BDS 3-Clause License</li>
          <li className="footer__link">Privacy</li>
          <li className="footer__link">Terms of Use</li>
          <li className="footer__link">Contact</li>
        </ul>
      </div>
      <div className="footer__right">
        <p className="footer__version">Version 24354-23111</p>
      </div>
    </div>
  </footer>
);

export default Footer;
