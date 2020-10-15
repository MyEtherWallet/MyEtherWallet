<template>
  <div class="mew-component--token-table tableHeader pa-5">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <img
          src="@/assets/images/currencies/icon-btc-gold.svg"
          :alt="data.token"
          height="35"
          class="mr-3"
        />
        <div>
          <h5 class="font-weight-bold">{{ data.token }}</h5>
          <h5 class="font-weight-bold">2234.22</h5>
        </div>
      </div>
      <mew-button title="Trade" btn-size="small" btn-style="outline" />
    </div>

    <ul class="mt-3">
      <li>
        <div>Price:</div>
        <div>{{ data.price }}</div>
      </li>
      <li>
        <div>Market Cap:</div>
        <div>{{ data.cap }}</div>
      </li>
      <li>
        <div>24h Changes:</div>
        <div>{{ data.change }}</div>
      </li>
      <li>
        <div>Token Value:</div>
        <div>{{ data.value }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
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
