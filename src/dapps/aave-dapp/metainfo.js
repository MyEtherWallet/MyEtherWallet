import { ETH } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
const layout = () =>
  import(/* webpackChunkName: "dapp-aave" */ './TheAaveLayout');
export default {
  title: 'Aave V2',
  subtitle: '',
  description: 'Earn on your deposits and borrow assets',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'aave',
  name: ROUTES_WALLET.AAVE.NAME,
  path: ROUTES_WALLET.AAVE.PATH,
  networks: [ETH],
  layout,
  release: '09/01/2022',
  meta: {
    noAuth: false,
    title: 'Borrow And Lend With Aave on MyEtherWallet',
    description:
      'Earn interest on supplying and borrowing crypto assets using Aave. Earn crypto rewards.'
  }
};
