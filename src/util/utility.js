/* Utility Functions */

// Update object with given properties
export const updateObject = (oldObject, updatedProps) => {
  return {
    ...oldObject,
    ...updatedProps,
  };
};

// Remove property from given object
export const removeProp = (oldObject, propToRemove) => {
  const { [propToRemove]: deletedItem, ...updatedObject } = oldObject;
  return updatedObject;
};
