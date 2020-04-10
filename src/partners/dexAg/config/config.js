import { swapNotificationStatuses as notificationStatuses } from '../../partnersConfig/config';

const statuses = {
  new: 'new',
  waiting: 'waiting',
  confirming: 'confirming',
  exchanging: 'exchanging',
  sending: 'sending',
  finished: 'finished',
  failed: 'failed',
  refunded: 'refunded',
  overdue: 'overdue',
  hold: 'hold'
};

const TIME_SWAP_VALID = 300;
const PROVIDER_NAME = 'dexag';
const PROXY_CONTRACT_ADDRESS = '0x05c449fb434183ef6702e3ff137c1e13cb90943e';
const WETH_TOKEN_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const SUPPORTED_DEXES = [
  'uniswap', //ETH to Token -> OK, Token to Token ->
  'bancor', //ETH to Token -> , Token to Token ->
  'kyber', //ETH to Token -> , Token to Token ->
  'zero_x', //ETH to Token -> OK , Token to Token ->  | (did have 1 eth-> token fail revert)
  'radar-relay', //ETH to Token -> , Token to Token ->
  'oasis', //ETH to Token -> OK, Token to Token ->  | (did have 1 eth-> token fail revert)
  'synthetix', //ETH to Token -> , Token to Token ->
  'curvefi' //ETH to Token -> , Token to Token ->
];

export {
  PROXY_CONTRACT_ADDRESS,
  WETH_TOKEN_ADDRESS,
  notificationStatuses,
  statuses,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  SUPPORTED_DEXES
};
