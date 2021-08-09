/* eslint-disable security/detect-unsafe-regex */
import * as uts46 from 'idna-uts46-hx';

const normalise = function (str) {
  return uts46.toUnicode(str, {
    useStd3ASCII: true,
    transitional: false
  });
};

const extractHostname = url => {
  let hostname;
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
};

const extractRootDomain = url => {
  if (!url) return '';
  let domain = extractHostname(url);
  const splitArr = domain.split('.');
  const arrLen = splitArr.length;

  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }

  return domain.toLowerCase();
};
const isUrl = function (input) {
  try {
    const rootDomain = extractRootDomain(input);
    const parsedInput = normalise(rootDomain);
    const urlRegex = new RegExp(
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    );
    return urlRegex.test(parsedInput.toLowerCase());
  } catch (e) {
    return false;
  }
};

const isEmail = function (input) {
  if (!input || input === '') return false;
  const atIndex = input.indexOf('@');
  const emailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  try {
    const parsedEmailName = normalise(input.substr(0, atIndex));
    const parsedEmailHost = normalise(input.substr(atIndex + 1, input.length));
    return emailRegex.test(
      `${parsedEmailName}@${parsedEmailHost}`.toLowerCase()
    );
  } catch (e) {
    return emailRegex.test(input);
  }
};

const isString = function (input) {
  if (!input || input === '') return false;
  return typeof input === 'string';
};

const isHandle = function (input) {
  if (!input || input === '') return false;
  const atIndex = input.indexOf('@');
  const parsedInput = normalise(input.substr(atIndex + 1, input.length));
  if (!isString(parsedInput)) return false;

  return !parsedInput.includes('@');
};

const supportedTxt = [
  {
    name: 'email',
    type: 'email',
    validate: isEmail
  },
  {
    name: 'url',
    type: 'url',
    validate: isUrl
  },
  {
    name: 'avatar',
    type: 'url',
    validate: isUrl
  },
  {
    name: 'description',
    type: 'string',
    validate: isString
  },
  {
    name: 'notice',
    type: 'string',
    validate: isString
  },
  {
    name: 'keywords',
    type: 'string',
    validate: isString
  },
  {
    name: 'vnd.twitter',
    type: 'string',
    validate: isHandle
  },
  {
    name: 'vnd.github',
    type: 'string',
    validate: isHandle
  }
];
export default supportedTxt;
