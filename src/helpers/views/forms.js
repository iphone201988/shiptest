
export const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});