<template>
  <div class="deploy-contract-container">
    <success-modal
      message=""
      link-message="Ok"/>
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
          placeholder="Gas Limit" >
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
    <confirm-modal
      :show-success="showSuccessModal"
      :signed-tx="signedTx"
      :fee="transactionFee"
      :gas-price="$store.state.gasPrice"
      :from="$store.state.wallet.getAddressString()"
      :gas="gasLimit"
      :data="data"
      :nonce="nonce"
      :contract-name="contractName"
      :abi="abi"/>
    <success-modal
      message="Sending Transaction"
      link-message="Close"/>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import ConfirmModal from '@/containers/ConfirmationContainer/components/ConfirmModal/ConfirmModal';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import { Misc } from '@/helpers';

import store from 'store';

// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require('ethjs-unit')
export default {
  name: 'DeployContract',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'confirm-modal': ConfirmModal,
    'success-modal': SuccessModal
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
      signedTx: '',
      transactionFee: 0,
      gasAmount: this.$store.state.gasPrice,
      gasLimit: 21000,
      data: '',
      nonce: 0,
      validAbi: false
    };
  },
  mounted () {
    this.contractNamePlaceholder = store.get('localContracts') !== undefined ? `myContracts${store.get('localContracts').length}` : 'myContracts'
    this.constructors = []
    if (this.abi !== '') {
      JSON.parse(this.abi).forEach(item => {
        if (item.type === 'constructor') {
          this.constructors.push(item)
        }
      })
    }
    this.estimateGas()
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
      const web3 = this.$store.state.web3;
      const contract = new web3.eth.Contract(JSON.parse(this.abi));
      const deployArgs = Object.keys(this.inputs).map(key => {
        return web3.utils.toHex(this.inputs[key]);
      });
      this.data = contract
        .deploy({ data: this.bytecode, arguments: deployArgs })
        .encodeABI();
      this.nonce = await web3.eth.getTransactionCount(
        this.$store.state.wallet.getAddressString()
      );

      this.raw = {
        from: this.$store.state.wallet.getAddressString(),
        gas: this.gasLimit,
        nonce: this.nonce,
        gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
        data: this.data
      };

      // const tx = new EthTx(this.raw)
      // tx.sign(this.$store.state.wallet.getPrivateKey())
      // const signedTx = tx.serialize()
      // this.signedTx = `0x${signedTx.toString('hex')}`
      await web3.eth
        .sendTransaction(this.raw)
        .once('transactionHash', hash => {
          this.$store.dispatch('addNotification', [
            this.from,
            hash,
            'Transaction Hash'
          ]);
        })
        .on('receipt', res => {
          this.$store.dispatch('addNotification', [
            this.from,
            res,
            'Transaction Receipt'
          ]);
        })
        .on('error', err => {
          // eslint-disable-next-line no-console
          console.log(err);
          this.$store.dispatch('addNotification', [
            this.from,
            err,
            'Transaction Error'
          ]);
        });
    },
    showSuccessModal() {
      this.$children[5].$refs.success.show();
    },
    confirmationModalOpen() {
      this.signTransaction();
      window.scrollTo(0, 0);
      this.$children[4].$refs.confirmation.show();
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
            console.log(err);
          });
      }
      this.estimateGas()
    },
    bytecode (newVal) {
      this.estimateGas()
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
