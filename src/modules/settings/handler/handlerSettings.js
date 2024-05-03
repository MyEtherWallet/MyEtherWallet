import { toWei } from 'web3-utils';
import { includes, isString, keys } from 'lodash';
import xss from 'xss';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default class Settings {
  constructor() {
    const { $state } = useGlobalStore();
    this.validFields = Object.keys($state);
  }

  // Receives object from file read in module
  // Returns a promise so the module can react accordingly
  importStore(file) {
    const { setImportedState } = useGlobalStore();
    return new Promise((resolve, reject) => {
      const _this = this;
      try {
        const reader = new FileReader();
        reader.onerror = e => {
          Toast(e.message, {}, ERROR);
        };
        reader.onloadend = evt => {
          const file = evt.target.result;
          try {
            const obj = JSON.parse(file);
            const parsedObj = _this._validateImportObject(obj);
            // sets the imported state to the store
            setImportedState(parsedObj).then(() => {
              resolve();
            });
          } catch ({ message }) {
            Toast('Invalid JSON: ' + message, {}, ERROR);
          }
        };
        reader.readAsBinaryString(file);
      } catch (e) {
        reject(e.message);
      }
    });
  }

  exportStore() {
    const { $state } = useGlobalStore();
    const body = document.body;
    const time = new Date();
    const filename = `Store-Export-${time.getTime()}.json`;
    const newObj = Object.assign({}, $state);
    const el = document.createElement('a');
    el.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(newObj)
      )}`
    );
    el.setAttribute('download', filename);
    body.appendChild(el);
    el.click();
    body.removeChild(el);
  }

  // Validates the passed object for import
  // strips strings and only accepts certain keys
  _validateImportObject(obj) {
    const newObj = {};
    keys(obj).forEach(item => {
      if (includes(this.validFields, item)) {
        if (item === 'gasPrice') {
          // converts gasPrice back to BN instance
          // this is assuming that when exporting, it gets converted to string
          newObj[item] = toWei(item);
        } else {
          // strip tags for string, otherwise return item
          newObj[item] = isString(obj[item]) ? xss(obj[item]) : obj[item];
        }
      }
    });
    return newObj;
  }
}
