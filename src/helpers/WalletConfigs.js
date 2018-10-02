const walletConfigs = {
  params: {
    keyBytes: 32,
    ivBytes: 16
  },
  options: {
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      n: 131072,
      r: 8,
      p: 1
    }
  }
};
export default walletConfigs;
