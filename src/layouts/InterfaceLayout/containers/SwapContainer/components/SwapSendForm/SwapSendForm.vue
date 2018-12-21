<template>
  <div class="swap-send-form">
    <div class="wrap">
      <interface-container-title :isbackbutton="true" />
      <div class="content-container">
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
              <li><standard-input :options="inputPhoneNumber" /></li>
            </ul>
          </accordion-menu>
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <!-- accordion-menu ******************************** -->
          <accordion-menu :isopen="step2" title="Bank Information" number="2">
            <ul>
              <li><standard-input :options="inputBicSwift" /></li>
              <li><standard-input :options="inputBabNumber" /></li>
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
              <li><standard-input :options="inputName" /></li>
              <li>
                <div class="grid-billing-address">
                  <standard-input :options="inputAddress1" class="address1" />
                  <standard-input :options="inputAddress2" class="address2" />
                  <standard-input :options="inputCity" class="city" />
                  <standard-dropdown class="state" />
                  <standard-input :options="inputZip" class="zip" />
                  <standard-input :options="inputCountry" class="country" />
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

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'accordion-menu': AccordionMenu1,
    'standard-input': StandardInput,
    'standard-dropdown': StandardDropdown,
    'standard-button': StandardButton
  },
  props: {
    providerData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      step1: true,
      step2: true,
      step3: true,
      inputPhoneNumber: {
        title: 'Phone Number',
        placeHolder: '000-000-0000'
      },
      inputBicSwift: {
        title: 'BIC_Swift',
        popover: 'This is international bank routing number.'
      },
      inputBabNumber: {
        title: 'BAB Number',
        popover: 'This is BAB number.'
      },
      inputName: {
        title: 'Name on the bank account'
      },
      inputAddress1: {
        title: 'Billing Address',
        placeHolder: 'Address 1'
      },
      inputAddress2: {
        placeHolder: 'Address 2'
      },
      inputCity: {
        placeHolder: 'City'
      },
      inputState: {
        placeHolder: 'State'
      },
      inputZip: {
        placeHolder: 'Zip'
      },
      inputCountry: {
        placeHolder: 'Country'
      },
      button1: {
        title: 'Send',
        buttonStyle: 'green'
      },
      button2: {
        title: 'Continue',
        buttonStyle: 'green'
      },
      button3: {
        title: 'Submit',
        buttonStyle: 'green'
      }
    };
  },
  computed: {},
  mounted() {
    this.openMenu();
  },
  methods: {
    openMenu() {}
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapSendForm.scss';
</style>
