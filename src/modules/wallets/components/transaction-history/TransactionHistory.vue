<template>
  <div class="mew-component--side-info-tx-history">
    <mew6-white-sheet :sideinfo="!mobile" class="px-5 px-lg-7 py-5">
      <div class="d-flex align-center justify-space-between">
        <h4 class="font-weight-bold">{{ title }}</h4>
        <div class="primary--text font-weight--500">EthVM</div>
      </div>

      <div class="mt-5 ml-n5 mr-n5 pr-5 tx-blocks custom-scroll-bar">
        <txBlock
          class="mb-5"
          address="0x68dcd0743ea5dea3f03c6e49bbfb1eb72ab050a3"
          amount="0.0023"
          time="1m"
          direction="in"
          status="success"
        />
        <txBlock
          class="mb-5"
          address="0x68dcd0743ea5dea3f03c6e49bbfb1eb72ab050a3"
          amount="0.0023"
          time="1m"
          direction="out"
          status="pending"
        />
        <txBlock
          class="mb-5"
          address="0x68dcd0743ea5dea3f03c6e49bbfb1eb72ab050a3"
          amount="0.0023"
          time="1m"
          direction="out"
          status="pending"
        />
        <txBlock
          class="mb-5"
          address="0x68dcd0743ea5dea3f03c6e49bbfb1eb72ab050a3"
          amount="0.0023"
          time="1m"
          direction="out"
          status="pending"
        />
        <txBlock
          address="0x68dcd0743ea5dea3f03c6e49bbfb1eb72ab050a3"
          amount="0.0023"
          time="1m"
          direction="swap"
          status="error"
        />
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
import txBlock from './component/tx-block/TxBlock';

export default {
  components: { txBlock },
  props: {
    mobile: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.mew-component--side-info-tx-history {
  .tx-blocks {
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
