<img src="./src/assets/images/presskit/logo-dark.png" width="300px"/>

[![Website](https://img.shields.io/website-up-down-green-red/http/myetherwallet.com.svg?label=MyEtherWallet.com\&style=flat-square)](http://www.MyEtherWallet.com/)
[![Github All Releases](https://img.shields.io/github/downloads/MyEtherWallet/MyEtherWallet/total.svg?style=flat-square)](https://www.github.com/MyEtherWallet/MyEtherWallet/releases)
[![GitHub issues](https://img.shields.io/github/issues-raw/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://github.com/MyEtherWallet/MyEtherWallet/issues)
[![GitHub package version](https://img.shields.io/github/package-json/v/MyEtherWallet/MyEtherWallet.svg?style=flat-square)](https://github.com/MyEtherWallet/MyEtherWallet/blob/main/package.json)
![GitHub contributors](https://img.shields.io/github/contributors/MyEtherWallet/MyEtherWallet.svg?style=flat-square) [![Codecov badge](https://img.shields.io/codecov/c/github/MyEtherWallet/MyEtherWallet/develop.svg?style=flat-square)](https://codecov.io/github/MyEtherWallet/MyEtherWallet?branch=develop)


## MEW Around the Web

* [Website: https://www.myetherwallet.com/](https://www.myetherwallet.com/)
* [Blog](https://www.myetherwallet.com/blog)
* [MEW Help Center](https://help.myetherwallet.com/)
* MEW Mobile App:
  * [IOS App](https://apps.apple.com/us/app/mew-wallet-ethereum-and-defi/id1464614025)
  * [Android App](https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet\&hl=en_US\&gl=US)
* [EthVM Blockchain explorer](https://www.ethvm.com/)
* [Enkrypt Wallet Extension](https://www.enkrypt.com)

* [X (Twitter)](https://x.com/myetherwallet)
* [YouTube](https://www.youtube.com/@MyEtherWallet)
* [Instagram](https://www.instagram.com/myetherwallet/)
* [Telegram](https://t.me/myetherwallet)
* [Reddit](https://www.reddit.com/r/MyEtherWallet/)
  
* [Github MEW Repo](https://github.com/MyEtherWallet/MyEtherWallet)
* [Github MEW Org](https://github.com/MyEtherWallet)
* [Github Latest Releases](https://github.com/MyEtherWallet/MyEtherWallet/releases/latest)
* MEW ETH Donation Address: 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D (mewtopia.eth)
* MEW BTC Donation Address: 1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9

## Bug / Feature Request

If you find a bug, or want a new feature added, please submit it on the [Github Issues](https://github.com/MyEtherWallet/MyEtherWallet/issues)

## Getting started

1. Open terminal
2. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
3. go into repo: `cd MyEtherWallet`
4. run `git checkout develop`
5. run `npm ci` to install node packages.
6. run `npm update` and update packages indicated by the script or add the packages to `package-test.js`
7. run `npm run build:nohash` and open the `index.html` file within the `/dist` folder. You can also build the offline version by running `npm run build:offline` and opening the `index.html` file from the `/dist` folder with your preferred browser

### To start the local dev environment, follow everything above and skip step 7

1. start `npm run dev`
2. App should be running in `https://localhost:8080`

EACCESS issue can be resolved by running: `sudo chown -R $(whoami) ~/.npm`

For other issues, try the steps shown here: <https://github.com/MyEtherWallet/MyEtherWallet/issues/1182#issuecomment-506342875> by @tomwalton78

For step 7, you may run into a memory heap problem, rerun the script using `NODE_OPTIONS=--max-old-space-size=8192 npm run build:nohash` or `NODE_OPTIONS=--max-old-space-size=8192 npm run build:offline`
P.S if you want Intercom to be enabled locally, create a `.env` file and add `INTERCOM_ID={yourIntercomKey}` otherwise Intercom will be disabled.

## Verify Signature with GPG library

### Step 1:

Download GPG file found in the repo https://github.com/MyEtherWallet/MyEtherWallet/blob/main/MEW-PUP-KEY-GPG

### Step 2:

Download signed (file with `.sig` extension) and the corresponding unsigned file (file with the same name and `.zip` extension)

### Step 3:

Open terminal and import downloaded public key:\
`gpg --import <MEW-PUP-KEY-GPG path>`

### Step 4:

Verify signature:\
`gpg --verify MyEtherWallet-<version>.zip.sig MyEtherWallet-<version>.zip`

Example output:

    $ gpg --verify MyEtherWallet-v6.9.22-hotfix.1.zip.sig MyEtherWallet-v6.9.22-hotfix.1.zip
    gpg: Signature made Mon Jun 30 12:17:24 2025 PDT
    gpg:                using RSA key 2FCA4A1E3AF4278F7AD3B7637F059C0F7B9A12F0
    gpg: Good signature from "MyEtherWallet Inc <support@myetherwallet.com>" [unknown]
    gpg: WARNING: This key is not certified with a trusted signature!
    gpg:          There is no indication that the signature belongs to the owner.

## NOTE

The warning is normal since you haven't marked the `MEW-PUP-KEY-GPG` key as "trusted" in your GPG keyring.\
You can ignore the warning or add it to your trusted keys in your GPG keyring
