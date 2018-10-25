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
                @click="ensDebuggerOpen = !ensDebuggerOpen">
                <p>ENS Debugger & Data Grabber</p>
                <i 
                  v-if="!ensDebuggerOpen" 
                  class="fa fa-angle-down" 
                  aria-hidden="true"/>
                <i 
                  v-if="ensDebuggerOpen" 
                  class="fa fa-angle-up" 
                  aria-hidden="true"/>
              </div>
              <div 
                :class="ensDebuggerOpen ? 'the-description-open' : ''" 
                class="the-description">
                <p>
                  The measured steps are meant to avoid an escalation
                  of operations by Russia to more serious computer-based
                  attacks on US information systems and infrastructure.
                </p>
              </div>
            </div>
            <div 
              :class="ensDebuggerOpen ? 'input-block-open' : ''" 
              class="input-block">
              <div class="inputs">
                <div class="the-input">
                  <standard-input :options="inputAddress" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputEnsNameYouBid" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputHashedEnsName" />
                </div>
                <div class="the-input-grid-4">
                  <standard-input :options="inputAmountYourEthBid" />
                  <standard-input :options="inputAmountYourWeiBid" />
                  <standard-input :options="inputYourSecret" />
                  <standard-input :options="inputYourSecretHashed" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputHashedEnsName" />
                </div>
              </div>
            </div>
          </li>

          <li>
            <div class="input-title">
              <div 
                class="the-title" 
                @click="convertDecHexOpen = !convertDecHexOpen">
                <p>Convert Decimal to Hexadecimal & Hex to Decimal</p>
                <i 
                  v-if="!convertDecHexOpen" 
                  class="fa fa-angle-down" 
                  aria-hidden="true"/>
                <i 
                  v-if="convertDecHexOpen" 
                  class="fa fa-angle-up" 
                  aria-hidden="true"/>
              </div>              
              <div 
                :class="convertDecHexOpen ? 'the-description-open' : ''" 
                class="the-description">
                <p>
                  The measured steps are meant to avoid an escalation
                  of operations by Russia to more serious computer-based
                  attacks on US information systems and infrastructure.
                </p>
              </div>
            </div>
            <div 
              :class="convertDecHexOpen ? 'input-block-open' : ''" 
              class="input-block">
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
                @click="mistypedPrivateKeyOpen = !mistypedPrivateKeyOpen">
                <p>Mistyped Private Key</p>
                <i 
                  v-if="!mistypedPrivateKeyOpen" 
                  class="fa fa-angle-down" 
                  aria-hidden="true"/>
                <i 
                  v-if="mistypedPrivateKeyOpen" 
                  class="fa fa-angle-up" 
                  aria-hidden="true"/>
              </div>              
              <div 
                :class="mistypedPrivateKeyOpen ? 'the-description-open' : ''" 
                class="the-description">
                <p>
                  The measured steps are meant to avoid an escalation
                  of operations by Russia to more serious computer-based
                  attacks on US information systems and infrastructure.
                </p>
                <div class="link-block">
                  <a href="">Learn more</a>
                </div>
              </div>
            </div>
            <div 
              :class="mistypedPrivateKeyOpen ? 'input-block-open' : ''" 
              class="input-block">
              <div class="inputs">
                <div class="the-input">
                  <standard-input :options="inputPrivateKey" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputToAddress" />
                </div>
                <div class="the-input">
                  <standard-input :options="inputActualPrivateKey" />
                </div>
              </div>
            </div>
          </li>



          <li>
            <div class="input-title">
              <div 
                class="the-title" 
                @click="SHA3Open = !SHA3Open">
                <p>"SHA3" (Keccak-256) It!</p>
                <i 
                  v-if="!SHA3Open" 
                  class="fa fa-angle-down" 
                  aria-hidden="true"/>
                <i 
                  v-if="SHA3Open" 
                  class="fa fa-angle-up" 
                  aria-hidden="true"/>
              </div>              
              <div 
                :class="SHA3Open ? 'the-description-open' : ''" 
                class="the-description">
                <p>
                  The measured steps are meant to avoid an escalation
                  of operations by Russia to more serious computer-based
                  attacks on US information systems and infrastructure.
                </p>
                <div class="link-block">
                  <a href="">Yooo... sha3 !== Keccak-256?!</a>
                </div>
              </div>
            </div>
            <div 
              :class="SHA3Open ? 'input-block-open' : ''" 
              class="input-block">
              <div class="inputs">
                <div class="the-input">
                  <standard-input :options="inputSHA3Input" />
                </div>
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

export default {
  components: {
    'title-text-contents': TitleTextContentsLayout
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
      inputAddress: {
        title: 'Address You Bid From',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputEnsNameYouBid: {
        title: "ENS Name You Bid On (No '.eth' at The End!)",
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputHashedEnsName: {
        title: 'Hashed ENS Name (Label Hash)',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputAmountYourEthBid: {
        title: 'Amount Your ETH Bid',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputAmountYourWeiBid: {
        title: 'Amount Your Wei Bid',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
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
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputYourSecretHashed: {
        title: 'Your Secret (Hashed)',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
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
        placeHolder: 'Please Enter........',
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
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputHexadecimalPadded: {
        title: 'Hexadecimal (Padded Left w/64 characters)',
        value: '',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },

      inputPrivateKey: {
        title: "Private Key (This isn't unlocking correct address)",
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },
      inputToAddress: {
        title: 'To Address',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter........',
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
        placeHolder: 'Please Enter........',
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
        placeHolder: 'Please Enter........',
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
        placeHolder: 'Please Enter........',
        rightInputText: ''
      },

      ensDebuggerOpen: false,
      convertDecHexOpen: false,
      mistypedPrivateKeyOpen: false,
      SHA3Open: false,

      titleAndTextContents: {
        title: 'Advanced',
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
