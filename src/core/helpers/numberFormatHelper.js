import BigNumber from 'bignumber.js';
import { isNull } from 'lodash';
import { toBN } from 'web3-utils';
import { fromWei } from 'web3-utils';
/**
 * ---------------------------------
 * Number Format Helper.
 * Used to format numerical strings in the UI
 * ---------------------------------
 */

/** FormatterNumber Object:
 * {
 *    value: '< 0.0000001', //string
 *    tooltipText: '0.0000000001' //string || undefined,
 *    unit: 'eth' // string || undefined,
 * };
 */

/**
 * ---------------------------------
 * Constants
 * ---------------------------------
 */
const SmallNumberBreakpoint = 0.000001;
const SmallFiatBreakpoint = 0.01;
const TenThousand = 1e4;
const OneMillion = 1e6;
const OneBillion = 1e9;
const TenBillion = 1e10;
const OneTrillion = 1e12;
const OneQuadrillion = 1e15;

const FormattedNumberUnit = {
  ETH: 'ETH',
  GWEI: 'Gwei',
  WEI: 'wei',
  PERCENT: '%',
  USD: '$',
  B: 'B',
  T: 'T',
  Q: 'Q',
  M: 'M',
  FIAT: 'fiat'
};

/*  Set the global formatting options */
const fmt = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
};
BigNumber.config({ FORMAT: fmt });
BigNumber.config({ ROUNDING_MODE: 1 }); // equivalent

/**
 * ---------------------------------
 * CORE Functions
 * ---------------------------------
 */

/**
 * GROUP I: Format number
 * Converts an integer value to a formatted string using BigNumber.js
 * @param {any} _value - number to convert takes BigNumber || string || number 1000
 * @return {string} formatter number as a string ie: '1,000'
 */

const formatIntegerToString = _value => {
  return new BigNumber(_value).toFormat();
};

/**
 * GROUP II: Formatted integers
 * Converts an integer value to a FormattedNumber object, returns value in { billions, trillions, "> 1Q"} if > 1 million
 * @param _value BigNumber || string || number}
 * @return {object} FormattedNumber
 */
const formatIntegerValue = _value => {
  const value = new BigNumber(_value);
  /* Case I: value >= 1,000,000,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneQuadrillion)) {
    return convertToQuadrillion(value);
  }

  /* Case II: value >= 1,000,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneTrillion)) {
    return convertToTrillions(value);
  }

  /* Case III: value >= 1,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneBillion)) {
    return convertToBillions(value);
  }

  /* Case IV: value >= 1,000,000 */
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    return convertToMillions(value);
  }

  /* Case V: value < 1,000,000,000 */
  return { value: value.toFormat() };
};

/**
 * GROUP III: Floating point values
 * Converts a floating point value to a FormattedNumber object. Returns formatted value, unless the value is less then 0.000001.
 * Show upto 6 decimal points or to the last decimal point. Ie: 1.3 should be shown as 1.3. Follows Group II (formatIntegerValue) if value is greater than 1 million.
 * Use cases: Token Balances / Quantities / Tx fee/ Tx amount
 * @param {any} _value number to convert takes BigNumber || string || number
 * @returns {object} FormattedNumber with value as formatted string, and tooltipText
 */
function formatFloatingPointValue(_value) {
  const value = new BigNumber(_value);
  /**
   * Case I: value === 0
   * Return: "0"
   */
  if (value.isZero() || value.isNaN()) {
    return { value: '0' };
  }

  /**
   * Case II: value >= 1,000,000
   * Return: formated integer value with tooltip
   */
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    return formatIntegerValue(value);
  }

  /**
   * Case III: value >= 10,000
   * Return: a number, rounded to 2 decimal points and tooltip with full value if > 2 decimal places
   */
  if (value.isGreaterThanOrEqualTo(TenThousand)) {
    return getRoundNumber(value, 2);
  }

  /**
   * Case IV: value >= 1
   * Return: a number, rounded to 4 decimal points and tooltip with full value if > 4 decimal places
   */
  if (value.isGreaterThanOrEqualTo(1)) {
    return getRoundNumber(value, 4);
  }

  /**
   * Case V: value >= 0.0000001
   * Return: a number, rounded up to 7 decimal places and tooltip with full value if > 7 decimal places
   */
  if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
    return getRoundNumber(value, 6);
  }

  /**
   * Case V: value < 0.000001
   * Return: string "< 0.000001" and tooltip with full value
   */
  return {
    value: `< ${SmallNumberBreakpoint}`,
    tooltipText: value.toFormat()
  };
}

/**
 * GROUP IV: Balance ETH Value
 * Converts a floating point WEI value to a FormattedNumber object. Returns formatted value in ETH, Gwei or wei.
 * Show upto 6 decimal points or to the last decimal point. Ie: 1.3 should be shown as 1.3. Follows Group II (formatIntegerValue) if value is greater than 1 million.
 * Use cases: Dashboard ETH balance / Swap & Send Transaction Balance /Access Wallet with Mnemonic type wallet, in address table
 * @param {any} _value MUST BE IN WEI number to convert takes BigNumber || string || number
 * @returns {object} FormattedNumber with value as formatted string, unit and tooltipText
 */
const formatBalanceEthValue = _value => {
  const value = new BigNumber(_value);
  const ethValue = new BigNumber(fromWei(_value.toString()));

  /**
   * Case I: value === 0
   * Return: "0 ETH"
   */
  if (value.isZero()) {
    return { value: '0', unit: FormattedNumberUnit.ETH };
  }
  /**
   * Case II: value < 10,000 wei
   * Return: small values in WEI (no conversion) and tooltip with ETH value
   */
  if (value.isLessThan(TenThousand)) {
    return {
      value: value.toFormat(),
      unit: FormattedNumberUnit.WEI,
      tooltipText: `${ethValue.toFormat()}`
    };
  }
  /**
   * Case III: value < 10 Billion Wei OR value < 10 Gwei
   * Return: Gwei value
   */
  if (value.isLessThan(TenBillion)) {
    return {
      value: new BigNumber(fromWei(_value.toString(), 'gwei')).toFormat(),
      unit: FormattedNumberUnit.GWEI,
      tooltipText: `${ethValue.toFormat()}`
    };
  }
  /**
   * Case IV: 0.00000001 ETH <= x < 0.000001 ETH
   * Return: rounded number to 8 dps
   */
  if (value.isLessThan(OneTrillion)) {
    const formatted = getRoundNumber(ethValue, 8);
    return {
      value: formatted.value,
      unit: FormattedNumberUnit.ETH,
      tooltipText: formatted.tooltipText
    };
  }

  /**
   * Case V: x >= 0.000001 ETH
   * Return: formatFloatingPointValue
   */
  const formatted = formatFloatingPointValue(ethValue, 8);
  return {
    value: formatted.value,
    unit: FormattedNumberUnit.ETH,
    tooltipText: formatted.tooltipText
  };
};
/**
 * GROUP V: Gwei (gas) values
 * Converts a floating point WEI value to a FormattedNumber object. Returns formatted value in ETH, Gwei or wei.
 * Show upto 6 decimal points or to the last decimal point. Ie: 1.3 should be shown as 1.3. Follows Group II (formatIntegerValue) if value is greater than 1 million.
 * Use cases: Token Balances / Quantities / Tx fee/ Tx amount
 * @param {any} _value MUST BE IN WEI number to convert takes BigNumber || string || number
 * @returns {object} FormattedNumber with value as formatted string, unit and tooltipText
 */
const formatGasValue = _value => {
  const value = new BigNumber(_value);
  const gweiValue = new BigNumber(fromWei(_value.toString(), 'gwei'));
  const ethValue = new BigNumber(fromWei(_value.toString()));
  const unit = FormattedNumberUnit.GWEI;

  /**
   * Case I: value === 0
   * Return: "0 Gwei"
   */
  if (value.isZero()) {
    return { value: '0', unit };
  }

  /**
   * Case II: x < 0.00001 Gwei
   * Return: number in wei and show tooltip with Gwei value
   */
  if (value.isLessThan(TenThousand)) {
    return {
      value: value.toFormat(),
      unit: FormattedNumberUnit.WEI,
      tooltipText: `${ethValue.toFormat()}`
    };
  }

  /**
   * Case III:  0.00001 Gwei =< X < 1 mil Gwei
   * Return: number in Gwei
   */

  if (gweiValue.isLessThan(OneMillion)) {
    return {
      value: formatFloatingPointValue(gweiValue).value,
      unit: unit,
      tooltipText: `${ethValue.toFormat()}`
    };
  }

  /**
   * Case IV: x >= 1 mill
   * Return: number in eth and show tooltip with Gwei value
   */
  const formatted = formatFloatingPointValue(ethValue);
  return {
    value: formatted.value,
    unit: FormattedNumberUnit.ETH,
    tooltipText: `${formatted.tooltipText}`
  };
};
/**
 * GROUP VI: Percentage values
 * Converts a percentage value to a FormattedNumber
 * @param {any} _value number to convert takes string || number
 * @returns {object} FormattedNumber with value as formatted string, unit and tooltipText
 */
const formatPercentageValue = _value => {
  /* Strip '%' if necessary */
  const value = new BigNumber(_value.toString().replaceAll('%', ''));
  const unit = FormattedNumberUnit.PERCENT;
  /**
   * Case I: value === 0
   * Return: "0%"
   */
  if (value.isZero()) {
    return { value: '0', unit };
  }

  const isNegative = value.isNegative(); // Record whether value is negative
  const absoluteValue = value.absoluteValue(); // Get Absolute value

  /**
   * Case II: |value| > 10000
   * Return: >10,000% or <-10000% and tooltip
   */
  if (absoluteValue.isGreaterThan(TenThousand)) {
    const result = isNegative ? '< -10,000%' : '> 10,000%';
    return {
      value: result,
      unit: unit,
      tooltipText: `${value.toFormat()}%`
    };
  }

  /**
   * Case III: |value| >= 1000
   * Return: whole number and tooltips if has decimal points
   */
  if (absoluteValue.isGreaterThanOrEqualTo(1000)) {
    const dps = value.decimalPlaces();
    return {
      value: `${value.toFormat(0)}%`,
      unit: unit,
      tooltipText: dps ? `${value.toFormat()}%` : undefined
    };
  }

  /**
   * Case IV: |value| >= 0.01
   * Return: rounded to 2 decimal points number and tooltip if > 2 decimal points
   */
  if (absoluteValue.isGreaterThanOrEqualTo(0.01)) {
    return { value: `${getRoundNumber(value, 2, true).value}%`, unit: unit };
  }

  /**
   * Case V: |value| >= 0.01
   * Return: rounded to 2 decimal points number and tooltip if > 2 decimal points
   */
  if (absoluteValue.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
    return { value: `${getRoundNumber(value, 6).value}%`, unit: unit };
  }

  /**
   * Case VI: If |value| < 0.000001
   * Return: '>-0.000001' '<0.000001'r and tooltip
   */
  const result = isNegative ? '> -0.000001%' : '< 0.000001%';
  return { value: result, unit: unit, tooltipText: `${value.toFormat()}%` };
};

/**
 * GROUP VII: Fiat Values
 * Converts a fiat value to a FormattedNumber
 * Shows upto 6 decimal points or to the last decimal point on 0.000001 <= X < 0.01.
 * Shows 2 decimal points or to the last decimal point on 0.01 <= X < 1,000,000.
 * @param _value: BigNumber
 * @returns Object FormattedNumber with value as formatted string and tooltipText
 */
const formatFiatValue = _value => {
  const value = new BigNumber(_value);
  /**
   * Case I: value === 0
   * Return: "$0.00"
   */
  if (value === undefined || value.isZero() || value.isNaN()) {
    return { value: '0.00' };
  }

  /**
   * Case II: value >= 1,000,000
   * Return: formated integer value with tooltip
   */
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    return formatIntegerValue(value);
  }

  /**
   * Case V: value > 0.04
   * Return: rounded number up to 2 decimal points,  no tooltip
   */
  if (value.isGreaterThanOrEqualTo(SmallFiatBreakpoint)) {
    return { value: getRoundNumber(value, 2, true).value };
  }

  /**
   * Case VI: 0.000001  <= value < 0.01
   * Return: rounded number up to 6 decimal points", no tooltip
   */
  if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
    return { value: getRoundNumber(value, 6).value };
  }

  /**
   * Case V: value < 0.0000001
   * Return: string "< $0.0000001" and tooltip with full value with tooltip
   */
  return { value: `< ${SmallNumberBreakpoint}`, tooltipText: value.toFormat() };
};

/**
 * ---------------------------------
 * Helper Functions
 * Do not export then to use in formatting strings
 * ---------------------------------
 */

/**
 * Helper function. Converts a value to Millions in FormattedNumber object
 * @param {BigNumber} value - number to convert takes BigNumber || string || number 1000
 * @return {object} - FormatterNumber
 */
const convertToMillions = value => {
  const result = value.dividedBy(OneMillion);
  return {
    value: `${getRoundNumber(result, 4).value}${FormattedNumberUnit.M}`,
    tooltipText: value.toFormat()
  };
};

/**
 * Helper function. Converts a value to Billions in FormattedNumber object
 * @param {BigNumber} value - number to convert takes BigNumber || string || number
 * @return {object} - FormatterNumber
 */
const convertToBillions = value => {
  const result = value.dividedBy(OneBillion);
  return {
    value: `${getRoundNumber(result, 4).value}${FormattedNumberUnit.B}`,
    tooltipText: value.toFormat()
  };
};
/**
 * Helper function. Converts a value to Trillions in FormattedNumber object
 * @param {BigNumber} value - number to convert takes BigNumber || string || number
 * @return {object} - FormatterNumber
 */
const convertToTrillions = value => {
  const result = value.dividedBy(OneTrillion);
  return {
    value: `${getRoundNumber(result, 4).value}${FormattedNumberUnit.T}`,
    tooltipText: value.toFormat()
  };
};

/**
 * Helper function. returns Quadrillion in FormattedNumber object
 * @param {BigNumber} value - number to convert takes BigNumber || string || number
 * @return {object} - FormatterNumber
 */
const convertToQuadrillion = value => {
  return {
    value: '> 1Q',
    unit: FormattedNumberUnit.Q,
    tooltipText: value.toFormat()
  };
};

/**
 * Helper function. Rounds a value to specified decimal points and tooltip with full value if > more decimal points then round
 * @param {BigNumber} value - number to convert takes BigNumber || string || number
 * @param {number} round - how many decimal points to round the number
 * @param {boolean} hasTrailingZeros - set this to true, if you want to dispaly trailing zeros ie: desired result 12.3000 instead of 12.3
 * @return {object} - FormatterNumber
 */
const getRoundNumber = (value, round, hasTrailingZeros = false) => {
  const dps = value.decimalPlaces();
  return {
    value: hasTrailingZeros
      ? value.decimalPlaces(round).toFormat(round)
      : value.decimalPlaces(round).toFormat(),
    tooltipText: dps > round ? value.toFormat() : undefined
  };
};

/*****************************************
 * handeles edgecases for web3 util toBN
 * @param {number} number - expects number, handles non numbers
 * @return {BigNumber} BN from web3
 *****************************************/

const toBNSafe = number => {
  if (isNaN(number) || isNull(number) || number === undefined || number === '')
    number = 0;
  number = toBN(new BigNumber(number).toFixed(0));
  return number;
};

export {
  formatIntegerToString,
  formatIntegerValue,
  formatFloatingPointValue,
  formatFiatValue,
  formatBalanceEthValue,
  formatPercentageValue,
  formatGasValue,
  toBNSafe
};
