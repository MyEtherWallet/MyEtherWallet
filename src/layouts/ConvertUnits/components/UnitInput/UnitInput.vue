<template>
  <div class="unit-input">
    <div class="wrap">
      <div class="block-left">
        <div class="select-block">
          <select>
            <option
              v-for="data in leftDropDown"
              :key="data.key"
              value="data.value">{{ data.label }}
            </option>
          </select>
          <p class="select-down-arrow">⌄</p>
        </div>
        <div>
          <input
            type="text"
            name=""
            placeholder="Amount">
        </div>
      </div>

      <div class="block-center">
        <div class="convert-icon">
          <img src="~@/assets/images/icons/swap.svg">
        </div>
      </div>

      <div class="block-right">
        <div class="select-block">
          <select>
            <option
              v-for="data in rightDropDown"
              :key="data.key"
              value="data.value">{{ data.label }}
            </option>
          </select>
          <p class="select-down-arrow">⌄</p>
        </div>
        <div>
          <input
            type="text"
            name=""
            placeholder="Amount">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      leftDropDown: [
        {
          label: 'Wei',
          value: ''
        },
        {
          label: 'Kwei',
          value: ''
        },
        {
          label: 'Mwei',
          value: ''
        },
        {
          label: 'Gwei',
          value: ''
        },
        {
          label: 'Szabo',
          value: ''
        },
        {
          label: 'Finney',
          value: ''
        },
        {
          label: 'Ether',
          value: ''
        },
        {
          label: 'Kether',
          value: ''
        },
        {
          label: 'Mether',
          value: ''
        },
        {
          label: 'Gether',
          value: ''
        },
        {
          label: 'Tether',
          value: ''
        }
      ],
      rightDropDown: [
        {
          label: 'Wei',
          value: ''
        },
        {
          label: 'Kwei',
          value: ''
        },
        {
          label: 'Mwei',
          value: ''
        },
        {
          label: 'Gwei',
          value: ''
        },
        {
          label: 'Szabo',
          value: ''
        },
        {
          label: 'Finney',
          value: ''
        },
        {
          label: 'Ether',
          value: ''
        },
        {
          label: 'Kether',
          value: ''
        },
        {
          label: 'Mether',
          value: ''
        },
        {
          label: 'Gether',
          value: ''
        },
        {
          label: 'Tether',
          value: ''
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'UnitInput.scss';
</style>
