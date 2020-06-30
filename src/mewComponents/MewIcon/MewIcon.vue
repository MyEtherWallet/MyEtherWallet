<template>
  <div>
    <img
      :height="imgHeight"
      :src="getIcon()"
    >
  </div>
</template>
<script>
import aave from '@/assets/images/icons/aave.svg'
import account from '@/assets/images/icons/account.svg'
import acctValue from '@/assets/images/icons/acct-value.svg'
import advancedTools from '@/assets/images/icons/advanced-tools.svg'
import arrow from '@/assets/images/icons/arrow.svg'
import bcvault from '@/assets/images/icons/bcvault.svg'
import bicycle from '@/assets/images/icons/bicycle.svg'
import bitbox from '@/assets/images/icons/bitbox.svg'
import buyEth from '@/assets/images/icons/buy-eth.svg'
import calendar from '@/assets/images/icons/calendar.svg'
import car from '@/assets/images/icons/car.svg'
import chrome from '@/assets/images/icons/chrome.svg'
import clock from '@/assets/images/icons/clock.svg'
import coolWallet from '@/assets/images/icons/cool-wallet.svg'
import copy from '@/assets/images/icons/copy.svg'
import diploma from '@/assets/images/icons/diploma.svg'
import edit from '@/assets/images/icons/edit.svg'
import ensManager from '@/assets/images/icons/ens-manager.svg'
import ethBalance from '@/assets/images/icons/eth-balance.svg'
import finney from '@/assets/images/icons/finney.svg'
import keepkey from '@/assets/images/icons/keepkey.svg'
import keystore from '@/assets/images/icons/keystore.svg'
import ledger from '@/assets/images/icons/ledger.svg'
import lock from '@/assets/images/icons/lock.svg'
import makerdao from '@/assets/images/icons/makerdao.svg'
import message from '@/assets/images/icons/message.svg'
import mewtopia from '@/assets/images/icons/mewtopia.svg'
import mnemonic from '@/assets/images/icons/mnemonic.svg'
import navBar from '@/assets/images/icons/nav-bar.svg'
import networkNodes from '@/assets/images/icons/network-nodes.svg'
import newWallet from '@/assets/images/icons/new-wallet.svg'
import nightMode from '@/assets/images/icons/night-mode.svg'
import notification from '@/assets/images/icons/notification.svg'
import paperPlane from '@/assets/images/icons/paper-plane.svg'
import privateKey from '@/assets/images/icons/private-key.svg'
import quickHelp from '@/assets/images/icons/quick-help.svg'
import rocket from '@/assets/images/icons/rocket.svg'
import secalot from '@/assets/images/icons/secalot.svg'
import shield from '@/assets/images/icons/shield.svg'
import swapToken from '@/assets/images/icons/swap-token.svg'
import tags from '@/assets/images/icons/tags.svg'
import team from '@/assets/images/icons/team.svg'
import thief from '@/assets/images/icons/thief.svg'
import tokensList from '@/assets/images/icons/tokens-list.svg'
import trezor from '@/assets/images/icons/trezor.svg'
import viewOnly from '@/assets/images/icons/view-only.svg'
import xwallet from '@/assets/images/icons/xwallet.svg'
import btc from '@/assets/images/icons/footer/btc.png'
import eth from '@/assets/images/icons/footer/eth.png'
import facebook from '@/assets/images/icons/footer/facebook.png'
import github from '@/assets/images/icons/footer/github.png'
import instagram from '@/assets/images/icons/footer/instagram.png'
import linkedin from '@/assets/images/icons/footer/linkedin.png'
import love from '@/assets/images/icons/footer/love.png'
import medium from '@/assets/images/icons/footer/medium.png'
import reddit from '@/assets/images/icons/footer/reddit.png'
import twitter from '@/assets/images/icons/footer/twitter.png'
import youtube from '@/assets/images/icons/footer/youtube.png'


export default {
  data() {
    return {
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
      ethBalance: ethBalance,
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
      newWallet: newWallet,
      nightMode: nightMode,
      notification: notification,
      paperPlane: paperPlane,
      privateKey: privateKey,
      quickHelp: quickHelp,
      rocket: rocket,
      secalot: secalot,
      shield: shield,
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

    }
  },
  props: {
    /**
     * Icon name
     */
      iconName: {
      type: String,
      default: ''
    },
    /**
     * Image height
     */
      imgHeight: {
      type: Number,
      default: 40
    }
  },
  methods: {
    // todo: think of a better way to do this.
    getIcon() {
      switch(this.iconName) {
        case 'aave':
          return this.aave;
        case 'account':
          return this.account
        case 'acctValue':
          return this.acctValue;
        case 'advancedTools':
          return this.advancedTools; 
        case 'arrow':
          return this.arrow;
        case 'bcvault':
          return this.bcvault;
        case 'bicycle':
          return this.bicycle;
        case 'bitbox':
          return this.bitbox;
        case 'buyEth':
          return this.buyEth;
        case 'calendar':
          return this.calendar;
        case 'car':
          return this.car;
        case 'chrome':
          return this.chrome;
        case 'clock':
          return this.clock;
        case 'coolWallet':
          return this.coolWallet;
        case 'copy':
          return this.copy;
        case 'diploma':
          return this.diploma
        case 'ensManager':
          return this.ensManager;
        case 'ethBalance':
          return this.ethBalance; 
        case 'finney':
          return this.finney;
        case 'keepkey':
          return this.keepkey;
        case 'keystore':
          return this.keystore;
        case 'ledger':
          return this.ledger;
        case 'lock':
          return this.lock;
        case 'makerdao':
          return this.makerdao;
        case 'message':
          return this.message;
        case 'mewtopia':
          return this.mewtopia;
        case 'mnemonic':
          return this.mnemonic;
        case 'navBar':
          return this.navBar;
        case 'networkNodes':
          return this.networkNodes; 
        case 'newWallet':
          return this.newWallet;
        case 'nightMode':
          return this.nightMode;
        case 'notification':
          return this.notification;
        case 'paperPlane':
          return this.paperPlane;
        case 'privateKey':
          return this.privateKey;
        case 'quickHelp':
          return this.quickHelp;
        case 'rocket':
          return this.rocket;
        case 'secalot':
          return this.secalot;
        case 'shield':
          return this.shield;
        case 'swapToken':
          return this.swapToken;
        case 'tags':
          return this.tags; 
        case 'team':
          return this.team;
        case 'thief':
          return this.thief;
        case 'tokensList':
          return this.tokensList;
        case 'trezor':
          return this.trezor;
        case 'viewOnly':
          return this.viewOnly;
        case 'xwallet':
          return this.xwallet;
        case 'btc':
          return this.btc;
        case 'eth':
          return this.eth;
        case 'facebook':
          return this.facebook;
        case 'github':
          return this.github;
        case 'instagram':
          return this.instagram;
        case 'linkedin':
          return this.linkedin;
        case 'love':
          return this.love;
        case 'medium':
          return this.medium;
        case 'reddit':
          return this.reddit;
        case 'twitter':
          return this.twitter;
        case 'youtube':
          return this.youtube;
        default: 
          return this.eth;

      }
    }
  }
}

</script>