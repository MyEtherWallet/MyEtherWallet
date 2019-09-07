<template>
  <div>
    <p>
      This is most likely due to the fact that you are behind a firewall, you
      have refreshed the page a bunch of times and hit your hourly-API-limit, or
      our nodes are under extreme strain and are refusing to return your balance
      information.
    </p>
    <p>
      The easiest way to check your balance is actually not by unlocking your
      wallet. You only need your address in order to see your balance. It is not
      recommended that you enter your private key anywhere if you just want to
      check on the balance or see incoming / outgoing transactions. Instead...
    </p>
    <code>ETH</code>
    <p>
      <a href="https://etherscan.io/" rel="noopener noreferrer" target="_blank"
        >https://etherscan.io/</a
      >. Paste your address into the search bar and it will pull up your address
      and transaction history.
    </p>
    <code>Tokens</code>
    <p>
      <a href="https://ethplorer.io/" rel="noopener noreferrer" target="_blank"
        >https://ethplorer.io/</a
      >
      allows you to easily see token balances and transfers.
    </p>
    <p>
      You can also see all tokens on
      <a href="https://etherscan.io/" rel="noopener noreferrer" target="_blank"
        >https://etherscan.io/</a
      >
      now. Your balances are in the dropdown in the header section thingy. Your
      transfers can be viewed on the "
      <a
        href="https://etherscan.io/address/0x7cb57b5a97eabe94205c07890be4c1ad31e486a8#tokentxns"
        >Token Transfers</a
      >" tab.
    </p>
    <code>ETC</code>
    <p>
      <a href="https://gastracker.io/" rel="noopener noreferrer" target="_blank"
        >https://gastracker.io/</a
      >. Paste your address into the search bar and it will pull up your address
      and transaction history.
    </p>

    <h5>
      If you need to send some tokens and they aren't loading, here are some
      things you can try to troubleshoot:
    </h5>

    <ol>
      <li>
        Hard refresh the page. On Chrome on OSX you hit <abbr>cmd</abbr>+
        <abbr>shift</abbr>+ <abbr>r</abbr>. On a PC, I assume it is
        <abbr>ctrl</abbr>+ <abbr>shift</abbr>+ <abbr>r</abbr>.
      </li>
      <li>Check your internet / firewall.</li>
      <li>
        Try connecting to a different network in the top-right corner. Choosing
        one that you are not currently connected to may solve your problem. If
        you are interacting with the Ethereum blockchain, you have four nodes to
        choose from:
        <ul class="list-in-block">
          <li>MyEtherWallet</li>
          <li>Etherscan.io</li>
          <li>Infura.io</li>
          <li>Giveth.io</li>
        </ul>
      </li>
    </ol>
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
