import { ROBINHOOD } from '../types';
export default {
  type: ROBINHOOD,
  service: 'publicnode.com-ws',
  url: 'wss://robinhood-rpc.publicnode.com',
  port: 443,
  auth: false,
  username: '',
  password: ''
};
