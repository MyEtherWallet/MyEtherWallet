import DappRoutes from '@/dapps/routes-dapps.js';
import { swapProps, swapRouterGuard } from './helpers';
import { ROUTES_WALLET } from '../configs/configRoutes';
import StakeRoute from '@/core/router/routes-staking.js';
export default {
  path: '/wallet',
  component: () => import('@/views/TheWalletView'),
  props: true,
  children: [
    {
      path: ROUTES_WALLET.WALLETS.PATH,
      name: ROUTES_WALLET.WALLETS.NAME,
      component: () => import('@/views/layouts-wallet/TheDashboardLayout'),
      meta: {
        noAuth: false,
        title: 'Crypto Portfolio Manager | MyEtherWallet',
        description:
          'Manage your crypto portfolio with MyEtherWallet. View all your crypto assets in one easy to use portfolio manager.'
      }
    },
    {
      path: ROUTES_WALLET.DASHBOARD.PATH,
      name: ROUTES_WALLET.DASHBOARD.NAME,
      component: () => import('@/views/layouts-wallet/TheDashboardLayout'),
      meta: {
        noAuth: false,
        title: 'Crypto Portfolio Manager | MyEtherWallet',
        description:
          'Manage your crypto portfolio with MyEtherWallet. View all your crypto assets in one easy to use portfolio manager.'
      }
    },
    {
      path: ROUTES_WALLET.SETTINGS.PATH,
      name: ROUTES_WALLET.SETTINGS.NAME,
      component: () => import('@/modules/settings/ModuleSettings'),
      meta: {
        noAuth: false,
        title: 'Modify Your Settings | MyEtherWallet',
        description:
          'Manage your settings on MyEtherWallet. We heard you like dark mode crypto apps.'
      }
    },
    {
      path: ROUTES_WALLET.PRINT.PATH,
      name: ROUTES_WALLET.PRINT.NAME,
      component: () => import('@/modules/balance/ModulePaperWallet'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SEND_TX.PATH,
      name: ROUTES_WALLET.SEND_TX.NAME,
      component: () =>
        import('@/views/layouts-wallet/TheSendTransactionLayout'),
      props: true,
      meta: {
        noAuth: false,
        title: 'Send And Receive Crypto | MyEtherWallet',
        description:
          'Send and receive crypto to your self custody wallet using MyEtherWallet. Open sourced, safe and secure EVM wallet.'
      }
    },
    {
      path: ROUTES_WALLET.NFT_MANAGER.PATH,
      name: ROUTES_WALLET.NFT_MANAGER.NAME,
      component: () => import('@/views/layouts-wallet/TheNFTManagerLayout'),
      children: [
        {
          path: ROUTES_WALLET.NFT_MANAGER_SEND.PATH,
          name: ROUTES_WALLET.NFT_MANAGER_SEND.NAME,
          component: () =>
            import('@/modules/nft-manager/components/NftManagerSend'),
          meta: {
            noAuth: false,
            title: 'Send Your NFTs on MyEtherWallet',
            description:
              "Send your NFTs easily on MyEtherWallet. From Bored Apes to Doodles and everything in between, we've got you."
          }
        }
      ],
      meta: {
        noAuth: false,
        title: 'Manage Your NFTs | View Your NFTs',
        description:
          'View and send your NFTs on MyEtherWallet. See all your NFTs on multiple chains.'
      }
    },
    {
      path: ROUTES_WALLET.SWAP.PATH,
      name: ROUTES_WALLET.SWAP.NAME,
      component: () => import('@/views/layouts-wallet/TheSwapLayout'),
      props: swapProps,
      beforeEnter: swapRouterGuard,
      meta: {
        noAuth: false,
        title: 'Swap and Trade Crypto | Easy Crypto Trading',
        description:
          'Swap crypto across chains. Trade crypto securely without using a centralized exchange.'
      }
    },
    {
      path: ROUTES_WALLET.STAKE.PATH,
      children: StakeRoute,
      component: () => import('@/views/layouts-wallet/TheDappCenterLayout.vue'),
      meta: {
        noAuth: false,
        title: 'Stake on MyEtherWallet | Staking',
        description:
          'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
      }
    },
    {
      path: ROUTES_WALLET.DAPPS.PATH,
      component: () => import('@/views/layouts-wallet/TheDappCenterLayout.vue'),
      children: DappRoutes,
      meta: {
        noAuth: false,
        title: 'Access DApps on MyEtherWallet | Web3 DApps',
        description:
          'Engage with the featured web3 DApps on MyEtherWallet. Find the next cool crypto project.'
      }
    },
    {
      path: ROUTES_WALLET.DEPLOY_CONTRACT.PATH,
      name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME,
      component: () => import('@/views/layouts-wallet/TheDeployContractLayout'),
      meta: {
        noAuth: false,
        title: 'Deploy Ethereum Contract On MyEtherWallet | MEW',
        description:
          'Deploy a smart contract to the Ethereum mainnet using MyEtherWallet. Trusted by Ethereum developers since 2015. '
      }
    },
    {
      path: ROUTES_WALLET.INTERACT_WITH_CONTRACT.PATH,
      name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME,
      component: () =>
        import('@/views/layouts-wallet/TheInteractContractLayout'),
      meta: {
        noAuth: false,
        title: 'Interact With Ethereum Contracts On MyEtherWallet | MEW',
        description:
          'MyEtherWallet empowers users to interact with Ethereum contracts directly. Collect airdrops, mint tokens and more.'
      }
    },
    {
      path: ROUTES_WALLET.SIGN_MESSAGE.PATH,
      name: ROUTES_WALLET.SIGN_MESSAGE.NAME,
      component: () => import('@/views/layouts-wallet/TheSignMessageLayout'),
      meta: {
        noAuth: false,
        title: 'Use Your Wallet To Sign a Message | MyEtherWallet',
        description:
          'Sign a message with your crypto wallet. Use MyEtherWallet to easily verify ownership of your wallet.'
      }
    },
    {
      path: ROUTES_WALLET.VERIFY_MESSAGE.PATH,
      name: ROUTES_WALLET.VERIFY_MESSAGE.NAME,
      component: () => import('@/views/layouts-wallet/TheVerifyMessageLayout'),
      meta: {
        noAuth: false,
        title: 'Verify A Signed Message With a Crypto Wallet | MyEtherWallet',
        description:
          'Confirm a signed message with your crypto wallet. Access this feature using MyEtherWallet.'
      }
    }
  ]
};
