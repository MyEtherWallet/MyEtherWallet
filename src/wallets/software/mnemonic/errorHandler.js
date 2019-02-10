import { ErrorHandler } from '@/helpers';
const ERRORS = {};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    ErrorHandler(err, true);
  } else {
    ErrorHandler(err, false);
  }
};
