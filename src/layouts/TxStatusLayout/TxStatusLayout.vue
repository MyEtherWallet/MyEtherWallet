<template>
  <div class="tx-status">
    <div class="wrap">
      <div class="page-container">
        <div class="content-width-limit">
          <div class="page-header">
            <h1>Transaction Status</h1>
          </div>

          <div class="content">
            <p>
              Check the status of your transactions, and replace or cancel pending transactions.
            </p>

            <p>
              Please note that this tool cannot be used to edit verified transactions,
              and can only be used successfully when transaction pools are full.
              Please read here to <a href="https://myetherwallet.com">Learn more</a>.
            </p>
          </div>
        </div>
      </div><!-- .page-container -->
    </div>
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
@import 'TxStatusLayout-desktop.scss';
@import 'TxStatusLayout-tablet.scss';
@import 'TxStatusLayout-mobile.scss';
</style>
