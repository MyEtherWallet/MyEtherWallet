import { validBlockNumber } from './handlers/helpers/common';

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
  if (validBlockNumber(to.params.blockRef)) {
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
      block: blockNumber
    };
  }
  return {
    block: ''
  };
};

export { ETH_BLOCKS_ROUTE, blockGuard, myBlocksProps };
