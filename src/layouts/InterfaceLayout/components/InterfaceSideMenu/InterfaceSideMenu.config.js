export default {
  tabs: [
    {
      name: 'send-transaction',
      onlineOnly: false,
      routes: [
        '/interface/send-transaction',
        '/interface',
        '/interface/send-offline',
        '/interface/send-offline/generate-info',
        '/interface/send-offline/generate-tx',
        '/interface/send-offline/send-tx'
      ],
      icons: {
        active: require('@/assets/images/sidemenu/send-active.svg'),
        inactive: require('@/assets/images/sidemenu/send.svg')
      },
      titleKey: 'interface.txSideMenuTitle',
      children: [
        {
          name: 'send-transaction',
          routes: ['/interface/send-transaction', '/interface'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'common.sendTx'
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
          titleKey: 'common.offline'
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
        '/interface/dapps/manage-ens/auction',
        '/interface/dapps/manage-ens/bid',
        '/interface/dapps/manage-ens/owned',
        '/interface/dapps/manage-ens/reveal',
        '/interface/dapps/manage-ens/forbidden',
        '/interface/dapps/manage-ens/finalize',
        '/interface/dapps/manage-ens/manage',
        '/interface/dapps/manage-ens/fifs',
        '/interface/dapps/manage-ens/claim',
        '/interface/dapps/manage-ens/dns-error',
        '/interface/dapps/manage-ens/no-txt-setup',
        '/interface/dapps/manage-ens/transfer-registrar',
        '/interface/dapps/manage-ens/create-commitment',
        '/interface/dapps/manage-ens/permanent-registration',
        '/interface/dapps/domain-sale',
        '/interface/dapps/schedule-transaction'
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
      titleKey: 'interface.txSideMenuContract',
      children: [
        {
          name: 'interact-with-contract',
          routes: ['/interface/interact-with-contract'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'common.interactWcontract'
        },
        {
          name: 'deploy-contract',
          routes: ['/interface/deploy-contract'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'common.depContract'
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
      titleKey: 'interface.txSideMenuMessage',
      children: [
        {
          name: 'sign-message',
          routes: ['/interface/sign-message'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'common.signMessage'
        },
        {
          name: 'verify-message',
          routes: ['/interface/verify-message'],
          icons: {
            active: '',
            inactive: ''
          },
          titleKey: 'common.verifyMessage'
        }
      ]
    }
  ]
};
