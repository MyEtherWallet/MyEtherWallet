import BigNumber from 'bignumber.js';

const roundNumber = val => {
  const OneThousand = 1e3;
  const OneMillion = 1e6;
  const OneBillion = 1e9;
  const OneTrillion = 1e12;
  const value = new BigNumber(val);

  /* Case I: value is 0 */
  if (value.isZero()) {
    return '0';
  }

  /* Case I: value >= 1,000,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneTrillion)) {
    return `${value.dividedBy(OneTrillion).toFormat(2)}T`;
  }

  /* Case II: value >= 1,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneBillion)) {
    return `${value.dividedBy(OneBillion).toFormat(2)}B`;
  }

  /* Case III: value >= 1,000,000*/
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    return `${value.dividedBy(OneMillion).toFormat(2)}M`;
  }

  /* Case IV: value >= 1,000*/
  if (value.isGreaterThanOrEqualTo(OneThousand)) {
    return value.toFormat(0);
  }

  /* Case V: value >= 1,000*/
  if (value.isGreaterThanOrEqualTo(1)) {
    return value.toFormat(Math.min(2, value.decimalPlaces()));
  }

  /**
   * Case VI: value >= 0.0001
   * Return: a number, rounded up to 4 decimal places
   */
  if (value.isGreaterThanOrEqualTo(0.0001)) {
    return value.toFormat(Math.min(4, value.decimalPlaces()));
  }
  return '<0.0001';
};

export { roundNumber };
