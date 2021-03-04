<template>
  <v-sheet
    elevation="10"
    width="100%"
    min-width="600px"
    class="mx-auto pa-8"
    rounded
  >
    <div v-if="loading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div
      v-if="!loading"
      :class="[
        'd-flex align-center pa-6 rounded',
        isAvailable ? 'superPrimary' : 'error lighten-3'
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
      {{ $t('ens.request.estimated-price') }}: {{ rentPriceETH }}
      {{ $t('common.currency.eth') }} (${{ rentPriceUSD }})
    </div>
    <div class="d-flex justify-center my-6">
      <mew-button :title="btnTitle" btn-size="xlarge" @click.native="onClick" />
    </div>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {
    getRentPrice: {
      default: function () {
        return {};
      },
      type: Function
    },
    isAvailable: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    name: {
      default: '',
      type: String
    },
    hostName: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      duration: 0,
      rentPriceETH: '',
      rentPriceUSD: ''
    };
  },
  computed: {
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
        items.push({ name: i + 1 + ' ' + 'year', value: i + 1 });
      }
      return items;
    }
  },
  watch: {
    duration() {
      this.rentPrice();
    }
  },
  mounted() {
    this.rentPrice();
  },
  methods: {
    rentPrice() {
      if (this.duration > 0) {
        return this.getRentPrice(this.duration).then(resp => {
          if (resp) {
            this.rentPriceETH = resp.eth;
            this.rentPriceUSD = resp.usd;
          }
        });
      }
    },
    onClick() {
      this.$emit('onRequest', this.duration);
    },
    setDuration(item) {
      this.duration = item.value;
    }
  }
};
</script>
