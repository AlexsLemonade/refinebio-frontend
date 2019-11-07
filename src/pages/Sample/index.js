import React from 'react';
import './sample.scss';
import SampleDebug from './SampleDebug';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { useLoader } from '../../components/Loader';
import { getDetailedSample } from '../../api/samples';
import SampleInfo from './SampleInfo';

export default function Sample({ match }) {
  const accessionCode = match.params.id;

  const { data, isLoading } = useLoader(
    () => getDetailedSample(accessionCode),
    [accessionCode]
  );

  return (
    <div>
      {!isLoading && <SampleInfo sample={data} />}

      <Accordion>
        <AccordionItem title="Debug Information">
          <SampleDebug accessionCode={accessionCode} />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
