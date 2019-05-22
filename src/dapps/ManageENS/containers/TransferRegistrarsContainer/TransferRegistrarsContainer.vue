<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>{{ fullDomainName }} is still in the old registrar!</h3>
      <p v-show="isOwner">
        Since you are are the owner of {{ fullDomainName }} you can transfer the
        name to the new registrar using transfer button
      </p>
      <div class="transfer-registrar-button">
        <button
          v-show="isOwner"
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : ''
          ]"
          @click="transferFunc"
        >
          <span v-show="!loading">
            Transfer
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
import { mapState } from 'vuex';
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
    owner: {
      type: String,
      default: ''
    },
    transferFunc: {
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
    }
  },
  computed: {
    ...mapState({
      account: 'account'
    }),
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    },
    isOwner() {
      return this.account.address.toLowerCase() === this.owner.toLowerCase();
    }
  },
  mounted() {
    if (this.hostName === '') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TransferRegistrarsContainer.scss';
</style>
