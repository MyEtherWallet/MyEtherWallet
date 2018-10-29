<template>
  <div class="modal-container">
    <b-modal
      ref="network"
      :title="$t('interface.network')"
      hide-footer
      centered
      class="bootstrap-modal network nopadding max-height-1">
      <div class="content-block">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.advanced') }}</h4>
          <div class="margin-left-auto add-custom-network">
            <p>{{ $t('interface.addCustomNode') }}</p>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  ref="addCustomToggle"
                  type="checkbox"
                  @click="addCustomNetworkToggle">
                <span class="slider round"/>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="networkList"
        class="network-list">
        <div
          v-for="(key, index) in Object.keys($store.state.Networks)"
          :key="key + index"
          class="content-block">
          <div class="network-title">
            <img
              :src="$store.state.Networks[key][0].type.icon">
            <h4 :class="key.toLowerCase()">{{ key }}</h4>
          </div>
          <div class="grid-3">
            <p
              v-for="net in $store.state.Networks[key]"
              :key="net.service"
              :class="net.service === $store.state.network.service && net.type && net.type.name === $store.state.network.type.name ? 'current-network': ''"
              class="switch-network"
              @click="switchNetwork(net)">{{ net.service }}</p>
          </div>
        </div>
        <div
          v-if="customNetworks.length > 0"
          class="content-block">
          <h4 class="cust">Custom Networks</h4>
          <div
            v-for="(net, idx) in customNetworks"
            :key="net.service + '('+ net.type.name + ')' + idx"
            class="grid-3">
            <div
              :class="net.service === $store.state.network.service && net.type.name === $store.state.network.type.name ? 'current-network': ''"
              class="switch-network custom-network-item">
              <p @click="switchNetwork(net)">{{ net.service }} {{ '('+ net.type.name + ')' }}</p>
              <i
                class="fa fa-times-circle"
                @click.prevent="removeNetwork(net, idx)"/>
            </div>
          </div>
        </div>
      </div>
      <form
        v-if="selectedNetwork && selectedNetwork.type"
        ref="networkAdd" 
        class="network-add hidden">
        <div class="content-block">
          <div class="input-block-container">
            <input
              v-model="name"
              class="custom-input-text-1"
              type="text"
              name=""
              placeholder="ETH Node Name"
              autocomplete="off">
            <select
              v-model="selectedNetwork"
              class="custom-select-1">
              <option
                v-for="type in Object.keys(types)"
                :value="types[type]"
                :key="types[type].name + types[type].name_long">
                {{ types[type].name | capitalize }} - {{ types[type].name_long |
                capitalize }}
              </option>
            </select>
            <input
              v-model="url"
              class="custom-input-text-1"
              type="text"
              name=""
              placeholder="URL"
              autocomplete="off">
            <input
              v-model="port"
              class="custom-input-text-1"
              type="text"
              name=""
              placeholder="Port"
              autocomplete="off">
            <input
              v-show="selectedNetwork.type.name === 'CUS'"
              v-model="blockExplorerTX"
              class="custom-input-text-1"
              type="number"
              name=""
              placeholder="https://etherscan.io/tx/"
              autocomplete="off">
            <input
              v-show="selectedNetwork.type.name === 'CUS'"
              v-model="chainID"
              class="custom-input-text-1"
              type="number"
              name=""
              placeholder="Chain ID"
              autocomplete="off">
            <input
              v-show="selectedNetwork.type.name === 'CUS'"
              v-model="blockExplorerAddr"
              class="custom-input-text-1"
              type="number"
              name=""
              placeholder="https://etherscan.io/address/"
              autocomplete="off">
          </div>
        </div>

        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">{{ $t('interface.httpBasicAccess') }}</h4>
            <div class="margin-left-auto add-custom-network">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input
                    type="checkbox"
                    @click="expendAuth">
                  <span class="slider round"/>
                </label>
              </div>
            </div>
          </div>
          <div
            ref="authForm"
            class="auth-form-container hidden">
            <input
              v-model="username"
              class="custom-input-text-1"
              type="text"
              name=""
              placeholder="User Name"
              autocomplete="off">
            <input
              v-model="password"
              class="custom-input-text-1"
              type="password"
              name=""
              placeholder="Password"
              autocomplete="off">
          </div>
        </div>

        <div class="content-block">
          <div class="save-button-container">
            <button
              class="save-button large-round-button-green-filled clickable"
              @click.prevent="saveCustomNetwork">
              {{ $t('interface.save') }}
            </button>
            <interface-bottom-text
              :link-text="$t('interface.learnMore')"
              :question="$t('interface.dontKnow')"
              link="/"/>
          </div>
        </div>

      </form>
    </b-modal>
  </div>
</template>

<script>
import store from 'store';

import InterfaceBottomText from '@/components/InterfaceBottomText';
import * as networkTypes from '@/networks/types';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  data() {
    return {
      types: networkTypes,
      selectedNetwork: this.$store.state.network,
      chainID: '',
      port: '',
      name: '',
      url: '',
      username: '',
      password: '',
      customNetworks: [],
      blockExplorerAddr: '',
      blockExplorerTX: ''
    };
  },
  watch: {
    selectedNetwork(newVal) {
      this.chainID = newVal ? newVal.type.chainID : -1;
    }
  },
  mounted() {
    if (store.get('customNetworks') !== undefined) {
      this.customNetworks = store.get('customNetworks');
    }
    this.types['custom'] = {
      name: 'CUS',
      name_long: 'CUSTOM',
      homePage: '',
      blockExplorerTX: '',
      blockExplorerAddr: '',
      chainID: '',
      tokens: [],
      contracts: [],
      ensResolver: ''
    };
  },
  methods: {
    networkModalOpen() {
      this.$children[0].$refs.network.show();
    },
    removeNetwork(net, idx) {
      this.customNetworks.splice(idx, 1);
      if (net.service === this.$store.state.network.service) {
        if (this.customNetworks.length > 0) {
          this.switchNetwork(this.customNetworks[0]);
        } else {
          this.switchNetwork(this.$store.state.Networks.ETH[0]);
        }
      }
      store.set('customNetworks', this.customNetworks);
    },
    addCustomNetworkToggle() {
      this.$refs.network.$el.classList.toggle('max-height-1');
      this.$refs.networkList.classList.toggle('hidden');
      this.$refs.networkAdd.classList.toggle('hidden');
    },
    resetCompState() {
      this.selectedNetwork = this.$store.state.network;
      this.chainID = '';
      this.port = '';
      this.name = '';
      this.url = '';
      this.username = '';
      this.password = '';
      this.blockExplorerAddr = '';
      this.blockExplorerTX = '';
    },
    saveCustomNetwork() {
      const customNetwork = {
        auth: !!(this.password !== '' && this.username !== ''),
        password: this.password,
        port: this.port,
        service: this.name,
        type: {
          blockExplorerAddr:
            this.selectedNetwork.blockExplorerAddr ||
            this.blockExplorerAddr ||
            '',
          blockExplorerTX:
            this.selectedNetwork.blockExplorerTX || this.blockExplorerTX || '',
          chainID: this.chainID,
          contracts: this.$store.state.Networks[this.selectedNetwork.name][0]
            .type.contracts,
          homePage: '',
          name: this.selectedNetwork.name,
          name_long: this.selectedNetwork.name_long,
          tokens: this.$store.state.Networks[this.selectedNetwork.name][0].type
            .tokens
        },
        url: this.url,
        username: this.username
      };

      this.customNetworks.push(customNetwork);
      this.resetCompState();
      this.$refs.addCustomToggle.click();
      store.set('customNetworks', this.customNetworks);
    },
    expendAuth() {
      this.$refs.authForm.classList.toggle('hidden');
    },
    switchNetwork(network) {
      this.$store.dispatch('switchNetwork', network).then(() => {
        this.$store.dispatch('setWeb3Instance').then(() => {
          this.selectedNetwork = network;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceNetworkModal.scss';
</style>
