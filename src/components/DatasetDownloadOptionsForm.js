import React from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import * as yup from 'yup';

import Alert from './Alert';
import Button from './Button';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import Error from './Error';
import HelpIcon from './HelpIconLink';

import { useLocalStorage } from '../common/hooks';
import { formatSentenceCase, subscribeToMailingList } from '../common/helpers';
import { ServerError } from '../common/errors';
import { createToken } from '../state/token';
import { createDataSet, updateDataSetOptions } from '../api/dataSet';

// This is the mechanism for propagating properties to child components
// TODO: Any option should be overridable at the child component level
const DatasetDownloadOptionsContext = React.createContext();

// If you do not add children this is what will be populated
// Notice no EMAIL
const DefaultOptions = () => {
  const { classPrefix } = React.useContext(DatasetDownloadOptionsContext);
  return (
    <>
      <div className={`${classPrefix}__actions`}>
        <div className={`${classPrefix}__fieldset`}>
          <AggreationOptions />
          <TransformationOptions />
          <AdvancedOptionsToggle />
        </div>
        <SubmitDatasetOptionsForm />
      </div>
      <AdvancedOptions />
    </>
  );
};

// Options for dataset aggregation
export const AggreationOptions = () => {
  const { handleChange, values, classPrefix } = React.useContext(
    DatasetDownloadOptionsContext
  );
  return (
    <label htmlFor="aggregation" className={`${classPrefix}__label`}>
      <div className={`${classPrefix}__label-text`}>
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
  );
};

// Options for dataset transformation

export const TransformationOptions = () => {
  const { handleChange, values, classPrefix } = React.useContext(
    DatasetDownloadOptionsContext
  );
  return (
    <label htmlFor="transformation" className={`${classPrefix}__label`}>
      <div className={`${classPrefix}__label-text`}>
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
  );
};

// button with chevron to collapse advanced dataset options
export const AdvancedOptionsToggle = () => {
  const { showAdvancedOptions, setAdvancedOptions } = React.useContext(
    DatasetDownloadOptionsContext
  );
  return (
    <button
      type="button"
      className="link flex-row"
      onClick={() => setAdvancedOptions(!showAdvancedOptions)}
    >
      Advanced Options{' '}
      {showAdvancedOptions ? <IoIosArrowUp /> : <IoIosArrowDown />}
    </button>
  );
};

// advanced options for now only applicable to rna-seq data
export const AdvancedOptions = ({ hideTitle = false }) => {
  const {
    showAdvancedOptions,
    values,
    dataSetId,
    handleChange,
    classPrefix,
  } = React.useContext(DatasetDownloadOptionsContext);
  return (
    showAdvancedOptions && (
      <div className={`${classPrefix}__advanced-options flex-row--top`}>
        {!hideTitle && (
          <p>
            <b>Advanced Options {values.quantile_normalize}</b>
          </p>
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
            !values.quantile_normalize && values.aggregate_by !== 'SPECIES'
          }
          disabled={values.aggregate_by === 'SPECIES'}
        >
          <span>Skip quantile normalization for RNA-seq samples</span>
          <HelpIcon
            alt="What does it mean to skip quantile normalization for RNA-seq samples?"
            url="//docs.refine.bio/en/latest/faq.html#what-does-it-mean-to-skip-quantile-normalization-for-rna-seq-samples"
          />
        </Checkbox>
        {!values.quantile_normalize && (
          <Alert dismissableKey={`skip_quantile_normalization_${dataSetId}`}>
            Skipping quantile normalization will make your dataset less
            comparable to other refine.bio data
          </Alert>
        )}
      </div>
    )
  );
};

export const EmailAddressOptions = ({ children }) => {
  const {
    touched,
    errors,
    values,
    handleChange,
    emailAddress,
    classPrefix,
    hasToken,
    submitCount,
  } = React.useContext(DatasetDownloadOptionsContext);
  return (
    <>
      {touched.email_address && errors.email_address && (
        <Error>{errors.email_address}</Error>
      )}
      <div className={`${classPrefix}__email-input`}>
        <Field
          name="email_address"
          type="email_address"
          placeholder="jdoe@example.com"
          className={classnames(
            `input-text ${classPrefix}__email-input mobile-p`,
            {
              'input--error': touched.email_address && errors.email_address,
            }
          )}
        />

        {children}
      </div>
      {!hasToken && (
        <div className={`${classPrefix}__checkbox`}>
          {submitCount > 0 && errors.acceptTerms && (
            <Error>{errors.acceptTerms}</Error>
          )}
          <Checkbox
            name="acceptTerms"
            checked={values.acceptTerms}
            onChange={handleChange}
          >
            I agree to the{' '}
            <Link href="/terms" as="/terms">
              <a className="link" target="_blank" rel="noopener noreferrer">
                Terms of Use
              </a>
            </Link>
          </Checkbox>
        </div>
      )}
      {(emailAddress === '' || values.email_address !== emailAddress) && (
        <div className={`${classPrefix}__checkbox`}>
          <Checkbox
            name="ccdl_email_ok"
            checked={values.ccdl_email_ok}
            onChange={handleChange}
          >
            I would like to receive occasional updates from the refine.bio team
          </Checkbox>
        </div>
      )}
    </>
  );
};

export const SubmitDatasetOptionsForm = () => {
  const { actionText, isSubmitting, classPrefix } = React.useContext(
    DatasetDownloadOptionsContext
  );
  return (
    <div
      className={classnames(
        `${classPrefix}__submit`,
        'flex-button-container',
        'flex-button-container--left'
      )}
    >
      <Button type="submit" text={actionText} disabled={isSubmitting} />
    </div>
  );
};

const defaultValidation = (token, startDownload) => {
  return yup.object().shape({
    id: yup.string(),
    aggregate_by: yup
      .string()
      .oneOf(['SPECIES', 'EXPERIMENT'])
      .required(),
    data: yup.object().required(), // always required
    email_address: yup
      .string()
      .email('Please enter a valid email address')
      .required(() =>
        startDownload ? 'Please enter your email address' : false
      ),
    acceptTerms: yup
      .bool()
      .test(
        'acceptTerms',
        'Please accept our terms of use to process and download data',
        value => value === true || Boolean(token)
      ),
    ccdl_email_ok: yup.boolean(),
  });
};

/**
 *
 */
const DatasetDownloadOptionsFormComponent = ({
  dataset,
  setDataset = false,
  classPrefix = 'dataset-download',
  actionText = 'Download',
  children = false,
  advancedOptions = false,
  startDownload = false,
  validator,
  token,
  createToken: connectedCreateToken,
}) => {
  const [showAdvancedOptions, setAdvancedOptions] = React.useState(
    !dataset.quantile_normalize || advancedOptions
  );

  const [emailAddress, setEmailAddress] = useLocalStorage('email-address', '');
  const validation = validator || defaultValidation(token, startDownload);

  const handleSubmit = async (values, { setSubmitting, isSubmitting }) => {
    if (isSubmitting) return false;

    try {
      const datasetId =
        dataset.id || (await createDataSet(values.email_address)).id;

      // update dataset with option
      const updatedDataset = await updateDataSetOptions({
        id: datasetId,
        ...values,
      });

      // subscribe to email if post on submit
      if (values.ccdl_email_ok) subscribeToMailingList(values.email_address);

      if (startDownload) {
        // get token
        const tokenId = token || (await connectedCreateToken());

        // start dataset
        const startedDataset = await updateDataSetOptions(
          {
            ...updatedDataset,
            start: true,
          },
          tokenId
        );

        setDataset(startedDataset);
      }
    } catch (e) {
      // expect server errors here
      const tokenDetail = 'You must provide an active API token ID';

      if (e instanceof ServerError && e.data.detail === tokenDetail) {
        // remove the token from local storage
        // set acceptTerms false
      } else {
        throw e;
      }
    }

    if (values.email_address) setEmailAddress(values.email_address);
    return setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        ...dataset,
        email_address: emailAddress,
        acceptTerms: false,
        ccdl_email_ok: false,
      }}
      onSubmit={handleSubmit}
      validationSchema={validation}
    >
      {formikContext => (
        <DatasetDownloadOptionsContext.Provider
          value={{
            dataset,
            actionText,
            showAdvancedOptions,
            setAdvancedOptions,
            classPrefix,
            emailAddress,
            hasToken: Boolean(token),
            ...formikContext,
          }}
        >
          <Form className={`${classPrefix}__form`}>
            {children || <DefaultOptions />}
          </Form>
        </DatasetDownloadOptionsContext.Provider>
      )}
    </Formik>
  );
};

export const DatasetDownloadOptionsForm = connect(
  state => ({
    token: state.token,
  }),
  { createToken }
)(DatasetDownloadOptionsFormComponent);

export default DatasetDownloadOptionsForm;

/**
 * @description Returns the frontend dropdown
 * option from the backend tranformation name
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
