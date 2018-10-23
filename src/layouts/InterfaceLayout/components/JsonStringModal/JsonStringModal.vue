<template>
  <div class="modal-container">
    <b-modal
      ref="jsonstring"
      title="JSON String"
      hide-footer
      centered
      class="bootstrap-modal balance nopadding">

      <div class="modal-content-container">
        <standard-input :options="inputJSONString" />

        <div class="button-block">
          <standard-button 
            :options="buttonConfirm"
            class="confirm-button"
            @click.native="modalStatusDomainTaken = 'show'"
          />
        </div>
        
        <interface-bottom-text
          :link-text="$t('interface.etherscanIO')"
          :question="$t('interface.ethNodeProvidedBy')"
          link="/"/>

      </div>


    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {},
  data() {
    return {
      buttonConfirm: {
        title: 'Confirm',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false,
        isThisMobileBottomButton: false
      },
      inputJSONString: {
        title: '',
        value:
          '"address": "0x98923492735927390527930270345723094729034793"\nkjhwerifhwefiohw\n98u98u432r 23r723gr8273r23r\niujerwiuf2h9f3hefr983fr9823hr9283yr9238ry',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        isTextarea: true
      }
    };
  },
  mounted() {
    //this.$refs.jsonstring.show();
  }
};
</script>

<style lang="scss" scoped>
@import 'JsonStringModal.scss';
</style>
