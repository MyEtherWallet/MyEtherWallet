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
        v-if="deedOwner === wallet.getChecksumAddressString() && owner === '0x0000000000000000000000000000000000000000'"
        class="finalize-button"
        @click="openFinalizeModal">
        Finalize
      </button>
      <button
        v-if="owner === wallet.getChecksumAddressString()"
        class="manage-button"
        @click="manageEns">Manage</button>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="mailto:support@myetherwallet.com"/>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import FinalizeModal from '../../components/FinalizeModal/';

import { mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
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
