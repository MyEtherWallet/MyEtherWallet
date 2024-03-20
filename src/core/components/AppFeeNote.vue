<template>
  <app-modal :show="show" :close="close" :has-buttons="buttons">
    <template #dialogBody>
      <div class="mew-heading-1 mb-2">How are fees determined?</div>
      <div class="mt-6 textLight--text">
        Transaction fees are charged by Ethereum miners, not MEW. We can't
        influence them and we don't receive any part of the transaction fees
        that you pay.
      </div>
      <div class="mew-heading-1 my-2 mt-6">What should I do?</div>
      <div class="mt-6 textLight--text">
        Good news! You have options! If you’re not in a hurry, you can use the
        “Normal” setting and your transaction will be mined at a later time. MEW
        supports Ethereum scaling solutions Polygon and Binance Smart Chain
        (accessible on MEW web and Android). Consider using these chains to
        avoid congestion and save on fees. Learn how
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://help.myetherwallet.com/en/?q=network"
          >here</a
        >.
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/core/components/AppModal.vue';
export default {
  components: { AppModal },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    },
    buttons: {
      default: false,
      type: Boolean
    }
  }
};
</script>

<style scoped></style>
