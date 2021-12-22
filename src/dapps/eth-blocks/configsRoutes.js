import { validBlockNumber } from './handlers/helpers/common';
import moment from 'moment';

const ETH_BLOCKS_ROUTE = {
  CORE: {
    NAME: 'EthBlocks',
    PATH: 'eth-blocks'
  },
  BLOCK: {
    NAME: 'EthBlocksBlock',
    PATH: 'block/:blockRef'
  },
  DATE_SEARCH: {
    NAME: 'EthBlocksDateSearch',
    PATH: 'date/:dateString'
  },
  MY_BLOCKS: {
    NAME: 'EthBlocksMyBlocks',
    PATH: 'my-blocks'
  },
  BATCH_MINTING: {
    NAME: 'EthBlocksBatchMinting',
    PATH: 'batch'
  }
};

/**
 * Method executes before route is set to : ie: wallet/dapps/eth-blocks/block/130567789
 *  - Checks whether or not blockRef is a positive integer
 *  - Checks if router FROM was my-blocks and sets  prop hasSearch to false
 */
const blockGuard = (to, from, next) => {
  if (to.params.blockRef && validBlockNumber(to.params.blockRef)) {
    next();
  } else {
    //NOTE: kicks out completely if you are logged in
    next({ name: ETH_BLOCKS_ROUTE.CORE.NAME });
  }
};

const myBlocksProps = route => {
  if (route.query && route.query.block) {
    const block = route.query.block;
    const blockNumber = validBlockNumber(block) ? block : '';
    return {
      blockRef: blockNumber
    };
  }
  return {
    blockRef: ''
  };
};

const dateSearchGuard = (to, from, next) => {
  if (
    to.params.dateString &&
    moment(to.params.dateString).isBefore(moment().subtract(10, 'minutes')) && // only allow date from 10 mins before now
    moment(to.params.dateString).isAfter(moment('07-30-2015 15:26:13')) // only allow date after 1st block mined
  ) {
    next();
  } else {
    //NOTE: kicks out completely if you are logged in
    next({ name: ETH_BLOCKS_ROUTE.CORE.NAME });
  }
};

export { ETH_BLOCKS_ROUTE, blockGuard, myBlocksProps, dateSearchGuard };
