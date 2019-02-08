import { ErrorHandler } from '@/helpers';
const ERRORS = {};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    console.error(err.message, err); // eslint-disable-line
  } else {
    ErrorHandler(err, false);
  }
};
