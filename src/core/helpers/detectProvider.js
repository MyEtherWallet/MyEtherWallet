import MetaMask from '@/assets/images/icons/wallets/metamask.svg';
import injectedIcon from '@/assets/images/icons/icon-cx-mew.svg';
const icons = {
  MetaMask: MetaMask
};

export function getInjectedIcon(name) {
  return icons[name] ? icons[name] : injectedIcon;
}

export function getInjectedName(ethereum) {
  if (!ethereum) return 'Injected';

  const getName = provider => {
    if (provider.isApexWallet) return 'Apex Wallet';
    if (provider.isAvalanche) return 'Core Wallet';
    if (provider.isBackpack) return 'Backpack';
    if (provider.isBifrost) return 'Bifrost Wallet';
    if (provider.isBitKeep) return 'BitKeep';
    if (provider.isBitski) return 'Bitski';
    if (provider.isBlockWallet) return 'BlockWallet';
    if (provider.isBraveWallet) return 'Brave Wallet';
    if (provider.isCoinbaseWallet) return 'Coinbase Wallet';
    if (provider.isDawn) return 'Dawn Wallet';
    if (provider.isDefiant) return 'Defiant';
    if (provider.isEnkrypt) return 'Enkrypt';
    if (provider.isExodus) return 'Exodus';
    if (provider.isFrame) return 'Frame';
    if (provider.isFrontier) return 'Frontier Wallet';
    if (provider.isGamestop) return 'GameStop Wallet';
    if (provider.isHyperPay) return 'HyperPay Wallet';
    if (provider.isImToken) return 'ImToken';
    if (provider.isHaloWallet) return 'Halo Wallet';
    if (provider.isKuCoinWallet) return 'KuCoin Wallet';
    if (provider.isMathWallet) return 'MathWallet';
    if (provider.isNovaWallet) return 'Nova Wallet';
    if (provider.isOkxWallet || provider.isOKExWallet) return 'OKX Wallet';
    if (provider.isOneInchIOSWallet || provider.isOneInchAndroidWallet)
      return '1inch Wallet';
    if (provider.isOpera) return 'Opera';
    if (provider.isPhantom) return 'Phantom';
    if (provider.isPortal) return 'Ripio Portal';
    if (provider.isRabby) return 'Rabby Wallet';
    if (provider.isRainbow) return 'Rainbow';
    if (provider.isStatus) return 'Status';
    if (provider.isTalisman) return 'Talisman';
    if (provider.isTally) return 'Taho';
    if (provider.isTokenPocket) return 'TokenPocket';
    if (provider.isTokenary) return 'Tokenary';
    if (provider.isTrust || provider.isTrustWallet) return 'Trust Wallet';
    if (provider.isXDEFI) return 'XDEFI Wallet';
    if (provider.isZerion) return 'Zerion';
    if (provider.isMetaMask) return 'MetaMask';
  };

  // Some injected providers detect multiple other providers and create a list at `window.ethereum.providers`
  if (ethereum.providers?.length) {
    // Deduplicate names using Set
    // Coinbase Wallet puts multiple providers in `ethereum.providers`
    const nameSet = new Set();
    let unknownCount = 1;
    for (const provider of ethereum.providers) {
      let name = getName(provider);
      if (!name) {
        name = `Unknown Wallet #${unknownCount}`;
        unknownCount += 1;
      }
      nameSet.add(name);
    }
    const names = [...nameSet];
    if (names.length) return names;
    return names[0] ?? 'Injected';
  }

  return getName(ethereum) ?? 'Injected';
}
