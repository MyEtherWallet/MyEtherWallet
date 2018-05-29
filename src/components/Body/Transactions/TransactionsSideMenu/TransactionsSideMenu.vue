<template>
  <div class="transactions-side-menu">
    <ul>
      <li>
        Send
        <ul>
          <li>Send ETH and Tokens</li>
          <li>Send Offline</li>
        </ul>
      </li>
      <li>Swap</li>
      <li>Dapps</li>
      <li>
        Contract
        <ul>
          <li>Interact With Contract</li>
          <li>Deploy Contract</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionsSideMenu.scss";
</style>
