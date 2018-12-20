<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title isbackbutton="true" />
      <div class="content-container">iuehfowh osijfo gv</div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle
  },
  props: {
    providerData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'SwapSendForm.scss';
</style>
