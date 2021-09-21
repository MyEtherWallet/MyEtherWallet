<img src="./src/assets/images/presskit/logo-dark.png" width="300px"/>

[![Website](https://img.shields.io/website-up-down-green-red/http/myetherwallet.com.svg?label=MyEtherWallet.com&style=flat-square)](http://www.MyEtherWallet.com/)
[![Github All Releases](https://img.shields.io/github/downloads/MyEtherWallet/MyEtherWallet/total.svg?style=flat-square)](https://www.github.com/MyEtherWallet/MyEtherWallet/releases)
[![GitHub issues](https://img.shields.io/github/issues-raw/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://github.com/MyEtherWallet/MyEtherWallet/issues)
[![Travis](https://img.shields.io/travis/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://travis-ci.org/MyEtherWallet/MyEtherWallet)
[![GitHub package version](https://img.shields.io/github/package-json/v/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://github.com/MyEtherWallet/MyEtherWallet/blob/main/package.json) [![Greenkeeper badge](https://badges.greenkeeper.io/MyEtherWallet/MyEtherWallet.svg)](https://greenkeeper.io/)
![GitHub contributors](https://img.shields.io/github/contributors/MyEtherWallet/MyEtherWallet.svg?style=flat-square) [![Codecov badge](https://img.shields.io/codecov/c/github/MyEtherWallet/MyEtherWallet/develop.svg?style=flat-square)](https://codecov.io/github/MyEtherWallet/MyEtherWallet?branch=develop)

MyEtherWallet is a doorway to the Ethereum blockchain, allowing users to manage their own funds without a centralized platform. - <i>Stephen, #MEWForce</i>

!["MyEtherWallet Logo](./src/assets/images/backgrounds/v6-landing-screen-shot.png 'MyEtherWallet')

## Philosophy

- <b>Empower the people</b>: Give people the ability to interact with the Ethereum blockchain easily, without having to run a full node.
- <b>Make it easy & free</b>: Everyone should be able to create a wallet and send Ether & Tokens without additional cost.
- <b>People are the Priority</b>: People are the most important & their experience trumps all else. If monetization worsens the experience, we don't do it. (e.g. ads)
- <b>A learning experience, too</b>: We want to educate about Ethereum, security, privacy, the importance of controlling your own keys, how the blockchain works, and how Ethereum and blockchain technologies enable a better world.
- <b>If it can be hacked, it will be hacked</b>: Never save, store, or transmit secret info, like passwords or keys.
- <b>Offline / Client-Side</b>: User should be able to run locally and offline without issue.
- <b>Private</b>: No tracking!!! No emails. No ads. No demographics. We don't even know how many wallets have been generated, let alone who / what / where you are.
- <b>Open source & auditable</b>

## MEW Around the Web

- [Website: https://www.myetherwallet.com/](https://www.myetherwallet.com/)
- MEW Wallet:
  - [IOS App](https://apps.apple.com/us/app/mew-wallet-ethereum-and-defi/id1464614025)
  - [Android App](https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet&hl=en_US&gl=US)
- [EthVM Blockchain explorer](https://www.ethvm.com/)
- [MEW CX: https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm](https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm)
- [MEW Team](https://team.myetherwallet.com/)
- [MEWtopia](https://www.mewtopia.com/)
- [MEW Help Center](https://help.myetherwallet.com/)
- [FB: https://www.facebook.com/MyEtherWallet/](https://www.facebook.com/MyEtherWallet/)
- [Twitter: https://twitter.com/myetherwallet](https://twitter.com/myetherwallet)
- [YouTube: https://www.youtube.com/channel/UCQU5QbObwmaHNEMsuX3uQKA](https://www.youtube.com/channel/UCQU5QbObwmaHNEMsuX3uQKA)
- [Instagram: https://www.instagram.com/myetherwallet/](https://www.instagram.com/myetherwallet/)
- [Vkontakte: https://vk.com/public190491855](https://vk.com/public190491855)
- [Medium: https://medium.com/@myetherwallet](https://medium.com/@myetherwallet)
- [Telegram: https://t.me/myetherwallet](https://t.me/myetherwallet)
- [Github MEW Repo: https://github.com/MyEtherWallet/MyEtherWallet](https://github.com/MyEtherWallet/MyEtherWallet)
- [Github MEW Org: https://github.com/MyEtherWallet](https://github.com/MyEtherWallet)
- [Github Latest Releases: https://github.com/MyEtherWallet/MyEtherWallet/releases/latest](https://github.com/MyEtherWallet/MyEtherWallet/releases/latest)
- MEW ETH Donation Address: 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D (mewtopia.eth)
- MEW BTC Donation Address: 1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9

## Bug / Feature Request

If you find a bug, or want a new feature added, please submit it on the [Github Issues](https://github.com/MyEtherWallet/MyEtherWallet/issues)

## Getting started

1. Open terminal
2. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
3. run `npm ci` to install node packages.
4. run `npm run build`. You can also use the offline version by opening the index file from the dist folder with your preferred browser
5. start `npm start`
6. If `npm start` fails and above the error message it states 'new update found' then the package.json version of the indicated packages needs to be updated to match the versions shown in the notice.
7. App should be running in `https://localhost:8080`

## Developers

1. Open terminal
2. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
3. run `git checkout develop`
4. run `npm ci` to install node packages.
5. run `npm run build`. You can also use the offline version by opening the index file from the dist folder with your preferred browser
6. start `npm run dev`
7. App should be running in `https://localhost:8080`

EACCESS issue can be resolved by running: `sudo chown -R $(whoami) ~/.npm`
For other issues, try the steps shown here: <https://github.com/MyEtherWallet/MyEtherWallet/issues/1182#issuecomment-506342875> by @tomwalton78
