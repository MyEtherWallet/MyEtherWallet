<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title
        :isbackbutton="true"
        @backButtonClick="backButtonAction"
      />
      <div class="form-content-container">
        <div class="accordion-menu-container">
          <p class="beta-notice">{{ $t('interface.CryptoToFiatBeta') }}</p>

          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu
            :isopen="step1"
            :title="$t('interface.phoneNumber')"
            number="1"
          >
            <ul>
              <li>
                <p>{{ $t('interface.enterPhoneForSMS') }}</p>
                <p>{{ $t('interface.clickToContinue', { label: 'Send' }) }}</p>
              </li>
              <li>
                <div class="grid-phone-number">
                  <standard-input
                    :options="inputCountryCode"
                    class="country-code"
                    @changedValue="countryCode = $event"
                  />
                  <standard-input
                    :options="inputPhoneNumber"
                    class="phone-number"
                    @changedValue="phoneNumber = $event"
                  />
                </div>
              </li>
            </ul>
          </accordion-menu>
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu
            :isopen="verifyStep"
            :title="$t('interface.enterVerification')"
            number="2"
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
            </ul>
          </accordion-menu>
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu
            :isopen="step2"
            :title="$t('interface.bankInfo')"
            number="3"
            @titleClicked="reOpenBankInformation"
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
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu
            :isopen="step3"
            :title="$t('interface.personalInfo')"
            number="4"
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
            v-if="step1"
            :options="button1"
            @click.native="
              step1 = false;
              step2 = false;
              verifyStep = true;
              updateStage('phone');
              registerPhone();
            "
          />
          <standard-button
            v-if="verifyStep"
            :options="verifyButton"
            @click.native="
              updateStage('verify');
              confirmUser();
            "
          />
          <standard-button
            v-if="step2"
            :options="button2"
            @click.native="
              updateStage('account');
              step2 = false;
              step3 = true;
            "
          />
          <standard-button
            v-if="step3"
            :options="button3"
            @click.native="
              step3 = false;
              step2 = false;
              step1 = false;
              updateStage('accountHolder');
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
import store from 'store';
import { getNames, registerLocale } from 'i18n-iso-countries';
import names from 'i18n-iso-countries/langs/en.json';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import AccordionMenu1 from '@/components/AccordionMenu1';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from '@/components/StandardDropdown';
import StandardButton from '@/components/Buttons/StandardButton';

import { providerMap } from '@/partners';

registerLocale(names);

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'accordion-menu': AccordionMenu1,
    'standard-input': StandardInput,
    'standard-dropdown': StandardDropdown,
    'standard-button': StandardButton
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
      previouslyVerified: false,
      addSpace: false,
      finalizingSwap: false,
      countryList: Object.entries(getNames('en')),
      status: {
        phone: false,
        verify: false,
        account: false,
        accountHolder: false
      },
      step1: true,
      verifyStep: false,
      step2: false,
      step3: false,
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
      phonenumber: '',
      tan: '',
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
    }
  },
  mounted() {
    this.openMenu();
    const providerConstructor = providerMap.get(this.swapDetails.provider);
    this.provider = new providerConstructor();
    const haveCred = store.get('exit_to_fiat');
    if (haveCred !== null && haveCred !== undefined) {
      const userDetails = store.get('exit_to_fiat');
      if (userDetails.phone_token && userDetails.verified) {
        this.step1 = false;
        this.verifyStep = false;
        this.step2 = true;
        this.step3 = false;
      }
      if (!this.phoneToken) this.phoneToken = userDetails.phone_token;
    }
  },
  methods: {
    reOpenBankInformation() {
      this.step2 = true;
      this.step3 = false;
    },
    roomForDropDown(val) {
      this.addSpace = val;
    },
    updateStage(stage) {
      this.status[stage] = true;
    },
    openMenu(val) {
      return val;
      // console.log(val);
      // this.orderDetails.owner.country = val;
    },
    backButtonAction() {
      this.$emit('backButtonClick');
    },
    async registerPhone() {
      if (this.phoneNumber === '')
        throw Error(this.$t('interface.phoneRequired'));
      if (this.countryCode === '')
        throw Error(this.$t('interface.countryCodeRequired'));
      const initData = {
        phoneNumber: this.countryCode + this.phoneNumber,
        ...this.swapDetails
      };
      const existing = await this.provider.registerUser(initData);
      if (existing) {
        this.previouslyVerified = true;
        this.step1 = false;
        this.verifyStep = false;
        this.step2 = true;
      } else {
        this.step1 = false;
        this.verifyStep = true;
      }
    },
    async confirmUser() {
      const verifyData = {
        tan: this.tan,
        ...this.swapDetails
      };
      const verified = await this.provider.verifyUser(verifyData);
      if (verified.success) {
        this.verifyStep = false;
        this.step2 = true;
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
