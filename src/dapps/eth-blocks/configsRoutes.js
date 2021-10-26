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

const MY_BLOCKS_PATH = '/wallet/dapps/eth-blocks/my-blocks';

/**
 * Method executes before route is set to : ie: wallet/dapps/eth-blocks/block/130567789
 *  - Checks whether or not blockRef is a positive integer
 *  - Checks if router FROM was my-blocks and sets  prop hasSearch to false
 */
const blockGuard = (to, from, next) => {
  if (validBlockNumber(to.params.blockRef)) {
    if (from.path === MY_BLOCKS_PATH) {
      to.params.hasSearch = false;
    }
    next();
  } else {
    //NOTE: kicks out completely if you are logged in
    next({ name: ETH_BLOCKS_ROUTE.CORE.NAME });
  }
};

export { ETH_BLOCKS_ROUTE, blockGuard };
