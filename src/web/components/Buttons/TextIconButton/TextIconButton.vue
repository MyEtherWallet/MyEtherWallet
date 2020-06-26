<template>
  <mew6-flexible-btn small>
    <div class="d-flex align-center justify-space-between py-2">
      <h4 class="mr-2 font-weight-bold">{{ data.label }}</h4>
      <img :src="data.icon" :alt="data.label" height="50" />
    </div>
  </mew6-flexible-btn>
</template>

<script>
export default {
  components: {},
  props: { data: { default: () => {}, type: Object } },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
