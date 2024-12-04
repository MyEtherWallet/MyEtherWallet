import { defineStore } from 'pinia'
// import { computed, reactive, toRefs, type ComputedRef } from 'vue'
import { reactive } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WalletType = {
  LEDGER: 'ledger',
  TREZOR: 'trezor',
  BITBOX2: 'bitbox02',
  KEEPKEY: 'keepkey',
  WALLET_CONNECT: 'walletConnect',
  KEYSTORE: 'keystore',
  MNEMONIC: 'mnemonic',
  WEB3_WALLET: 'web3Wallet',
  PRIV_KEY: 'privKey',
  COOL_WALLET: 'coolWallet',
  COOL_WALLET_S: 'coolWalletS',
  COOL_WALLET_PRO: 'coolWalletPro',
  WALLET_LINK: 'walletLink',
  MEW_WALLET: 'mewWallet',
} as const
type WalletType = (typeof WalletType)[keyof typeof WalletType]

// type WalletConnection = { disconnect?(): void; killSession?(): void }
//
// type Wallet = {
//   getConnection(): undefined | WalletConnection
//   getAddressString(): string
//   isHardware?: boolean
//   identifier: WalletType
//   getNickname(): string
// }

type WalletState = {
  test: boolean
  // Put wallet state here

  // v6 wallet state:
  // localStore: boolean
  // address: string | null
  // /** Base 10 string */
  // balance: string
  // blockNumber: number
  // identifier: null | WalletType
  // isHardware: boolean
  // ledgerBLE: boolean
  // ledgerApp: Record<PropertyKey, unknown> // ?
  // instance: null | Wallet
  // isOfflineApp: boolean
  // web3: Record<PropertyKey, unknown> // ?
  // ensDomains: null | string[] // ?
  // tokens: unknown[] // ?
  // loadingWalletInfo: boolean
  // swapRates: unknown[]
  // nickname: null | string
}

const defaultState: WalletState = {
  test: true
  // v6 default wallet state:
  // localStore: false,
  // address: null,
  // balance: '0',
  // blockNumber: 0,
  // identifier: null,
  // isHardware: false,
  // ledgerBLE: false,
  // ledgerApp: {},
  // instance: null,
  // isOfflineApp: false,
  // web3: {},
  // ensDomains: null,
  // tokens: [],
  // loadingWalletInfo: true,
  // swapRates: [],
  // nickname: null,
}

export type WalletStore = {
  test: boolean
  // Put default(initial) wallet store here

  // v6 wallet store:
  //
  // // Getters
  // balanceInETH: ComputedRef<string>
  // balanceInWei: ComputedRef<string>
  // totalOwnedDomains: ComputedRef<number>
  // tokensList: ComputedRef<unknown[]>
  // initialLoad: ComputedRef<unknown>
  // getLedgerApp: ComputedRef<unknown>
  // hasGasPriceOption: ComputedRef<boolean>
  //
  // // Mutations
  // setBlockNumber(number: number): void
  // removeWallet(): void
  // setWallet(wallet: Wallet): void
  // setBalance(to: string): void
  // setLedgerBluetooth(ledgerBLE: boolean): void
  // setWeb3Instance(web3: unknown): void
  // setOwnedDomains(ensDomains: string[]): void
  // setTokens(tokens: unknown[]): void
  // setLoadingWalletInfo(isLoading: boolean): void
  // setOfflineApp(isOfflineApp: boolean): void
  // setLedgerApp(ledgerApp: Record<PropertyKey, unknown>): void
  // setSwapRates(swapRates: unknown[]): void
}

export const useWalletStore = defineStore('wallet', (): WalletStore => {
  const state = reactive(defaultState)

  const store: WalletStore = {
    test: state.test
    // v6 store implementation:
    // // Getters
    // balanceInETH: computed(() => {
    //   // Can use web3 eth to wei
    //   console.error('TODO: Not Implemented: WalletStore::balanceInETH')
    //   return '0'
    // }),
    // balanceInWei: computed(() => state.balance),
    // totalOwnedDomains: computed(() => state.ensDomains?.length ?? 0),
    // tokensList: computed(() => state.tokens),
    // initialLoad: computed(() => state.loadingWalletInfo),
    // getLedgerApp: computed(() => state.ledgerApp),
    // hasGasPriceOption: computed(() => {
    //   switch (state.identifier) {
    //     case WalletType.WEB3_WALLET:
    //     case WalletType.WALLET_CONNECT:
    //     case WalletType.MEW_WALLET:
    //     case WalletType.WALLET_LINK:
    //       return true
    //     default:
    //       return false
    //   }
    // }),
    //
    // // Mutations
    // setBlockNumber(blockNumber) {
    //   state.blockNumber = blockNumber
    // },
    // removeWallet() {
    //   switch (state.identifier) {
    //     case WalletType.WALLET_CONNECT:
    //     case WalletType.MEW_WALLET:
    //     case WalletType.WALLET_LINK: {
    //       const connection = state.instance!.getConnection()
    //       if (connection) {
    //         if (connection.disconnect) {
    //           connection.disconnect()
    //         }
    //         if (connection.killSession) {
    //           connection.killSession()
    //         }
    //       }
    //       break
    //     }
    //     case WalletType.WEB3_WALLET:
    //       // TODO:previously:
    //       // rootState.external.selectedEIP6963Provider.removeAllListeners();
    //       // dispatch('external/setSelectedEIP6963Provider', null, { root: true });
    //       // dispatch('external/setSelectedEIP6963Info', null, { root: true });
    //       // dispatch('external/clearEIP963Providers', null, { root: true });
    //       break
    //   }
    // },
    // setBalance(balance) {
    //   state.balance = balance
    // },
    // setLedgerBluetooth(ledgerBLE) {
    //   state.ledgerBLE = ledgerBLE
    // },
    // setWeb3Instance(web3) {
    //   console.error('TODO: Not Implemented: WalletStore::setWeb3Instance')
    // },
    // setOwnedDomains(ensDomains) {
    //   state.ensDomains = ensDomains
    // },
    // setTokens(tokens) {
    //   state.tokens = tokens
    // },
    // setLoadingWalletInfo(isLoading) {
    //   state.loadingWalletInfo = isLoading
    // },
    // setOfflineApp(isOfflineApp) {
    //   state.isOfflineApp = isOfflineApp
    // },
    // setLedgerApp(ledgerApp) {
    //   state.ledgerApp = ledgerApp
    // },
    // setWallet(wallet) {
    //   state.instance = wallet
    //   state.address = wallet.getAddressString()
    //   state.isHardware = wallet.isHardware ?? false
    //   state.identifier = wallet.identifier
    //   if (!wallet.hasOwnProperty('isHardware')) {
    //     state.nickname = wallet.getNickname()
    //   }
    // },
    // setSwapRates(swapRates) {
    //   state.swapRates = swapRates
    // },
  }

  return store
})
