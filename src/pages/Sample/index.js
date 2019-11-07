import React from 'react';
import './sample.scss';
import SampleDebug from './SampleDebug';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { useLoader } from '../../components/Loader';
import { getDetailedSample } from '../../api/samples';
import AccessionIcon from '../../common/icons/accession.svg';
import DataSetSampleActions from '../../components/DataSetSampleActions';
import OrganismIcon from '../../common/icons/organism.svg';
import { formatSentenceCase } from '../../common/helpers';
import Technology from '../Experiment/Technology';

export default function Sample({ match }) {
  const accessionCode = match.params.id;

  const { data, isLoading } = useLoader(
    () => getDetailedSample(accessionCode),
    [accessionCode]
  );

  return (
    <div>
      {!isLoading && (
        <div className="experiment">
          <div className="experiment__header">
            <div className="experiment__accession">
              <img
                src={AccessionIcon}
                className="experiment__stats-icon"
                alt="Accession Icon"
              />
              {data.accession_code} | Sample
            </div>

            <div>
              {!data.is_downloadable && (
                <DataSetSampleActions
                  dataSetSlice={{
                    [data.accession_code]: [data.accession_code],
                  }}
                />
              )}
            </div>
          </div>

          <div className="experiment__stats">
            <div className="experiment__stats-item">
              <img
                src={OrganismIcon}
                className="experiment__stats-icon"
                alt="Organism Icon"
              />{' '}
              {formatSentenceCase(data.organism.name)}
            </div>
            <div className="experiment__stats-item">
              <Technology samples={[data]} />
            </div>
          </div>
        </div>
      )}

      <Accordion>
        <AccordionItem title="Debug Information">
          <SampleDebug accessionCode={accessionCode} />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
