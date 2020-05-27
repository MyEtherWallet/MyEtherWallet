/* eslint-disable security/detect-unsafe-regex */
import normalise from '@/helpers/normalise';
import { extractRootDomain } from '@/builds/mewcx/cxHelpers/extractRootDomain.js';
const isUrl = function (input) {
  const rootDomain = extractRootDomain(input);
  const parsedInput = normalise(rootDomain);
  const urlRegex = new RegExp(
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  );
  return urlRegex.test(parsedInput.toLowerCase());
};

const isEmail = function (input) {
<<<<<<< HEAD
  if (!input) return false;
=======
  if (!input) return;
>>>>>>> bd54d154f352809c0a81ebb3e8a3178f83b152bc
  const atIndex = input.indexOf('@');
  const parsedEmailName = normalise(input.substr(0, atIndex));
  const parsedEmailHost = normalise(input.substr(atIndex + 1, input.length));
  const emailRegex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
  );
  return emailRegex.test(`${parsedEmailName}@${parsedEmailHost}`.toLowerCase());
};

const isString = function (input) {
  if (!input) return false;
  const parsedInput = normalise(input);
  return typeof parsedInput === 'string';
};

const isHandle = function (input) {
<<<<<<< HEAD
  if (!input) return false;
=======
  if (!input) return;
>>>>>>> bd54d154f352809c0a81ebb3e8a3178f83b152bc
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
