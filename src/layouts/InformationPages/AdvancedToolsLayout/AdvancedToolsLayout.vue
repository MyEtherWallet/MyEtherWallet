<template>
  <div class="advanced-tools">
    <div class="wrap">
      <div class="page-container">
        <title-text-contents :options="titleAndTextContents" />

        <ul class="user-input-container">
          <li>
            <div class="input-title">
              <div
                class="the-title"
                @click="ensDebuggerOpen = !ensDebuggerOpen"
              >
                <p>ENS Debugger & Data Grabber</p>
                <i
                  v-if="!ensDebuggerOpen"
                  class="fa fa-angle-down"
                  aria-hidden="true"
                />
                <i
                  v-if="ensDebuggerOpen"
                  class="fa fa-angle-up"
                  aria-hidden="true"
                />
              </div>
              <div
                :class="ensDebuggerOpen ? 'the-description-open' : ''"
                class="the-description"
              >
                <p>
                  The measured steps are meant to avoid an escalation of
                  operations by Russia to more serious computer-based attacks on
                  US information systems and infrastructure.
                </p>
              </div>
            </div>
            <div
              :class="ensDebuggerOpen ? 'input-block-open' : ''"
              class="input-block"
            >
              <div class="inputs">
                <div class="the-input">
                  <dropdown-address-selector
                    :options="addressSelectorFromAddressOptions"
                  />
                </div>

                <div class="the-input the-input-flex">
                  <standard-input :options="inputAmountBid" />
                  <dropdown-bid-currency-selector />
                </div>

                <div class="the-input-grid-2">
                  <standard-input :options="inputEnsNameYouBid" />
                  <standard-input :options="inputYourSecret" />
                </div>
              </div>

              <div class="outputs">
                <div class="the-input to-address">
                  <standard-input :options="inputToAddress" />
                  <span>Detail</span>
                </div>

                <div class="the-input-grid-2">
                  <standard-input :options="inputHashedEnsName" />
                  <standard-input :options="inputYourSecretHashed" />

                  <standard-input :options="inputStartAuctionData" />
                  <standard-input :options="inputStartAuctionBidData" />

                  <standard-input :options="inputNewBidData" />
                  <standard-input :options="inputRevealData" />
                </div>

                <div class="the-input">
                  <standard-input :options="inputFinalizeAuctionData" />
                </div>
              </div>
            </div>
          </li>

          <li>
            <div class="input-title">
              <div
                class="the-title"
                @click="convertDecHexOpen = !convertDecHexOpen"
              >
                <p>Convert Decimal to Hexadecimal & Hex to Decimal</p>
                <i
                  v-if="!convertDecHexOpen"
                  class="fa fa-angle-down"
                  aria-hidden="true"
                />
                <i
                  v-if="convertDecHexOpen"
                  class="fa fa-angle-up"
                  aria-hidden="true"
                />
              </div>
              <div
                :class="convertDecHexOpen ? 'the-description-open' : ''"
                class="the-description"
              >
                <p>
                  The measured steps are meant to avoid an escalation of
                  operations by Russia to more serious computer-based attacks on
                  US information systems and infrastructure.
                </p>
              </div>
            </div>
            <div
              :class="convertDecHexOpen ? 'input-block-open' : ''"
              class="input-block"
            >
              <div class="inputs">
                <div class="the-input">
                  <standard-input :options="inputDecimal" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputHexadecimal" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputHexadecimalPadded" />
                </div>
              </div>
            </div>
          </li>

          <li>
            <div class="input-title">
              <div
                class="the-title"
                @click="mistypedPrivateKeyOpen = !mistypedPrivateKeyOpen"
              >
                <p>Mistyped Private Key</p>
                <i
                  v-if="!mistypedPrivateKeyOpen"
                  class="fa fa-angle-down"
                  aria-hidden="true"
                />
                <i
                  v-if="mistypedPrivateKeyOpen"
                  class="fa fa-angle-up"
                  aria-hidden="true"
                />
              </div>
              <div
                :class="mistypedPrivateKeyOpen ? 'the-description-open' : ''"
                class="the-description"
              >
                <p>
                  The measured steps are meant to avoid an escalation of
                  operations by Russia to more serious computer-based attacks on
                  US information systems and infrastructure.
                </p>
                <div class="link-block">
                  <a
                    rel="noopener noreferrer"
                    href="https:/kb.myetherwallet.com"
                    target="_blank"
                  >
                    >Learn more</a
                  >
                </div>
              </div>
            </div>
            <div
              :class="mistypedPrivateKeyOpen ? 'input-block-open' : ''"
              class="input-block"
            >
              <div class="inputs">
                <div class="the-input">
                  <standard-input :options="inputPrivateKey" />
                </div>

                <div class="the-input">
                  <dropdown-address-selector
                    :options="addressSelectorToAddressOptions"
                  />
                </div>
              </div>
              <div class="outputs">
                <div class="the-input">
                  <standard-input :options="inputActualPrivateKey" />
                </div>
                <div class="the-input-button-container">
                  <standard-button
                    :options="buttonCleanAll"
                    class="the-button"
                  />
                  <standard-button :options="buttonSearch" class="the-button" />
                </div>
              </div>
            </div>
          </li>

          <li>
            <div class="input-title">
              <div class="the-title" @click="SHA3Open = !SHA3Open">
                <p>"SHA3" (Keccak-256) It!</p>
                <i
                  v-if="!SHA3Open"
                  class="fa fa-angle-down"
                  aria-hidden="true"
                />
                <i v-if="SHA3Open" class="fa fa-angle-up" aria-hidden="true" />
              </div>
              <div
                :class="SHA3Open ? 'the-description-open' : ''"
                class="the-description"
              >
                <p>
                  The measured steps are meant to avoid an escalation of
                  operations by Russia to more serious computer-based attacks on
                  US information systems and infrastructure.
                </p>
                <div class="link-block">
                  <a href="#" rel="noopener noreferrer" target="_blank"
                    >Yooo... sha3 !== Keccak-256?!</a
                  >
                </div>
              </div>
            </div>
            <div
              :class="SHA3Open ? 'input-block-open' : ''"
              class="input-block"
            >
              <div class="inputs">
                <div class="the-input">
                  <standard-input :options="inputSHA3Input" />
                </div>
              </div>
              <div class="outputs">
                <div class="the-input">
                  <standard-input :options="inputSHA3Output" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '../Components/TitleTextContentsLayout';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import DropDownBidCurrencySelector from '@/components/DropDownBidCurrencySelector';

export default {
  components: {
    'title-text-contents': TitleTextContentsLayout,
    'dropdown-address-selector': DropDownAddressSelector,
    'dropdown-bid-currency-selector': DropDownBidCurrencySelector
  },
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
      buttonCleanAll: {
        title: 'Clean All',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      },
      buttonSearch: {
        title: 'Search',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      },
      addressSelectorFromAddressOptions: {
        title: 'Address Bid From'
      },
      addressSelectorToAddressOptions: {
        title: 'To Address',
        buttonCopy: true
      },
      inputAmountBid: {
        title: 'Amount Bid',
        titleText: '(0 WEI)',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputEnsNameYouBid: {
        title: 'ENS Name Bid On',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '.eth'
      },
      inputHashedEnsName: {
        title: 'Label Hash ENS Name',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        inputDisabled: true
      },
      inputToAddress: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        inputDisabled: true
      },
      inputStartAuctionData: {
        title: 'Start Auction Data',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        inputDisabled: true
      },
      inputStartAuctionBidData: {
        title: 'Start Auction & Bid Data',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        inputDisabled: true
      },
      inputYourSecret: {
        title: 'Your Secret',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputYourSecretHashed: {
        title: 'Hashed Secret',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        inputDisabled: true
      },

      inputDecimal: {
        title: 'Decimal',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputHexadecimal: {
        title: 'Hexadecimal',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputHexadecimalPadded: {
        title: 'Hexadecimal',
        titleText: '(Padded Left w/64 characters)',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },

      inputPrivateKey: {
        title: 'Private Key',
        titleText: "(This isn't unlocking correct address)",
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputActualPrivateKey: {
        title: 'Actual Private Key',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },

      inputSHA3Input: {
        title: 'Input',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputSHA3Output: {
        title: 'Output',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputFinalizeAuctionData: {
        title: 'Finalize Auction Data',
        value:
          '0x983b94fbc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        borderGrey: false,
        inputDisabled: true
      },
      inputNewBidData: {
        title: 'New Bid Data',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: 'Hi',
        placeHolder: '',
        rightInputText: '',
        borderGrey: false,
        inputDisabled: true
      },
      inputRevealData: {
        title: 'Reveal Data',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: 'Hello',
        placeHolder: '',
        rightInputText: '',
        borderGrey: false,
        inputDisabled: true
      },

      ensDebuggerOpen: false,
      convertDecHexOpen: false,
      mistypedPrivateKeyOpen: false,
      SHA3Open: false,

      titleAndTextContents: {
        title: 'Advanced Tools',
        boldSubTitle: '',
        textContent: [
          'The measured steps are meant to avoid an escalation of operations by Russia to more serious computer-based attacks on US information systems and infrastructure.'
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'AdvancedToolsLayout.scss';
</style>
