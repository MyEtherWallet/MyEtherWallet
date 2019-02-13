import { Toast } from '@/helpers';
const ERRORS = {
  SIGN_FAILED: 'Sign failed'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(err, true);
  } else {
    Toast.responseHandler(err, false);
  }
};
