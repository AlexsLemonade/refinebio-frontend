import React from 'react';
import { useRouter } from 'next/router';
import SampleDebug from './SampleDebug';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { useLoader } from '../../components/Loader';
import { getDetailedSample } from '../../api/samples';
import SampleInfo from './SampleInfo';
import Spinner from '../../components/Spinner';

export default function Sample() {
  const {
    query: { accessionCode },
  } = useRouter();

  const { data, isLoading } = useLoader(
    () => getDetailedSample(accessionCode),
    [accessionCode]
  );

  return (
    <div className="sample-page">
      {isLoading ? <Spinner /> : <SampleInfo sample={data} />}

      <Accordion>
        <AccordionItem title="Debug Information">
          <SampleDebug accessionCode={accessionCode} />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
