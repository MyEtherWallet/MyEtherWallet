<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title isbackbutton="true" />
      <div class="content-container">
        <accordion-menu title="Verification" number="1">
          <p>
            You will receive a 6 digits PIN number through your phone number. To
            continue, enter the PIN number below.
          </p>
        </accordion-menu>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import AccordionMenu1 from '@/components/AccordionMenu1';
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'accordion-menu': AccordionMenu1
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
