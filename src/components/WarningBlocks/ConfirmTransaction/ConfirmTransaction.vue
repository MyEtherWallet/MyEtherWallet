<template>
  <div class="d-flex align-start warning-content py-6 px-8">
    <v-icon :color="iconColor">mdi-alert</v-icon>
    <div class="ml-4">
      Please confirm the transaction on your device, and make sure all your
      transaction details are CORRECT. Learn more <a href="#">here…</a>
    </div>
  </div>
</template>

<script>
import Var from '@/common/plugins/variables.js';

export default {
  components: {},
  props: {},
  data() {
    return {
      iconColor: Var.colorSets.warning
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.warning-content {
  background-color: $yellow-1;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

a {
  color: $emerald !important;
  text-decoration: none;
  font-weight: 500;
}
</style>
