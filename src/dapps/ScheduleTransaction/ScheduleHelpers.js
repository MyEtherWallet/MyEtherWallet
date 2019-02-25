import BigNumber from 'bignumber.js';
import { Toast } from '@/helpers';
import { Util } from '@ethereum-alarm-clock/lib';
import * as unit from 'ethjs-unit';

const EAC_SCHEDULING_CONFIG = {
  FEE: new BigNumber('0'),
  TOKEN_TRANSFER_ADDITIONAL_GAS: new BigNumber('20000'),
  TOKEN_SCHEDULING_GAS_LIMIT: new BigNumber('1500000'),
  FUTURE_GAS_LIMIT: new BigNumber('1000000'),
  TIME_BOUNTY_MIN: new BigNumber('1'),
  TIME_BOUNTY_DEFAULTS: ['0.01', '0.02', '0.03'],
  BOUNTY_TO_DEPOSIT_MULTIPLIER: 2,
  SUPPORTED_MODES: [
    {
      name: 'Date & Time',
      executionWindow: {
        min: 5,
        default: 10
      },
      unit: 'Minutes'
    },
    {
      name: 'Block Number',
      executionWindow: {
        min: 20,
        default: 90
      },
      unit: 'Blocks'
    }
  ],
  TOKEN_TRANSFER_METHOD_ID: '23b872dd',
  APPROVE_TOKEN_TRANSFER_METHOD_ID: '095ea7b3'
};

const calcSchedulingTotalCost = ({
  gasPrice,
  gasLimit,
  futureGasLimit,
  futureGasPrice,
  timeBounty
}) => {
  const deployCost = gasPrice.times(gasLimit);
  const futureExecutionCost = timeBounty.plus(
    futureGasLimit.times(futureGasPrice)
  );
  return deployCost.plus(futureExecutionCost).plus(EAC_SCHEDULING_CONFIG.FEE);
};

const canBeConvertedToWei = (web3, string, denomination = 'ether') => {
  try {
    web3.utils.toWei(string.toString(), denomination);
  } catch (e) {
    if (
      !e.message.includes('too many decimal places') ||
      !e.message.includes(`invalid number value ''`)
    ) {
      Toast.responseHandler(e, false);
    }
    return false;
  }
  return true;
};

const estimateBountyForGasPrice = (gasPrice, futureGasLimit) => {
  const estimatedWei = Util.estimateBountyForExecutionGasPrice(
    new BigNumber(unit.toWei(Math.round(gasPrice).toString(), 'gwei')),
    new BigNumber(futureGasLimit.toString()),
    new BigNumber(unit.toWei('0', 'gwei'))
  );

  const estimatedEth = unit.fromWei(estimatedWei.toString(), 'ether');

  // Estimate the number of decimals to show
  let decimalPoints = 0;
  if (estimatedEth.substring(0, 2) === '0.') {
    let endFound = false;

    let i = estimatedEth.length;
    while (i && !endFound) {
      i -= 1;
      const char = estimatedEth.charAt(estimatedEth.length - i - 1);
      if (char !== '0' && char !== '.') {
        endFound = true;
        break;
      }
      decimalPoints += 1;
    }
  }

  return parseFloat(estimatedEth).toFixed(decimalPoints);
};

export {
  calcSchedulingTotalCost,
  canBeConvertedToWei,
  EAC_SCHEDULING_CONFIG,
  estimateBountyForGasPrice
};
