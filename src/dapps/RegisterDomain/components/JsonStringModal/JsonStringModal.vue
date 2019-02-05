<template>
  <b-modal
    ref="jsonString"
    :title="$t('dapps.jsonString')"
    hide-footer
    class="bootstrap-modal json-string-modal"
    centered
  >
    <form class="json-string-form">
      <div class="input-container">
        <textarea
          v-model="jsonText"
          placeholder="{
            'address': '0xf6827a968275bd62c8ca5fc08cf498b8711491c1',
            'msg': 'hellow',
            'sig': '0x32e4c6b54fb88487b1ea6b0bd41509aec82eb98969eec7127ecc8a1f1a8275724f3e97283ca3beb4692dd093150216cf602cd7a915605bfc3fb56f74f6e065d31c',
            'version': '3',
            'signer': 'MEW'
          }"
        />
      </div>
      <button
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="submitJson"
      >
        {{ $t('dapps.confirm') }}
      </button>
      <interface-bottom-text
        link="mailto:support@myetherwallet.com"
        link-text="https://kb.myetherwallet.com"
        question="Having issues?"
      />
    </form>
  </b-modal>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    updateJsonString: {
      type: Function,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      jsonText: ''
    };
  },
  methods: {
    submitJson() {
      this.updateJsonString(this.jsonText);
      this.jsonText = '';
      this.$refs.jsonString.hide();
    }
  }
};
</script>
<style lang="scss">
@import 'JsonStringModal.scss';
</style>
