<template>
  <div>
    <v-sheet
      max-width="700px"
      color="transparent"
      class="px-3 py-8 py-md-13 mx-auto"
    >
      <div class="mb-5">
        <div class="mew-heading-2 mb-8 ml-2">
          {{ $t('ens.search-domain') }}
        </div>
        <form @submit.prevent="findDomain">
          <v-row class="mx-0">
            <v-col class="pr-0" cols="8">
              <mew-input
                :value="name"
                :has-clear-btn="true"
                :rules="rules"
                :label="$t('ens.register.domain-name')"
                :placeholder="$t('ens.ph.three-char')"
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
                :title="$t('ens.register.name')"
                @click.native="findDomain"
              />
            </v-col>
          </v-row>
        </form>
      </div>
    </v-sheet>

    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
      :show-overlay="onRegister"
      :title="$t('ens.register-domain')"
      content-size="xlarge"
      :close="closeRegister"
    >
      <mew-stepper :items="stepperItems" :on-step="onStep">
        <template #stepperContent1
          ><request
            v-if="onStep === 1"
            class="mt-3"
            :name="name"
            :host-name="nameHandler.parsedHostName"
            :loading="loading"
            :get-rent-price="getRentPrice"
            @onRequest="onRequest"
        /></template>
        <template #stepperContent2
          ><register
            v-if="onStep === 2"
            class="mt-3"
            :name="name"
            :duration="duration"
            :register="register"
            :commit="commit"
            :committed="committed"
            :minimum-age="minimumAge"
            :loading-commit="loadingCommit"
        /></template>
        <template #stepperContent3><complete v-if="onStep === 3" /></template>
      </mew-stepper>
    </mew-overlay>
  </div>
</template>

<script>
import Request from '../components/register/RegisterRequest';
import Register from '../components/register/Register';
import { mapGetters, mapState } from 'vuex';
// import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import normalise from '@/core/helpers/normalise';
import handlerEnsManager from '../handlers/handlerEnsManager';
import ENS from 'ethereum-ens';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';

export default {
  components: { Request, Register },
  props: {
    // getRentPrice: {
    //   default: function () {
    //     return {};
    //   },
    //   type: Function
    // }
    // commit: {
    //   default: function () {
    //     return {};
    //   },
    //   type: Function
    // },
    // onRegister: { default: false, type: Boolean },
    // close: {
    //   default: function () {
    //     return {};
    //   },
    //   type: Function
    // },
    // register: {
    //   default: function () {
    //     return {};
    //   },
    //   type: Function
    // },
    // generateKeyPhrase: {
    //   default: function () {
    //     return {};
    //   },
    //   type: Function
    // },
    // loadingCommit: {
    //   default: false,
    //   type: Boolean
    // },
    // committed: {
    //   default: false,
    //   type: Boolean
    // },
    // minimumAge: {
    //   default: '',
    //   type: String
    // },
    // name: {
    //   default: '',
    //   type: String
    // },
    // parsedHostName: {
    //   default: '',
    //   type: String
    // },
    // checkingDomainAvail: {
    //   default: false,
    //   type: Boolean
    // }
  },
  data() {
    return {
      loadingCommit: false,
      minimumAge: '',
      committed: false,
      onRegister: false,
      name: '',
      searchError: '',
      nameHandler: {},
      duration: 1,
      onStep: 1,
      stepperItems: [
        {
          step: 1,
          name: 'STEP 1. Select Duration'
        },
        {
          step: 2,
          name: 'STEP 2. Create Commitment'
        },
        {
          step: 3,
          name: 'STEP 3. Complete registration'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['balance', 'address', 'web3']),
    loading() {
      return this.nameHandler.checkingDomainAvail;
    },
    rules() {
      return [
        this.searchError === '' || this.searchError,
        (this.name && this.name.length > 2) ||
          this.$t('ens.warning.not-enough-char'),
        !this.hasInvalidChars || this.$t('ens.warning.invalid-symbol'),
        (this.name && this.name.split('.').length <= 2) ||
          this.$t('ens.warning.invalid-symbol')
      ];
    },
    errorMessages() {
      if (this.domainTaken) return this.$t('ens.domain-taken');
      return this.searchError;
    },
    hasInvalidChars() {
      const letters = /^[0-9a-zA-Z_.-]+$/;
      if (!letters.test(this.name)) {
        return true;
      }
      return false;
    },
    ensDomainAvailable() {
      return this.nameHandler.isAvailable;
    },
    domainTaken() {
      return (
        !this.isNameEmpty &&
        !this.loading &&
        !this.ensDomainAvailable &&
        Object.keys(this.nameHandler).length !== 0
      );
    },
    isNameEmpty() {
      return this.name === null || this.name === '';
    }
  },
  watch: {
    ensDomainAvailable(newVal) {
      if (newVal === true) {
        this.onRegister = true;
      }
    }
    // onStep(newStep) {
    //   if (newStep == 2) {
    //     this.$router.push({ name: ROUTES_WALLET.ENS_2.NAME });
    //   } else if (newStep == 3) {
    //     this.$router.push({ name: ROUTES_WALLET.ENS_3.NAME });
    //   } else {
    //     this.$router.push({ name: ROUTES_WALLET.ENS_MANAGER.NAME });
    //   }
    // }
  },
  mounted() {
    const ens = this.network.type.ens
      ? new ENS(this.web3.currentProvider, this.network.type.ens.registry)
      : null;
    this.ensManager = new handlerEnsManager(
      this.network,
      this.address,
      this.web3,
      ens,
      this.gasPrice
    );
    // if (this.onStep == 1) this.$router.push({ name: ROUTES_WALLET.ENS_1.NAME });
  },
  methods: {
    generateKeyPhrase() {
      if (this.nameHandler.generateKeyPhrase) {
        this.nameHandler.generateKeyPhrase();
      }
    },
    onRequest(val) {
      this.generateKeyPhrase();
      this.duration = val;
      this.onStep += 1;
    },
    findDomain() {
      try {
        this.nameHandler = this.ensManager.searchName(this.name);
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    setName(name) {
      this.searchError = '';
      if (this.name === null || this.name === '') {
        this.nameHandler = {};
      }
      try {
        this.name = normalise(name);
      } catch (e) {
        this.searchError = e.message.includes('Failed to validate')
          ? 'Invalid name!'
          : e.message;
        this.name = name;
      }
    },
    closeRegister() {
      this.onRegister = false;
      this.committed = false;
      this.loadingCommit = false;
      this.name = '';
      this.nameHandler = {};
      // this.$router.push({ name: ROUTES_WALLET.ENS_MANAGER.NAME });
    },
    commit() {
      let waitingTime;
      this.nameHandler
        .createCommitment()
        .on('transactionHash', () => {
          this.nameHandler.getMinimumAge().then(resp => {
            this.minimumAge = resp;
            waitingTime = parseInt(resp);
          });
        })
        .on('receipt', () => {
          this.loadingCommit = true;
          this.committed = false;
          setTimeout(() => {
            this.committed = true;
            this.loadingCommit = false;
          }, waitingTime * 1000);
        })
        .on('error', err => {
          this.closeRegister();
          Toast(err, {}, ERROR);
        });
    },
    register(duration) {
      this.nameHandler
        .register(duration, this.balanceToWei)
        .on('transactionHash', () => {
          Toast(`ENS name: ${this.name} registered`, {}, SUCCESS);
          this.closeRegister();
        })
        .once('receipt', () => {
          setTimeout(() => {
            this.getDomains();
          }, 15000);
        })
        .on('error', err => {
          Toast(err, {}, ERROR);
        });
    },
    getRentPrice(duration) {
      return this.nameHandler.getRentPrice(duration).then(resp => {
        if (resp) {
          const ethValue = fromWei(resp);
          return {
            wei: resp,
            eth: ethValue,
            usd: new BigNumber(ethValue).times(this.fiatValue).toFixed(2)
          };
        }
      });
    }
  }
};
</script>
