import toastWarn from '@/assets/images/icons/toast-warn.svg';
import toastErr from '@/assets/images/icons/toast-err.svg';
import toastSuccess from '@/assets/images/icons/toast-success.svg';

const toastObject = {
  position: 'bottom-right',
  duration: 2500,
  onClick: toastObject => {
    toastObject.goAway(0);
  }
};

const error = {
  name: 'appError',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastErr}" /> &nbsp; Oops.. Something Went Wrong..</div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastErr}" /> &nbsp; Oops.. ${
      payload.message
    }</div>`;
  },
  options: Object.assign({}, toastObject, { className: 'toast-error' })
};

const info = {
  name: 'appWarn',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastWarn}" /> &nbsp; Something minor happened. Don't be alarmed</div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastWarn}" /> &nbsp; Info: ${
      payload.message
    }</div>`;
  },
  options: Object.assign({}, toastObject, { className: 'toast-warn' })
};

const success = {
  name: 'appSuccess',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastErr}" /> &nbsp; Success!</div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastSuccess}" /> &nbsp; Success: ${
      payload.message
    }</div>`;
  },
  options: Object.assign({}, toastObject, { className: 'toast-success' })
};

export { error, info, success };
