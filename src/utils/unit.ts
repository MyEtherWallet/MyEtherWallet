/*
Primary Attribution
Richard Moore <ricmoo@me.com>
https://github.com/ethers-io

Note, Richard is a god of ether gods. Follow and respect him, and use Ethers.io!
*/

import BN from 'bn.js'

const zero = new BN(0)
const negative1 = new BN(-1)

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {number} decimals the unit to convert to, default ether
 * @returns {BN} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */

const getValueOfUnit = (decimals: number) => {
  return new BN(10).pow(new BN(decimals))
}

const numberToString = (arg: string | number | BigNumber) => {
  if (typeof arg === 'string') {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        `while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`,
      )
    }
    return arg
  } else if (typeof arg === 'number') {
    return String(arg)
  } else if (
    typeof arg === 'object' &&
    arg.toString &&
    // @ts-expect-error this checks for BigNumber or similar libraries
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision())
    }
    return arg.toString(10)
  }
  throw new Error(
    `while converting number to string, invalid number value '${arg}' type ${typeof arg}.`,
  )
}

/**
 * wei -> eth
 * @param {*} weiInput
 * @param {*} decimals
 * @param {*} optionsInput
 * @returns String
 */

const fromBase = (weiInput: string | number, decimals: number, optionsInput?: { pad?: boolean, commify?: boolean }) => {
  let wei = new BN(weiInput)
  const negative = wei.lt(zero)
  const base = getValueOfUnit(decimals)
  const baseLength = base.toString().length - 1 || 1
  const options = optionsInput || {}

  if (negative) {
    wei = wei.mul(negative1)
  }

  let fraction: string = wei.mod(base).toString(10)

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`
  }
  if (!options.pad) {
    const match = fraction.match(/^([0-9]*[1-9]|0)(0*)/)
    if (match) {
      fraction = match[1]
    }
  }

  let whole = wei.div(base).toString(10)

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  let value = `${whole}${fraction == '0' ? '' : `.${fraction}`}`

  if (negative) {
    value = `-${value}`
  }

  return value
}
/**
 * eth -> wei
 * @param {*} etherInput
 * @param {*} decimals
 * @returns String wei
 */
const toBase = (etherInput: string | number, decimals: number) => {
  let ether = numberToString(etherInput)
  const base = getValueOfUnit(decimals)
  const baseLength = base.toString().length - 1 || 1

  // Is it negative?
  const negative = ether.substring(0, 1) === '-'
  if (negative) {
    ether = ether.substring(1)
  }

  if (ether === '.') {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei, invalid value`,
    )
  }

  // Split it into a whole and fractional part
  const comps = ether.split('.')
  if (comps.length > 2) {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei,  too many decimal points`,
    )
  }

  let whole: BN | string = comps[0],
    fraction: BN | string = comps[1]

  if (!whole) {
    whole = '0'
  }
  if (!fraction) {
    fraction = '0'
  }
  if (fraction.length > baseLength) {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei, too many decimal places`,
    )
  }

  while (fraction.length < baseLength) {
    fraction += '0'
  }

  whole = new BN(whole)
  fraction = new BN(fraction)
  let wei = whole.mul(base).add(fraction)

  if (negative) {
    wei = wei.mul(negative1)
  }

  return wei.toString()
}

export { fromBase, toBase }
