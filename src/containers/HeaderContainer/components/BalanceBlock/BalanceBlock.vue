<template>
  <div class="main-menu--balance-block block-wrap">
    <div class="block-title">Balance</div>
    <div class="block-content">
      <p class="balance-amount">7130.000000 ETH</p>
    </div>
    <div class="top-right-content">
      <button>
        <img class="more-info-icon" src="@/assets/images/icons/more.svg" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainMenuBalanceBlock',
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'BalanceBlock.scss';
</style>
