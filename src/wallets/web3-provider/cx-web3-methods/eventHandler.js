const clearListeners = () => {
  window.removeEventListener(this.responseEvent, () => {});
  window.removeEventListener(this.rejectEvent, () => {});
};

const eventHandler = (event, data, responseEvent, rejectEvent) => {
  return new Promise((resolve, reject) => {
    const actualEvent = new CustomEvent(event, data);
    window.dispatchEvent(actualEvent);
    window.addEventListener(responseEvent, res => {
      resolve(res.detail);
      clearListeners();
    });
    window.addEventListener(rejectEvent, () => {
      reject(new Error('User cancelled request!'));
      clearListeners();
    });
  });
};

export default eventHandler;
