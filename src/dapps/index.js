import domainSale from '@/assets/images/icons/domain-sale.svg';
import domainSaleHov from '@/assets/images/icons/domain-sale-hov.svg';
import manageEns from '@/assets/images/icons/domain.svg';
import manageEnsHov from '@/assets/images/icons/domain-hov.svg';
import scheduleTransaction from '@/assets/images/icons/eac.svg';
import scheduleTransactionHov from '@/assets/images/icons/eac-hov.svg';
import makerdai from '@/assets/images/icons/dapps/makerdai.svg';
import makerdaiDisabled from '@/assets/images/icons/dapps/makerdai-disabled.svg';
import ambrpay from '@/assets/images/icons/dapps/ambrpay.png';
import ambrpayDisabled from '@/assets/images/icons/dapps/ambrpay-disabled.png';
import aave from '@/assets/images/icons/dapps/aave.svg';
import { ETH, GOERLI, ROP, RIN, KOV } from '@/networks/types';

const dapps = {
  manageEns: {
    route: '/interface/dapps/manage-ens',
    icon: manageEns,
    iconDisabled: manageEnsHov,
    title: 'ens.title',
    desc: 'ens.dapp-desc',
    supportedNetworks: [ETH.name, GOERLI.name, ROP.name, RIN.name],
    lastUpdated: '11/06/2019',
    releaseDate: '10/05/2018'
  },
  domainSale: {
    route: '/interface/dapps/name-wallet',
    icon: domainSale,
    iconDisabled: domainSaleHov,
    title: 'subDomain.title',
    desc: 'subDomain.dapp-desc',
    supportedNetworks: [ETH.name],
    lastUpdated: '09/20/2019',
    releaseDate: '10/08/2018'
  },
  scheduleTransaction: {
    route: '/interface/dapps/schedule-transaction',
    icon: scheduleTransaction,
    iconDisabled: scheduleTransactionHov,
    title: 'scheduleTx.title',
    desc: 'scheduleTx.dapp-desc',
    supportedNetworks: [ETH.name, KOV.name],
    lastUpdated: '10/28/2019',
    releaseDate: '02/21/2019'
  },
  maker: {
    route: '/interface/dapps/maker-dai',
    icon: makerdai,
    iconDisabled: makerdaiDisabled,
    title: 'dappsMaker.maker_title',
    desc: 'dappsMaker.maker_desc',
    supportedNetworks: [ETH.name, KOV.name],
    lastUpdated: '08/14/2019',
    releaseDate: '06/14/2019'
  },
  makerOld: {
    route: '/interface/dapps/maker-sai',
    icon: makerdai,
    iconDisabled: makerdaiDisabled,
    title: 'dappsMaker.maker_title_old',
    desc: 'dappsMaker.maker_desc_sai',
    supportedNetworks: [ETH.name, KOV.name],
    lastUpdated: '08/14/2019',
    releaseDate: '06/14/2019'
  },
  ambrpay: {
    route: '/interface/dapps/ambrpay',
    icon: ambrpay,
    iconDisabled: ambrpayDisabled,
    title: 'dappsAmbrpay.title',
    desc: 'dappsAmbrpay.ambrpay-popover',
    supportedNetworks: [ETH.name, KOV.name],
    lastUpdated: '11/05/2019',
    releaseDate: '11/05/2019'
  },
  aave: {
    route: '/interface/dapps/aave',
    icon: aave,
    // iconDisabled: aaveDisabled,
    title: 'dappsAave.title',
    desc: 'dappsAave.popover',
    supportedNetworks: [ETH.name]
    // lastUpdated: '11/05/2019',
    // releaseDate: '11/05/2019'
  }
};

export default dapps;
