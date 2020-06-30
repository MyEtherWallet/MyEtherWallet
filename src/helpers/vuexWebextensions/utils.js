/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

function filterObject(source, keys) {
  const newObject = {};

  keys.forEach(key => {
    const isModuled = key.includes('.');
    if (isModuled) {
      const arrayedKey = key.split('.');
      if (!newObject[arrayedKey[0]]) {
        newObject[arrayedKey[0]] = {};
      }
      const parentValue = source[arrayedKey[0]];
      const actualValue = parentValue[arrayedKey[1]];
      if (typeof actualValue !== 'undefined') {
        newObject[arrayedKey[0]][arrayedKey[1]] = actualValue;
      }
    } else {
      const value = source[key];
      if (typeof value !== 'undefined' && value) {
        newObject[key] = value;
      }
    }
  });
  return newObject;
}

export { filterObject };
