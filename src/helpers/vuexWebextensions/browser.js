/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 *
 *  Custom class to apply polyfills without dependencies
 *  and offer crossbrowser compatibility
 */

/* global chrome, browser */

import Logger from './logger';

const browsers = Object.freeze({
  firefox: {
    name: 'Mozilla Firefox',
    namespace: 'browser',
    type: 'promise'
  },

  chrome: {
    name: 'Google Chrome',
    namespace: 'chrome',
    type: 'callback'
  },

  edge: {
    name: 'Microsoft Edge',
    namespace: 'browser',
    type: 'callback'
  }
});

class Browser {
  constructor() {
    this.browser = null;
    this.detectBrowser();
  }

  detectBrowser() {
    if (typeof chrome !== 'undefined') {
      if (typeof browser !== 'undefined') {
        this.browser = browsers.firefox;

        return;
      }

      this.browser = browsers.chrome;

      return;
    }

    this.browser = browsers.edge;
  }

  isBackgroundScript(script) {
    return new Promise(resolve => {
      try {
        if (this.browser == browsers.chrome) {
          chrome.runtime.getBackgroundPage(function (backgroundPage) {
            return resolve(script === backgroundPage);
          });
        } else if (this.browser == browsers.firefox) {
          browser.runtime.getBackgroundPage().then(function (backgroundPage) {
            return resolve(script === backgroundPage);
          });
        } else if (this.browser == browsers.edge) {
          browser.runtime.getBackgroundPage(function (backgroundPage) {
            return resolve(script === backgroundPage);
          });
        }
      } catch (err) {
        return resolve(false);
      }

      return false;
    });
  }

  getPersistentStates() {
    return new Promise((resolve, reject) => {
      try {
        if (this.browser == browsers.chrome) {
          chrome.storage.local.get('@@vwe-persistence', function (data) {
            if (data['@@vwe-persistence']) {
              return resolve(data['@@vwe-persistence']);
            }

            return resolve(null);
          });
        } else if (this.browser == browsers.firefox) {
          browser.storage.local.get('@@vwe-persistence').then(function (data) {
            if (data['@@vwe-persistence']) {
              return resolve(data['@@vwe-persistence']);
            }

            return resolve(null);
          });
        } else if (this.browser == browsers.edge) {
          browser.storage.local.get('@@vwe-persistence', function (data) {
            if (data['@@vwe-persistence']) {
              return resolve(data['@@vwe-persistence']);
            }

            return resolve(null);
          });
        }
      } catch (err) {
        return reject(err);
      }

      return false;
    });
  }

  savePersistentStates(datas) {
    if (this.browser == browsers.chrome) {
      try {
        chrome.storage.local.set({
          '@@vwe-persistence': datas
        });
      } catch (err) {
        Logger.error(
          `Can't write persistent states to local storage. Did you grant storage permission to your WebExtension?`
        );
      }
    } else if (this.browser == browsers.firefox) {
      try {
        browser.storage.local.set({
          '@@vwe-persistence': datas
        });
      } catch (err) {
        Logger.error(
          `Can't write persistent states to local storage. Did you grant storage permission to your WebExtension?`
        );
      }
    } else if (this.browser == browsers.edge) {
      try {
        browser.storage.local.set({
          '@@vwe-persistence': datas
        });
      } catch (err) {
        Logger.error(
          `Can't write persistent states to local storage. Did you grant storage permission to your WebExtension?`
        );
      }
    }
  }

  handleConnection(callback) {
    if (this.browser == browsers.chrome) {
      return chrome.runtime.onConnect.addListener(callback);
    }

    return browser.runtime.onConnect.addListener(callback);
  }

  connectToBackground(connectionName) {
    if (this.browser == browsers.chrome) {
      return chrome.runtime.connect({
        name: connectionName
      });
    }

    return browser.runtime.connect({
      name: connectionName
    });
  }
}

export default Browser;
