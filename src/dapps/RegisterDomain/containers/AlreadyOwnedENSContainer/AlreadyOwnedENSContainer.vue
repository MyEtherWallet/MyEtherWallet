<template lang="html">
  <div class="already-owned-container">
    <finalize-modal
      ref="finalizeModal"
      :domain-name="domainName"
      :finalize="finalize"/>
    <h3>{{ domainName }}.eth is already owned.</h3>
    <div class="content-container">
      <p class="label"> Labelhash({{ domainName }}.eth): </p>
      <p class="content"> {{ labelHash }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Namehash({{ domainName }}): </p>
      <p class="content"> {{ nameHash }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Owner: </p>
      <p class="content"> {{ owner }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Highest Bidder(Deed Owner): </p>
      <p class="content"> {{ deedOwner }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Resolver Address: </p>
      <p class="content"> {{ resolverAddress }} </p>
    </div>
    <div class="owner-options">
      <button
        v-if="deedOwner === $store.state.wallet.getChecksumAddressString() && owner === '0x0000000000000000000000000000000000000000'"
        @click="openFinalizeModal">
        Finalize
      </button>
      <span
        v-if="owner === $store.state.wallet.getChecksumAddressString()"
        @click="manageEns">Manage</span>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="/"/>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import FinalizeModal from '../../components/FinalizeModal/';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'finalize-modal': FinalizeModal
  },
  props: {
    labelHash: {
      type: String,
      default: ''
    },
    nameHash: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      default: ''
    },
    deedOwner: {
      type: String,
      default: ''
    },
    resolverAddress: {
      type: String,
      default: ''
    },
    domainName: {
      type: String,
      default: ''
    },
    finalize: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    openFinalizeModal() {
      this.$refs.finalizeModal.$refs.finalize.show();
    },
    manageEns() {
      this.$router.push('manage');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AlreadyOwnedENSContainer.scss';
</style>
