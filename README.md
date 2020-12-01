<img src="./src/assets/images/logo.png" width="300px"/>

[![Website](https://img.shields.io/website-up-down-green-red/http/myetherwallet.com.svg?label=MyEtherWallet.com\&style=flat-square)](http://www.MyEtherWallet.com/)
[![Github All Releases](https://img.shields.io/github/downloads/MyEtherWallet/MyEtherWallet/total.svg?style=flat-square)](https://www.github.com/MyEtherWallet/MyEtherWallet/releases)
[![GitHub issues](https://img.shields.io/github/issues-raw/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://github.com/MyEtherWallet/MyEtherWallet/issues)
[![Travis](https://img.shields.io/travis/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://travis-ci.org/MyEtherWallet/MyEtherWallet)
[![GitHub package version](https://img.shields.io/github/package-json/v/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://github.com/MyEtherWallet/MyEtherWallet/blob/master/package.json)
![GitHub contributors](https://img.shields.io/github/contributors/MyEtherWallet/MyEtherWallet.svg?style=flat-square) [![Codecov badge](https://img.shields.io/codecov/c/github/MyEtherWallet/MyEtherWallet/develop.svg?style=flat-square)](https://codecov.io/github/MyEtherWallet/MyEtherWallet?branch=develop)

MyEtherWallet is a doorway to the Ethereum blockchain, allowing users to manage their own funds without a centralized platform. -*Stephen, #MEWForce*

!["MyEtherWallet Logo](./src/assets/images/mew-screen.png "MyEtherWallet")

## Philosophy

* **Empower the people**: Give people the ability to interact with the Ethereum blockchain easily, without having to run a full node.
* **Make it easy & free**: Everyone should be able to create a wallet and send Ether & Tokens without additional cost.
* **People are the Priority**: People are the most important & their experience trumps all else. If monetization worsens the experience, we don't do it. (e.g. ads)
* **A learning experience, too**: We want to educate about Ethereum, security, privacy, the importance of controlling your own keys, how the blockchain works, and how Ethereum and blockchain technologies enable a better world.
* **If it can be hacked, it will be hacked**: Never save, store, or transmit secret info, like passwords or keys.
* **Offline / Client-Side**: User should be able to run locally and offline without issue.
* **Private**: No tracking!!! No emails. No ads. No demographics. We don't even know how many wallets have been generated, let alone who / what / where you are.
* **Open source & auditable**

## MEW Around the Web

* [Website: https://www.myetherwallet.com/](https://www.myetherwallet.com/)
* [CX: https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm](https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm)
* [Anti-phish CX](https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn)
* [FB: https://www.facebook.com/MyEtherWallet/](https://www.facebook.com/MyEtherWallet/)
* [Twitter: https://twitter.com/myetherwallet](https://twitter.com/myetherwallet)
* [Medium: https://medium.com/@myetherwallet](https://medium.com/@myetherwallet)
* [Github MEW Repo: https://github.com/MyEtherWallet/MyEtherWallet](https://github.com/MyEtherWallet/MyEtherWallet)
* [Github MEW Org: https://github.com/MyEtherWallet](https://github.com/MyEtherWallet)
* [Github Latest Releases: https://github.com/MyEtherWallet/MyEtherWallet/releases/latest](https://github.com/MyEtherWallet/MyEtherWallet/releases/latest)
* [Github Anti-phish CX: https://github.com/409H/EtherAddressLookup](https://github.com/409H/EtherAddressLookup)
* MEW ETH Donation Address: 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D (mewtopia.eth)
* MEW BTC Donation Address: 1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9

## Bug / Feature Request

If you find a bug, or want a new feature added, please submit it on the [Github Issues](https://github.com/MyEtherWallet/MyEtherWallet/issues)

## Reporting a Vulnerability

**Please do not file a public ticket** mentioning the vulnerability.

To find out how to disclose a vulnerability visit [hackerone.com/myetherwallet](https://hackerone.com/myetherwallet).

## Getting started

1. Make sure you have NodeJS newer than version 8, but older than version 12, and NPM version 6 or greater.
2. Open terminal
3. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
4. run `npm i` to install node packages.
5. run `npm run build`. If instructed to edit `package.json` to use newly released versions of dependencies, do so and then run `npm update` and `npm run build` again. After this step succeeds, you can stop and use the offline version by opening the index file from the dist folder with your preferred browser.
6. start with `npm start`. If instructed to edit `package.json` for newly updated dependencies, see previous step.
7. If `npm start` fails and above the error message it states 'new update found' then the package.json version of the indicated packages needs to be updated to match the versions shown in the notice.
8. App should be running in `https://localhost:8080`

## Developers

1. Open terminal
2. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
3. run `git checkout develop`
4. run `npm i` to install node packages.
5. run `npm run build`. You can also use the offline version by opening the index file from the dist folder with your preferred browser
6. start `npm run dev`
7. App should be running in `https://localhost:8080`

Can't start due to an update found:
Update the package in the `package.json` as told by the terminal error you see.
Example error: `new update found print-js 1.0.60 1.0.63 2019-11-15T05:05:52.202Z`

EACCESS issue can be resolved by running: `sudo chown -R $(whoami) ~/.npm`
For other issues, try the steps shown here: <https://github.com/MyEtherWallet/MyEtherWallet/issues/1182#issuecomment-506342875> by @tomwalton78
