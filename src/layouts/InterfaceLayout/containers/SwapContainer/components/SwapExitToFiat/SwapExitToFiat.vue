<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title
        ><h3 @click="backButtonAction">
          <i class="fa fa-arrow-left"></i>
          {{ $t('common.back') }}
        </h3></interface-container-title
      >

      <div class="form-content-container">
        <div class="accordion-menu-container">
          <!-- Bank Details - accordion-menu ******************************** -->
          <accordion-menu
            :isopen="true"
            :title="$t('swap.exit-to-fiat.bank-info')"
            :greytitle="false"
            :editbutton="true"
            number="1"
            @titleClicked="updateStep('step1')"
          >
            <ul>
              <li v-if="previouslyVerified">
                <p>{{ $t('swap.exit-to-fiat.prev-verified') }}</p>
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
            :title="$t('swap.exit-to-fiat.person-info')"
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
                    @changedValue="orderDetails.address_complement = $event"
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
                    :placeholder="$t('swap.exit-to-fiat.country')"
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
            {{ $t('swap.button-loading') }}
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
import { getNames, registerLocale } from 'i18n-iso-countries';
import names from 'i18n-iso-countries/langs/en.json';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import AccordionMenu from '@/components/AccordionMenu';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from './StandardDropdown';
import StandardButton from '@/components/Buttons/StandardButton';
import IBAN from 'iban';

import { providerMap } from '@/partners';

registerLocale(names);

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'accordion-menu': AccordionMenu,
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
      localStoreKey: 'linkedPhone',
      previouslyVerified: false,
      addSpace: false,
      finalizingSwap: false,
      countryList: Object.entries(getNames('en')),
      complete: {
        step1: false,
        step2: false
      },
      steps: {
        step1: true,
        step2: false
      },
      inputCountryCode: {
        title: this.$t('swap.exit-to-fiat.country-code'),
        placeHolder: '000'
      },
      inputPhoneNumber: {
        title: this.$t('swap.exit-to-fiat.phone-number'),
        placeHolder: '000-000-0000'
      },
      inputVerification: {
        title: this.$t('swap.exit-to-fiat.verification-code'),
        placeHolder: '000000'
      },
      inputBicSwift: {
        title: this.$t('swap.exit-to-fiat.bic-swift'),
        popover: this.$t('swap.exit-to-fiat.popover-bic-swift'),
        value: ''
      },
      inputAbaNumber: {
        title: this.$t('swap.exit-to-fiat.aba-num'),
        popover: this.$t('swap.exit-to-fiat.popover-aba-num'),
        value: ''
      },
      inputIbanNumber: {
        title: this.$t('swap.exit-to-fiat.iban-num'),
        popover: this.$t('swap.exit-to-fiat.popover-iban-num'),
        value: ''
      },
      inputName: {
        title: this.$t('swap.exit-to-fiat.acc-owner-name'),
        value: ''
      },
      inputEmail: {
        title: this.$t('swap.exit-to-fiat.email'),
        popover: this.$t('swap.exit-to-fiat.popover-email'),
        placeHolder: 'user@example.com',
        value: ''
      },
      inputAddress1: {
        title: this.$t('swap.exit-to-fiat.billing-addr'),
        placeHolder: this.$t('swap.exit.to-fiat.addr-placeholder'),
        value: ''
      },
      inputAddress2: {
        placeHolder: this.$t('swap.exit-to-fiat.addr-optional'),
        value: ''
      },
      inputCity: {
        placeHolder: this.$t('swap.exit-to-fiat.city'),
        value: ''
      },
      inputState: {
        placeHolder: this.$t('swap.exit-to-fiat.state'),
        value: ''
      },
      inputZip: {
        placeHolder: this.$t('swap.exit-to-fiat.zip-code'),
        value: ''
      },
      inputCountry: {
        placeHolder: this.$t('swap.exit-to-fiat.country'),
        value: ''
      },
      button1: {
        title: this.$t('sendTx.send'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      verifyButton: {
        title: this.$t('common.verify'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      button2: {
        title: this.$t('common.continue'),
        buttonStyle: 'green',
        value: '',
        noWalletTerms: true
      },
      button3: {
        title: this.$t('swap.exit-to-fiat.button-submit'),
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
        iban: '',
        bic_swift: '',
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
    canSwap() {
      return (
        this.isValidIBAN &&
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
