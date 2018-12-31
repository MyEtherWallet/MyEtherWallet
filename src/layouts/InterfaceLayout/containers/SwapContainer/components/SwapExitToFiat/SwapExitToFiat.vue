<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title
        :isbackbutton="true"
        @backButtonClick="backButtonAction"
      />
      <div class="form-content-container">
        <div class="accordion-menu-container">
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu :isopen="step1" title="Verification" number="1">
            <ul>
              <li>
                <p>
                  You will receive a 6 digits PIN number through your phone
                  number. To continue, enter the PIN number below.
                </p>
              </li>
              <li>
                <standard-input
                  :options="inputPhoneNumber"
                  @changedValue="setPhone"
                />
              </li>
            </ul>
          </accordion-menu>
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu :isopen="step2" title="Bank Information" number="2">
            <ul>
              <li>
                <standard-input
                  :options="inputIbanNumber"
                  @changedValue="setIban"
                />
              </li>
              <li>
                <standard-input
                  :options="inputBicSwift"
                  @changedValue="setBic"
                />
              </li>
              <li>
                <standard-input
                  :options="inputAbaNumber"
                  @changedValue="setAba"
                />
              </li>
            </ul>
          </accordion-menu>
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu
            :isopen="step3"
            title="Personal Information"
            number="3"
          >
            <ul>
              <li>
                <standard-input :options="inputName" @changedValue="setName" />
              </li>
              <li>
                <div class="grid-billing-address">
                  <standard-input
                    :options="inputAddress1"
                    @changedValue="setAddress1"
                    class="address1"
                  />
                  <standard-input
                    :options="inputAddress2"
                    @changedValue="setAddress2"
                    class="address2"
                  />
                  <standard-input
                    :options="inputCity"
                    @changedValue="setCity"
                    class="city"
                  />
                  <!--<standard-dropdown class="state" />-->
                  <standard-input
                    :options="inputState"
                    @changedValue="setState"
                    class="state"
                  />
                  <standard-input
                    :options="inputZip"
                    @changedValue="setZip"
                    class="zip"
                  />
                  <standard-input
                    :options="inputCountry"
                    @changedValue="setCountry"
                    class="country"
                  />
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
              step2 = true;
            "
          />
          <standard-button
            v-if="step2"
            :options="button2"
            @click.native="
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
              step1 = true;
              createExitOrder();
            "
          />
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
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import AccordionMenu1 from '@/components/AccordionMenu1';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from '@/components/StandardDropdown';
import StandardButton from '@/components/Buttons/StandardButton';

import {
  providerMap
  // providers,
  // bestProviderForQuantity,
  // bestRateForQuantity,
  // isValidEntry,
  // providerNames,
  // BASE_CURRENCY,
  // fiat,
  // MIN_SWAP_AMOUNT,
  // ERC20
} from '@/partners';

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
    }
  },
  data() {
    return {
      step1: true,
      step2: false,
      step3: false,
      inputPhoneNumber: {
        title: 'Phone Number',
        placeHolder: '000-000-0000'
      },
      inputBicSwift: {
        title: 'BIC_Swift',
        popover: 'This is international bank routing number.',
        value: ''
      },
      inputAbaNumber: {
        title: 'ABA Number',
        popover: 'This is ABA number.',
        value: ''
      },
      inputIbanNumber: {
        title: 'IBAN Number',
        popover: 'This is international bank account number (IBAN).',
        value: ''
      },
      inputName: {
        title: 'Name on the bank account',
        value: ''
      },
      inputAddress1: {
        title: 'Billing Address',
        placeHolder: 'Address 1',
        value: ''
      },
      inputAddress2: {
        placeHolder: 'Address 2 (Optional)',
        value: ''
      },
      inputCity: {
        placeHolder: 'City',
        value: ''
      },
      inputState: {
        placeHolder: 'State',
        value: ''
      },
      inputZip: {
        placeHolder: 'Zip',
        value: ''
      },
      inputCountry: {
        placeHolder: 'Country',
        value: ''
      },
      button1: {
        title: 'Send',
        buttonStyle: 'green',
        value: ''
      },
      button2: {
        title: 'Continue',
        buttonStyle: 'green',
        value: ''
      },
      button3: {
        title: 'Submit',
        buttonStyle: 'green',
        value: ''
      },
      provider: {},
      phoneData: '',
      orderDetails: {
        currency: this.swapDetails.toCurrency,
        type: 'bank_account',
        iban: '',
        bic_swift: '',
        aba_number: '',
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
  computed: {},
  mounted() {
    this.openMenu();
    const providerConstructor = providerMap.get(this.swapDetails.provider);
    this.provider = new providerConstructor();
    console.log(this.provider); // todo remove dev item
  },
  methods: {
    setPhone(phone) {
      console.log(phone); // todo remove dev item
    },
    setIban(val) {
      this.orderDetails.iban = val;
    },
    setBic(val) {
      this.orderDetails.bic_swift = val;
    },
    setAba(val) {
      this.orderDetails.aba_number = val;
    },
    setName(val) {
      this.orderDetails.owner.name = val;
    },
    setAddress1(val) {
      this.orderDetails.owner.address = val;
    },
    setAddress2(val) {
      this.orderDetails.owner.address_complement = val;
    },
    setCity(val) {
      this.orderDetails.owner.city = val;
    },
    setZip(val) {
      this.orderDetails.owner.zip = val;
    },
    setState(val) {
      this.orderDetails.owner.state = val;
    },
    setCountry(val) {
      this.orderDetails.owner.name = val;
    },
    openMenu(val) {
      this.orderDetails.owner.country = val;
    },
    backButtonAction() {
      this.$emit('backButtonClick');
    },
    registerPhone() {},
    verifyUser() {},
    createExitOrder() {
      const details = {
        input: {
          amount: this.swapDetails.fromValue,
          currency: this.swapDetails.fromCurrency,
          type: 'crypto_address',
          crypto_address: this.swapDetails.fromAddress
        },
        output: this.orderDetails
      };
      //
      // if (this.inputIbanNumber) {
      //   details.output.iban = this.inputIbanNumber;
      // }
      // if (this.inputAbaNumber) {
      //   details.output.aba_number = this.inputAbaNumber;
      // }
      // if (this.inputBicSwift) {
      //   details.output.bic_swift = this.inputBicSwift;
      // }
      console.log(details); // todo remove dev item
      // iban: body.params.iban,
      //   bic_swift: body.params.bic_swift,
      //   aba_number: body.params.aba_number,
      //   sort_code: body.params.sort_code,
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapExitToFiat';
</style>
