const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';

const FOOTER_EVENTS = {
  footerAboutUs: 'LP2FooterAboutUs',
  footerCareers: 'LP2Footercareers',
  footerHowItWorks: 'LP2FooterHowItWorks',
  footerTeam: 'LP2FooterTeam',
  footerAdvertiseWithUs: 'LP2FooterAdvertiseWithUs',
  footerPrivacy: 'LP2FooterPrivacy',
  footerTerms: 'LP2FooterTerms',
  footerBugBounty: 'LP2FooterBugBounty',
  footerMobile: 'LP2FooterMewMobileApp',
  footerEnkrypt: 'LP2FooterEnkrypt',
  footerPortfolio: 'LP2FooterPortfolio',
  footerEthvm: 'LP2FooterEthvm',
  footerMewtopia: 'LP2FooterMewtopia',
  footerPressKit: 'LP2FooterPressKit',
  footerHelpCenter: 'LP2FooterHelpCenter',
  footerCustomerSupport: 'LP2FooterCustomerSupport',
  footerSecurityPolicy: 'LP2FooterSecurityPolicy',
  footerVerifyMessage: 'LP2FooterVerifyMessage',
  footerConvertUnits: 'LP2FooterConvertUnits',
  footerSendOfflineHelper: 'LP2FooterSendOfflineHelper',
  footerEthDonation: 'LP2FooterEthDonation',
  footerBtcDonation: 'LP2FooterBtcDonation',
  footerCoinGecko: 'LP2FooterCoinGecko',
  footerJoinMewCommunity: 'LP2JoinCommunity',
  closeMobileMenu: 'LP2CloseMobileMenu',
  otherWaysToCreate: 'LP2OtherWaysToCreate'
};

const fromAmount = '1000000000000000000';
const STATIC_PAIRS = [
  {
    toT: {
      symbol: 'BTC',
      contract: '0xbtc'
    },
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    fromAmount: fromAmount
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDT',
      contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimals: 6
    },
    fromAmount: fromAmount
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'KNC',
      contract: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      toT: 18
    },
    fromAmount: fromAmount
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'DAI',
      contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18
    },
    fromAmount: fromAmount
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'LINK',
      contract: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18
    },
    fromAmount: fromAmount
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDC',
      contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6
    },
    fromAmount: fromAmount
  }
];

const MODES = ['add', 'edit'];

const OPEN_HARDWARE_PASSWORD = 'showHardwarePassword';
const ISSUE_MODAL = 'issueModal';

const USER_INPUT_TYPES = {
  typed: 'TYPED',
  selected: 'SELECTED',
  resolved: 'RESOLVED'
};

const MAX_ADDRESSES = 5;

const STAKEWISE_MIN_GAS_LIMIT = 150000;
const STAKEWISE_REWARD_MIN_GAS_LIMIT = 30000;
const ETH_BLOCKS_MIN_GAS_TRANSFER = 150000;
const ETH_BLOCKS_MIN_GAS_MINT = 350000;

const RARIBLE_CONTRACT = 'token/0x01234567bac6ff94d7e4f0ee23119cf848f93245:';
const RARIBLE = 'https://rarible.com/';
const RARIBLE_TOKEN = `${RARIBLE}${RARIBLE_CONTRACT}`;
const RARIBLE_OWNER = `${RARIBLE}user/`;

const RARIBLE_TEST = 'https://rinkeby.rarible.com/';
const RARIBLE_TEST_TOKEN = `${RARIBLE_TEST}${RARIBLE_CONTRACT}`;
const RARIBLE_TEST_OWNER = `${RARIBLE_TEST}user/`;

const FIVE_MINS = 300000; // 1000 * 60 * 5

export default {
  ETH_TOKEN,
  DAI_TOKEN,
  FOOTER_EVENTS,
  STATIC_PAIRS,
  MODES,
  OPEN_HARDWARE_PASSWORD,
  ISSUE_MODAL,
  USER_INPUT_TYPES,
  MAX_ADDRESSES,
  STAKEWISE_MIN_GAS_LIMIT,
  STAKEWISE_REWARD_MIN_GAS_LIMIT,
  ETH_BLOCKS_MIN_GAS_TRANSFER,
  ETH_BLOCKS_MIN_GAS_MINT,
  RARIBLE_TOKEN,
  RARIBLE_OWNER,
  RARIBLE_TEST_TOKEN,
  RARIBLE_TEST_OWNER,
  FIVE_MINS
};
