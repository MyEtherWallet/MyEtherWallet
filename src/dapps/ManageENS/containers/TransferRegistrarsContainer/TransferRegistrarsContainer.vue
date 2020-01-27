<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>{{ $t('ens.domain-old', { domain: fullDomainName }) }}</h3>
      <p v-show="isOwner">
        {{ $t('ens.domain-owner', { domain: fullDomainName }) }}
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
            {{ $t('ens.transfer') }}
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
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
    deedOwner: {
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
    ...mapState('main', ['account']),
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    },
    isOwner() {
      return (
        this.account.address.toLowerCase() === this.deedOwner.toLowerCase()
      );
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
