<template>
  <div class="multi-manager-container">
    <div class="title-container">
      <h3>ENS Manager</h3>
      <p>Manage your ENS names or transfer it to someone else</p>
    </div>
    <div v-if="loading">
      <i clas="fa fa-spinner fa-spin" /> Fetching names...
    </div>
    <div v-else-if="names.length === 0 && !loading" class="no-ens-container">
      No ENS name found for account {{ account.address }}!
    </div>
    <div v-else class="name-container">
      <div
        v-for="name in names"
        :key="name['name']"
        class="information-container"
      >
        <p class="name-container">
          {{ name.name }}.{{ network.type.ens.registrarTLD }}
        </p>
        <p>{{ name.expiration }}</p>
        <button
          v-show="name.name.indexOf('0x') !== 0"
          :class="[
            'action-button',
            name.gracePeriod && !name.expired
              ? 'renew-class'
              : name.expired && !name.gracePeriod
              ? 'expired-class'
              : ''
          ]"
          @click="
            methodCall(`${name.name}.${network.type.ens.registrarTLD}`, name)
          "
        >
          {{
            name.gracePeriod && !name.expired
              ? 'Renew'
              : name.expired && !name.gracePeriod
              ? 'Expired'
              : 'Manage'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isAddress } from '@/helpers/addressUtils';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import ExpiryAbi from '@/layouts/InterfaceLayout/expiryAbi.js';

const ENS_CURRENT_ADDRESS = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
const EXPIRY_ADDRESS = '0x78e21d038fcbb6d56f825dc1e8d8acd965744adb';

export default {
  props: {
    renewName: {
      type: Function,
      default: () => {}
    },
    checkDomain: {
      type: Function,
      default: () => {}
    }
  },
  data: () => {
    return {
      names: [],
      loading: true
    };
  },
  computed: {
    ...mapState('main', ['account', 'network', 'web3'])
  },
  mounted() {
    this.loading = true;
    const nameFetch = fetch(
      `https://nft2.mewapi.io/tokens?owner=${this.account.address}&chain=mainnet`
    ).then(res => {
      return res.json();
    });

    nameFetch.then(this.setExpiry);
  },
  methods: {
    setExpiry(param) {
      const names = param[ENS_CURRENT_ADDRESS].tokens;
      if (names.length > 0) {
        const hashes = names.map(item => {
          return item.id;
        });
        const contract = new this.web3.eth.Contract(ExpiryAbi, EXPIRY_ADDRESS);
        const expiry = contract.methods
          .getExpirationDates(ENS_CURRENT_ADDRESS, hashes)
          .call()
          .then(response => {
            return response;
          })
          .catch(() => {
            Toast.responseHandler('Something went wrong!', Toast.ERROR);
          });
        expiry.then(response => {
          response.forEach((item, idx) => {
            const expiryDate = item * 1000;
            const gracePeriod = new Date(expiryDate);
            gracePeriod.setDate(gracePeriod.getDate() + 90);
            const isInGracePeriod = expiryDate < new Date().getTime();
            const isExpired = gracePeriod.getTime() < new Date().getTime();
            const expiryDateFormat = new Date(expiryDate);
            names[idx].gracePeriod = isInGracePeriod;
            names[idx].expired = isExpired;
            names[idx].expireDateValue = expiryDateFormat;
            names[
              idx
            ].expiration = `${expiryDateFormat.toLocaleDateString()} ${expiryDateFormat.toLocaleTimeString()}`;
          });
          const sortedNames = names.slice().sort((a, b) => {
            return a.expireDateValue - b.expireDateValue;
          });

          this.names = sortedNames;
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    methodCall(nameString, nameObj) {
      if (nameObj.gracePeriod && !nameObj.expired) {
        this.checkDomain(nameString, true);
      } else {
        this.checkDomain(nameString, false);
      }
    },
    showBlockie(name) {
      return !(
        name !== 'controller' &&
        name !== 'registrant' &&
        name !== 'resolver'
      );
    },
    shouldHide(key, name) {
      const exclusion = ['name', 'id', 'description', 'image', 'expired'];
      if (exclusion.includes(key)) {
        return false;
      } else if (key === 'controller' && name['expired']) {
        return false;
      }
      return true;
    },
    isAddress: isAddress
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsMultiManager.scss';
</style>
