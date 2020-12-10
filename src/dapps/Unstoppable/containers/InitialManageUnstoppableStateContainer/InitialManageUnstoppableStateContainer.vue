<template lang="html">
  <div class="initial-state-unstoppable">
    <div class="content-container">
      <div class="title-container">
        <div class="title">
          <span>
            {{ $t('unstoppable.your-crypto-domains') }}
          </span>
        </div>
      </div>
      <div class="content">
        <div
          v-show="!loading && (!domains || !domains.length)"
          class="no-domains"
        >
          {{ $t('unstoppable.no-crypto-domains-one') }}
          <span class="link" @click="handleBuyClick()">
            {{ $t('unstoppable.no-crypto-domains-two') }}</span
          >
        </div>
        <div v-show="loading" class="loading-container">
          <i class="fa fa-spinner fa-lg fa-spin" />
        </div>
        <div
          v-for="domain in domains"
          v-show="!loading"
          :key="domain"
          class="domain-row"
        >
          <div class="name">{{ domain }}</div>
          <button class="button" @click="setDomain(domain)">Manage</button>
        </div>
      </div>
    </div>

    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://howto.xinfin.org/XinFinWallet/features"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    account: {
      type: Object,
      default: function () {}
    },
    setDomain: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      domains: [],
      loading: true
    };
  },
  computed: { ...mapState('main', ['online']) },
  mounted() {
    this.setDomain('');
    if (this.online) {
      this.getDomains();
    }
  },
  methods: {
    async getDomains() {
      const domains = await fetch(
        `https://unstoppabledomains.com/api/zns-domains/${this.account.address}`
      )
        .then(resp => {
          if (resp.status === 200) {
            return resp.json();
          }
          throw new Error('Failed to fetch crypto domains');
        })
        .then(({ domains }) =>
          domains.map(domain => domain.label + '.' + domain.extension)
        )
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.domains = domains;
      this.loading = false;
    },
    handleBuyClick() {
      this.$router.push('/interface/dapps/unstoppable');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InitialManageUnstoppableStateContainer.scss';
</style>
