import { ErrorHandler } from '@/helpers';
const ERRORS = {
  SIGN_FAILED: 'Sign failed'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    ErrorHandler(err, true);
  } else {
    ErrorHandler(err, false);
  }
};
