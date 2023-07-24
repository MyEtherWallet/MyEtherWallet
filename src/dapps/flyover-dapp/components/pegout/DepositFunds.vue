<template>
  <div class="text-center">
    <h2 class="mb-2">{{ $t('flyover.pegout.deposit.thanks') }}</h2>

    <h3>
      <a class="mb-4" :href="hash" target="_blank">{{
        $t('flyover.pegout.deposit.tx')
      }}</a>
    </h3>

    <h3>
      <p class="mb-2 mt-2">{{ $t('flyover.pegout.deposit.done') }}</p>
    </h3>
  </div>
</template>

<script>
export default {
  name: 'DepositFunds',
  components: {},
  props: {
    hash: {
      default: '',
      type: String
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  destroyed() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.note {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
