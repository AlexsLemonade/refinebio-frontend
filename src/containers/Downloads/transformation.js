/**
 * @description Returns the frontend dropdown option from the backend tranformation name
 */
export const getTransformationOptionFromName = transformationName => {
  switch (transformationName.toLowerCase()) {
    case 'standard':
      return 'Z-score';
    case 'minmax':
      return 'Zero to One';
    default:
      return transformationName;
  }
};

/**
 * @description Returns the backend name from the frontend transformation dropdown option
 */
export const getTransformationNameFromOption = transformationOption => {
  switch (transformationOption) {
    case 'Z-score':
      return 'Standard';
    case 'Zero to One':
      return 'Minmax';
    default:
      return transformationOption;
  }
};
