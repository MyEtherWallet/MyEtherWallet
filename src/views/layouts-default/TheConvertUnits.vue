<template>
  <div class="mew-component--convert-units">
    <the-layout-header title="Convert Units" />
    <v-container class="my-10">
      <div><unit-input :options="options" /></div>

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
                  <div v-show="$vuetify.breakpoint.mdAndUp" class="mr-1">
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
                  <div v-show="$vuetify.breakpoint.lgAndUp" class="mr-1">
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
    </v-container>

    <app-get-started />
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import AppGetStarted from '@/core/components/AppGetStarted';

export default {
  name: 'TheConvertUnits',
  components: {
    TheLayoutHeader,
    AppGetStarted
  },
  data() {
    return {
      etherUnitRef: [
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
      ],
      options: [
        'wei',
        'kwei',
        'mwei',
        'gwei',
        'szabo',
        'finney',
        'ether',
        'kether',
        'mether',
        'gether',
        'tether'
      ]
    };
  }
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
