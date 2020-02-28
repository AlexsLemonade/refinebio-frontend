import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="https://www.refine.bio/manifest.json" />
          <link rel="shortcut icon" href="https://www.refine.bio/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://www.refine.bio/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="https://www.refine.bio/favicon-16x16.png"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Rubik:400,500,700|Lato:400,500,700|Oxygen+Mono&display=swap"
            rel="stylesheet"
          />
          <link
            type="application/opensearchdescription+xml"
            rel="search"
            href="https://www.refine.bio/search-all.xml"
          />
          <meta
            name="google-site-verification"
            content="jj-No2DhQg4OvDdvk5Jct6Iy4q4iXsk2hyLzy65eO2g"
          />
          <meta
            name="description"
            content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
          />
          <meta property="og:url" content="https://www.refine.bio" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="refine.bio" />
          <meta property="og:image" content="https://www.refine.bio/fb.png" />
          <meta
            property="og:description"
            content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
          />
          <meta property="og:site_name" content="Refine.bio" />
          <meta property="og:locale" content="en_US" />
          <meta name="twitter:title" content="refine.bio" />
          <meta
            name="twitter:description"
            content="Build ready-to-use datasets with normalized transcriptome data from publicly available sources."
          />
          <meta name="twitter:image" content="https://www.refine.bio/fb.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@CancerDataLab" />
        </Head>
        <body>
          <Main />
          <NextScript />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (window.location.host === 'www.refine.bio') {
                (function (h, o, t, j, a, r) {
                  h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
                  h._hjSettings = { hjid: 916802, hjsv: 6 };
                  a = o.getElementsByTagName('head')[0];
                  r = o.createElement('script'); r.async = 1;
                  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
              }
            `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
