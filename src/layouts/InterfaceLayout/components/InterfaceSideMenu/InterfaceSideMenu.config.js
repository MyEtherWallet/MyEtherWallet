import { Misc } from '@/helpers';

const config = {
  tabs: [
    {
      name: 'dashboard',
      onlineOnly: false,
      routes: ['/interface/dashboard', '/interface'],
      icons: {
        active: require('@/assets/images/sidemenu/dashboard-active.svg'),
        inactive: require('@/assets/images/sidemenu/dashboard.svg')
      },
      titleKey: 'interface.menu.dashboard',
      children: []
    },
    {
      name: 'send-transaction',
      onlineOnly: false,
      routes: [
        '/interface/send-transaction',
        '/interface/send-offline',
        '/interface/send-offline/generate-info',
        '/interface/send-offline/generate-tx',
        '/interface/send-offline/send-tx',
        '/interface/nft-manager'
      ],
      icons: {
        active: require('@/assets/images/sidemenu/send-active.svg'),
        inactive: require('@/assets/images/sidemenu/send.svg')
      },
      titleKey: 'interface.menu.send',
      children: [
        {
          name: 'send-transaction',
          routes: ['/interface/send-transaction'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'sendTx.send-tx'
        },
        {
          name: 'send-offline',
          routes: [
            '/interface/send-offline',
            '/interface/send-offline/generate-info',
            '/interface/send-offline/generate-tx',
            '/interface/send-offline/send-tx'
          ],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'sendTx.send-offline'
        },
        {
          name: 'nft-manager',
          onlineOnly: true,
          routes: ['/interface/nft-manager'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'interface.menu.ntf'
        }
      ]
    },
    {
      name: 'swap',
      onlineOnly: true,
      routes: ['/interface/swap'],
      icons: {
        active: require('@/assets/images/sidemenu/swap-active.svg'),
        inactive: require('@/assets/images/sidemenu/swap.svg')
      },
      titleKey: 'common.swap',
      children: []
    },
    {
      name: 'dapps',
      onlineOnly: true,
      routes: [
        '/interface/dapps',
        '/interface/dapps/manage-ens',
        '/interface/dapps/manage-ens/owned',
        '/interface/dapps/manage-ens/forbidden',
        '/interface/dapps/manage-ens/manage',
        '/interface/dapps/manage-ens/fifs',
        '/interface/dapps/manage-ens/claim',
        '/interface/dapps/manage-ens/dns-error',
        '/interface/dapps/manage-ens/no-txt-setup',
        '/interface/dapps/manage-ens/transfer-registrar',
        '/interface/dapps/manage-ens/create-commitment',
        '/interface/dapps/manage-ens/permanent-registration',
        '/interface/dapps/domain-sale',
        '/interface/dapps/schedule-transaction',
        '/interface/dapps/maker-dai'
      ],
      icons: {
        active: require('@/assets/images/sidemenu/dapps-active.svg'),
        inactive: require('@/assets/images/sidemenu/dapps.svg')
      },
      titleKey: 'common.dapps',
      children: []
    },
    {
      name: 'contracts',
      onlineOnly: true,
      routes: [
        '/interface/interact-with-contract',
        '/interface/deploy-contract'
      ],
      icons: {
        active: require('@/assets/images/sidemenu/contract-active.svg'),
        inactive: require('@/assets/images/sidemenu/contract.svg')
      },
      titleKey: 'interface.menu.contract',
      children: [
        {
          name: 'interact-with-contract',
          routes: ['/interface/interact-with-contract'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'interface.menu.interact-contract'
        },
        {
          name: 'deploy-contract',
          routes: ['/interface/deploy-contract'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'interface.menu.deploy'
        }
      ]
    },
    {
      name: 'messages',
      onlineOnly: false,
      routes: ['/interface/sign-message', '/interface/verify-message'],
      icons: {
        active: require('@/assets/images/sidemenu/message-active.svg'),
        inactive: require('@/assets/images/sidemenu/message.svg')
      },
      titleKey: 'interface.menu.message',
      children: [
        {
          name: 'sign-message',
          routes: ['/interface/sign-message'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'interface.menu.sign-message'
        },
        {
          name: 'verify-message',
          routes: ['/interface/verify-message'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'verifyMessage.title'
        }
      ]
    }
  ]
};
if (Misc.isMewCx()) {
  const tabIdx = config.tabs.findIndex(item => {
    return item.name === 'send-transaction';
  });
  const newArr = [];
  config.tabs[tabIdx].children.forEach(item => {
    if (item.name !== 'send-offline') {
      newArr.push(item);
    }
  });

  config.tabs[tabIdx].children = newArr;
}
export default config;
