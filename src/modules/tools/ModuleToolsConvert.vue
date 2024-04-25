<template>
  <mew-module
    class="mew-component--convert-units pt-6"
    :title="title"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <v-row class="conver-units mx-auto mb-15" style="max-width: 1000px">
        <v-col cols="12" md="5">
          <mew-select
            :has-filter="false"
            :items="items"
            :value="selectedLeft"
            class="mb-2"
            normal-dropdown
            @input="updateCurrencyLeft"
          />
          <mew-input
            class="CurrencyLeftInput"
            :value="valueLeft"
            type="number"
            label="Amount"
            @input="updateAmountLeft"
          />
        </v-col>
        <v-col cols="12" md="2" class="d-flex align-center justify-center">
          <v-icon
            :style="
              $vuetify.breakpoint.smAndDown ? 'transform: rotate(90deg)' : ''
            "
            large
            >mdi-swap-horizontal</v-icon
          >
        </v-col>
        <v-col cols="12" md="5">
          <mew-select
            :has-filter="false"
            :items="items"
            :value="selectedRight"
            class="mb-2 CurrencyRightSelect"
            normal-dropdown
            @input="updateCurrencyRight"
          />
          <mew-input
            :value="valueRight"
            type="number"
            label="Amount"
            @input="updateAmountRight"
          />
        </v-col>
      </v-row>

      <div class="mew-heading-1">
        {{ $t('convertUnits.title-refference') }}
      </div>

      <div class="unit-table">
        <table>
          <thead>
            <tr class="font-weight-medium">
              <td>Unit</td>
              <td>Wei</td>
              <td>Ether</td>
              <td>Alternate name</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eu in etherUnitRef" :key="eu.key">
              <td>{{ eu.name }}</td>
              <td>
                <div class="d-flex align-center">
                  <div
                    v-if="false"
                    v-show="$vuetify.breakpoint.mdAndUp"
                    class="mr-1"
                  >
                    {{ eu.unit1 }} =
                  </div>
                  <div class="unit-short">
                    {{ eu.unit2 }}
                    <span> {{ eu.unit2e }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex align-center">
                  <div
                    v-if="false"
                    v-show="$vuetify.breakpoint.lgAndUp"
                    class="mr-1"
                  >
                    {{ eu.etherUnit1 }} =
                  </div>
                  <div class="unit-short">
                    {{ eu.etherUnit2 }}
                    <span> {{ eu.etherUnit2e }}</span>
                  </div>
                </div>
              </td>
              <td>{{ eu.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </mew-module>
</template>

<script setup>
import { ref, watch } from 'vue';
import { BigNumber } from 'bignumber.js';
import utils from 'web3-utils';

// data
const title = 'Convert Units';
const items = [
  {
    name: 'Wei',
    value: 'wei'
  },
  {
    name: 'Kwei',
    value: 'kwei'
  },
  {
    name: 'Mwei',
    value: 'mwei'
  },
  {
    name: 'Gwei',
    value: 'gwei'
  },
  {
    name: 'Szabo',
    value: 'szabo'
  },
  {
    name: 'Finney',
    value: 'finney'
  },
  {
    name: 'Ether',
    value: 'ether'
  },
  {
    name: 'Kether',
    value: 'kether'
  },
  {
    name: 'Mether',
    value: 'mether'
  },
  {
    name: 'Gether',
    value: 'gether'
  },
  {
    name: 'Tether',
    value: 'tether'
  }
];
const selectedLeft = ref({
  name: 'Wei',
  value: 'wei'
});
const selectedRight = ref({
  name: 'Ether',
  value: 'ether'
});
const valueLeft = ref('1000000000000000000');
const valueRight = ref('1');
const etherUnitRef = [
  {
    name: 'Wei',
    unit1: '1',
    unit2: '1',
    unit2e: '',
    etherUnit1: '0.000,000,000,000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-18',
    desc: ''
  },
  {
    name: 'Kwei',
    unit1: '1,000',
    unit2: '10',
    unit2e: '3',
    etherUnit1: '0.000,000,000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-15',
    desc: 'ada, femtoether'
  },
  {
    name: 'Mwei',
    unit1: '1,000,000',
    unit2: '10',
    unit2e: '6',
    etherUnit1: '0.000,000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-12',
    desc: 'babbage, picoether'
  },
  {
    name: 'Gwei',
    unit1: '1,000,000,000',
    unit2: '10',
    unit2e: '9',
    etherUnit1: '0.000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-9',
    desc: 'shannon, nanoether, nano'
  },
  {
    name: 'Szabo',
    unit1: '1,000,000,000,000',
    unit2: '10',
    unit2e: '12',
    etherUnit1: '0.000,001',
    etherUnit2: '10',
    etherUnit2e: '-6',
    desc: 'microether, micro'
  },
  {
    name: 'Finney',
    unit1: '1,000,000,000,000,000',
    unit2: '10',
    unit2e: '15',
    etherUnit1: '0.001',
    etherUnit2: '10',
    etherUnit2e: '-3',
    desc: 'milliether, milli'
  },
  {
    name: 'Ether',
    unit1: '1,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '18',
    etherUnit1: '1',
    etherUnit2: '1',
    etherUnit2e: '',
    desc: ''
  },
  {
    name: 'Kether',
    unit1: '1,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '21',
    etherUnit1: '1,000',
    etherUnit2: '10',
    etherUnit2e: '3',
    desc: 'grand, einstein'
  },
  {
    name: 'Mether',
    unit1: '1,000,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '24',
    etherUnit1: '1,000,000',
    etherUnit2: '10',
    etherUnit2e: '6',
    desc: ''
  },
  {
    name: 'Gether',
    unit1: '1,000,000,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '27',
    etherUnit1: '1,000,000,000',
    etherUnit2: '10',
    etherUnit2e: '9',
    desc: ''
  },
  {
    name: 'Tether',
    unit1: '1,000,000,000,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '30',
    etherUnit1: '1,000,000,000,000',
    etherUnit2: '10',
    etherUnit2e: '12',
    desc: ''
  }
];

// watchers
watch(valueLeft, newVal => {
  valueRight.value = convertFromTo(
    newVal,
    selectedLeft.value,
    selectedRight.value
  );
});
watch(valueRight, newVal => {
  valueLeft.value = convertFromTo(
    newVal,
    selectedRight.value,
    selectedLeft.value
  );
});
watch(selectedLeft, newVal => {
  valueRight.value = convertFromTo(
    valueLeft.value,
    newVal,
    selectedRight.value
  );
});
watch(selectedRight, newVal => {
  valueLeft.value = convertFromTo(valueRight.value, newVal, selectedLeft.value);
});
const getValueOfUnit = unit => {
  unit = unit ? unit.value.toLowerCase() : 'ether';
  const unitValue = utils.unitMap[unit];
  return new BigNumber(unitValue, 10);
};
const convertFromTo = (amt, from, to) => {
  return new BigNumber(String(amt))
    .times(getValueOfUnit(from))
    .div(getValueOfUnit(to))
    .toString(10);
};
const updateCurrencyLeft = e => {
  selectedLeft.value = e;
};
const updateCurrencyRight = e => {
  selectedRight.value = e;
};
const updateAmountLeft = e => {
  valueLeft.value = e;
};
const updateAmountRight = e => {
  valueRight.value = e;
};
</script>

<style lang="scss" scoped>
.unit-table {
  margin-top: 20px;
  table {
    width: 100%;
    border-collapse: collapse;
    thead {
      tr {
        border-top: 1px solid var(--v-titlePrimary-base);
        border-bottom: 1px solid var(--v-titlePrimary-base);
      }
    }
    tbody {
      tr:nth-child(even) {
        background-color: var(--v-tableHeader-base);
      }
    }
    tr {
      td {
        padding: 12px 10px;
        position: relative;
      }
    }
  }
}

.unit-short {
  position: relative;
  span {
    position: absolute;
    top: 3px;
    left: 17px;
    font-size: 9px;
    margin-top: -10px;
  }
}
</style>

<style lang="scss">
.mew-component--convert-units {
  .v-text-field__details {
    display: none;
  }
}
</style>
