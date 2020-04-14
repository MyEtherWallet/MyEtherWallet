/**
 *  Conversion Utilities
 *
 */

function addSlice(array) {
  if (array.slice) {
    return array;
  }

  array.slice = function () {
    const args = Array.prototype.slice.call(arguments);
    return new Uint8Array(Array.prototype.slice.apply(array, args));
  };

  return array;
}

function isArrayish(value) {
  if (
    !value ||
    parseInt(value.length) != value.length ||
    typeof value === 'string'
  ) {
    return false;
  }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (v < 0 || v >= 256 || parseInt(v) != v) {
      return false;
    }
  }

  return true;
}

export function arrayify(value) {
  if (value && value.toHexString) {
    value = value.toHexString();
  }

  if (isHexString(value)) {
    value = value.substring(2);
    if (value.length % 2) {
      value = '0' + value;
    }

    const result = [];
    for (let i = 0; i < value.length; i += 2) {
      result.push(parseInt(value.substr(i, 2), 16));
    }

    return addSlice(new Uint8Array(result));
  }
  if (isArrayish(value)) {
    return addSlice(new Uint8Array(value));
  }
}

export function padZeros(value, length) {
  value = arrayify(value);

  if (length < value.length) {
    throw new Error('cannot pad');
  }

  const result = new Uint8Array(length);
  result.set(value, length - value.length);
  return addSlice(result);
}

function isHexString(value, length) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

const HexCharacters = '0123456789abcdef';

export function hexlify(value) {
  if (value && value.toHexString) {
    return value.toHexString();
  }

  if (typeof value === 'number') {
    let hex = '';
    while (value) {
      hex = HexCharacters[value & 0x0f] + hex;
      value = parseInt(value / 16);
    }

    if (hex.length) {
      if (hex.length % 2) {
        hex = '0' + hex;
      }
      return '0x' + hex;
    }

    return '0x00';
  }

  if (isHexString(value)) {
    if (value.length % 2) {
      value = '0x0' + value.substring(2);
    }
    return value;
  }

  if (isArrayish(value)) {
    const result = [];
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      result.push(HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]);
    }
    return '0x' + result.join('');
  }
}
