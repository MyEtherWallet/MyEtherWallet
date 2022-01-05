<template>
  <div>
    <mew-input
      type="number"
      :max-btn-obj="{
        title: 'Max',
        disabled: false,
        method: setMaxAmount
      }"
    />

    <div class="d-flex">
      <div>
        <div>YOU GIVE</div>
      </div>
      <div>
        <div>YOU WILL GET</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleSubStakeEth',
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    setMaxAmount() {}
  }
};
</script>

<style lang="scss" scoped></style>
