<template>
  <v-sheet
    elevation="10"
    width="100%"
    max-width="600px"
    class="mx-auto pa-8"
    rounded
  >
    <div
      :class="[
        'd-flex align-center pa-6 rounded',
        isAvailable ? 'available' : 'unavailable'
      ]"
    >
      <v-icon size="80" :color="isAvailable ? 'primary' : 'error'" class="mr-3">
        {{ icon }}
      </v-icon>
      <div>
        <div
          :class="[
            'mew-heading-2 mb-2',
            isAvailable ? 'primary--text' : 'error--text'
          ]"
        >
          {{ isAvailable ? $t('ens.is-available') : $t('ens.domain-taken') }}
        </div>
        <div class="mew-heading-2">{{ name }}</div>
      </div>
    </div>
    <div v-if="isAvailable" class="pa-1 mt-3 mb-7 text-center">
      {{ $t('ens.request.about-domain') }}
    </div>
    <mew-select
      v-if="isAvailable"
      :has-filter="false"
      :label="$t('ens.request.choose-term')"
      :items="items"
      @input="setDuration"
    />

    <div v-if="isAvailable" class="font-weight-bold text-center">
      {{ $t('ens.request.estimated-price') }}: {{ estimatedPrice.eth }}
      {{ $t('common.currency.eth') }} (${{ estimatedPrice.usd }})
    </div>
    <div class="d-flex justify-center my-6">
      <mew-button :title="btnTitle" btn-size="xlarge" @click.native="onClick" />
    </div>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { getHostName } from '@/dapps/ens-manager/helpers';

export default {
  components: {},
  props: {
    isAvailable: {
      default: false,
      type: Boolean
    },
    name: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      available: false,
      duration: '1'
    };
  },
  computed: {
    ...mapState('wallet', ['currency']),
    btnTitle() {
      return this.isAvailable
        ? this.$t('ens.request.request-registr')
        : this.$t('common.ok');
    },
    icon() {
      return this.isAvailable
        ? 'mdi-check-circle-outline'
        : 'mdi-do-not-disturb';
    },
    items() {
      const items = [];
      for (let i = 0; i < 20; i++) {
        items.push({ name: i + 1 + ' ' + 'year' });
      }
      return items;
    },
    hostName() {
      return getHostName(this.name);
    },
    // double check how this works
    pricingByLength() {
      if (this.hostName.length === 3) {
        return 640;
      } else if (this.hostName.length === 4) {
        return 160;
      }

      return 5;
    },
    estimatedPrice() {
      const eth = new BigNumber(this.pricingByLength)
        .dividedBy(this.currency.value)
        .times(this.duration)
        .toFixed(2);

      const usd = new BigNumber(this.pricingByLength)
        .times(this.duration)
        .toFixed(2);
      return {
        usd: usd,
        eth: eth
      };
    }
  },
  methods: {
    onClick() {
      this.$emit('onRequest', this.duration);
    },
    setDuration(val) {
      this.duration = val.name.substr(0, val.name.indexOf(' '));
    }
  }
};
</script>

<style lang="scss" scoped>
.available {
  background-color: var(--v-superPrimary-base);
}
.unavailable {
  background-color: var(--v-error-lighten3);
}
</style>
