<template>
  <v-sheet
    color="bg_warning"
    class="d-flex align-start border-radius-bottom--10px py-6 px-8"
  >
    <v-icon color="text_warning">mdi-alert</v-icon>
    <div class="darkSpace--text ml-4">
      Please confirm the transaction on your device, and make sure all your
      transaction details are CORRECT. Learn more
      <a class="emerald--text text-decoration--none font-weight-medium" href="#"
        >here…</a
      >
    </div>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>
