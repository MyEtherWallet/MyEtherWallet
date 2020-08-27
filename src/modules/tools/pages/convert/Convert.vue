<template>
  <div>
    <block-title max-width="600px" no-page-title :data="title" class="mb-7" />

    <div class="d-flex">
      <div>
        <mew-select :items="coins" label="From" />
        <mew-input label="Amount" placeholder=" " />
      </div>
      <div class="px-6 mb-8 d-flex align-center">
        <img :src="swap" height="35" />
      </div>
      <div>
        <mew-select :items="coins" label="To" />
        <mew-input label="Amount" placeholder=" " />
      </div>
    </div>

    <div class="mew-heading-2 mb-3 mt-5">Ether unit reference guide</div>

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
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import swapIcon from '@/assets/images/icons/icon-swap.svg';

export default {
  components: { blockTitle },
  data: () => ({
    title: {
      title: 'Convert units',
      description:
        'Our helpful conversion tool and ether unit reference allow you to calculate the total cost of your transactions.'
    },
    coins: [
      {
        name: 'ETH',
        subtext: 'Ethereum',
        value: 'Ethereum'
      }
    ],
    swap: swapIcon,
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
    ]
  })
};
</script>

<style lang="scss" scoped>
$tablet-width: 1024px;
$mobile-width: 414px;

// Desktop
@media all and (min-width: calc(#{$tablet-width} + 1px)) {
  .wrap {
    padding: 100px 0;
    background-position: right top, left 80px;
  }
}

// Tablet
@media all and (min-width: calc(#{$mobile-width} + 1px)) and (max-width: $tablet-width) {
  .wrap {
    padding: 50px 0;
    background-position: calc(100% + 35px) -70px, -60px 80px;
    background-size: 100px, 200px;
  }
}

// Mobile
@media all and (max-width: $mobile-width) {
  .wrap {
    padding: 50px 0;
    background-position: calc(100% + 35px) -70px, -60px 80px;
    background-size: 100px, 170px;
  }
}
table {
  border-collapse: collapse;
}

.unit-table {
  margin-top: 20px;
  table {
    width: 100%;

    tr {
      position: relative;
      border-bottom: 1px solid #e0e0e0;
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
@media all and (max-width: 760px) {
  .unit-long {
    display: none;
  }
}
</style>
