import { Toast } from '@/helpers';
const ERRORS = {};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(ERRORS[err.message], Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast.responseHandler(WARNING[err.message], Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
