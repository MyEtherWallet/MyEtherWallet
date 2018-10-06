<template>
  <div class="deploy-contract-container">
    <!--<success-modal message="" linkMessage="Ok"></success-modal>-->
    <interface-container-title :title="$t('common.depContract')"/>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Byte Code</h4>
          <div class="copy-buttons">
            <span @click="deleteInput('bytecode')">Clear</span>
            <span @click="copyToClipboard('bytecode')">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea
          ref="bytecode"
          v-model="bytecode"
          class="custom-textarea-1"/>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>ABI/JSON Interface</h4>
          <div class="copy-buttons">
            <span @click="deleteInput('abi')">Clear</span>
            <span @click="copyToClipboard('abi')">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea
          ref="abi"
          v-model="abi"
          class="custom-textarea-1"/>
        <i
          :class="[validAbi && validAbi !== ''? '': 'not-good' ,'fa fa-check-circle good-button']"
          aria-hidden="true"/>
      </div>
    </div>

    <div
      v-if="constructors.length !== 0"
      class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Constructor {{ constructors.length > 1 ? 'Inputs': 'Input' }}: </h4>
        </div>
      </div>
      <div
        v-for="(construct, idx) in constructors"
        :key="construct.type+idx">
        <div
          v-for="(input, idx) in construct.inputs"
          :key="input.name + idx">
          <div class="title-container">
            <div class="title">
              <h5>{{ input.name | capitalize }}: </h5>
            </div>
          </div>
          <div class="the-form domain-name">
            <input
              ref="contractName"
              v-model="inputs[input.name]">
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Contract Name</h4>
        </div>
      </div>
      <div class="the-form domain-name">
        <input
          ref="contractName"
          v-model="contractName"
          :placeholder="contractNamePlaceholder">
      </div>
    </div>

    <div class="send-form2">
      <div class="title-container">
        <div class="title">
          <div class="title-and-popover">
            <h4>{{ $t("common.speedTx") }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <p>{{ $t("common.txFee") }}: {{ transactionFee }} ETH </p>
        </div>
        <div class="buttons">
          <div
            :class="[$store.state.gasPrice === 5 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(5)">
            {{ $t('common.slow') }}
          </div>
          <div
            :class="[$store.state.gasPrice === 45 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(45)">
            {{ $t('common.regular') }}
          </div>
          <div
            :class="[$store.state.gasPrice === 75 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(75)">
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input
          v-model="gasLimit"
          type="number"
          name=""
          placeholder="Gas Limit">
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"/>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div
          :class="[abi === '' || bytecode === '' || !validAbi ? 'disabled': '', 'submit-button large-round-button-green-filled clickable']"
          @click="confirmationModalOpen">
          Sign Transaction
        </div>
      </div>
      <interface-bottom-text
        :link-text="$t('interface.learnMore')"
        :question="$t('interface.haveIssues')"
        link="/"/>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
// import SuccessModal from '@/components/SuccessModal'
import { Misc } from '@/helpers';

import store from 'store';

import * as unit from 'ethjs-unit';
export default {
  name: 'DeployContract',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle
    // 'success-modal': SuccessModal
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
      gasAmount: this.$store.state.gasPrice,
      gasLimit: 21000,
      data: '',
      nonce: 0,
      validAbi: false
    };
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
    bytecode() {
      this.estimateGas();
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
        const web3 = this.$store.state.web3;
        const contract = new web3.eth.Contract(JSON.parse(this.abi));
        const deployArgs = Object.keys(this.inputs).map(key => {
          return this.inputs[key];
        });
        this.data = contract
          .deploy({ data: this.bytecode, arguments: deployArgs })
          .encodeABI();
        this.nonce = await web3.eth.getTransactionCount(
          this.$store.state.wallet.getAddressString()
        );

        this.raw = {
          from: this.$store.state.wallet.getAddressString(),
          nonce: this.nonce,
          gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
          data: this.data.replace(/\s/g, '')
        };

        const transactionFee = await this.$store.state.web3.eth.estimateGas(
          this.raw
        );

        this.raw.gas = transactionFee;
        this.transactionFee = await unit.fromWei(
          unit.toWei(this.$store.state.gasPrice, 'gwei') * transactionFee,
          'ether'
        );
        // estimateGas was failing if chainId in present
        this.raw.chainId = this.$store.state.network.type.chainID || 1;

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
        this.$store.state.web3.eth
          .estimateGas(newRaw)
          .then(res => {
            this.transactionFee = unit.fromWei(
              unit.toWei(this.$store.state.gasPrice, 'gwei') * res,
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
