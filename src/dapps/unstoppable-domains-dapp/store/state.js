import UResolution from '@/dapps/unstoppable-domains-dapp/handlers/resolution.js';
const EMPTY_DOMAIN = {
  name: '',
  available: false,
  price: 0
};

const resolution = new UResolution();

const state = {
  currentDomain: EMPTY_DOMAIN,
  email: 'mew@unstoppabledomains.com',
  udBaseUrl: 'https://unstoppabledomains.com/api',
  resellerId: 'myetherwallet',
  myDomains: [],
  order: {},
  resolution,
  manageRecordDomain: { name: '' },
  activeOverlay: ''
};

export default state;
