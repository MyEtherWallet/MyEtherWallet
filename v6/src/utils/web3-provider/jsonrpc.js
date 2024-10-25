const toPayload = (id, result) => {
  return {
    jsonrpc: '2.0',
    id,
    result
  };
};
const toError = (id, msg, code) => {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: code ? code : -32603,
      message: msg
    }
  };
};
export { toPayload, toError };
