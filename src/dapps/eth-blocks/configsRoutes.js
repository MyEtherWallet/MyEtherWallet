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
  MY_BLOCKS: {
    NAME: 'EthBlocksMyBlocks',
    PATH: 'my-blocks'
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
  } else if (
    to.params.dateSearch &&
    moment(to.params.dateSearch).isAfter(moment().subtract(10, 'minutes')) && // only allow date from 10 mins before current
    moment(to.params.dateSearch).isAfter(moment('07-30-2015 15:26:13')) // only allow date after 1st block mined
  ) {
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

export { ETH_BLOCKS_ROUTE, blockGuard, myBlocksProps };
