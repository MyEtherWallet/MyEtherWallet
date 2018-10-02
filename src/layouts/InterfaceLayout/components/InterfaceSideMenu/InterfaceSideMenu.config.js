export default {
  tabs: [
    {
      name: 'send-transaction',
      routes: [
        '/interface/send-transaction',
        '/interface',
        '/interface/send-offline-transaction'
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
          name: 'send-offline-transaction',
          routes: ['/interface/send-offline-transaction'],
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
      routes: [
        '/interface/dapps',
        '/interface/dapps/register-domain',
        '/interface/dapps/register-domain/bid',
        '/interface/dapps/register-domain/reveal',
        '/interface/dapps/register-domain/owned',
        '/interface/dapps/register-domain/forbidden',
        '/interface/dapps/register-domain/auction',
        '/interface/dapps/register-domain/confirm',
        '/interface/dapps/domain-sale'
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
