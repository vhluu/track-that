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

// Whether to show console.log statements
export const debug = false;

// Detect macOS (for handling emojis)
export const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

// Detect Windows (for scrollbar issue)
const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
const platform = window.navigator.platform;
export const isWindows = windowsPlatforms.indexOf(platform) !== -1;