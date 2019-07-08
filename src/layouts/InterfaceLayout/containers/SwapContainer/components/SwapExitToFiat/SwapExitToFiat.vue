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
          <!-- Bank Details - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="true"
            :title="$t('interface.bankInfo')"
            :greytitle="false"
            :editbutton="true"
            number="1"
            @titleClicked="updateStep('step1')"
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
            </ul>
          </accordion-menu>
          <!-- Personal Details - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="true"
            :title="$t('interface.personalInfo')"
            :greytitle="false"
            :editbutton="true"
            number="2"
            @titleClicked="updateStep('step2')"
          >
            <ul>
              <li>
                <standard-input
                  :options="inputName"
                  @changedValue="orderDetails.name = $event"
                />
              </li>
              <li>
                <standard-input
                  :options="inputEmail"
                  @changedValue="email = $event"
                />
              </li>
              <li>
                <div class="grid-billing-address">
                  <standard-input
                    :options="inputAddress1"
                    class="address1"
                    @changedValue="orderDetails.address = $event"
                  />
                  <standard-input
                    :options="inputAddress2"
                    class="address2"
                    @changedValue="
                      orderDetails.address_complement = $event
                    "
                  />
                  <standard-input
                    :options="inputCity"
                    class="city"
                    @changedValue="orderDetails.city = $event"
                  />
                  <standard-input
                    :options="inputState"
                    class="state"
                    @changedValue="orderDetails.state = $event"
                  />
                  <standard-input
                    :options="inputZip"
                    class="zip"
                    @changedValue="orderDetails.zip = $event"
                  />
                  <standard-dropdown
                    :options="countryOptions"
                    :placeholder="$t('interface.country')"
                    :option-display-key="'1'"
                    :option-value-key="'0'"
                    class="country"
                    @selection="orderDetails.country = $event"
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
            v-show="!finalizingSwap"
            :options="button3"
            :button-disabled="!canSwap"
            @click.native="
              updateStep('');
              stageComplete('step2');
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

// import store from 'store';
import { getNames, registerLocale } from 'i18n-iso-countries';
import names from 'i18n-iso-countries/langs/en.json';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import AccordionMenu from '@/components/AccordionMenu';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from './StandardDropdown';
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
        // verifyStep: false,
        step2: false
        // step3: false
      },
      steps: {
        step1: true,
        // verifyStep: false,
        step2: false
        // step3: false
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
      inputEmail: {
        title: this.$t('interface.email'),
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
      email: '',
      orderDetails: {
        currency: this.swapDetails.toCurrency,
        // type: 'bank_account',
        iban: '',
        bic_swift: '',
        // aba_number: '',
        // sort_code: '',
        name: '',
        address: '',
        address_complement: '',
        zip: '',
        city: '',
        state: '',
        country: ''
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
        this.orderDetails.name !== '' &&
        this.orderDetails.address !== '' &&
        this.orderDetails.city !== '' &&
        this.orderDetails.country !== ''
      );
    }
  },
  mounted() {
    this.openMenu();
    const providerConstructor = providerMap.get(this.swapDetails.provider);
    this.provider = new providerConstructor();
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
    backButtonAction() {
      this.$emit('backButtonClick');
    },
    async createExitOrder() {
      this.finalizingSwap = true;
      const details = {
        email: this.email,
        input: {
          amount: this.swapDetails.fromValue,
          currency: this.swapDetails.fromCurrency,
          crypto_address: this.exitFromAddress
        },
        ...this.orderDetails
      };

      const swapDetails = await this.provider.startSwap({
        ...this.swapDetails,
        bypass: true,
        orderDetails: details
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
