import translations from './index';

const codes = {};
const translationKeys = Object.keys(translations);

translationKeys.forEach(key => {
  codes[key.substr(0, 2)] = key;
});

export default codes;
