import React from 'react';
import Link from 'next/link';
import { IoLogoTwitter, IoLogoGithub } from 'react-icons/io';
import FundIcon from '../../common/icons/fund-icon.svg';

import apiData from '../../apiData.json';

const Footer = () => (
  <footer className="footer">
    <div className="footer__container footer__container--main footer__flex">
      <div className="footer__left">
        <p>
          refine.bio is a repository of uniformly processed and normalized,
          ready-to-use transcriptome data from publicly available sources.
          refine.bio is a project of the{' '}
          <a
            className="link"
            href="https://www.ccdatalab.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Childhood Cancer Data Lab (CCDL)
          </a>
        </p>
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
          <div>
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
      <div className="footer__right">
        <div>
          <b>Cite refine.bio</b>
        </div>
        <p>
          Casey S. Greene, Dongbo Hu, Richard W. W. Jones, Stephanie Liu, David
          S. Mejia, Rob Patro, Stephen R. Piccolo, Ariel Rodriguez Romero, Hirak
          Sarkar, Candace L. Savonen, Jaclyn N. Taroni, William E. Vauclain,
          Deepashree Venkatesh Prasad, Kurt G. Wheeler.{' '}
          <strong>
            refine.bio: a resource of uniformly processed publicly available
            gene expression datasets.
          </strong>
          <br />
          URL:{' '}
          <a href="https://www.refine.bio" rel="nofollow">
            https://www.refine.bio
          </a>
          <br />
          <br />
          <em>
            Note that the contributor list is in alphabetical order as we
            prepare a manuscript for submission
          </em>
          .
        </p>
      </div>
    </div>

    <div className="footer__container footer__link-container">
      <Link href="/license" as="/license">
        <a className="footer__link">BSD 3-Clause License</a>
      </Link>
      <Link href="/privacy" as="/privacy">
        <a className="footer__link">Privacy</a>
      </Link>
      <Link href="/terms" as="/terms">
        <a className="footer__link">Terms of Use</a>
      </Link>
      <a className="footer__link" href="mailto:requests@ccdatalab.org">
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
