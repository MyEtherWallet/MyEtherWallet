<template>
  <mew6-flexible-btn small :to="to">
    <div class="d-flex align-center justify-space-between py-2">
      <h4 class="mr-2 font-weight-bold">{{ label }}</h4>
      <img :src="icon" :alt="label" height="50" />
    </div>
  </mew6-flexible-btn>
</template>

<script>
export default {
  components: {},
  props: {
    label: { default: '', type: String },
    icon: { default: '', type: String },
    to: { default: () => {}, type: Object }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
