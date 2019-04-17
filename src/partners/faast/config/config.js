import {
  swapNotificationStatuses as notificationStatuses,
  faastApi
} from '../../partnersConfig/config';

const supportedNetworks = ['ETH'];

const statuses = {
  awaitingDeposit: 'awaiting deposit',
  awaitingNetworkConfirmation: 'awaiting network confirmation',
  received: 'received',
  withdrawing: 'withdrawing',
  complete: 'complete',
  cancelled: 'cancelled',
  refunding: 'refunding',
  refunded: 'refunded'
};

const host = process.env.FAAST_API_HOST || faastApi;

const TIME_SWAP_VALID = 300;
const PROVIDER_NAME = 'faast';
const FEE_RATE = 0.5;
const AFFILIATE_ID = 'MyEtherWallet';

export {
  notificationStatuses,
  supportedNetworks,
  statuses,
  host,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  FEE_RATE,
  AFFILIATE_ID
};
