<template>
  <div
    class="mew-component--domain-btn d-flex align-center justify-space-between cursor--pointer user-select--none"
  >
    <div class="d-flex align-center">
      <div class="mew-heading-3">{{ domain }}</div>
      <badge
        v-if="badge"
        class="ml-3"
        :badge-title="badge"
        badge-type="error"
      />
    </div>
    <div class="primary--text font-weight-medium">Buy domain</div>
  </div>
</template>

<script>
export default {
  props: {
    domain: {
      type: String,
      default: ''
    },
    badge: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.mew-component--domain-btn {
  background-color: var(--v-errorOutlineActive-base) !important;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 10px;
}
</style>
