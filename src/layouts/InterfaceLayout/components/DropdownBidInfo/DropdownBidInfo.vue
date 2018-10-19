<template>
  <div class="bid-info">

    <div>
      <div class="info-button">
        <div class="title-block">
          <p class="button-number">1</p>
          <p class="button-title">Bid Information</p>
        </div>
        <div class="functions">
          <p @click="bidInfoOpen = !bidInfoOpen">Edit</p>
        </div>
      </div>
      <div 
        :class="bidInfoOpen ? 'user-input-open' : ''" 
        class="user-inputs">
        <div>
          <standard-input :options="inputActualBidAmount" />
        </div>
        <div>
          <standard-input :options="inputBidMask" />
        </div>
        <div>
          <standard-input :options="inputSecretPhrase" />
        </div>        
      </div>
    </div>

    <div>
      <div class="info-button">
        <div class="title-block">
          <p class="button-number">2</p>
          <p class="button-title">Detail Information</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      bidInfoOpen: false,
      inputActualBidAmount: {
        title: 'Actual Bid Amount',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: 'Herro',
        placeHolder: 'Minimum bid 0.01',
        rightInputText: 'ETH'
      },
      inputBidMask: {
        title: 'Bid Mask',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: 'Herro',
        placeHolder: 'Minimum bid 0.01',
        rightInputText: 'ETH'
      },
      inputSecretPhrase: {
        title: 'Secret Phrase',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: 'Random',
        popover: 'Herro',
        placeHolder: 'Secret Phrase',
        rightInputText: ''
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'DropdownBidInfo.scss';
</style>
