<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Deploy contract">
            <mew-input
              label="Byte code"
              placeholder=" "
              @input="byteCodeInput($event)"
            />

            <v-textarea
              no-resize
              outlined
              name="input-7-4"
              label="ABI/JSON Interface"
              value=""
              placeholder=" "
              @input="abiInput($event)"
            ></v-textarea>
            <mew-input label="Contract name" placeholder=" " @input="setContractName($event)"/>
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
          </interface-wrap>
        </mew6-white-sheet>
      </div>
      <div class="pa-4"></div>
      <div>
        <network />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
import { mapState } from 'vuex';
import * as unit from 'ethjs-unit';
import Contracts from '../contracts';

const padLeftEven = hex => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};

const sanitizeHex = hex => {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '0x';
  return '0x' + padLeftEven(hex);
};

export default {
  components: {
    'interface-wrap': InterfaceWrap,
    network: Network,
    swap: Swap
  },
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
    ...mapState(['network', 'gasPrice', 'account', 'web3']),
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
    this.activeContract = new Contracts(this.account.address, undefined, 0);
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
    },
    valueInput(name, value) {
      this.activeContract.setDeployArg(name, value);
      this.canDeploy = this.activeContract.canDeploy;
    },
    ethPayable(value) {
      this.ethValue = value;
    },
    setContractName(name){
      this.contractName = name;
    },
    getType() {
      return Contracts.getType.apply(this, arguments);
    }
  }
};
</script>
