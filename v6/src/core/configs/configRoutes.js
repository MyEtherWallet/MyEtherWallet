const ROUTES_HOME = {
  HOME: { NAME: 'Home', PATH: '' },
  //A-Z
  ACCESS_WALLET: { NAME: 'AccessWallet', PATH: 'wallet/access/:overlay?' },
  ABOUT_PAGE: { NAME: 'AboutPage', PATH: 'about' },
  ADVERTISE: { NAME: 'AdvertiseWithUsPage', PATH: 'advertise-with-us' },
  BUY_HARDWARE_WALLET: { NAME: 'BuyHardwareWallet', PATH: 'buy-hardware' },
  CREATE_WALLET: { NAME: 'CreateWallet', PATH: 'wallet/create' },
  CREATE_WALLET_SOFTWARE_OVERVIEW: {
    NAME: 'CreateWalletSoftwareOverview',
    PATH: 'overview'
  },
  CREATE_WALLET_SOFTWARE_MNEMONIC: {
    NAME: 'CreateWalletSoftwareMnemonic',
    PATH: 'mnemonic'
  },
  CREATE_WALLET_SOFTWARE_KEYSTORE: {
    NAME: 'CreateWalletSoftwareKeystore',
    PATH: 'keystore'
  },
  CONVERT_UNITS: { NAME: 'ConvertUnits', PATH: 'convert-units' },
  HOW_IT_WORKS: { NAME: 'HowItWorks', PATH: 'how-it-works' },
  JOBS: { NAME: 'Careers', PATH: 'careers' },
  PAGE_NOT_FOUND: { NAME: 'PageNotFound', PATH: '*' },
  PRESS_KIT: { NAME: 'PressKit', PATH: 'presskit' },
  PRIVACY_POLICY: { NAME: 'PrivacyPolicy', PATH: 'privacy-policy' },
  QR_CODE: { NAME: 'QrCode', PATH: 'qr-code' },
  SECURITY_POLICY: { NAME: 'SecurityPolicy', PATH: 'security-policy' },
  TEAM_PAGE: { NAME: 'TeamPage', PATH: 'team' },
  TERMS_OF_SERVICE: { NAME: 'TermsOfService', PATH: 'terms-of-service' },
  TOOLS: { NAME: 'Tools', PATH: 'tools' }
};
const ROUTES_WALLET = {
  WALLETS: { NAME: 'Wallets', PATH: '' },
  //A-Z
  AAVE: { NAME: 'Aave', PATH: 'aave' },
  DAPPS: { NAME: 'Dapps', PATH: 'dapps' },
  DASHBOARD: { NAME: 'Dashboard', PATH: 'dashboard' },
  DEPLOY_CONTRACT: { NAME: 'DeployContract', PATH: 'deploy' },
  ENS_MANAGER: { NAME: 'ENSManager', PATH: 'ens-manager' },
  ENS_1: { NAME: 'ENS1', PATH: 'ens-1' },
  ENS_2: { NAME: 'ENS2', PATH: 'ens-2' },
  ENS_3: { NAME: 'ENS3', PATH: 'ens-3' },
  INTERACT_WITH_CONTRACT: { NAME: 'InteractWithContract', PATH: 'interact' },
  NFT_MANAGER: { NAME: 'NFTManager', PATH: 'nft' },
  NFT_MANAGER_SEND: { NAME: 'NftManagerSend', PATH: 'send-your-nft' },
  PRINT: { NAME: 'PrintPaperWallet', PATH: 'print-wallet' },
  SEND_TX: { NAME: 'SendTX', PATH: 'send-tx' },
  STAKE: { NAME: 'Stake', PATH: 'stake' },
  SEND_TX_OFFLINE: { NAME: 'SendTXOffline', PATH: 'send-tx-offline' },
  SETTINGS: { NAME: 'Settings', PATH: 'settings' },
  SIGN_MESSAGE: { NAME: 'SignMessage', PATH: 'sign' },
  STAKED: { NAME: 'Staked', PATH: 'staked' },
  STAKED_STATUS: { NAME: 'StakedStatus', PATH: 'status' },
  STAKED_1: { NAME: 'Staked1', PATH: 'staked-1' },
  STAKED_2: { NAME: 'Staked2', PATH: 'staked-2' },
  STAKED_3: { NAME: 'Staked3', PATH: 'staked-3' },
  STAKED_4: { NAME: 'Staked4', PATH: 'staked-4' },
  STAKEWISE: { NAME: 'Stakewise', PATH: 'stakewise' },
  SWAP: { NAME: 'Swap', PATH: 'swap' },
  BRIDGE: { NAME: 'Bridge', PATH: 'bridge' },
  UNSTOPPABLE: { NAME: 'Unstoppable', PATH: 'unstoppable' },
  VERIFY_MESSAGE: { NAME: 'VerifyMessage', PATH: 'verify' }
};

export { ROUTES_HOME, ROUTES_WALLET };
