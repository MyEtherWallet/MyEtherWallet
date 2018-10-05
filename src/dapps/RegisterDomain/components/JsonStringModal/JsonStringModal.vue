<template>
  <b-modal
    ref="jsonString"
    title="JSON String"
    hide-footer
    class="bootstrap-modal json-string-modal"
    centered>
    <form class="json-string-form">
      <div class="input-container">
        <textarea 
          v-model="jsonText" 
          placeholder="{
  &quot;address&quot;: &quot;0xf6827a968275bd62c8ca5fc08cf498b8711491c1&quot;,
  &quot;msg&quot;: &quot;hellow&quot;,
  &quot;sig&quot;: &quot;0x32e4c6b54fb88487b1ea6b0bd41509aec82eb98969eec7127ecc8a1f1a8275724f3e97283ca3beb4692dd093150216cf602cd7a915605bfc3fb56f74f6e065d31c&quot;,
  &quot;version&quot;: &quot;3&quot;,
  &quot;signer&quot;: &quot;MEW&quot;
}"/>
      </div>
      <button
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="submitJson">
        Confirm
      </button>
      <interface-bottom-text 
        link="/" 
        link-text="Help Center" 
        question="Having issues?"/>
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
