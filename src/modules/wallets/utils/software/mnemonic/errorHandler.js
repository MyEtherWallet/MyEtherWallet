import Toast from '@/components/toast';
const ERRORS = {};
const WARNING = {};

export default err => {
  const errorValues = Object.values(ERRORS);
  const warningValues = Object.values(WARNING);
  if (errorValues.includes(err.message)) {
    Toast(err, {}, 'error');
  } else if (warningValues.includes(err.message)) {
    Toast(err, {}, 'warning');
  } else {
    Toast(err, {}, 'sentry');
  }
};
