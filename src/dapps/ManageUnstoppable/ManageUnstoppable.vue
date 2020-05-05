<template>
  <div class="unstoppable-container">
    <back-button
      v-show="!domainName"
      :path="'/interface/dapps/'"
      :title="$t('common.exit-dapp')"
    />
    <back-button
      v-show="domainName"
      :path="'/interface/dapps/manage-unstoppable'"
      :title="$t('common.back')"
    />
    <div class="branding-container">
      <div class="name-container">
        <img
          height="33"
          src="@/assets/images/icons/dapps/unstoppable-blue.png"
          alt="Unstoppable"
        />
        <span>{{ $t('unstoppable.title-manage') }}</span>
      </div>
      <div class="about-text">{{ $t('unstoppable.about-unstoppable') }}</div>
    </div>
    <router-view
      :account="account"
      :web3="web3"
      :domain-name="domainName"
      :set-domain="setDomain"
    />
  </div>
</template>

<script>
import '@stripe/stripe-js';
import { mapState } from 'vuex';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'back-button': BackButton
  },
  data() {
    return { domainName: '' };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account']),
    label() {
      if (!this.domainName) {
        return '';
      }
      const labelPosition = this.domainName.indexOf('.');
      return labelPosition !== -1
        ? this.domainName.substr(0, labelPosition)
        : '';
    },
    tld() {
      if (!this.domainName) {
        return '';
      }
      const tldPosition = this.domainName.lastIndexOf('.');
      return tldPosition !== -1
        ? this.domainName.substr(tldPosition + 1, this.domainName.length)
        : '';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setup();
    });
  },
  methods: {
    setup() {},
    setDomain(domainName) {
      this.domainName = domainName;
      this.$router.push({ path: `manage-unstoppable/${this.tld}` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageUnstoppable.scss';
</style>
