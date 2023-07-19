/* eslint-disable security/detect-unsafe-regex, no-useless-escape */
import normalise from '@/core/helpers/normalise';
export default input => {
  if (!input || input === '') return false;
  const atIndex = input.indexOf('@');
  const emailRegex =
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
