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
        'd-flex align-center pa-4 rounded',
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
    <div class="pa-1 mt-3 mb-7 text-center">
      {{ $t('ens.request.about-domain') }}
    </div>
    <mew-select
      :has-filter="false"
      label="Choose the term to keep your domain"
      :items="items"
      @input="setDuration"
    />

    <div class="font-weight-bold text-center">Price: 0.0031 ETH ($12.31)</div>
    <div class="d-flex justify-center mt-6">
      <mew-button title="Request registration" btn-size="xlarge" />
    </div>
  </v-sheet>
</template>

<script>
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
      duration: ''
    };
  },
  computed: {
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
    }
  },
  methods: {
    setDuration(val) {
      this.duration = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.available {
  background-color: var(--v-superPrimary-base);
}
.unavailable {
  background-color: var(--v-lighten1-base);
}
</style>
