import BigNumber from 'bignumber.js';
export default function sortByBalance(a, b) {
  const aBn = new BigNumber(a.balance);
  const bBn = new BigNumber(b.balance);
  if (!aBn.isNaN() && !bBn.isNaN()) {
    if (aBn.isGreaterThan(bBn)) {
      return -1;
    } else if (bBn.isGreaterThan(aBn)) {
      return 1;
    }
  }
  return 0;
}
