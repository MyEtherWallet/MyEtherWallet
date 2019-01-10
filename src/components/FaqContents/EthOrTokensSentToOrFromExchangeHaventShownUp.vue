<template>
  <div>
    <p>
      First, check the transaction on https://etherscan.io/ and ensure that
      there is no red ( ! ) symbol by the transaction.
    </p>
    <p>
      A successful transaction will look like
      <a
        href="https://etherscan.io/tx/0xcde5a30a1a1514919e9c357d4e89211701aa22a741936ad9516c2987d8b097c9"
        target="_blank"
        rel="noopener noreferrer"
        >this</a
      >.
    </p>
    <p>
      And unsuccessful one will look like
      <a
        href="https://etherscan.io/tx/0xf9c8514fad47eb54a414930563aabfeceb465c9f308f5f294a37edd0d669243c"
        target="_blank"
        rel="noopener noreferrer"
        >this</a
      >.
    </p>
    <p>
      If there is no red symbol, that means the transaction is a valid &
      successful transaction on the blockchain.
    </p>
    <p>
      MyEtherWallet is not a "web-wallet" and we do not store your funds and you
      do not have an account with us. We do not have the ability to process
      withdrawals nor deposits, nor can we send or cancel transactions. If your
      funds aren't showing up where you sent them, you likely need to reach out
      to that service and for more information.
    </p>
    <p>
      We also highly recommend that you Google the services you send funds to as
      there are a lot of scams out there. Typing in "[service name] + scam" or
      "[service name] + reviews" will help you determine if you are sending to a
      legitimate service.
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
