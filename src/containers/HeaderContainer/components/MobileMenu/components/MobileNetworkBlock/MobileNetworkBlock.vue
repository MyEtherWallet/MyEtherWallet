<template>
  <div class="mobile-network-block">
    <interface-balance-modal ref="balanceModal" />
    <div class="wrap">
      <div class="top-block">
        <div class="block-title">
          Network
        </div>
        <button class="change-button">
          Change
        </button>
      </div>
      <div class="bottom-block">
        <p class="network">Myetherapi.com (ETH)</p>
        <p class="last-block">Last Block#: 5699679</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileBalanceBlock',
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MobileNetworkBlock.scss';
</style>
