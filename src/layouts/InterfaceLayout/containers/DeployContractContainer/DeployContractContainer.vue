<template>
  <div class="deploy-contract-container">
    <interface-container-title :title="$t('common.depContract')" />
    <div class="content-container">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.byteCode') }}</h4>
            <div class="copy-buttons">
              <button class="title-button" @click="deleteInput('bytecode')">
                {{ $t('common.clear') }}
              </button>
              <button class="title-button" @click="copyToClipboard('bytecode')">
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form byte-code">
          <textarea
            ref="bytecode"
            v-model="bytecode"
            class="custom-textarea-1"
          />
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.abiJsonInt') }}</h4>
            <div class="copy-buttons">
              <button class="title-button" @click="deleteInput('abi')">
                {{ $t('common.clear') }}
              </button>
              <button class="title-button" @click="copyToClipboard('abi')">
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form">
          <textarea ref="abi" v-model="abi" class="custom-textarea-1" />
          <i
            :class="[
              validAbi && validAbi !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div v-if="constructors.length !== 0" class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>
              {{ $t('interface.constructor') }}
              {{ constructors.length > 1 ? 'Inputs' : 'Input' }}:
            </h4>
          </div>
        </div>
        <div
          v-for="(construct, idx) in constructors"
          :key="construct.type + idx"
        >
          <div v-for="(input, idx) in construct.inputs" :key="input.name + idx">
            <div class="title-container">
              <div class="title">
                <h5>{{ input.name | capitalize }}:</h5>
              </div>
            </div>
            <div class="the-form contract-name">
              <input ref="contractName" v-model="inputs[input.name]" />
            </div>
          </div>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.contractName') }}</h4>
          </div>
        </div>
        <div class="the-form contract-name">
          <input
            ref="contractName"
            v-model="contractName"
            :placeholder="contractNamePlaceholder"
          />
        </div>
      </div>

      <div v-if="false" class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-and-popover">
              <h4>{{ $t('common.speedTx') }}</h4>
              <popover :popcontent="$t('popover.txSpeed')" />
            </div>
            <p>{{ $t('common.txFee') }}: {{ transactionFee }} ETH</p>
          </div>
          <div class="buttons">
            <div
              :class="[
                gasPrice === 5 ? 'active' : '',
                'small-circle-button-green-border'
              ]"
              @click="changeGas(5)"
            >
              {{ $t('common.economy') }}
            </div>
            <div
              :class="[
                gasPrice === 45 ? 'active' : '',
                'small-circle-button-green-border'
              ]"
              @click="changeGas(45)"
            >
              {{ $t('common.regular') }}
            </div>
            <div
              :class="[
                gasPrice === 75 ? 'active' : '',
                'small-circle-button-green-border'
              ]"
              @click="changeGas(75)"
            >
              {{ $t('common.fast') }}
            </div>
          </div>
        </div>

        <div class="the-form gas-amount">
          <input
            v-model="gasLimit"
            :placeholder="$t('common.gasLimit')"
            type="number"
            name
          />
          <div class="good-button-container">
            <p>Gwei</p>
            <i
              class="fa fa-check-circle good-button not-good"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div class="submit-button-container">
        <div class="buttons">
          <div
            :class="[
              abi === '' || bytecode === '' || validByte || !validAbi
                ? 'disabled'
                : '',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click="confirmationModalOpen"
          >
            {{ $t('common.signTx') }}
          </div>
        </div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://kb.myetherwallet.com"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import { Misc } from '@/helpers';
import store from 'store';
import * as unit from 'ethjs-unit';
import { mapGetters } from 'vuex';

export default {
  name: 'DeployContract',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle
  },
  data() {
    return {
      bytecode: '',
      abi: '',
      constructors: [],
      inputs: {},
      contractName: '',
      contractNamePlaceholder: '',
      raw: {},
      transactionFee: 0,
      gasAmount: this.gasPrice,
      gasLimit: 21000,
      data: '',
      nonce: 0,
      validAbi: true,
      validByte: true
    };
  },
  computed: {
    ...mapGetters({
      gasPrice: 'gasPrice',
      web3: 'web3',
      wallet: 'wallet',
      network: 'network'
    })
  },
  watch: {
    abi(newVal) {
      this.constructors = [];
      this.validAbi = Misc.isJson(newVal);
      if (newVal !== '' && this.validAbi) {
        JSON.parse(newVal).forEach(item => {
          if (item.type === 'constructor') {
            this.constructors.push(item);
          }
        });
      }
      this.estimateGas();
    },
    bytecode(newVal) {
      if (Misc.validateHexString(newVal)) {
        this.validByte = true;
        this.estimateGas();
      } else {
        this.validByte = false;
      }
    },
    gasAmount() {
      this.estimateGas();
    }
  },
  mounted() {
    this.contractNamePlaceholder =
      store.get('localContracts') !== undefined
        ? `myContracts${store.get('localContracts').length}`
        : 'myContracts';
    this.constructors = [];
    this.validAbi = Misc.isJson(this.abi);
    if (this.abi !== '' && this.validAbi) {
      JSON.parse(this.abi && this.validAbi).forEach(item => {
        if (item.type === 'constructor') {
          this.constructors.push(item);
        }
      });
    }

    this.estimateGas();
  },
  methods: {
    async signTransaction() {
      try {
        const web3 = this.web3;
        const contract = new web3.eth.Contract(JSON.parse(this.abi));
        const deployArgs = Object.keys(this.inputs).map(key => {
          return this.inputs[key];
        });
        this.data = contract
          .deploy({ data: this.bytecode, arguments: deployArgs })
          .encodeABI();
        this.nonce = await web3.eth.getTransactionCount(
          this.wallet.getAddressString()
        );

        this.raw = {
          from: this.wallet.getAddressString(),
          nonce: this.nonce,
          gasPrice: Number(unit.toWei(this.gasPrice, 'gwei')),
          data: this.data.replace(/\s/g, '')
        };

        const transactionFee = await this.web3.eth.estimateGas(this.raw);

        this.raw.gas = transactionFee;
        this.transactionFee = await unit.fromWei(
          unit.toWei(this.gasPrice, 'gwei') * transactionFee,
          'ether'
        );
        // estimateGas was failing if chainId in present
        this.raw.chainId = this.network.type.chainID || 1;

        await web3.eth.sendTransaction(this.raw);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e); // todo replace with proper error
      }
    },
    showSuccessModal() {
      this.$eventHub.$emit('showSuccessModal', 'Sending Transaction', 'Close');
    },
    confirmationModalOpen() {
      this.signTransaction();
      window.scrollTo(0, 0);
    },
    estimateGas() {
      if (this.bytecode !== '' && this.abi !== '') {
        const newRaw = this.raw;
        delete newRaw['gas'];
        delete newRaw['nonce'];
        this.web3.eth
          .estimateGas(newRaw)
          .then(res => {
            this.transactionFee = unit.fromWei(
              unit.toWei(this.gasPrice, 'gwei') * res,
              'ether'
            );
            this.gasLimit = res;
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      }
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInput(ref) {
      this[ref] = '';
    },
    changeGas(val) {
      this.gasAmount = val;
      this.$store.dispatch('setGasPrice', Number(val));
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DeployContractContainer.scss';
</style>
