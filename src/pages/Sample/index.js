import React from 'react';
import './sample.scss';
import SampleDebug from './SampleDebug';
import { Accordion, AccordionItem } from '../../components/Accordion';

export default function Sample({ match }) {
  const accessionCode = match.params.id;

  // const { data, isLoading } = useLoader(() => getSample(accessionCode), [
  //   accessionCode,
  // ]);

  return (
    <div>
      <h1>Sample {accessionCode}</h1>

      <Accordion>
        <AccordionItem title="Debug Information">
          <SampleDebug accessionCode={accessionCode} />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
