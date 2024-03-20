import { bech32 } from 'bech32';
import { decode as decodeBase58Check } from 'bs58check';
import { utils } from 'ethers';

const BTC_MAINNET_ADDRESS_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
const BTC_LEGACY_MAINNET_ADRESS_REGEX = /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/;

function isBtcNativeSegwitAddress(address) {
  const isNotMixedCase =
    address === address.toLowerCase() || address === address.toUpperCase();
  return (
    [BTC_MAINNET_ADDRESS_REGEX].some(regex => regex.test(address)) &&
    isNotMixedCase
  );
}

function isBtcAddress(address) {
  return [BTC_MAINNET_ADDRESS_REGEX, BTC_LEGACY_MAINNET_ADRESS_REGEX].some(
    regex => regex.test(address)
  );
}

export function decodeBtcAddress(address, options = { keepChecksum: false }) {
  if (isBtcNativeSegwitAddress(address)) {
    return new Uint8Array(bech32.decode(address).words);
  } else if (isBtcAddress(address)) {
    return options.keepChecksum
      ? utils.base58.decode(address)
      : decodeBase58Check(address);
  }
  throw new Error('not a BTC address');
}
