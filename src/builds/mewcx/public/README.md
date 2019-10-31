# MyEtherWallet Chrome Extension V5

<img src="./img/icons/icon192.png" />

## Build

Like the webapp version, the chrome extension is also built with Vue.
With that in mind, You can run this command on your terminal:
`npm install; npm run start:mewcx`
This should output a folder called `chrome-extension` which you can install on your browser.
[See here for more details](https://developer.chrome.com/extensions/getstarted#manifest)

### Dev Info

This chrome extension follows the EIP-1193. But with the way teh wallets are stored/generated, we excempted `accountsChanged`.
For more info, you can read the EIP-1193 specs [here](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md)

## Web3 API

Our API still follows the current web3 iteration. Only change is that you'll have to interact with the Chrome Extension.

`eth_account`: Opens an account selection modal and returns the selected account.
`eth_coinbase`: Returns the selected account for the page.
`eth_sign`: Actually uses `personnal_sign` internally because we don't inject your unlocked account to web3. Still returns the signedMsg as a hex value.
`eth_sendTransaction`: Opens a confirmation modal and returns the `tx_hash`. Internally, we sign the transaction, send the raw signed transaction, and return the `tx_hash`

## Issues

As with our webapp, you can submit issues at our [Github repo](https://github.com/myetherwallet/myetherwallet/issues) or you can email us at [support@myetherwallet.com](mailto:support@myetherwallet.com)
