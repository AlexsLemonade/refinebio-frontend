import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { connect } from 'react-redux';
import Link from 'next/link';
import { push } from '../../state/routerActions';
import SearchInput from '../../components/SearchInput';
import { getExampleLink } from '../../common/helpers';
import SearchIcon from '../../common/icons/search.svg';
import DatasetIcon from '../../common/icons/dataset.svg';
import EmailSection from './EmailSection';
import { searchUrl } from '../../routes';
import circusPlot from '../about/circus-plot.svg';

import pathwayIcon from './icon-pathway.svg';
import exploreIcon from './icon-explore.svg';
import heatmapIcon from './icon-heatmap.svg';
import networkBottomIcon from './network-combined.svg';
import networkDocsIcon from './icon-docs.svg';

import { themes, useTheme } from '../../common/ThemeContext';

let Main = ({ push }) => {
  useTheme(themes.inverted);
  return (
    <div className="main">
      <Head>
        <title>Search for harmonized transcriptome data - refine.bio</title>
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": "https://www.refine.bio/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.refine.bio/search/?q={searchbox_target}",
              "query-input": "required name=searchbox_target"
            }
          }
        `}
        </script>
      </Head>
      <section className="main__section main__section--searchbox">
        <Image
          src={circusPlot}
          className="about__header-bg"
          alt="Circus Plot"
        />
      </section>

      <div>
        <div className="main__container main__container--searchbox">
          <h1 className="main__heading-1">
            Search for normalized transcriptome data
          </h1>
          <SearchInput
            onSubmit={query =>
              push({
                pathname: '/search',
                query: query ? { q: query } : null,
              })
            }
            buttonStyle="primary"
          />
          <div className="main__search-suggestions">
            <p className="main__search-suggestion-label">Try searching for:</p>

            {['Notch', 'Medulloblastoma', 'GSE24528'].map(q => (
              <Link
                legacyBehavior
                href={{ pathname: '/search', query: { q } }}
                as={searchUrl({ q })}
                key={q}
              >
                <a className="main__search-suggestion">{q}</a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="main__section">
        <div className="main__steps-container">
          <div className="main__col">
            <h3 className="main__heading-2">
              <Image
                src={SearchIcon}
                className="main__icon"
                alt="search-icon"
              />{' '}
              <div>
                Find the data you need
                <p className="main__paragraph">
                  Search the multi-organism collection of genome wide gene
                  expression data obtained from publicly available sources like
                  GEO, ArrayExpress, and SRA. The data has been processed
                  uniformly and normalized using a set of{' '}
                  <a
                    href="//docs.refine.bio/en/latest/main_text.html#processing-information"
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    standardized pipelines
                  </a>{' '}
                  curated by the{' '}
                  <a
                    className="link"
                    href="https://www.ccdatalab.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Childhood Cancer Data Lab (CCDL)
                  </a>
                  .
                </p>
              </div>
            </h3>
          </div>
          <div className="main__col">
            <h3 className="main__heading-2">
              <Image
                src={DatasetIcon}
                className="main__icon"
                alt="dataset-icon"
              />{' '}
              <div>
                Create custom datasets
                <p className="main__paragraph">
                  Build and download custom datasets tailored to your needs
                  including gene expression matrices and sample metadata.
                </p>
              </div>
            </h3>
          </div>
        </div>
      </section>

      <section className="main__section main__section--uses main__section--blue-gradient">
        <div className="main__container">
          <h1>
            You can use refine.bio datasets for preliminary assessment of
            biological signals and to accelerate validation of your research
            findings.
          </h1>

          <div className="main__uses-container">
            <div className="main__use-card">
              <Image
                src={exploreIcon}
                alt=""
                className="main__use-card__icon"
              />
              <div className="main__use-card__title">
                Getting Started using refine.bio data
              </div>
              <div className="main__use-card__body">
                Explore different ways you can use refine.bio data to help with
                your scientific questions.
              </div>
              <div className="main__use-card__actions main__use-card__actions__alone">
                <a
                  href={getExampleLink('index.html')}
                  className="button button--secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="main__use-card">
              <Image
                src={heatmapIcon}
                alt=""
                className="main__use-card__icon"
              />
              <div className="main__use-card__title">
                Differential Expression Analysis
              </div>
              <div className="main__use-card__body">
                Learn how you can do differential expression analysis with
                refine.bio datasets.
              </div>
              <div className="main__use-card__actions">
                <a
                  href={getExampleLink(
                    '03-rnaseq/differential-expression_rnaseq_01.html'
                  )}
                  className="button button--secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RNA-seq Example
                </a>
                <a
                  href={getExampleLink(
                    '02-microarray/differential-expression_microarray_01_2-groups.html'
                  )}
                  className="button button--secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microarray Example
                </a>
              </div>
            </div>
            <div className="main__use-card">
              <Image
                src={pathwayIcon}
                alt=""
                className="main__use-card__icon"
              />
              <div className="main__use-card__title">Pathway Analysis</div>
              <div className="main__use-card__body">
                Learn how you can use refine.bio data to identify pathways that
                are active in your biological condition of interest.
              </div>
              <div className="main__use-card__actions">
                <a
                  href={getExampleLink(
                    '03-rnaseq/pathway-analysis_rnaseq_02_gsea.html'
                  )}
                  className="button button--secondary mr-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RNA-seq Example
                </a>
                <a
                  href={getExampleLink(
                    '02-microarray/pathway-analysis_microarray_02_gsea.html'
                  )}
                  className="button button--secondary "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microarray Example
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="main__section main__section--explore">
        <div className="main__container">
          <div className="main__explore-card-container">
            <div
              className="main__explore-card"
              style={{
                backgroundImage: `url(${networkBottomIcon})`,
                backgroundSize: '80%',
              }}
            >
              <div className="main__explore-card__title">
                refine.bio Compendia
              </div>
              <div className="main__explore-card__body">
                refine.bio compendia are collections of samples that have been
                processed and packaged for broad and flexible use.
              </div>
              <div className="main__explore-card__actions">
                <Link legacyBehavior href="/compendia" as="/compendia">
                  <a className="button button--secondary ">Learn More</a>
                </Link>
              </div>
            </div>
            <div
              className="main__explore-card"
              style={{
                backgroundImage: `url(${networkDocsIcon})`,
                backgroundPositionX: 260,
              }}
            >
              <div className="main__explore-card__title">Explore the docs</div>
              <div className="main__explore-card__body">
                Learn about how we source and process data and other downstream
                analyses you can do with refine.bio data.
              </div>
              <div className="main__explore-card__actions">
                <a
                  href="//docs.refine.bio/en/latest/index.html"
                  className="button button--secondary "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Take me to the docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="main__section main__section--blue-gradient">
        <EmailSection />
      </section>
    </div>
  );
};
Main = connect(null, { push })(Main);

export default Main;
