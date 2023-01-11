import React from 'react';
import Image from 'next/image';
import { Formik } from 'formik';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import Dropdown from '../../components/Dropdown';
import HelpIconImage from '../../common/icons/help.svg';
import { formatSentenceCase } from '../../common/helpers';
import Checkbox from '../../components/Checkbox';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

/**
 *
 */
export default function DownloadOptionsForm({
  dataSet,
  onSubmit,
  onChange,
  actionText = 'Download',
}) {
  const { dataSetId, aggregate_by, scale_by, quantile_normalize } = dataSet;
  const [advancedOptions, setAdvancedOptions] = React.useState(
    !quantile_normalize
  );

  return (
    <Formik
      initialValues={{ aggregate_by, scale_by, quantile_normalize }}
      onSubmit={onSubmit}
      validate={values => {
        // hack to track changes to the entire form
        // https://github.com/jaredpalmer/formik/issues/271#issuecomment-407869424
        onChange(values);
        return {};
      }}
    >
      {({ handleSubmit, handleChange, isSubmitting, values }) => (
        <form onSubmit={handleSubmit}>
          <div className="downloads__actions">
            <div className="downloads__fieldset">
              <label htmlFor="aggregation" className="downloads__label">
                <div className="downloads__label-text">
                  Aggregate{' '}
                  <HelpIcon
                    alt="What does aggregate mean?"
                    url="//docs.refine.bio/en/latest/main_text.html#aggregations"
                  />
                </div>{' '}
                <Dropdown
                  name="aggregate_by"
                  options={['EXPERIMENT', 'SPECIES']}
                  label={formatSentenceCase}
                  selectedOption={values.aggregate_by}
                  onChange={value =>
                    handleChange({ target: { name: 'aggregate_by', value } })
                  }
                />
              </label>
              <label htmlFor="transformation" className="downloads__label">
                <div className="downloads__label-text">
                  Transformation{' '}
                  <HelpIcon
                    alt="What does transformation mean?"
                    url="//docs.refine.bio/en/latest/main_text.html#transformations"
                  />
                </div>{' '}
                <Dropdown
                  name="scale_by"
                  options={['NONE', 'MINMAX', 'STANDARD']}
                  selectedOption={values.scale_by}
                  label={getTransformationOptionFromName}
                  onChange={value =>
                    handleChange({ target: { name: 'scale_by', value } })
                  }
                />
              </label>
              <button
                type="button"
                className="link flex-row"
                onClick={() => setAdvancedOptions(!advancedOptions)}
              >
                Advanced Options{' '}
                {advancedOptions ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
            <div className="flex-button-container flex-button-container--left">
              <Button type="submit" text={actionText} disabled={isSubmitting} />
            </div>
          </div>

          {advancedOptions && (
            <div className="downloads__advanced-options">
              <p>
                <b>Advanced Options</b>
              </p>

              {!quantile_normalize && (
                <Alert
                  dismissableKey={`skip_quantile_normalization_${dataSetId}`}
                >
                  Skipping quantile normalization will make your dataset less
                  comparable to other refine.bio data
                </Alert>
              )}

              <Checkbox
                onClick={() =>
                  handleChange({
                    target: {
                      name: 'quantile_normalize',
                      value: !values.quantile_normalize,
                    },
                  })
                }
                checked={
                  !values.quantile_normalize &&
                  values.aggregate_by !== 'SPECIES'
                }
                disabled={values.aggregate_by === 'SPECIES'}
              >
                <span>Skip quantile normalization for RNA-seq samples</span>
                <HelpIcon
                  alt="What does it mean to skip quantile normalization for RNA-seq samples?"
                  url="//docs.refine.bio/en/latest/faq.html#what-does-it-mean-to-skip-quantile-normalization-for-rna-seq-samples"
                />
              </Checkbox>
            </div>
          )}
        </form>
      )}
    </Formik>
  );
}

function HelpIcon({ url = '//docs.refine.bio/', alt = 'What is this?' }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={alt}
      className="downloads__help-icon"
    >
      <Image src={HelpIconImage} alt={alt} />
    </a>
  );
}

/**
 * @description Returns the frontend dropdown option from the backend tranformation name
 */
export const getTransformationOptionFromName = transformationName => {
  switch (transformationName.toLowerCase()) {
    case 'standard':
      return 'Z-score';
    case 'minmax':
      return 'Zero to One';
    case 'none':
      return 'None';
    default:
      return transformationName;
  }
};
