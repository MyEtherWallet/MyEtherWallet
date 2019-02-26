<template>
  <div class="modal-container">
    <b-modal
      ref="network"
      :title="$t('interface.network')"
      hide-footer
      centered
      class="bootstrap-modal network nopadding max-height-1"
    >
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
                  @click="addCustomNetworkToggle"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div ref="networkList" class="network-list">
        <div
          v-for="(key, index) in Object.keys(reorderedNetworks)"
          :key="key + index"
          class="content-block"
        >
          <div class="network-title">
            <img :src="Networks[key][0].type.icon" />
            <h4 :class="key.toLowerCase()">{{ key }}</h4>
          </div>
          <div class="grid-3">
            <p
              v-for="net in Networks[key]"
              :key="net.service"
              :class="
                net.service === network.service &&
                net.type &&
                net.type.name === network.type.name
                  ? 'current-network'
                  : ''
              "
              class="switch-network"
              @click="switchNetwork(net)"
            >
              {{ net.service }}
            </p>
          </div>
        </div>
        <div v-if="customNetworks.length > 0" class="content-block">
          <h4 class="cust">Custom Networks</h4>
          <div
            v-for="(net, idx) in customNetworks"
            :key="net.service + '(' + net.type.name + ')' + idx"
            class="grid-3"
          >
            <div
              :class="
                net.service === network.service &&
                net.type.name === network.type.name
                  ? 'current-network'
                  : ''
              "
              class="switch-network custom-network-item"
            >
              <p @click="switchNetwork(net)">
                {{ net.service }} {{ '(' + net.type.name + ')' }}
              </p>
              <i
                class="fa fa-times-circle"
                @click.prevent="removeNetwork(net, idx)"
              />
            </div>
          </div>
        </div>
      </div>
      <form ref="networkAdd" class="network-add hidden">
        <div class="content-block">
          <div class="input-block-container">
            <input
              v-validate="'required'"
              v-model="name"
              class="custom-input-text-1"
              type="text"
              name="nodeName"
              placeholder="ETH Node Name"
              autocomplete="off"
            />
            <select v-model="selectedNetworkName" class="custom-select-1">
              <option
                v-for="type in types"
                :value="type.name"
                :key="type.name + type.name_long"
                :selected="selectedNetworkName === type.name"
              >
                {{ type.name | capitalize }} -
                {{ type.name_long | capitalize }}
              </option>
            </select>
            <input
              v-validate="{
                required: true,
                url: {
                  require_protocol: true,
                  protocols: ['http', 'https', 'ws', 'wss']
                }
              }"
              v-model="url"
              class="custom-input-text-1"
              type="text"
              name="nodeUrl"
              placeholder="URL"
              autocomplete="off"
            />
            <input
              v-model="port"
              class="custom-input-text-1"
              type="number"
              name="nodePort"
              placeholder="Port"
              autocomplete="off"
            />
            <input
              v-validate="'required|url:require_protocol'"
              v-show="selectedNetworkName === 'CUS'"
              v-model="blockExplorerTX"
              class="custom-input-text-1"
              type="text"
              name="customExplorerTx"
              placeholder="https://etherscan.io/tx/"
              autocomplete="off"
            />
            <input
              v-validate="'required|numeric'"
              v-show="selectedNetworkName === 'CUS'"
              v-model="chainID"
              class="custom-input-text-1"
              type="number"
              name="customChain"
              placeholder="Chain ID"
              autocomplete="off"
            />
            <input
              v-validate="'required|url:require_protocol'"
              v-show="selectedNetworkName === 'CUS'"
              v-model="blockExplorerAddr"
              class="custom-input-text-1"
              type="text"
              name="customExplorerAddr"
              placeholder="https://etherscan.io/address/"
              autocomplete="off"
            />
          </div>
          <div>
            <p v-show="errors.has('nodeName')">
              {{ errors.first('nodeName') }}
            </p>
            <p v-show="errors.has('nodeUrl')">{{ errors.first('nodeUrl') }}</p>
            <p
              v-show="
                errors.has('customExplorerTx') || blockExplorerTX.length > 0
              "
            >
              {{ errors.first('customExplorerTx') }}
            </p>
            <p v-show="errors.has('customChain') || (chainID && chainID > 0)">
              {{ errors.first('customChain') }}
            </p>
            <p
              v-show="
                errors.has('customExplorerAddr') || blockExplorerAddr.length > 0
              "
            >
              {{ errors.first('customExplorerAddr') }}
            </p>
          </div>
        </div>

        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">{{ $t('interface.httpBasicAccess') }}</h4>
            <div class="margin-left-auto add-custom-network">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input type="checkbox" @click="expendAuth" />
                  <span class="slider round" />
                </label>
              </div>
            </div>
          </div>
          <div ref="authForm" class="auth-form-container hidden">
            <input
              v-model="username"
              class="custom-input-text-1"
              type="text"
              name
              placeholder="User Name"
              autocomplete="off"
            />
            <input
              v-model="password"
              class="custom-input-text-1"
              type="password"
              name
              placeholder="Password"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="content-block">
          <div class="save-button-container">
            <button
              v-show="selectedNetworkName !== 'CUS'"
              :class="[
                errors.has('nodeName') ||
                errors.has('nodeUrl') ||
                url === '' ||
                name === ''
                  ? 'disabled'
                  : '',
                'save-button large-round-button-green-filled clickable'
              ]"
              @click.prevent="saveCustomNetwork"
            >
              {{ $t('interface.save') }}
            </button>
            <button
              v-show="selectedNetworkName === 'CUS'"
              :class="[
                errors.has('nodeName') ||
                errors.has('nodeUrl') ||
                url === '' ||
                name === '' ||
                errors.has('customChain') ||
                errors.has('customExplorerTx') ||
                blockExplorerTX === '' ||
                !chainID ||
                blockExplorerAddr === '' ||
                errors.has('customExplorerAddr')
                  ? 'disabled'
                  : '',
                'save-button large-round-button-green-filled clickable'
              ]"
              @click.prevent="saveCustomNetwork"
            >
              {{ $t('interface.save') }}
            </button>
            <interface-bottom-text
              :link-text="$t('interface.helpCenter')"
              :question="$t('interface.dontKnow')"
              link="https://kb.myetherwallet.com"
            />
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
import Misc from '@/helpers/misc';

import { mapGetters } from 'vuex';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  data() {
    return {
      types: networkTypes,
      selectedNetworkName: 'ETH',
      chainID: networkTypes['ETH'].chainID,
      port: 443,
      name: '',
      url: '',
      username: '',
      password: '',
      customNetworks: [],
      blockExplorerAddr: '',
      blockExplorerTX: ''
    };
  },
  computed: {
    ...mapGetters({
      network: 'network',
      Networks: 'Networks'
    }),
    reorderedNetworks() {
      const networks = Misc.reorderNetworks();
      return networks;
    },
    selectedNetwork() {
      return this.network.type;
    }
  },
  watch: {
    selectedNetworkName(val) {
      if (val !== 'CUS') {
        this.chainID = this.selectedNetwork.chainID;
      }
    }
  },
  mounted() {
    if (store.get('customNetworks') !== undefined) {
      this.customNetworks = store.get('customNetworks');
    }
    this.types['CUS'] = {
      name: 'CUS',
      name_long: 'CUSTOM',
      homePage: '',
      blockExplorerTX: '',
      blockExplorerAddr: '',
      chainID: networkTypes['ETH'].chainID,
      tokens: [],
      contracts: []
    };
    this.selectedNetworkName = this.network.type.name;
  },
  methods: {
    networkModalOpen() {
      this.$refs.network.$refs.network.show();
    },
    removeNetwork(net, idx) {
      this.customNetworks.splice(idx, 1);
      if (net.service === this.network.service) {
        if (this.customNetworks.length > 0) {
          this.switchNetwork(this.customNetworks[0]);
        } else {
          this.switchNetwork(this.Networks.ETH[0]);
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
      this.port = 443;
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
          contracts: [],
          homePage: '',
          name: this.selectedNetwork.name,
          name_long: this.selectedNetwork.name_long,
          tokens: []
        },
        url: this.url,
        username: this.username
      };

      this.customNetworks.push(customNetwork);
      store.set('customNetworks', this.customNetworks);
      this.resetCompState();
      this.$refs.addCustomToggle.click();
    },
    expendAuth() {
      this.$refs.authForm.classList.toggle('hidden');
    },
    switchNetwork(network) {
      this.$store.dispatch('switchNetwork', network).then(() => {
        this.$store.dispatch('setWeb3Instance').then(() => {
          this.selectedeNtworkName = network.name;
        });
      });

      this.$refs.network.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceNetworkModal.scss';
</style>
