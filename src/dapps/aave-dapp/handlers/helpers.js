const AAVE_TABLE_TITLE = {
  deposit: 'DEPOSIT',
  borrow: 'BORROW',
  withdraw: 'WITHDRAW',
  repay: 'REPAY',
  balance_deposit: 'BALANCE_DEPOSIT',
  balance_borrow: 'BALANCE_BORROW'
};

const ACTION_TYPES = {
  deposit: 'deposit',
  borrow: 'borrow',
  collateral: 'collateral',
  interest: 'interest',
  withdraw: 'withdraw',
  repay: 'repay',
  switch: 'switch'
};

const INTEREST_TYPES = {
  stable: 'Stable',
  variable: 'Variable'
};

const AAVE_TABLE_BUTTON = {
  deposit: {
    title: 'Deposit',
    btnStyle: 'background',
    colorTheme: 'greenPrimary',
    disabled: false
  },
  swap: {
    title: 'Swap',
    btnStyle: 'outline',
    colorTheme: 'greenPrimary'
  },
  borrow: {
    title: 'Borrow',
    btnStyle: 'background',
    colorTheme: 'greenPrimary'
  },
  withdraw: {
    title: 'Withdraw',
    btnStyle: 'outline',
    colorTheme: 'greenPrimary'
  },
  repay: {
    title: 'Repay',
    btnStyle: 'transparent',
    colorTheme: 'greenPrimary'
  }
};

const AAVE_TABLE_HEADER = {
  deposit: [
    {
      text: 'Token',
      value: 'token',
      sortable: true,
      width: '15%'
    },
    {
      text: 'Available',
      value: 'available',
      sortable: true
    },
    {
      text: 'Deposited',
      value: 'deposited',
      sortable: true
    },
    {
      text: 'APY',
      value: 'apy',
      sortable: false,
      width: '14%'
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      width: '32%'
    }
  ],
  borrow: [
    {
      text: 'Token',
      value: 'token',
      sortable: false,
      width: '15%'
    },
    {
      text: 'Available',
      value: 'available',
      sortable: true
    },
    {
      text: 'Stable APY',
      value: 'stableApy',
      sortable: false,
      width: '15%'
    },
    {
      text: 'Variable APY',
      value: 'variableApy',
      sortable: false,
      width: '15%'
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      width: '32%'
    }
  ],
  balanceDeposit: [
    {
      text: 'Token',
      value: 'token',
      sortable: false,
      filterable: false,
      width: '20%'
    },
    {
      text: 'Deposited',
      value: 'balance',
      sortable: false,
      filterable: false,
      width: '20%'
    },
    {
      text: 'APY',
      value: 'apy',
      sortable: false,
      filterable: false,
      width: '20%'
    },
    {
      text: 'Use as collateral',
      value: 'toggle',
      sortable: false,
      filterable: false,
      width: '10%'
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      filterable: false,
      containsLink: true,
      width: '30%'
    }
  ],
  balanceBorrow: [
    {
      text: 'Token',
      value: 'token',
      sortable: false,
      filterable: false
    },
    {
      text: 'Borrowed',
      value: 'balance',
      sortable: false,
      filterable: false
    },
    {
      text: 'APY',
      value: 'apy',
      sortable: false,
      filterable: false,
      containsLink: true
    },
    {
      text: 'APR Type',
      value: 'toggle',
      sortable: false,
      filterable: false
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      filterable: false,
      containsLink: true,
      width: '32%'
    }
  ]
};

export {
  AAVE_TABLE_TITLE,
  AAVE_TABLE_HEADER,
  AAVE_TABLE_BUTTON,
  ACTION_TYPES,
  INTEREST_TYPES
};
