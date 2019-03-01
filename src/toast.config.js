import toastWarn from '@/assets/images/icons/toast-warn.svg';
import toastErr from '@/assets/images/icons/toast-err.svg';
import toastSuccess from '@/assets/images/icons/toast-success.svg';

const toastObject = {
  position: 'bottom-right',
  closeOnSwipe: true,
  iconPack: 'fontawesome',
  action: {
    text: '',
    icon: 'fa-times',
    class: 'toast-action',
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    }
  },
  duration: 5000
};

const error = {
  name: 'appError',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastErr}" /> &nbsp; Oops.. Something Went Wrong..</div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastErr}" /> &nbsp; ${payload.message}</div>`;
  },
  options: Object.assign({}, toastObject, {
    className: 'toast-error'
  })
};

const warn = {
  name: 'appWarn',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastWarn}" /> &nbsp; Something minor happened. Don't be alarmed</div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastWarn}" /> &nbsp; Warning: ${
      payload.message
    }</div>`;
  },
  options: Object.assign({}, toastObject, {
    className: 'toast-warn'
  })
};

const info = {
  name: 'appInfo',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastSuccess}" /> Good job! </div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastSuccess}" /> &nbsp; ${payload.message}</div>`;
  },
  options: Object.assign({}, toastObject, {
    className: 'toast-info'
  })
};

const success = {
  name: 'appSuccess',
  payloadFunc: payload => {
    // if there is no message passed show default message
    if (!payload.message) {
      return `<div><img src="${toastSuccess}" /> &nbsp; Success!</div>`;
    }
    // if there is a message show it with the message
    return `<div><img src="${toastSuccess}" /> &nbsp; ${payload.message}</div>`;
  },
  options: Object.assign({}, toastObject, {
    className: 'toast-success'
  })
};

export { error, warn, success, info };
