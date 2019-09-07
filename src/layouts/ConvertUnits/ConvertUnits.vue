<template>
  <div class="convert-units">
    <div class="wrap">
      <div class="page-container">
        <div class="page-title"><page-title :options="titleOptions" /></div>

        <div><unit-input :options="options" /></div>

        <div class="ether-unit-reference-guide">
          <div class="block-title"><h3>Ether Unit Reference Guide</h3></div>

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
    </div>
  </div>
</template>

<script>
import UnitInput from './components/UnitInput';
import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';

export default {
  components: {
    'unit-input': UnitInput,
    'page-title': TitleTextContentsLayout
  },
  data() {
    return {
      titleOptions: {
        title: 'Convert Units',
        boldSubTitle: '',
        textContent: [
          'Our helpful conversion tool and ether unit reference allow you to calculate the total cost of your transactions.'
        ]
      },
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
@import 'ConvertUnits.scss';
</style>
