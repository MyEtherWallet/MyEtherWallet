<template>
  <div>
    <div v-if="!isSwap" class="mb-6">
      Please select a default gas price for your transaction fee
    </div>

    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <div class="mr-2">
          {{ currentValue.gas }}
          {{ network.type.currencyName }}
        </div>
        <div class="textSecondary--text">{{ currentValue.usd }}</div>
      </div>
      <div class="d-flex align-center">
        <v-icon small color="basic" class="mr-1">mdi-clock-outline</v-icon>
        <div>{{ currentValue.time }}</div>
      </div>
    </div>

    <div class="textBlack2--text mb-5">
      This fee is changed by Ethereum network. You can prioritize transaction by
      adding a tip to the miner.
    </div>

    <!--
    =====================================================================================
      Economic / Regular / Fast
    =====================================================================================
    -->
    <div>
      <div
        v-for="(b, key) in buttons"
        :key="key"
        class="mb-2 d-flex align-center justify-space-between group-button"
        :class="[selected === b.title ? 'active' : '']"
        @click.stop="
          () => {
            setSelected(b.title);
          }
        "
      >
        <div class="d-flex align-center">
          <div
            class="mr-1 ml-n1 text-center"
            style="width: 40px; line-height: 0"
          >
            <v-icon v-if="b.title === gasPriceTypes.ECONOMY" color="textBlack">
              mdi-check
            </v-icon>
            <img
              v-if="b.title === gasPriceTypes.REGULAR"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
            <img
              v-if="b.title === gasPriceTypes.FAST"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
            <img
              v-if="b.title === gasPriceTypes.FAST"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
          </div>
          <div class="mew-heading-3 font-weight-regular">
            {{ b.priority }}
          </div>
        </div>

        <!-- Show check mark if this is called from global settings -->
        <div v-if="global">
          <v-icon v-if="selected === b.title" color="primary">
            mdi-check-circle
          </v-icon>
          <v-icon v-else color="#e1e6ec"> mdi-checkbox-blank-circle </v-icon>
        </div>

        <div v-else class="text-right">
          <div
            v-if="b.title === gasPriceTypes.ECONOMY"
            class="textSecondary--text py-5"
          >
            No tip
          </div>
          <div v-else>
            <div class="textSecondary--text">{{ b.time }}</div>
            <div class="textSecondary--text">+{{ b.usd }}</div>
            <div class="textSecondary--text">
              +{{ b.gas }} {{ network.type.currencyName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notEnoughEth" class="mt-6 mb-5 secondary--text pl-4">
      <div>Not enough funds to increase priority.</div>
      <a
        rel="noopener noreferrer"
        target="_blank"
        :href="swapLink"
        class="mt-1 d-block"
      >
        Buy more ETH
      </a>
    </div>
  </div>
</template>

<script>
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'SettingsGasPrice',
  props: {
    selected: {
      type: String,
      default: gasPriceTypes.ECONOMY
    },
    setSelected: {
      type: Function,
      default: () => {}
    },
    buttons: {
      type: Array,
      default: () => []
    },
    isSwap: {
      type: Boolean,
      default: false
    },
    global: {
      type: Boolean,
      default: false
    },
    notEnoughEth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gasPriceTypes: gasPriceTypes
    };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['swapLink']),
    ...mapState('global', ['gasPriceType', 'gasPrice']),
    ...mapGetters('global', ['network']),
    currentValue() {
      for (const but of this.buttons) {
        if (but.title === this.selected) {
          return but;
        }
      }
      return {};
    }
  }
};
</script>

<style lang="scss" scoped>
.group-button {
  min-height: 72px;
  padding: 5px 16px;
  border-radius: 8px;
  background-color: #f4f6f8;
  cursor: pointer;
  user-select: none;
  width: 100%;
  border: 2px solid transparent;
  &:hover {
    background-color: #e9eff4;
  }
  &.active {
    border: 2px solid #05c0a5;
    background-color: #e1f7f4;
    opacity: 1;
    &:hover {
      opacity: 1;
      background-color: #d5edef;
    }
  }
}
</style>
