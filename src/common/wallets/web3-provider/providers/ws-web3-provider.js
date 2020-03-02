'use strict';

const _ = require('underscore');
const errors = require('web3-core-helpers').errors;

let Ws = null;
let _btoa = null;
let parseURL = null;
Ws = function(url, protocols) {
  if (protocols) return new window.WebSocket(url, protocols);
  return new window.WebSocket(url);
};
_btoa = btoa;
parseURL = function(url) {
  return new URL(url);
};
const WebsocketProvider = function WebsocketProvider(url, options) {
  const _this = this;
  this.responseCallbacks = {};
  this.notificationCallbacks = [];

  options = options || {};
  this._customTimeout = options.timeout;
  const parsedURL = parseURL(url);
  const headers = options.headers || {};
  const protocol = options.protocol || undefined;
  if (parsedURL.username && parsedURL.password) {
    headers.authorization =
      'Basic ' + _btoa(parsedURL.username + ':' + parsedURL.password);
  }
  const clientConfig = options.clientConfig || undefined;
  if (parsedURL.auth) {
    headers.authorization = 'Basic ' + _btoa(parsedURL.auth);
  }
  this.connection = new Ws(
    url,
    protocol,
    undefined,
    headers,
    undefined,
    clientConfig
  );

  this.addDefaultEvents();
  this.connection.onmessage = function(e) {
    const data = typeof e.data === 'string' ? e.data : '';
    _this._parseResponse(data).forEach(function(result) {
      let id = null;
      if (_.isArray(result)) {
        result.forEach(function(load) {
          if (_this.responseCallbacks[load.id]) id = load.id;
        });
      } else {
        id = result.id;
      }
      if (
        !id &&
        result &&
        result.method &&
        result.method.indexOf('_subscription') !== -1
      ) {
        _this.notificationCallbacks.forEach(function(callback) {
          if (_.isFunction(callback)) callback(result);
        });
      } else if (_this.responseCallbacks[id]) {
        _this.responseCallbacks[id](null, result);
        delete _this.responseCallbacks[id];
      }
    });
  };
  Object.defineProperty(this, 'connected', {
    get: function() {
      return (
        this.connection && this.connection.readyState === this.connection.OPEN
      );
    },
    enumerable: true
  });
};
WebsocketProvider.prototype.addDefaultEvents = function() {
  const _this = this;

  this.connection.onerror = function() {
    _this._timeout();
  };

  this.connection.onclose = function() {
    _this._timeout();
    _this.reset();
  };
};
WebsocketProvider.prototype._parseResponse = function(data) {
  const _this = this,
    returnValues = [];
  const dechunkedData = data
    .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
    .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
    .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
    .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
    .split('|--|');

  dechunkedData.forEach(function(data) {
    if (_this.lastChunk) data = _this.lastChunk + data;
    let result = null;
    try {
      result = JSON.parse(data);
    } catch (e) {
      _this.lastChunk = data;
      clearTimeout(_this.lastChunkTimeout);
      _this.lastChunkTimeout = setTimeout(function() {
        _this._timeout();
        throw errors.InvalidResponse(data);
      }, 1000 * 15);

      return;
    }
    clearTimeout(_this.lastChunkTimeout);
    _this.lastChunk = null;

    if (result) returnValues.push(result);
  });

  return returnValues;
};

WebsocketProvider.prototype._addResponseCallback = function(payload, callback) {
  const id = payload.id || payload[0].id;
  const method = payload.method || payload[0].method;

  this.responseCallbacks[id] = callback;
  this.responseCallbacks[id].method = method;

  const _this = this;
  if (this._customTimeout) {
    setTimeout(function() {
      if (_this.responseCallbacks[id]) {
        _this.responseCallbacks[id](
          errors.ConnectionTimeout(_this._customTimeout)
        );
        delete _this.responseCallbacks[id];
      }
    }, this._customTimeout);
  }
};
WebsocketProvider.prototype._timeout = function() {
  for (const key in this.responseCallbacks) {
    if (this.responseCallbacks.hasOwnProperty(key)) {
      this.responseCallbacks[key](errors.InvalidConnection('on WS'));
      delete this.responseCallbacks[key];
    }
  }
};
WebsocketProvider.prototype.send = function(payload, callback) {
  const _this = this;

  if (this.connection.readyState === this.connection.CONNECTING) {
    setTimeout(function() {
      _this.send(payload, callback);
    }, 10);
    return;
  }
  if (this.connection.readyState !== this.connection.OPEN) {
    if (typeof this.connection.onerror === 'function') {
      this.connection.onerror(new Error('connection not open'));
    }
    callback(new Error('connection not open'));
    return;
  }

  this.connection.send(JSON.stringify(payload));
  this._addResponseCallback(payload, callback);
};
WebsocketProvider.prototype.on = function(type, callback) {
  if (typeof callback !== 'function')
    throw new Error('The second parameter callback must be a function.');

  switch (type) {
    case 'data':
      this.notificationCallbacks.push(callback);
      break;

    case 'connect':
      this.connection.onopen = callback;
      break;

    case 'end':
      this.connection.onclose = callback;
      break;

    case 'error':
      this.connection.onerror = callback;
      break;
  }
};
WebsocketProvider.prototype.removeListener = function(type, callback) {
  const _this = this;

  switch (type) {
    case 'data':
      this.notificationCallbacks.forEach(function(cb, index) {
        if (cb === callback) _this.notificationCallbacks.splice(index, 1);
      });
      break;
  }
};
WebsocketProvider.prototype.removeAllListeners = function(type) {
  switch (type) {
    case 'data':
      this.notificationCallbacks = [];
      break;
    case 'connect':
      this.connection.onopen = null;
      break;

    case 'end':
      this.connection.onclose = null;
      break;

    case 'error':
      this.connection.onerror = null;
      break;

    default:
      break;
  }
};

WebsocketProvider.prototype.reset = function() {
  this._timeout();
  this.notificationCallbacks = [];
  this.addDefaultEvents();
};

WebsocketProvider.prototype.disconnect = function() {
  if (this.connection) {
    this.connection.close();
  }
};

export default WebsocketProvider;
