<template>
  <div class="bid-info">
    <div>
      <div class="info-button">
        <div class="title-block">
          <p class="button-number">1</p>
          <p class="button-title">Bid Information</p>
        </div>
        <div class="functions">
          <p @click="bidInfoOpen = !bidInfoOpen; detailInfoOpen = !detailInfoOpen">Edit</p>
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

    <div class="detail-info">
      <div class="info-button">
        <div class="title-block">
          <p class="button-number">2</p>
          <p class="button-title">Detail Information</p>
        </div>
      </div>
      <div 
        :class="detailInfoOpen ? 'user-input-open' : ''" 
        class="detail-info-data">
        <div class="padding-block">
          <div class="user-messages">
            <p>
              You CAN NOT claim your name unless you have this
              information during the reveal process.
              We suggest that you save those information locally.
            </p>
          </div>
          <div class="domain-detail-info">
            <ul>
              <li>
                <div class="info-title">
                  <p>Actual Bid Amount</p>
                  <popover 
                    popcontent="Hello Good bye~"/>
                </div>
                <div class="info-data">
                  <p>0.05 ETH</p>
                </div>
              </li>
              <li>
                <div class="info-title">
                  <p>Secret Phrase</p>
                  <popover 
                    popcontent="Hello Good bye~"/>
                </div>
                <div class="info-data">
                  <p>Suffer Ramp Power</p>
                </div>
              </li>
              <li>
                <div class="info-title">
                  <p>Reveal Date</p>
                  <popover 
                    popcontent="Hello Good bye~"/>
                </div>
                <div class="info-data">
                  <p>Wed 09/05/2018 15:43 GMT - 12:43 PDT</p>
                </div>
              </li>
              <li>
                <div class="info-title">
                  <p>Bid Mask</p>
                </div>
                <div class="info-data">
                  <p>0.06 ETH</p>
                </div>
              </li>
              <li>
                <div class="info-title">
                  <p>Auction Ends</p>
                </div>
                <div class="info-data">
                  <p>Fri 09/07/2018 15:41 GMT - 1:22 PDT</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="json-string-input">
            <standard-input :options="inputJSONString" />
          </div>
        </div><!-- .padding-block -->


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
      bidInfoOpen: true,
      detailInfoOpen: false,
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
        topTextInfo: '',
        popover: 'Herro',
        placeHolder: 'Secret Phrase',
        rightInputText: '',
        buttonRandom: true
      },
      inputJSONString: {
        title: 'JSON String',
        value:
          '"address": "0x98923492735927390527930270345723094729034793"\nkjhwerifhwefiohw\n98u98u432r 23r723gr8273r23r\niujerwiuf2h9f3hefr983fr9823hr9283yr9238ry',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        isTextarea: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'DropdownBidInfo-desktop.scss';
@import 'DropdownBidInfo-tablet.scss';
@import 'DropdownBidInfo-mobile.scss';
</style>
