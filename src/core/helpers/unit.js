/*
Primary Attribution
Richard Moore <ricmoo@me.com>
https://github.com/ethers-io

Note, Richard is a god of ether gods. Follow and respect him, and use Ethers.io!
*/

import { toBN } from 'web3-utils';

const zero = toBN(0);
const negative1 = toBN(-1);

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {number} decimals the unit to convert to, default ether
 * @returns {BN} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */

const getValueOfUnit = decimals => {
  return toBN(10).pow(toBN(decimals));
};

const numberToString = arg => {
  if (typeof arg === 'string') {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        `while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`
      );
    }
    return arg;
  } else if (typeof arg === 'number') {
    return String(arg);
  } else if (
    typeof arg === 'object' &&
    arg.toString &&
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    }
    return arg.toString(10);
  }
  throw new Error(
    `while converting number to string, invalid number value '${arg}' type ${typeof arg}.`
  );
};

/**
 * wei -> eth
 * @param {*} weiInput
 * @param {*} decimals
 * @param {*} optionsInput
 * @returns String
 */

const fromBase = (weiInput, decimals, optionsInput) => {
  let wei = toBN(weiInput);
  const negative = wei.lt(zero);
  const base = getValueOfUnit(decimals);
  const baseLength = base.toString().length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    wei = wei.mul(negative1);
  }

  let fraction = wei.mod(base).toString(10);

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }
  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  let whole = wei.div(base).toString(10);

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // eslint-disable-line
  }

  let value = `${whole}${fraction == '0' ? '' : `.${fraction}`}`;

  if (negative) {
    value = `-${value}`;
  }

  return value;
};
/**
 * eth -> wei
 * @param {*} etherInput
 * @param {*} decimals
 * @returns String wei
 */
const toBase = (etherInput, decimals) => {
  let ether = numberToString(etherInput);
  const base = getValueOfUnit(decimals);
  const baseLength = base.toString().length - 1 || 1;

  // Is it negative?
  const negative = ether.substring(0, 1) === '-';
  if (negative) {
    ether = ether.substring(1);
  }

  if (ether === '.') {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei, invalid value`
    );
  }

  // Split it into a whole and fractional part
  const comps = ether.split('.');
  if (comps.length > 2) {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei,  too many decimal points`
    );
  }

  let whole = comps[0],
    fraction = comps[1];

  if (!whole) {
    whole = '0';
  }
  if (!fraction) {
    fraction = '0';
  }
  if (fraction.length > baseLength) {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei, too many decimal places`
    );
  }

  while (fraction.length < baseLength) {
    fraction += '0';
  }

  whole = toBN(whole);
  fraction = toBN(fraction);
  let wei = whole.mul(base).add(fraction);

  if (negative) {
    wei = wei.mul(negative1);
  }

  return wei.toString();
};

export { fromBase, toBase };
