const state = {
  overlays: {
    accessWalletLedger: { isOpen: false },
    accessWalletBitbox: { isOpen: false },
    accessWalletFinney: { isOpen: false },
    accessWalletSecalot: { isOpen: false },
    accessWalletKeepKey: { isOpen: false },
    accessWalletTrezor: { isOpen: false },
    accessWalletCoolWallet: { isOpen: false },
    accessWalletBCVault: { isOpen: false },
    accessWalletXWallet: { isOpen: false },
    accessWalletBrowserExtensions: { isOpen: false },
    accessWalletMobileApps: { isOpen: false },
    transactionTxConfirmation: { isOpen: false },
    SignMessageConfirmation: { isOpen: false }
  }
};

export default state;

/*

methods: {
  openOverlay(name) {
    this.$store.commit('openOverlay', name);
  }
}

*/
