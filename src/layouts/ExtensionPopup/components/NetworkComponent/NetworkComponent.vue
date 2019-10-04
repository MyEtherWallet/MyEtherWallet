<template>
  <div ref="networkComponent" class="network-selection-container">
    <p class="network">NETWORK</p>
    <p class="network-name" @click="openSelection">
      {{ network.type.name }} - {{ network.service }}
      <i :class="['fa fa-lg', !isOpen ? 'fa-angle-down' : 'fa-angle-up']" />
    </p>
    <b-modal
      ref="networkModal"
      hide-footer
      hide-header
      hide-backdrop
      static
      lazy
      no-fade
      class="bootstrap-modal"
      modal-class="network-component-modal"
    >
      <div
        v-for="(title, idx) in titles"
        :key="title + idx"
        class="network-container"
      >
        <h3>{{ title }}</h3>
        <div class="node-container">
          <div
            v-for="(node, idx) in Networks[title]"
            :key="node.service + idx"
            class="node"
            @click="selectNetwork(node)"
          >
            <p :class="shouldBeActive(node) ? 'active' : ''">
              {{ node.service }}
            </p>
            <div v-show="shouldBeActive(node)" class="check-active">
              <i class="fa fa-check" />
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    ...mapState(['network', 'Networks']),
    titles() {
      return Object.keys(this.Networks);
    }
  },
  mounted() {
    this.$refs.networkModal.$on('hidden', () => {
      this.isOpen = false;
    });
    this.$refs.networkModal.$on('shown', () => {
      this.isOpen = true;
    });
  },
  methods: {
    shouldBeActive(network) {
      return (
        network.service === this.network.service &&
        network.type.name === this.network.type.name
      );
    },
    openSelection() {
      if (this.isOpen) {
        this.$refs.networkModal.hide();
      } else {
        this.$refs.networkModal.show();
      }
    },
    selectNetwork(network) {
      this.$refs.networkModal.hide();
      this.$store.dispatch('switchNetwork', network).then(() => {
        window.chrome.storage.sync.set({
          defNetwork: JSON.stringify({
            url: network.url,
            key: network.type.name
          })
        });
        this.$store.dispatch('setWeb3Instance');
      });
    }
  }
};
</script>

<style lang="scss">
.network-component-modal {
  padding-left: 0 !important;

  .modal-body {
    padding: 15px;
    height: calc(100vh - 110px);
    overflow-y: auto;
  }

  .modal-dialog {
    margin: 0 !important;
    margin-top: 108px !important;
  }

  .modal-content {
    border: none;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
</style>
<style lang="scss" scoped>
@import './NetworkComponent.scss';
</style>
