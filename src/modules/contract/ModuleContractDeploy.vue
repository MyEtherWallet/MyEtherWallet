<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :has-elevation="true"
    :has-indicator="true"
    title="Deploy contract"
  >
    <template #moduleBody>
      <div>
        <mew-input
          label="Byte code"
          placeholder=" "
          @input="byteCodeInput($event)"
        />

        <v-textarea
          outlined
          name="input-7-4"
          label="ABI/JSON Interface"
          value=""
          placeholder=" "
          @input="abiInput($event)"
        ></v-textarea>
        <mew-input
          label="Contract name"
          placeholder=" "
          @input="setContractName($event)"
        />
        <div v-show="showInputs">
          <div
            v-for="(input, idx) in inputs"
            :key="input.name + idx"
            class="input-item-container"
          >
            <mew-input
              v-if="getType(input.type).type !== 'radio'"
              :disabled="noInput"
              :label="`${input.name} (${input.type})`"
              class="non-bool-input"
              @input="valueInput(input.name, $event)"
            />
            <div
              v-if="getType(input.type).type === 'radio'"
              class="bool-input-container"
            >
              <div class="bool-items">
                <mew-switch
                  :value="input.value"
                  :label="input.name"
                  @input="valueInput(input.name, $event)"
                />
                <mew-checkbox
                  v-model="input.value"
                  :value="false"
                  :label="$t('contract.false')"
                  type="radio"
                  checked
                />
              </div>
              <div class="bool-items">
                <mew-checkbox
                  v-model="input.value"
                  :value="true"
                  :label="$t('contract.false')"
                  type="radio"
                  checked
                />
              </div>
            </div>
            <!--              <mew-input :label="`${input.name} (${input.type})`"> </mew-input>-->
          </div>
          <mew-input
            v-if="payableConstructor"
            :disabled="noInput"
            :label="`value (ETH)`"
            class="non-bool-input"
            @input="ethPayable($event)"
          />
        </div>
        <div class="text-center mt-3">
          <mew-button
            title="Sign Transaction"
            :has-full-width="false"
            button-size="xlarge"
            :disabled="!canDeploy"
            @click.native="deploy"
          />
        </div>
      </div>
    </template>
  </mew-module>
</template>

<script>
import { mapState } from 'vuex';
import * as unit from 'ethjs-unit';
import Contracts from './handlers/contracts';
import sanitizeHex from '@/core/helpers/sanitizeHex';

export default {
  name: 'ModuleContractDeploy',
  components: {},
  data() {
    return {
      contractName: '',
      show: false,
      activeContract: {},
      noInput: false,
      canDeploy: false,
      inputs: {},
      ethValue: 0,
      abi: [],
      methods: []
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['currentNetwork', 'gasPrice']),
    txValue() {
      return sanitizeHex(unit.toWei(this.value, 'ether').toString(16));
    },
    showInputs() {
      return this.activeContract.abiValid && this.activeContract.byteCodeValid;
    },
    payableConstructor() {
      return this.activeContract.payableConstructor;
    }
  },
  mounted() {
    this.activeContract = new Contracts(this.address, this.web3, this.gasPrice);
  },
  methods: {
    showInteract() {
      this.show = !this.show;
    },
    deploy() {
      this.activeContract.deploy(this.ethValue, this.contractName);
      this.activeContract.clear();
      this.inputs = {};
      this.canDeploy = false;
    },
    byteCodeInput(value) {
      this.activeContract.setByteCode(value);
      if (this.activeContract.abiValid && this.activeContract.byteCodeValid) {
        this.getInputs();
      }
    },
    abiInput(value) {
      this.activeContract.setAbi(value);
      if (this.activeContract.abiValid && this.activeContract.byteCodeValid) {
        this.getInputs();
      }
    },
    getInputs() {
      this.inputs = this.activeContract.constructorInputs;
      this.canDeploy = this.activeContract.canDeploy;
    },
    valueInput(name, value) {
      this.activeContract.setDeployArg(name, value);
      this.canDeploy = this.activeContract.canDeploy;
    },
    ethPayable(value) {
      this.ethValue = value;
    },
    setContractName(name) {
      this.contractName = name;
    },
    getType() {
      return Contracts.utils().getType.apply(this, arguments);
    }
  }
};
</script>
