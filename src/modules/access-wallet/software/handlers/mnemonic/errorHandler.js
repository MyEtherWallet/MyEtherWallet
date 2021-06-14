import {
  Toast,
  WARNING,
  ERROR,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
const ERRORS = {};
const WARNINGS = {};

export default err => {
  const errorValues = Object.values(ERRORS);
  const warningValues = Object.values(WARNINGS);
  if (errorValues.includes(err.message)) {
    Toast(err.message, {}, ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast(err.message, {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
