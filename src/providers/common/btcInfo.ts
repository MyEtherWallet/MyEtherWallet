export default {
  name: "BTC",
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
  dustThreshold: null,
  paymentType: "p2wpkh",
  maxFeeRate: 5000,
}