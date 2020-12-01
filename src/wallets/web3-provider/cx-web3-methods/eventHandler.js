const clearListeners = (res, rej) => {
  window.removeEventListener(res, () => {});
  window.removeEventListener(rej, () => {});
};

const eventHandler = (event, data, responseEvent, rejectEvent) => {
  return new Promise((resolve, reject) => {
    const actualEvent = new CustomEvent(event, data);
    window.addEventListener(responseEvent, res => {
      clearListeners(responseEvent, rejectEvent);
      resolve(res.detail);
    });
    window.addEventListener(rejectEvent, res => {
      clearListeners(responseEvent, rejectEvent);
      if (res.detail) {
        reject(new Error(res.detail));
      } else {
        reject(new Error('User cancelled request!'));
      }
    });
    window.dispatchEvent(actualEvent);
  });
};

export default eventHandler;
