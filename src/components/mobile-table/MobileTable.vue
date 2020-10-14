<template>
  <div class="mew-component--token-table tableHeader pa-5">
    <div v-if="token" class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center">
        <img
          src="@/assets/images/currencies/icon-btc-gold.svg"
          :alt="token"
          height="35"
          class="mr-3"
        />
        <div>
          <h5 class="font-weight-bold">{{ token }}</h5>
          <h5 v-if="tokenValue" class="font-weight-bold">{{ tokenValue }}</h5>
        </div>
      </div>
      <mew-button title="Trade" btn-size="small" btn-style="outline" />
    </div>

    <div v-if="vault" class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center">
        <div>
          <h5 class="font-weight-bold">ETH</h5>
        </div>
      </div>
      <mew-button title="Manage" btn-size="small" btn-style="outline" />
    </div>

    <ul>
      <li v-for="(t, key) in tableData" :key="key" class="mt-2">
        <div>{{ t.label }}</div>
        <div
          v-if="t.link"
          class="font-weight-bold text-overflow--ellipsis primary--text"
          style="max-width: 50%"
        >
          <a :href="t.link" target="_blank">{{ t.value }}</a>
        </div>
        <div v-else class="font-weight-bold">{{ t.value }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    token: {
      type: String,
      default: ''
    },
    tokenValue: {
      type: String,
      default: ''
    },
    vault: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.mew-component--token-table {
  border-radius: 5px;
}

ul {
  li {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
