<template>
  <div class="tx-status">
    <div class="wrap">
      <div class="page-container">

        <div class="page-title">
          <page-title :options="titleOptions" />
        </div>

        <div class="page-content">
          <p class="bold-message">
            This is not typically something you can do.
            It should not be relied upon & will only
            work when the TX pools are not full.
            Please read more <a href="/">here</a>.
          </p>

          <div class="user-input-block">
            <div class="address-input-block">
              <standard-input :options="inputAddress" />
            </div>

            <div class="check-button-block">
              <standard-button 
                :options="buttonCheck"
              />
            </div>
          </div>
        </div>

      </div><!-- .page-container -->
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';

export default {
  components: {
    'page-title': TitleTextContentsLayout
  },
  data() {
    return {
      inputAddress: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please enter the address',
        rightInputText: ''
      },
      buttonCheck: {
        title: 'Check',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      titleOptions: {
        title: 'Transaction Status',
        boldSubTitle: '',
        textContent: [
          'During times of high volume(like during ICOs) transctions can be pending for hours, if not days. This tool aims to give you the ability to find and "cancel" / replace these TXs.'
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TxStatusLayout.scss';
</style>
