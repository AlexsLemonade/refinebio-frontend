import React from 'react';
import { Link } from 'react-router-dom';
import FundIcon from '../../common/icons/fund-icon.svg';
import './Footer.scss';

import apiData from '../../apiData.json';
import { IoLogoTwitter, IoLogoGithub } from 'react-icons/io';

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
        <div className="footer__socials">
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
            className="footer__link-twitter"
          >
            <IoLogoTwitter className="footer__social" />
          </a>
          <a
            href="https://github.com/AlexsLemonade/refinebio"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link-github"
          >
            <IoLogoGithub className="footer__social" />
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

    <div className="footer__container footer__link-container">
      <Link className="footer__link" to="/license">
        BSD 3-Clause License
      </Link>
      <Link className="footer__link" to="/privacy">
        Privacy
      </Link>
      <Link className="footer__link" to="/terms">
        Terms of Use
      </Link>
      <a className="footer__link" href="mailto:ccdl@alexslemonade.org">
        Contact
      </a>
      {apiData.version && apiData.apiVersion && (
        <div className="footer__version">
          Version {apiData.apiVersion.substr(1)} - {apiData.version.substr(1)}
        </div>
      )}
    </div>
  </footer>
);

export default Footer;
