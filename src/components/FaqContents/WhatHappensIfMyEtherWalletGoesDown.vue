<template>
  <div>
    <p>
      MyEtherWallet is not a web wallet. You don't have a login, and nothing
      ever gets saved to our servers. It is simply an interface that allows you
      to interact with the blockchain.
    </p>
    <p>
      If MyEtherWallet.com goes down, you would have to find another way (like
      geth or Ethereum Wallet / Mist) to do what we are doing. But you wouldn't
      have to "get" your Ether out of MyEtherWallet because it's not in
      MyEtherWallet. It's in whatever wallet your generated via our site.
    </p>
    <p>
      You can import your unencrypted private key and your Geth/Mist Format
      (encrypted) files directly into geth / Ethereum Wallet / Mist very easily.
    </p>
    <p>
      You can also run
      <a
        href="https://kb.myetherwallet.com/offline/running-myetherwallet-locally.html"
        target="_blank"
        rel="noopener noreferrer"
        >MyEtherWallet locally</a
      >
      and/or
      <a
        href="https://kb.myetherwallet.com/networks/run-your-own-node-with-myetherwallet.html"
        target="_blank"
        rel="noopener noreferrer"
        >connect it to your own node</a
      >.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'FaqContents.scss';
</style>
