import vuexStore from '@/core/store';
import { mapActions } from 'vuex';
import { toWei, _ } from 'web3-utils';
import xss from 'xss';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default class Settings {
  constructor() {
    this.$store = vuexStore;
    this.validFields = Object.keys(this.$store.state.global);
    Object.assign(this, mapActions('global', ['setImportedState']));
  }

  // Receives object from file read in module
  // Returns a promise so the module can react accordingly
  importStore(file) {
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
            _this.setImportedState(parsedObj).then(() => {
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
    const body = document.body;
    const time = new Date();
    const filename = `Store-Export-${time.getTime()}.json`;
    const newObj = Object.assign({}, this.$store.state.global);
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
    _.keys(obj).forEach(item => {
      if (_.contains(this.validFields, item)) {
        if (item === 'gasPrice') {
          // converts gasPrice back to BN instance
          // this is assuming that when exporting, it gets converted to string
          newObj[item] = toWei(item);
        } else {
          // strip tags for string, otherwise return item
          newObj[item] = _.isString(obj[item]) ? xss(obj[item]) : obj[item];
        }
      }
    });
    return newObj;
  }
}
