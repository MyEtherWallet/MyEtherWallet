class EventHandler {
  constructor(event, data, responseEvent, rejectEvent) {
    this.event = event;
    this.data = data;
    this.responseEvent = responseEvent;
    this.rejectEvent = rejectEvent;

    return {
      dispatch: () => {
        return new Promise((resolve, reject) => {
          const actualEvent = new CustomEvent(event, data);
          window.dispatchEvent(actualEvent);
          window.addEventListener(responseEvent, res => {
            resolve(res.detail);
            this.clearListeners();
          });
          window.addEventListener(rejectEvent, () => {
            reject(new Error('User cancelled request!'));
            this.clearListeners();
          });
        });
      }
    };
  }

  clearListeners() {
    window.removeEventListener(this.responseEvent, () => {});
    window.removeEventListener(this.rejectEvent, () => {});
  }
}

export default EventHandler;
