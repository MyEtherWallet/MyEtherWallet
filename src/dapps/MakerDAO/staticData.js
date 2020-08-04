import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';

export default {
  walletBalanceTableHeaders: [
    {
      text: 'Asset',
      value: 'asset',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'Balance',
      value: 'balance',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'USD Value',
      value: 'value',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: '',
      value: 'btn',
      sortable: false,
      filterable: false,
      containsLink: false,
      width: '100%'
    }
  ],
  walletTableData: [
    {
      asset: 'DAI',
      balance: '15.231234 DAI',
      value: '$12.23',
      btn: 'Send'
    }
  ],
  historyTableHeaders: [
    {
      text: 'Activity',
      value: 'activity',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100px'
    },
    {
      text: 'Date',
      value: 'date',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100px'
    },
    {
      text: 'TX Hash',
      value: 'txHash',
      sortable: true,
      filterable: false,
      containsLink: true,
      width: '150px'
    }
  ],
  historyTableData: [
    {
      activity: 'Deposited 12.00000 DAI',
      date: '01/02/2020, 2:16:32 PM',
      txHash:
        '0x68f6ce1e607d6a6ec6fb1aaa6f43bb8210658f49065ae5a7325c5771ea1100e8'
    },
    {
      activity: 'Deposited 12.00000 DAI',
      date: '01/02/2020, 2:16:32 PM',
      txHash:
        '0x68f6ce1e607d6a6ec6fb1aaa6f43bb8210658f49065ae5a7325c5771ea1100e8'
    }
  ],
  myVaultsTableHeaders: [
    {
      text: 'Token',
      value: 'token',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'Value ID',
      value: 'id',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'Current Ratio',
      value: 'ratio',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'Deposited',
      value: 'deposited',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'Avail. To Withdraw',
      value: 'avail',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: 'DAI',
      value: 'dai',
      sortable: true,
      filterable: false,
      containsLink: false,
      width: '100%'
    },
    {
      text: '',
      value: 'btn',
      sortable: false,
      filterable: false,
      containsLink: false,
      width: '100%'
    }
  ],
  myVaultsTableData: [
    {
      token: 'DAI',
      id: '375',
      ratio: '243.11%',
      deposited: '0.40 ETH',
      avail: '0.15 ETH',
      dai: '30.08 DAI',
      btn: 'Manage'
    }
  ],
  tabs: [{ name: 'Save' }, { name: 'Borrow' }],
  BG: BG,
  balance: {
    total: 20.32,
    data: [
      {
        title: 'sendBal',
        color: 'titlePrimary',
        amount: 5.3,
        tooltip: 'Send: 5.3',
        percentage: '26.08'
      },
      {
        title: 'feeBal',
        color: 'warning darken-1',
        amount: 3.2,
        tooltip: 'Fee: 3.2',
        percentage: '15.75'
      }
    ]
  },
  topBanner: {
    title: 'MakerDAO',
    subtext:
      'DAI is a stable, decentralized currency that does not discriminate. Any business or individual can realize the advantages of digital money.',
    exit: 'Exit Dapp'
  },
  tab: 1
};
