
export const EthVMEvent = {
  ETHVM_LINK_CLICKED: 'EthVMLinkClicked',
} as const
export type EthVMEvent = typeof EthVMEvent[keyof typeof EthVMEvent]

export const WalletDirectLinkAccessEvent = {
  WALLET_DIRECT_LINK_ACCESS: 'WalletDirectLinkAccess'
} as const
export type WalletDirectLinkAccessEvent = typeof WalletDirectLinkAccessEvent[keyof typeof WalletDirectLinkAccessEvent]

export const ConsentEvent = {
  USER_OPT_OUT_TRACKING: 'UserOptOutTracking',
  USER_OPT_IN_TRACKING: 'UserOptInTracking',
} as const
export type ConsentEvent = typeof ConsentEvent[keyof typeof ConsentEvent]

export const LandingPageEvent = {
  APPLE_STORE: 'AppleStore',
  CREATE_WALLET: 'CreateWallet',
  ACCESS_WALLET: 'AccessWallet',
  GOOGLE_STORE_2: 'GoogleStore2',
  APPLE_STORE_2: 'AppleStore2',
  GOOGLE_STORE_3: 'GoogleStore3',
  CREATE_WALLET_2: 'CreateWallet2',
  ACCESS_WALLET_2: 'AccessWallet2',
  MEWTOPIA: 'MewTopia',
  PARTNERS: 'Partners',
  ENKRYPT_LEARN_MORE: 'EnkryptLearnMore',
  ACCESS_WALLET_MINT: 'AccessWalletMint',
  SWAP_CLICKED: 'SwapClicked',
  GET_TOKENS_CLICKED: 'GetTokensClicked',
  MEW_COMMUNITY: 'MEWCommunity',
  ACCESS_WALLET_MOBILE: 'AccessWalletMobile',
  CREATE_WALLET_MOBILE: 'CreateWalletMobile'
} as const
export type LandingPageEvent = typeof LandingPageEvent[keyof typeof LandingPageEvent]

export const HeaderEvent = {
  MEW_PRODUCTS: 'MEWProducts',
  LOGO: 'Logo',
  WHAT_IS_MEW: 'WhatIsMEW',
  WALLET_ACTIONS: 'WalletActions',
  BUY_ETH: 'BuyETH',
  BUY_ETH_MOBILE: 'BuyETHMobile'
} as const
export type HeaderEvent = typeof HeaderEvent[keyof typeof HeaderEvent]

export const DashboardEvent = {
  SWAP_BALANCE: 'SwapBalance',
  SWAP_MY_TOKENS_VALUE: 'SwapMyTokensValue',
  SWAP_PAIRS: 'SwapPairs',
  SWAP_LEFT_NAVIGATION: 'SwapLeftNavigation',
  SHOW_RECEIVE_ADDRESS: 'ShowReceiveAddress'
} as const
export type DashboardEvent = typeof DashboardEvent[keyof typeof DashboardEvent]

export const CreateWalletEvent = {
  KEYSTORE_FILE_CLICKED: 'KeystoreFileClicked',
  MNEMONIC_PHRASE_CLICKED: 'MnemonicPhraseClicked',
  KEYSTORE_VERIFICATION: 'KeystoreVerification',
  KEYSTORE_DOWNLOAD: 'KeystoreDownload',
  KEYSTORE_SUCCESS_ACCESS: 'KeystoreSuccessAccessWallet',
  KEYSTORE_BACK: 'KeystoreDownloadBackClicked',
  KEYSTORE_SUCCESS_CREATE: 'KeystoreSuccessCreateWallet',
  MNEMONIC_SUCCESS: 'MnemonicSuccess',
  MNEMONIC_SUCCESS_ACCESS: 'MnemonicSuccessAccessWallet',
  MNEMONIC_WROTE_DOWN: 'WroteDownClicked',
  MNEMONIC_BACK: 'MnemonicBackToStepOne',
  MNEMONIC_SUCCESS_CREATE: 'MnemonicSuccessCreateWallet',
  NAVIGATE_TO_ACCESS: 'NavigateToAccess',
  BUY_HARDWARE: 'BuyHardware',
  SOFTWARE_METHOD: 'SoftwareMethod',
  CLOSE_SOFTWARE: 'CloseSoftware'
} as const
export type CreateWalletEvent = typeof CreateWalletEvent[keyof typeof CreateWalletEvent]

export const AccessWalletEvent = {
  ENKRYPT: 'Enkrypt',
  BROWSER_EXTENSION: 'BrowserExtension',
  MOBILE_APPS: 'MobileApps',
  HARWARE_WALLETS: 'HardwareWallets',
  SOFTWARE: 'Software',
  CLOSE_SOFTWARE_ACCESS: 'CloseSoftwareAccess',
  CLOSE_HARDWARE_ACCESS: 'CloseHardwareAccess',
  CLOSE_MOBILE_ACCESS: 'CloseMobileAccess',
  WEB3_ACCESS_SUCCESS: 'Web3AccessSuccess',
  SOFTWARE_BACK: 'SoftwareBack',
  KEYSTORE_SHOWN: 'KeystoreShown',
  MNEMONIC_SHOWN: 'MnemonicShown',
  PRIVATE_KEY_SHOWN: 'PrivateKeyShown',
  KEYSTORE_CONNECTED: 'KeystoreConnected',
  MNEMONIC_CONNECTED: 'MnemonicConnected',
  PRIVATE_KEY_CONNECTED: 'PrivateKeyConnected',
  WALLET_CONNECT_QR_SHOWN: 'MobileAppsWalletConnectQRShown',
  WALLET_CONNECT_QR_SUCCESSFUL: 'MobileAppsWalletConnectQRShownSuccessful',
  WALLET_CONNECT_QR_FAILED: 'MobileAppsWalletConnectQRShownFailed',
  WALLET_LINK_QR_SHOWN: 'MobileAppsWalletLinkQRShown',
  WALLET_LINK_QR_SUCCESSFUL: 'MobileAppsWalletLinkQRSuccessful',
  WALLET_LINK_QR_FAILED: 'MobileAppsWalletLinkQRFailed',
  MEW_WALLET_QR_SHOWN: 'MobileAppsMEWWalletQRShown',
  MEW_WALLET_QR_SUCCESSFUL: 'MobileAppsMEWWalletQRSuccess',
  MEW_WALLET_QR_FAILED: 'MobileAppsMEWWalletQRFailed',
  HW_LEDGER_CLICKED: 'HWLedgerClicked',
  HW_TREZOR_CLICKED: 'HWTrezorClicked',
  HW_KEEPKEY_CLICKED: 'HWKeepKeyClicked',
  HW_BITBOX02_CLICKED: 'HWBitBox02Clicked',
  HW_COOL_WALLET_CLICKED: 'HWCoolWalletClicked',
  HW_BITBOX02_SHOWN: 'HWBitBox02Shown',
  HW_LEDGER_SHOWN: 'HWLedgerShown',
  HW_COOL_WALLET_SHOWN: 'HWCoolWalletShown',
  HW_TREZOR_SHOWN: 'HWTrezorShown',
  HW_KEEPKEY_SHOWN: 'HWKeepKeyShown',
  HW_LEDGER_CONNECTED: 'HWLedgerConnected',
  HW_TREZOR_CONNECTED: 'HWTrezorConnected',
  HW_COOL_WALLET_CONNECTED: 'HWCoolWalletConnected',
  HW_BITBOX02_CONNECTED: 'HWBitBox02Connected',
  HW_KEEPKEY_CONNECTED: 'HWKeepKeyConnected',
  ACCESS_FAILED: 'Failed',
  PRIV_KEY_TERMS: 'PrivateKeyTermsAccepted',
  PRIV_INVISIBLE_BOX: 'PrivateKeyInvisibleBox',
  SOFTWARE_FAILED: 'SoftwareFailed',
  HW_FAILED: 'HWFailed'
} as const
export type AccessWalletEvent = typeof AccessWalletEvent[keyof typeof AccessWalletEvent]

export const BuySellEvent = {
  OPEN_BUY_SELL_MODAL: 'OpenBuySellModal',
  BUY_NOW_BUTTON: 'BuyNow',
  BUY_TAB: 'BuyTab',
  SELL_TAB: 'SellTab',
  BUY_SELL_CLOSED: 'CloseModal',
  BUY_INPUT: 'BuyInput',
  SELL_INPUT: 'SellInput',
  BUY_W_SIMPLEX: 'BuyWithSimplex',
  BUY_W_SIMPLEX_SUCCESS: 'BuyWithSimplexSuccess',
  BUY_W_SIMPLEX_FAILED: 'BuyWithSimplexFailed',
  BUY_W_MOONPAY: 'BuyWithMoonpay',
  BUY_W_MOONPAY_SUCCESS: 'BuyWithMoonpaySuccess',
  BUY_W_MOONPAY_FAILED: 'BuyWithMoonpayFailed',
  SELL_WITH_MOONPAY: 'SellWithMoonpay',
  SELL_WITH_MOONPAY_SUCCESS: 'SellWithMoonpaySuccess',
  SELL_WITH_MOONPAY_FAILED: 'SellWithMoonpayFailed',
  BUY_W_TOPPER: 'BuyWithTopper',
  BUY_W_TOPPER_SUCCESS: 'BuyWithTopperSuccess',
  BUY_W_TOPPER_FAILED: 'BuyWithTopperFailed',
  BUY_PROVIDER_SELECTED: 'BuyWithProviderSelected'
} as const
export type BuySellEvent = typeof BuySellEvent[keyof typeof BuySellEvent]

export const ContractEvent = {
  INTERACT_W_CONTRACT_WRITE: 'InteractWithContractWriteButtonClicked',
  INTERACT_W_CONTRACT_WRITE_SUCCESS: 'InteractWithContractWriteSuccess',
  INTERACT_W_CONTRACT_WRITE_FAIL: 'InteractWithContractWriteFail',
  INTERACT_W_CONTRACT_READ: 'InteractWithContractReadButtonClicked',
  INTERACT_W_CONTRACT_READ_SUCCESS: 'InteractWithContractReadSuccess',
  INTERACT_W_CONTRACT_READ_FAIL: 'InteractWithContractReadFail',
  DEPLOY_CONTRACT: 'DeployContractButtonClicked',
  DEPLOY_CONTRACT_SUCCESS: 'DeployContractSuccess',
  DEPLOY_CONTRACT_FAIL: 'DeployContractFail',
  NAVIGATE_TO_INTERACT: 'NavigateToInteract',
  NAVIGATE_TO_DEPLOY: 'NavigateToDeploy'
} as const
export type ContractEvent = typeof ContractEvent[keyof typeof ContractEvent]

export const StakingEvent = {
  SIDE_MENU: 'SideMenu',
  DASHBOARD: 'Dashboard',
  DASHBOARD_CLOSED: 'DashboardClosed',
  STAKE_CENTER_STAKED: 'PageStaked',
  STAKE_CENTER_COINBASE: 'PageCoinbase',
  STAKE_CENTER_MORE_ABOUT: 'PageMoreAboutStaking',
  HEADER_NOW: 'HeaderNow'
} as const
export type StakingEvent = typeof StakingEvent[keyof typeof StakingEvent]

export const SwapEvent = {
  BROADCASTED: 'Broadcasted',
  RECEIPT: 'Receipt',
  FAILED: 'Failed',
  NOT_BROADCASTED: 'NotBroadcasted',
  VERIFY_PAGE_SHOWN: 'VerifyPageShown',
  CANCELLED: 'Cancelled',
  SUCCESS: 'Success',
  CONFIRM_CLICKED: 'ConfirmClicked',
  FIELD_INPUTS: 'FieldInputs',
  NEXT_CLICKED: 'NextClicked',
  INITIAL_MODAL_CLOSED: 'InitiatedModalClosed',
  SWAP_INITIATED: 'SwapInitiated',
  TRANSACTION_INITIATIED: 'TransactionInitiated',
  X_OUT: 'XOut',
  CLICK_OUTSIDE: 'ClickOutside',
  BUTTON_CANCEL: 'ButtonCancel'
} as const
export type SwapEvent = typeof SwapEvent[keyof typeof SwapEvent]

