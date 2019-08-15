const clearListeners = (res, rej) => {
  window.removeEventListener(res, () => {});
  window.removeEventListener(rej, () => {});
};

const eventHandler = (event, data, responseEvent, rejectEvent) => {
  return new Promise((resolve, reject) => {
    const actualEvent = new CustomEvent(event, data);
    window.dispatchEvent(actualEvent);
    window.addEventListener(responseEvent, res => {
      clearListeners(responseEvent, rejectEvent);
      resolve(res.detail);
    });
    window.addEventListener(rejectEvent, () => {
      clearListeners(responseEvent, rejectEvent);
      reject(new Error('User cancelled request!'));
    });
  });
};

export default eventHandler;
