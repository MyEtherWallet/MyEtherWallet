<template>
  <!--
  =====================================================================================
    Mew Icon
  =====================================================================================
  -->
  <img :height="imgHeight" :src="getIcon()" />
</template>
<script setup>
import aave from '@/assets/images/icon-component/aave.svg';
import account from '@/assets/images/icon-component/account.svg';
import acctValue from '@/assets/images/icon-component/acct-value.svg';
import advancedTools from '@/assets/images/icon-component/advanced-tools.svg';
import arrow from '@/assets/images/icon-component/arrow.svg';
import bcvault from '@/assets/images/icon-component/bcvault.svg';
import bicycle from '@/assets/images/icon-component/bicycle.svg';
import bitbox from '@/assets/images/icon-component/bitbox.svg';
import buyEth from '@/assets/images/icon-component/buy-eth.svg';
import calendar from '@/assets/images/icon-component/calendar.svg';
import car from '@/assets/images/icon-component/car.svg';
import chrome from '@/assets/images/icon-component/chrome.svg';
import clock from '@/assets/images/icon-component/clock.svg';
import coolWallet from '@/assets/images/icon-component/cool-wallet.svg';
import copy from '@/assets/images/icon-component/copy.svg';
import diploma from '@/assets/images/icon-component/diploma.svg';
import edit from '@/assets/images/icon-component/edit.svg';
import ensManager from '@/assets/images/icon-component/ens-manager.svg';
import ensManagerNew from '@/assets/images/icon-component/ens-manager-new.svg';
import ethBalance from '@/assets/images/icon-component/eth-balance.svg';
import ethBlocks from '@/assets/images/icon-component/eth-blocks.svg';
import finney from '@/assets/images/icon-component/finney.svg';
import keepkey from '@/assets/images/icon-component/keepkey.svg';
import keystore from '@/assets/images/icon-component/keystore.svg';
import ledger from '@/assets/images/icon-component/ledger.svg';
import lock from '@/assets/images/icon-component/lock.svg';
import makerdao from '@/assets/images/icon-component/makerdao.svg';
import message from '@/assets/images/icon-component/message.svg';
import mewtopia from '@/assets/images/icon-component/mewtopia.svg';
import mnemonic from '@/assets/images/icon-component/mnemonic.svg';
import navBar from '@/assets/images/icon-component/nav-bar.svg';
import networkNodes from '@/assets/images/icon-component/network-nodes.svg';
import wallet from '@/assets/images/icon-component/new-wallet.svg';
import nightMode from '@/assets/images/icon-component/night-mode.svg';
import notification from '@/assets/images/icon-component/notification.svg';
import paperPlane from '@/assets/images/icon-component/paper-plane.svg';
import privateKey from '@/assets/images/icon-component/private-key.svg';
import quickHelp from '@/assets/images/icon-component/quick-help.svg';
import rocket from '@/assets/images/icon-component/rocket.svg';
import secalot from '@/assets/images/icon-component/secalot.svg';
import shield from '@/assets/images/icon-component/shield.svg';
import stake from '@/assets/images/icon-component/stake.svg';
import stakeNew from '@/assets/images/icon-component/stake-new.svg';
import stakewise from '@/assets/images/icon-component/stakewise.svg';
import stakewiseGreen from '@/assets/images/icon-component/stakewise-green.svg';
import stakewisePurple from '@/assets/images/icon-component/stakewise-purple.svg';
import stakewiseRed from '@/assets/images/icon-component/stakewise-red.svg';
import swapToken from '@/assets/images/icon-component/swap-token.svg';
import tags from '@/assets/images/icon-component/tags.svg';
import team from '@/assets/images/icon-component/team.svg';
import thief from '@/assets/images/icon-component/thief.svg';
import tokensList from '@/assets/images/icon-component/tokens-list.svg';
import trezor from '@/assets/images/icon-component/trezor.svg';
import viewOnly from '@/assets/images/icon-component/view-only.svg';
import xwallet from '@/assets/images/icon-component/xwallet.svg';
import btc from '@/assets/images/icon-component/footer/btc.png';
import eth from '@/assets/images/icon-component/footer/eth.png';
import facebook from '@/assets/images/icon-component/footer/facebook.png';
import github from '@/assets/images/icon-component/footer/github.png';
import instagram from '@/assets/images/icon-component/footer/instagram.png';
import linkedin from '@/assets/images/icon-component/footer/linkedin.png';
import love from '@/assets/images/icon-component/footer/love.png';
import medium from '@/assets/images/icon-component/footer/medium.png';
import reddit from '@/assets/images/icon-component/footer/reddit.png';
import twitter from '@/assets/images/icon-component/footer/twitter.png';
import youtube from '@/assets/images/icon-component/footer/youtube.png';

// props
const props = defineProps({
  /**
   * Pass the icon here. Icon names are: 'aave', 'account', 'acctValue', 'advancedTools', 'arrow', 'bcvault', 'bicycle', 'bitbox', 'buyEth', 'calendar', 'car', 'chrome', 'clock', 'coolWallet', 'copy', 'diploma', 'edit', 'ensManager', 'ethBalance', 'finney', 'keepkey', 'keystore', 'ledger', 'lock', 'makerdao', 'message', 'mewtopia', 'mnemonic', 'navBar', 'networkNodes', 'wallet', 'nightMode', 'notification', 'paperPlane', 'privateKey', 'quickHelp', 'rocket', 'secalot', 'shield', 'swapToken', 'tags', 'team', 'thief', 'tokensList', 'trezor', 'viewOnly', 'xwallet', 'btc', 'eth', 'facebook', 'github', 'instagram', 'linkedin', 'love', 'medium', 'reddit', 'twitter', 'youtube'
   */
  iconName: {
    type: String,
    default: ''
  },
  /**
   * Icon image height
   */
  imgHeight: {
    type: Number,
    default: 40
  }
});

// methods
const icons = {
  aave: aave,
  account: account,
  acctValue: acctValue,
  advancedTools: advancedTools,
  arrow: arrow,
  bcvault: bcvault,
  bicycle: bicycle,
  bitbox: bitbox,
  buyEth: buyEth,
  calendar: calendar,
  car: car,
  chrome: chrome,
  clock: clock,
  coolWallet: coolWallet,
  copy: copy,
  diploma: diploma,
  edit: edit,
  ensManager: ensManager,
  ensManagerNew: ensManagerNew,
  ethBalance: ethBalance,
  ethBlocks: ethBlocks,
  finney: finney,
  keepkey: keepkey,
  keystore: keystore,
  ledger: ledger,
  lock: lock,
  makerdao: makerdao,
  message: message,
  mewtopia: mewtopia,
  mnemonic: mnemonic,
  navBar: navBar,
  networkNodes: networkNodes,
  wallet: wallet,
  nightMode: nightMode,
  notification: notification,
  paperPlane: paperPlane,
  privateKey: privateKey,
  quickHelp: quickHelp,
  rocket: rocket,
  secalot: secalot,
  shield: shield,
  stake: stake,
  stakeNew: stakeNew,
  stakewise: stakewise,
  stakewiseGreen: stakewiseGreen,
  stakewisePurple: stakewisePurple,
  stakewiseRed: stakewiseRed,
  swapToken: swapToken,
  tags: tags,
  team: team,
  thief: thief,
  tokensList: tokensList,
  trezor: trezor,
  viewOnly: viewOnly,
  xwallet: xwallet,
  btc: btc,
  eth: eth,
  facebook: facebook,
  github: github,
  instagram: instagram,
  linkedin: linkedin,
  love: love,
  medium: medium,
  reddit: reddit,
  twitter: twitter,
  youtube: youtube
};

// methods
const getIcon = () => {
  return icons[props.iconName] ? icons[props.iconName] : icons['eth'];
};
</script>
