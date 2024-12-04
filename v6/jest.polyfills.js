const { TextDecoder, TextEncoder } = require('util');
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder }
});
