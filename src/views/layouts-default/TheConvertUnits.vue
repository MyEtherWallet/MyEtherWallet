<template>
  <div class="mew-component--convert-units">
    <the-layout-header title="Convert Units" />
    <div class="py-7" />

    <v-container>
      <div class="page-container">
        <div class="page-title">
          <page-title
            :options="{
              title: $t('convertUnits.page.title'),
              boldSubTitle: '',
              textContent: [$t('convertUnits.page.desc')]
            }"
          />
        </div>

        <div><unit-input :options="options" /></div>

        <div class="ether-unit-reference-guide">
          <div class="block-title">
            <h3>{{ $t('convertUnits.title-refference') }}</h3>
          </div>

          <div class="unit-table">
            <table>
              <tbody>
                <tr v-for="eu in etherUnitRef" :key="eu.key">
                  <td>{{ eu.name }}</td>
                  <td class="unit-long">{{ eu.unit1 }}</td>
                  <td class="unit-short">
                    <div>
                      {{ eu.unit2 }}<span>{{ eu.unit2e }}</span>
                    </div>
                  </td>
                  <td>{{ eu.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
          desc: ''
        },
        {
          name: 'Kwei',
          unit1: '1,000',
          unit2: '10',
          unit2e: '3',
          desc: 'ada, femtoether'
        },
        {
          name: 'Mwei',
          unit1: '1,000,000',
          unit2: '10',
          unit2e: '6',
          desc: 'babbage, picoether'
        },
        {
          name: 'Gwei',
          unit1: '1,000,000,000',
          unit2: '10',
          unit2e: '9',
          desc: 'shannon, nanoether, nano'
        },
        {
          name: 'Szabo',
          unit1: '1,000,000,000,000',
          unit2: '10',
          unit2e: '12',
          desc: 'microether, micro'
        },
        {
          name: 'Finney',
          unit1: '1,000,000,000,000,000',
          unit2: '10',
          unit2e: '15',
          desc: 'milliether, milli'
        },
        {
          name: 'Ether',
          unit1: '1,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '18',
          desc: ''
        },
        {
          name: 'Kether',
          unit1: '1,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '21',
          desc: 'grand, einstein'
        },
        {
          name: 'Mether',
          unit1: '1,000,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '24',
          desc: ''
        },
        {
          name: 'Gether',
          unit1: '1,000,000,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '27',
          desc: ''
        },
        {
          name: 'Tether',
          unit1: '1,000,000,000,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '30',
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
.ether-unit-reference-guide {
  margin-top: 60px;

  .block-title {
    text-align: center;
  }

  .unit-table {
    margin-top: 20px;
    table {
      width: 100%;
      border-top: 1px solid grey;
      tr {
        position: relative;
        border-bottom: 1px solid grey;
        td {
          padding: 18px 10px;
          position: relative;

          span {
            position: absolute;
            top: 3px;
            left: 17px;
            font-size: 9px;
            margin-top: -10px;
          }
        }
      }
    }
  }

  .unit-short {
    & > div {
      position: relative;
    }
  }
}
</style>
