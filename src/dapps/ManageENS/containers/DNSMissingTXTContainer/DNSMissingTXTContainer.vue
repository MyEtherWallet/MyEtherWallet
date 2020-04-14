<template lang="html">
  <div class="dns-process-error">
    <div
      v-if="owner === '0x0000000000000000000000000000000000000000'"
      class="dns-process-content"
    >
      <h3>{{ $t('ens.txt.setup-not-found', { domain: domainName }) }}</h3>
      <p>{{ $t('ens.txt.add-txt-type-entry', { txtString: typeString }) }}</p>
    </div>
    <div v-else class="dns-process-content">
      <h3>
        {{ $t('ens.txt.name-owned', { owner: owner, domain: domainName }) }}
      </h3>
      <p>{{ $t('ens.txt.unclaim-desc', { domain: domainName }) }}</p>
      <div class="claim-dns-button">
        <button
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : ''
          ]"
          @click="claimFunc"
        >
          <span v-show="!loading">
            {{ $t('ens.txt.unclaim') }}
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
import InterfaceBottomText from '@/components/InterfaceBottomText';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      default: ''
    },
    claimFunc: {
      type: Function,
      default: function () {}
    },
    dnsClaim: {
      type: Object,
      default: () => {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    typeString() {
      return `{{'_ens.' + ${this.domainName}}}`;
    }
  },
  mounted() {
    if (this.domainName === '.') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DNSMissingTXTContainer.scss';
</style>
