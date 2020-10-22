import Toast from '@/components/toast';
const ERRORS = {};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  if (errorValues.includes(err.message)) {
    Toast(ERRORS[err.message], {}, 'error');
  } else if (warningValues.includes(err.message)) {
    Toast(WARNING[err.message], {}, 'warning');
  } else {
    Toast(err, {}, 'sentry');
  }
};
