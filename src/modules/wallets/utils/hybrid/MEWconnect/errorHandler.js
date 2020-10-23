import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
const ERRORS = {};
const WARNINGS = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNINGS);
  if (errorValues.includes(err.message)) {
    Toast(ERRORS[err.message], {}, ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast(WARNINGS[err.message], {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
