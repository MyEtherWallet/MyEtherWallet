<template>
  <div>
    <the-wrapper-dapp
      :is-new-header="true"
      :dapp-img="headerImg"
      :banner-text="header"
      :tab-items="tabs"
      :active-tab="activeTab"
      external-contents
      :on-tab="tabChanged"
      :valid-networks="validNetworks"
    >
      <!--
    =====================================================================================
      Register Domain - Tab 1
    =====================================================================================
    -->
      <template #tabContent1>
        <v-sheet
          max-width="700px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div class="mb-5">
            <div class="mew-heading-2 mb-8 ml-2">
              {{ $t('rns.search-domain') }}
            </div>
            <form @submit.prevent="findDomain">
              <v-row class="mx-0">
                <v-col class="pr-0" cols="8">
                  <mew-input
                    :value="name"
                    :has-clear-btn="true"
                    :rules="rules"
                    :label="$t('rns.register.domain-name')"
                    :placeholder="$t('rns.ph.three-char')"
                    class="mr-3 flex-grow-1"
                    :error-messages="errorMessages"
                    @input="setName"
                  />
                </v-col>
                <v-col class="pl-0" cols="4">
                  <mew-button
                    :loading="loading"
                    :disabled="
                      !name ||
                      (name && name.length < 3) ||
                      loading ||
                      (name && name.split('.').length > 2)
                    "
                    :has-full-width="true"
                    btn-size="xlarge"
                    :title="$t('rns.register.name')"
                    @click.native="findDomain"
                  />
                </v-col>
              </v-row>
            </form>
          </div>
        </v-sheet>
      </template>

      =====================================================================================
      Reverse Lookup - Tab 2
      =====================================================================================
      -->
      <template #tabContent2>
        <v-sheet
          max-width="500px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div>
            <rns-reverse-lookup :address="address" :rns-manager="nameHandler" />
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>

    <!--
    =====================================================================================
      Register Domain Overlay
    =====================================================================================
    -->
    <module-register-domain
      v-if="onRegister"
      ref="registerDomain"
      :on-register="onRegister"
      :close="closeRegister"
      :register="register"
      :not-enough-funds="notEnoughFunds"
      :loading-commit="loadingCommit"
      :loading-reg="loadingReg"
      :commited="committed"
      :minimum-age="minimumAge"
      :commit="commit"
      :no-funds-for-reg-fees="noFundsForRegFees"
      :commit-fee-in-eth="commitFeeInEth"
      :commit-fee-in-wei="commitFeeInWei"
      :commit-fee-usd="commitFeeUsd"
      :name="name"
      :checking-domain-avail="loading"
      :get-rent-price="getRentPrice"
      :waiting-for-reg="waitingForReg"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { RNS_MANAGER_ROUTE } from './routes';
import normalise from '@/core/helpers/normalise';
import RNSManager from './handlers/handlerRNSManager';
import ReverseRegister from './handlers/helpers/reverseRegistrar';
import { ethers, BigNumber } from 'ethers';
import { setInterval } from 'timers';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin.js';

export default {
  name: 'RNSManagerLayout',
  components: {
    TheWrapperDapp,
    ModuleRegisterDomain: () => import('./modules/ModuleRegisterDomain'),
    RnsReverseLookup: () => import('./components/reverse/RnsReverseLookup')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      name: '',
      regSecret: '',
      searchError: '',
      notEnoughFunds: false,
      onRegister: false,
      validNetworks: SUPPORTED_NETWORKS,
      headerImg: require('@/assets/images/icons/dapps/icon-dapp-rns.svg'),
      header: {
        title: this.$t('rns.title'),
        subtext: this.$t('rns.dapp-desc')
      },
      activeTab: 0,
      loadingCommit: false,
      loadingReg: false,
      committed: false,
      minimumAge: '',
      noFundsForRegFees: false,
      commitFeeInEth: '',
      domainPrice: '',
      commitFeeInWei: '0',
      commitFeeUsd: '0',
      waitingForReg: true,
      tabs: [
        {
          name: this.$t('rns.register-domain'),
          route: { name: RNS_MANAGER_ROUTE.CORE.NAME },
          id: 0
        },
        {
          name: this.$t('rns.my-domains'),
          route: {
            name: RNS_MANAGER_ROUTE.MANAGE.NAME,
            path: RNS_MANAGER_ROUTE.MANAGE.PATH
          },
          id: 1
        }
      ]
    };
  },
  computed: {
    ...mapGetters('custom', ['customTokens']),
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance']),
    errorMessages() {
      if (this.domainTaken) return this.$t('rns.domain-taken');
      return this.searchError;
    },
    loading() {
      return false;
    },
    rules() {
      return [
        this.searchError === '' || this.searchError,
        (this.name && this.name.length > 2) ||
          this.$t('rns.warning.not-enough-char'),
        !this.hasInvalidChars || this.$t('rns.warning.invalid-symbol'),
        (this.name && this.name.split('.').length <= 2) ||
          this.$t('rns.warning.invalid-symbol')
      ];
    },
    hasInvalidChars() {
      const letters = /^[0-9a-zA-Z_.-]+$/;
      if (!letters.test(this.name)) {
        return true;
      }
      return false;
    }
  },
  watch: {
    $route() {
      this.detactUrlChangeTab();
    }
  },
  mounted() {
    this.setup();
  },
  methods: {
    setup() {
      const provider = new ethers.providers.Web3Provider(
        this.web3.currentProvider
      );
      this.nameHandler = new RNSManager(this.instance, provider);
      this.reverseHandler = new ReverseRegister(this.instance, provider);
    },
    async findDomain() {
      try {
        const [name, domain] = this.name.split('.');

        if (domain !== 'rsk') {
          this.searchError =
            'Only .rsk names are supported. Please make sure to include ".rsk".';
          return;
        }

        if (name.length < 5) {
          this.searchError =
            'Domains with less than 5 characters are blocked. stay tuned, we are going to release them soon';
          return;
        }

        const available = await this.nameHandler.searchName(name);

        if (available) {
          this.onRegister = true;
        } else {
          this.searchError = 'Name not available';
        }
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    detactUrlChangeTab() {
      const currentRoute = this.$route.name;

      if (currentRoute === RNS_MANAGER_ROUTE.MANAGE.NAME) {
        this.activeTab = this.tabs[1].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    },
    tabChanged(tab) {
      this.activeTab = tab;
    },
    closeRegister() {
      this.onRegister = false;
      this.committed = false;
      this.loadingCommit = false;
      this.loadingReg = false;
      this.name = '';
      this.$router.push({ name: RNS_MANAGER_ROUTE.MANAGE.NAME });
      this.trackDapp('closeRnsRegister');
    },
    setName(name) {
      this.searchError = '';
      try {
        this.name = normalise(name);
        this.trackDapp('setRnsDomainName');
      } catch (e) {
        this.searchError = e.message.includes('Failed to validate')
          ? 'Invalid name!'
          : e.message;
        this.name = name;
      }
    },
    async register(duration) {
      this.trackDapp('rnsDomainRegisterEvent');
      this.loadingReg = true;
      this.minimumAge = '90';
      // trigger loader
      this.loadingCommit = true;
      this.waitingForReg = true;

      const [label] = this.name.split('.');
      const address = this.instance.getAddressString();
      const registerTx = await this.nameHandler.rskRegistrar.register(
        label,
        address,
        this.regSecret,
        BigNumber(duration),
        this.domainPrice
      );

      await registerTx.wait();
      await this.reverseHandler.setReverseRecord(this.name, this.address);
      this.loadingReg = false;
      this.waitingForReg = false;

      this.closeRegister();
      this.trackDapp('rnsDomainRegisterReceipt');
      Toast(`Registration successful!`, {}, SUCCESS);
    },
    async commit(duration) {
      this.loadingCommit = true;
      this.minimumAge = '120';
      this.committed = false;
      this.waitingForReg = true;
      try {
        const address = this.instance.getAddressString();
        const [label] = this.name.split('.');

        const { makeCommitmentTransaction, secret, canReveal } =
          await this.nameHandler.rskRegistrar.commitToRegister(label, address);
        await makeCommitmentTransaction.wait();
        this.regSecret = secret;
        // Ref: https://github.com/rsksmart/rns-sdk
        // you need to wait at least for one minute, you can build
        // your own polling strategy checking canReveal to ensure
        // it is the correct time to submit the register tx
        let commitmentReady = await canReveal();
        const intervalId = setInterval(async () => {
          commitmentReady = await canReveal();
          if (commitmentReady) {
            let id = intervalId;
            if (intervalId && intervalId._id) {
              id = intervalId._id;
            }
            clearInterval(id);
            this.loadingCommit = false;
            this.committed = true;
            this.waitingForReg = false;
            this.canRegister = true;
            this.$emit('onRequest', duration);
          }
        }, 1000);
        setTimeout(() => {
          if (!commitmentReady) {
            throw 'failed to commit name registration';
          }
        }, 1000 * 10 * 60);
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    getRentPrice(duration) {
      const token = this.customTokens.find(token => token.name === 'RIF');
      const [label] = this.name.split('.');

      return this.nameHandler.fetchPrice(label, duration).then(resp => {
        this.commitFeeInEth = resp.eth;
        this.domainPrice = resp.bn;

        if (token) {
          if (parseFloat(token.balancef) < parseFloat(resp.eth)) {
            this.notEnoughFunds = true;
          }
          this.commitFeeUsd = (
            (token.price || 0) * parseFloat(resp.eth)
          ).toFixed(2);
        }

        return { usd: this.commitFeeUsd, rif: resp.eth };
      });
    }
  }
};
</script>
