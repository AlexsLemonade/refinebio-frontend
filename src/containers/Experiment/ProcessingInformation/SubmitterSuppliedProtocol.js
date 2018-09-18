import React from 'react';
import isEqual from 'lodash/isEqual';

export default function SubmitterSuppliedProtocol({ sample, results }) {
  let processorNames = results.map(result => result.processor.name);

  return (
    <section className="processing-info-modal__section">
      <div className="processing-info-modal__protocol-description">
        <h3>Submitter Supplied Protocol</h3>
        {/* Rna seq specific note https://github.com/AlexsLemonade/refinebio-frontend/issues/265 */}
        {isEqual(processorNames, ['Salmon Quant', 'Tximport']) && (
          <p>
            We have created custom gene mapping files for Affymetrix platforms
            (see:
            <a
              href="https://github.com/AlexsLemonade/identifier-refinery"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              https://github.com/AlexsLemonade/identifier-refinery
            </a>) that support conversion from probe IDs, gene symbols, Entrez
            IDs, RefSeq and Unigene identifiers to Ensembl gene IDs. We support
            conversion from Illumina BeadArray probe IDs to Ensembl gene IDs
            using Bioconductor Illumina BeadArray expression packages.
          </p>
        )}
        <p>
          These tissues samples were obtained at surgery and stored at -80C
          until use., These tissues samples were obtained at surgery without any
          other pretreatment., Acid guanidinium thiocyanate-phenol-chloroform
          extraction of total RNA was performed according to the previous report
          (Anal. Biochem, 162: 156,1987)., Biotinylated cRNA were prepared
          according to the standard Affymetrix protocol from 2 ug total RNA
          (Expression Analysis Technical Manual, 2001, Affymetrix)., Title:
          Affymetrix CEL analysis. Description:, The data were analyzed with
          Microarray Suite version 5.0 (MAS 5.0) using Affymetrix default
          analysis settings and global scaling as normalization method.
        </p>
      </div>
    </section>
  );
}
