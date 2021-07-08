const ROUTES_HOME = {
  Home: { Name: 'Home', Path: '' },
  HowItWorks: { Name: 'HowItWorks', Path: 'how-it-works' },
  SecurityPolicy: { Name: 'SecurityPolicy', Path: 'security-policy' },
  PrivacyPolicy: { Name: 'PrivacyPolicy', Path: 'privacy-policy' },
  TermsOfService: { Name: 'TermsOfService', Path: 'terms-of-service' },
  Tools: { Name: 'Tools', Path: 'tools' },
  BuyHardwareWallet: { Name: 'BuyHardwareWallet', Path: 'company' },
  CompanyPage: { Name: 'CompanyPage', Path: 'company' },
  TeamPage: { Name: 'TeamPage', Path: 'team' },
  PressKit: { Name: 'PressKit', Path: 'presskit' },
  CreateWallet: { Name: 'CreateWallet', Path: 'wallet/create/:overlay?' },
  AccessWallet: { Name: 'AccessWallet', Path: 'wallet/create/:overlay?' }
};
const ROUTES_WALLET = {
  Wallets: { Name: 'Wallets', Path: '' },
  Dashboard: { Name: 'Dashboard', Path: '/dashboard' },
  SendTX: { Name: 'SendTX', Path: 'send-tx' },
  NFTManager: { Name: 'NFTManager', Path: 'nft' },
  Swap: { Name: 'Swap', Path: 'swap' },
  Dapps: { Name: 'Dapps', Path: 'dapps' },
  DeployContract: { Name: 'DeployContract', Path: 'deploy' },
  InteractWithContract: { Name: 'InteractWithContract', Path: 'interact' },
  SignMessage: { Name: 'SignMessage', Path: 'sign' },
  VerifyMessage: { Name: 'verifyMessage', Path: 'verify' }
};

export { ROUTES_HOME, ROUTES_WALLET };
