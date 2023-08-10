const parseXDCValues = (payload, response) => {
  if (
    (payload.method === 'eth_getBlockByNumber' ||
      payload.method === 'eth_subscription') &&
    response.result &&
    response.result.miner
  ) {
    response.result.miner = response.result.miner.startsWith('xdc')
      ? response.result.miner.replace('xdc', '0x')
      : response.result.miner;
  }
  return response;
};

export { parseXDCValues };
