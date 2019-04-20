<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>Cognratulations! {{ fullDomainName }} is available!</h3>
      <p>Do you want to register {{ fullDomainName }}?</p>
      <div class="secret-phrase-container">
        <label for="secret-phrase">Secret Phrase</label>
        <input v-model="localPhrase" name="secret-phrase" />
        <p>
          Please make sure to write down secret phrase, you will need it later
        </p>
      </div>
      <div class="transfer-registrar-button">
        <button
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : ''
          ]"
          @click="createCommitment(localPhrase)"
        >
          <span v-show="!loading">
            Register
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.helpCenter')"
      :question="$t('interface.haveIssues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    hostName: {
      type: String,
      default: ''
    },
    createCommitment: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    tld: {
      type: String,
      default: ''
    },
    secretPhrase: {
      type: String,
      default: 'random strings generated'
    }
  },
  data() {
    return {
      localPhrase: this.secretPhrase
    };
  },
  computed: {
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    }
  },
  watch: {
    localPhrase(newVal) {
      this.$emit('updateSecretPhrase', newVal);
    }
  },
  mounted() {
    console.log(this.secretPhrase);
    if (this.hostName === '') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCommitmentContainer.scss';
</style>
