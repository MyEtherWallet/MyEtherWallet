<template>
  <div>
    <b-modal
      ref="ledgerApp"
      title="Choose Opened App"
      hide-footer
      class="bootstrap-modal modal-software"
      centered
    >
      <div>
        <div class="ledger-app-container">
          <div
            v-for="type in getTypes"
            :key="type.name"
            :class="[selected === type.name ? 'selected' : '', 'ledger-app']"
            @click="setType(type.name)"
          >
            <div class="app-image-container">
              <img :src="type.icon" />
            </div>
            <span> {{ type.name }} </span>
          </div>
        </div>
        <div class="button-container">
          <div
            :class="[
              selected === '' ? 'disabled' : '',
              'large-round-button-green-filled'
            ]"
            @click="next"
          >
            Next
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    networks: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectApp: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      selected: ''
    };
  },
  computed: {
    getTypes() {
      const networks = Object.keys(this.networks);
      const types = networks.map(network => {
        if (this.networks[network][0].type.hasOwnProperty('path')) {
          return this.networks[network][0].type;
        }
      });
      return types;
    }
  },
  methods: {
    setType(name) {
      this.selected === name ? (this.selected = '') : (this.selected = name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LedgerAppModal.scss';
</style>
