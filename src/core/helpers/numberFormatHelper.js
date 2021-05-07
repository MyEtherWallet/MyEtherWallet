/**
 * Number Format Helper
 * taken from EthVM
 */
/* Constants: */
const SmallUsdBreakpoint = 0.04;
const SmallNumberBreakpoint = 0.0000001;
const SmallGweiBreakpoint = 0.00001;

const TenThousand = 1e4;
// const HundredThousand = 1e5;
const OneMillion = 1e6;
const OneBillion = 1e9;
// const HundredBillion = 1e11;
const OneTrillion = 1e12;
const OneQuadrillion = 1e15;

const FormattedNumberUnit = {
  ETH: 'eth',
  GWEI: 'gwei',
  WEI: 'wei',
  PERCENT: '%',
  USD: '$',
  B: 'B',
  T: 'T',
  Q: 'Q'
};

/**
 * GROUP I: Floating point values
 * Converts a floating point value to a FormattedNumber object
 * Use cases: Token Balances / Quantities / Non Detail page for floating numbers
 * @param value BigNumber
 * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
 */
function formatFloatingPointValue(value) {
  const dps = value.decimalPlaces();

  /**
   * Case I: value === 0
   * Return: "0"
   */
  if (value.isZero()) {
    return { value: '0' };
  }

  /**
   * Case II: value >= 1,000,000,000
   * Return: formated integer value with tooltip
   */
  if (value.isGreaterThanOrEqualTo(OneBillion)) {
    return this.formatIntegerValue(value);
  }

  /**
   * Case III: value >= 1,000,000
   * Return: round number and tooltip with full value if there are decimal places
   */
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    return this.getRoundNumber(value, 0, dps);
  }

  /**
   * Case IV: value >= 10,000
   * Return: a number, rounded to 2 decimal points and tooltip with full value if > 2 decimal places
   */
  if (value.isGreaterThanOrEqualTo(TenThousand)) {
    return this.getRoundNumber(value, 2, dps);
  }

  /**
   * Case IV: value >= 1
   * Return: a number, rounded to 4 decimal points and tooltip with full value if > 4 decimal places
   */
  if (value.isGreaterThanOrEqualTo(1)) {
    return this.getRoundNumber(value, 4, dps);
  }

  /**
   * Case V: value >= 0.0000001
   * Return: a number, rounded up to 7 decimal places and tooltip with full value if > 7 decimal places
   */
  if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
    return this.getRoundNumber(value, 7, dps);
  }

  /**
   * Case V: value < 0.0000001
   * Return: string "< 0.0000001" and tooltip with full value
   */
  return {
    value: '< 0.0000001',
    tooltipText: dps ? value.toFormat() : undefined
  };
}

/**
 * GROUP II: USD Values
 * Converts a USD value to a FormattedNumber
 * @param value: BigNumber
 * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
 */
function formatUsdValue(value) {
  const unit = FormattedNumberUnit.USD;
  /**
   * Case I: value === 0
   * Return: "$0.00"
   */
  if (value === undefined || value.isZero()) {
    return { value: '$0.00', unit };
  }

  /**
   * Case II: value >= 1 Quadrillion
   * Return:  value converted to Quadrillions"
   */
  if (value.isGreaterThanOrEqualTo(OneQuadrillion)) {
    const result = this.convertToQuadrillion(value);
    return {
      value: `$${result.value}`,
      unit,
      tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined
    };
  }

  /**
   * Case II: value >= 1 Trillion
   * Return:  value converted to trillions"
   */
  if (value.isGreaterThanOrEqualTo(OneTrillion)) {
    const result = this.convertToTrillions(value);
    return {
      value: `$${result.value}`,
      unit,
      tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined
    };
  }

  /**
   * Case III: value >= 1 Billion
   * Return: value converted to billions"
   */
  if (value.isGreaterThanOrEqualTo(OneBillion)) {
    const result = this.convertToBillions(value);
    return {
      value: `$${result.value}`,
      unit,
      tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined
    };
  }

  /**
   * Case IV: value >= 1 Million.
   * Return: rounded number and tolltip if has decimal points"
   */
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    const result = this.getRoundNumber(value, 0, value.decimalPlaces());
    return {
      value: `$${result.value}`,
      unit,
      tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined
    };
  }

  /**
   * Case V: value > 0.04
   * Return: rounded number up to 2 decimal points and tolltip if > 2 decimal points"
   */
  if (value.isGreaterThan(SmallUsdBreakpoint)) {
    return {
      value: `$${value.toFormat(2)}`,
      unit,
      tooltipText:
        value.decimalPlaces() > 2 ? `$${value.toFormat()}` : undefined
    };
  }

  /**
   * Case VI: 0.00001 <= value <= 0.04
   * Return: rounded number up to 5 decimal points and tooltip if > 5 decimal points"
   */
  if (value.isGreaterThanOrEqualTo(SmallGweiBreakpoint)) {
    const formatted = value.toFormat(Math.min(5, value.decimalPlaces()));
    return {
      value: `$${formatted}`,
      unit,
      tooltipText:
        value.decimalPlaces() > 5 ? `$${value.toFormat()}` : undefined
    };
  }

  /**
   * Case V: value < 0.0000001
   * Return: string "< $0.0000001" and tooltip with full value
   */
  return { value: '< $0.0000001', unit, tooltipText: `$${value.toFixed()}` };
}

/* Helper functions */

function convertToBillions(value) {
  const result = value.dividedBy(OneBillion);
  return {
    value: `${result.toFormat(Math.min(3, result.decimalPlaces()))}B`,
    unit: FormattedNumberUnit.B,
    tooltipText: value.toFormat()
  };
}

function convertToTrillions(value) {
  const result = value.dividedBy(OneTrillion);
  return {
    value: `${result.toFormat(Math.min(3, result.decimalPlaces()))}T`,
    unit: FormattedNumberUnit.T,
    tooltipText: value.toFormat()
  };
}

function convertToQuadrillion(value) {
  return {
    value: '> 1Q',
    unit: FormattedNumberUnit.Q,
    tooltipText: value.toFormat()
  };
}

function getRoundNumber(value, round, dp) {
  return {
    value: value.toFormat(Math.min(round, dp)),
    tooltipText: dp > round ? value.toFormat() : undefined
  };
}

export default {
  formatFloatingPointValue,
  formatUsdValue,
  convertToBillions,
  convertToTrillions,
  convertToQuadrillion,
  getRoundNumber
};
