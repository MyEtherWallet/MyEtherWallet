import Toast from '@/components/toast';
const ERRORS = {};
const WARNING = {};

export default err => {
  const errorValues = Object.values(ERRORS);
  const warningValues = Object.values(WARNING);
  if (errorValues.includes(err.message)) {
    Toast(err.message, {}, 'error');
  } else if (warningValues.includes(err.message)) {
    Toast(err.message, {}, 'warning');
  } else {
    Toast(err, {}, 'sentry');
  }
};
