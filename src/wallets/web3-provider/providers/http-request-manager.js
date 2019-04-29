import axios from 'axios';
import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
class HttpRequestManager {
  constructor(host, options) {
    options = options || {};
    this.host = host;
    const config = {
      timeout: options.timeout || 5000,
      headers: { 'Content-Type': 'application/json' }
    };
    if (options.headers) {
      options.headers.forEach(header => {
        config.headers[header.name] = header.value;
      });
    }
    this.request = axios.create(config);
    return new Web3RequestManager(this);
  }
  send(payload, callback) {
    this.request
      .post(this.host, payload)
      .then(result => {
        callback(null, result.data);
      })
      .catch(err => {
        callback(err);
      });
  }
  disconnect() {}
}
export default HttpRequestManager;
