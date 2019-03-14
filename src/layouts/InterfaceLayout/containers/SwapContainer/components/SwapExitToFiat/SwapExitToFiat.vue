<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title
        ><h3 @click="backButtonAction">
          <i class="fa fa-arrow-left"></i>
          {{ $t('interface.back') }}
        </h3></interface-container-title
      >

      <div class="form-content-container">
        <div class="accordion-menu-container">
          <!-- Phone Number - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="steps['step1']"
            :title="$t('interface.phoneNumber')"
            :greytitle="false"
            :editbutton="false"
            :right-text="complete.step1 ? 'complete' : 'incomplete'"
            number="1"
            @titleClicked="reOpen"
          >
            <ul>
              <li>
                <p>{{ $t('interface.enterPhoneForSMS') }}</p>
              </li>
              <li>
                <div class="grid-phone-number">
                  <vue-tel-input
                    v-model="phoneNumber"
                    :preferred-countries="['us', 'gb', 'ua']"
                    :disabled-fetching-country="true"
                    class="phone-number"
                    @onValidate="setPhoneNumber"
                  ></vue-tel-input>
                </div>
              </li>
              <li>
                <p>{{ $t('interface.clickToContinue', { label: 'Send' }) }}</p>
              </li>
            </ul>
          </accordion-menu>
          <!-- Tan Code - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="steps['verifyStep']"
            :greytitle="false"
            :editbutton="false"
            :title="$t('interface.enterVerification')"
            :right-text="complete.verifyStep ? 'complete' : 'incomplete'"
            number="2"
            @titleClicked="reOpen"
          >
            <ul>
              <li>
                <p>{{ $t('interface.verifyCodeInstructions') }}</p>
              </li>
              <li>
                <standard-input
                  :options="inputVerification"
                  @changedValue="tan = $event"
                />
              </li>
              <li>
                <p v-if="invalidTanEntered">
                  {{ $t('interface.invalidTanCode') }}
                </p>
              </li>
            </ul>
          </accordion-menu>
          <!-- Bank Details - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="steps['step2']"
            :title="$t('interface.bankInfo')"
            :greytitle="false"
            :editbutton="true"
            number="3"
            @titleClicked="reOpen"
          >
            <ul>
              <li v-if="previouslyVerified">
                <p>{{ $t('interface.previouslyVerified') }}</p>
              </li>
              <li>
                <standard-input
                  :options="inputIbanNumber"
                  @changedValue="orderDetails.iban = $event"
                />
              </li>
              <!--              <li v-if="!isValidIBAN">
                <p> {{$t('header.invalidIBAN')}}</p>
              </li>-->
              <li>
                <standard-input
                  :options="inputBicSwift"
                  @changedValue="orderDetails.bic_swift = $event"
                />
              </li>
              <li>
                <standard-input
                  :options="inputAbaNumber"
                  @changedValue="orderDetails.aba_number = $event"
                />
              </li>
            </ul>
          </accordion-menu>
          <!-- Personal Details - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="steps['step3']"
            :title="$t('interface.personalInfo')"
            :greytitle="false"
            :editbutton="true"
            number="4"
            @titleClicked="reOpen"
          >
            <ul>
              <li>
                <standard-input
                  :options="inputName"
                  @changedValue="orderDetails.owner.name = $event"
                />
              </li>
              <li>
                <div class="grid-billing-address">
                  <standard-input
                    :options="inputAddress1"
                    class="address1"
                    @changedValue="orderDetails.owner.address = $event"
                  />
                  <standard-input
                    :options="inputAddress2"
                    class="address2"
                    @changedValue="
                      orderDetails.owner.address_complement = $event
                    "
                  />
                  <standard-input
                    :options="inputCity"
                    class="city"
                    @changedValue="orderDetails.owner.city = $event"
                  />
                  <!--<standard-dropdown class="state" />-->
                  <standard-input
                    :options="inputState"
                    class="state"
                    @changedValue="orderDetails.owner.state = $event"
                  />
                  <standard-input
                    :options="inputZip"
                    class="zip"
                    @changedValue="orderDetails.owner.zip = $event"
                  />
                  <standard-dropdown
                    :options="countryOptions"
                    :placeholder="$t('interface.country')"
                    :option-display-key="'1'"
                    :option-value-key="'0'"
                    class="country"
                    @selection="orderDetails.owner.country = $event"
                    @opened="roomForDropDown"
                  />
                  <div v-if="addSpace" class="extraSpace"></div>
                </div>
              </li>
            </ul>
          </accordion-menu>
        </div>
        <!-- .accordion-menu-container -->
        <div class="button-container">
          <standard-button
            v-if="steps['step1']"
            :options="button1"
            :button-disabled="!isValidPhoneNumber"
            @click.native="registerPhone()"
          />
          <standard-button
            v-if="steps['verifyStep']"
            :options="verifyButton"
            :button-disabled="!validTan"
            @click.native="confirmUser()"
          />
          <standard-button
            v-if="steps['step2']"
            :options="button2"
            @click.native="
              updateStep('step3');
              stageComplete('step2');
            "
          />
          <standard-button
            v-if="steps['step3']"
            :options="button3"
            :button-disabled="!canSwap"
            @click.native="
              updateStep('');
              stageComplete('step3');
              createExitOrder();
            "
          />
          <div
            v-show="finalizingSwap"
            class="disabled submit-button large-round-button-green-filled clickable"
          >
            <i class="fa fa-spinner fa-spin" />
            {{ $t('interface.swapButtonLoading') }}
          </div>
        </div>
        <!-- .button-container -->
      </div>
      <!-- .content-container -->
    </div>
    <!-- .wrap -->
  </div>
  <!-- .swap-send-form -->
</template>

<script>
import 'vue-tel-input/dist/vue-tel-input.css';

import store from 'store';
import { getNames, registerLocale } from 'i18n-iso-countries';
import names from 'i18n-iso-countries/langs/en.json';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import AccordionMenu from '@/components/AccordionMenu';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from '@/components/StandardDropdown';
import StandardButton from '@/components/Buttons/StandardButton';
import VueTelInput from 'vue-tel-input';
import IBAN from 'iban';

import { providerMap } from '@/partners';

registerLocale(names);

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'accordion-menu': AccordionMenu,
    'standard-input': StandardInput,
    'standard-dropdown': StandardDropdown,
    'standard-button': StandardButton,
    'vue-tel-input': VueTelInput
  },
  props: {
    swapDetails: {
      type: Object,
      default: function() {
        return {};
      }
    },
    exitFromAddress: {
      type: String,
      default: ''
    },
    exitToFiatCallback: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      localStoreKey: 'linkedPhone',
      previouslyVerified: false,
      addSpace: false,
      finalizingSwap: false,
      countryList: Object.entries(getNames('en')),
      complete: {
        step1: false,
        verifyStep: false,
        step2: false,
        step3: false
      },
      steps: {
        step1: true,
        verifyStep: false,
        step2: false,
        step3: false
      },
      inputCountryCode: {
        title: this.$t('interface.countryCode'),
        placeHolder: '000'
      },
      inputPhoneNumber: {
        title: this.$t('interface.phoneNumber'),
        placeHolder: '000-000-0000'
      },
      inputVerification: {
        title: this.$t('interface.verificationCode'),
        placeHolder: '000000'
      },
      inputBicSwift: {
        title: this.$t('interface.bicSwiftCode'),
        popover: this.$t('interface.bicSwiftPopOver'),
        value: ''
      },
      inputAbaNumber: {
        title: this.$t('interface.abaNumber'),
        popover: this.$t('interface.abaPopOver'),
        value: ''
      },
      inputIbanNumber: {
        title: this.$t('interface.ibanNumber'),
        popover: this.$t('interface.ibanPopOver'),
        value: ''
      },
      inputName: {
        title: this.$t('interface.ownerName'),
        value: ''
      },
      inputAddress1: {
        title: this.$t('interface.billingAddress'),
        placeHolder: 'Address 1',
        value: ''
      },
      inputAddress2: {
        placeHolder: this.$t('interface.addressOptional'),
        value: ''
      },
      inputCity: {
        placeHolder: this.$t('interface.city'),
        value: ''
      },
      inputState: {
        placeHolder: this.$t('interface.state'),
        value: ''
      },
      inputZip: {
        placeHolder: this.$t('interface.zipCode'),
        value: ''
      },
      inputCountry: {
        placeHolder: this.$t('interface.country'),
        value: ''
      },
      button1: {
        title: this.$t('interface.send'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      verifyButton: {
        title: this.$t('interface.verify'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      button2: {
        title: this.$t('interface.continue'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      button3: {
        title: this.$t('interface.submit'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      provider: {},
      countryCode: '',
      validTan: false,
      validPhoneNumber: false,
      phoneNumber: '',
      tan: '',
      invalidTanEntered: false,
      orderDetails: {
        currency: this.swapDetails.toCurrency,
        type: 'bank_account',
        iban: '',
        bic_swift: '',
        aba_number: '',
        sort_code: '',
        owner: {
          name: '',
          address: '',
          address_complement: '',
          zip: '',
          city: '',
          state: '',
          country: ''
        }
      }
    };
  },
  computed: {
    countryOptions() {
      return this.countryList;
    },
    isValidIBAN() {
      if (this.orderDetails.iban === '') {
        return false;
      }
      return IBAN.isValid(this.orderDetails.iban);
    },
    isValidPhoneNumber() {
      return this.validPhoneNumber;
    },
    canSwap() {
      return (
        this.orderDetails.iban !== '' &&
        this.orderDetails.bic_swift !== '' &&
        this.orderDetails.owner.name !== '' &&
        this.orderDetails.owner.address !== '' &&
        this.orderDetails.owner.city !== '' &&
        this.orderDetails.owner.country !== ''
      );
    }
  },
  watch: {
    tan(val) {
      const correctLength = val.toString().length === 6;
      const allNumbers = /^\d\d\d\d\d\d$/.test(val);
      this.validTan = correctLength && allNumbers;
    }
  },
  mounted() {
    this.openMenu();
    const providerConstructor = providerMap.get(this.swapDetails.provider);
    this.provider = new providerConstructor();
    const haveCred = store.get(this.localStoreKey);
    if (haveCred !== null && haveCred !== undefined) {
      const userDetails = store.get(this.localStoreKey);
      if (userDetails.phone_token && userDetails.verified) {
        this.stageComplete('step1');
        this.stageComplete('verifyStep');
      }
      if (!this.phoneToken) this.phoneToken = userDetails.phone_token;
    }
  },
  methods: {
    reOpen(step) {
      if (this.complete[step]) {
        this.updateStep(step);
      }
    },
    roomForDropDown(val) {
      this.addSpace = val;
    },
    updateStep(stage) {
      const allSteps = Object.keys(this.steps);
      allSteps.forEach(step => {
        if (step !== stage) {
          this.steps[step] = false;
        } else {
          this.steps[step] = true;
        }
      });
    },
    stageComplete(stage) {
      this.complete[stage] = true;
    },
    openMenu(val) {
      return val;
    },
    setPhoneNumber({ number, isValid }) {
      this.validPhoneNumber = isValid;
      this.phoneNumber = number;
    },
    backButtonAction() {
      this.$emit('backButtonClick');
    },
    async registerPhone() {
      if (this.phoneNumber === '')
        throw Error(this.$t('interface.phoneRequired'));
      const initData = {
        phoneNumber: this.phoneNumber,
        ...this.swapDetails
      };
      const existing = await this.provider.registerUser(initData);
      if (existing) {
        this.previouslyVerified = true;
        this.stageComplete('step1');
        this.stageComplete('verifyStep');
        this.updateStep('step2');
      } else {
        this.stageComplete('step1');
        this.updateStep('verifyStep');
      }
    },
    async confirmUser() {
      if (this.validTan) {
        const verifyData = {
          tan: this.tan,
          ...this.swapDetails
        };
        const verified = await this.provider.verifyUser(verifyData);
        if (verified.success) {
          this.invalidTanEntered = false;
          this.stageComplete('verifyStep');
          this.updateStep('step2');
        } else {
          this.invalidTanEntered = true;
        }
      }
    },
    async createExitOrder() {
      this.finalizingSwap = true;
      const details = {
        input: {
          amount: this.swapDetails.fromValue,
          currency: this.swapDetails.fromCurrency,
          type: 'crypto_address',
          crypto_address: this.exitFromAddress
        },
        output: this.orderDetails
      };

      const swapDetails = await this.provider.startSwap({
        ...this.swapDetails,
        bypass: true,
        orderDetails: details,
        special: { phoneToken: this.provider.phoneToken }
      });
      this.finalizingSwap = false;
      this.exitToFiatCallback(swapDetails);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapExitToFiat';
</style>
