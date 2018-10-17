<template>
  <div class="register-domain-container">
    <back-button :reset-view="resetView"/>

    <div class="content-container">

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.registerDns') }}</h4>
            <p>{{ $t('interface.registerDnsDesc') }}</p>
          </div>
        </div>
        <div class="the-form domain-name">
          
          <standard-input :options="inputDomain" />
          <span>.eth</span>
        </div>
      </div>

      <div class="submit-button-container">

        <standard-button 
          :options="buttonCheckDomain"
          class="check-domain-button"
          @click.native="modalStatusDomainTaken = 'show'"
        />

        <div class="flex-container">
          <div class="title-container">
            <h4 class="modal-title">{{ $t('interface.subDomain') }}</h4>
            <div class="margin-left-auto add-custom-network">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input
                    type="checkbox"
                    @click="subDomainSearchOpen = !subDomainSearchOpen" >
                  <span class="slider round"/>
                </label>
              </div>
            </div>
          </div>


          <div 
            :class="subDomainSearchOpen ? 'sub-domain-content-open' : ''" 
            class="sub-domain-content">
            <div
              ref="checkForm"
              class="domain-check-form">
              <div class="domain-checker">
                <input
                  type="text"
                  name=""
                  value=""
                  placeholder="Enter Domain Name" >
                <div
                  class="check-button desktop-button"
                  @click="subDomainResultsOpen = !subDomainResultsOpen">
                  {{ $t('common.check') }}
                </div>
              </div>
            </div>
            <div
              ref="domainList"
              :class="subDomainResultsOpen ? 'sub-domain-list-open' : ''"
              class="sub-domain-list">
              <h4 class="title">{{ $t('interface.allSubDomains') }}</h4>
              <ul>

                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018erhrewgvwef.wewefgwegwefgwegv.erg.etherbase.eth</p>
                    <p class="sub-domain-price">0.240 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">wgwrgv.ewrgwegwgew.gwregh.myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">1.453213 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                <li>
                  <div class="sub-domain-container">
                    <p class="sub-domain-name">myetherwallet2018.etherbase.eth</p>
                    <p class="sub-domain-price">0 ETH</p>
                  </div>
                  <div class="buy-button-container">
                    <button
                      class="buy-button very-small-circle-button-green-border"
                      @click="domainBuyButtonClick($event)">
                      {{ $t('common.buy') }}
                    </button>
                  </div>
                </li>
                
              </ul>
            </div>
            <div
              class="check-button mobile-button"
              @click="subDomainResultsOpen = !subDomainResultsOpen">
              {{ $t('common.check') }}
            </div>
          </div><!-- .sub-domain-content -->
        </div><!-- .flex-container -->



        <interface-bottom-text
          :link-text="$t('interface.learnMore')"
          :question="$t('interface.haveIssues')"
          link="/"/>
      </div>
    </div><!-- .content-container -->

    <standard-modal 
      :options="domainTakenModal" />

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import BackButton from '../../components/BackButton';
import StandardModal from '@/containers/ConfirmationContainer/components/StandardModal';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton,
    'standard-modal': StandardModal
  },
  props: {
    resetView: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      subDomainSearchOpen: false,
      subDomainResultsOpen: false,
      domainTakenModal: {
        title: 'Oops!',
        text: 'This domain has been taken already, please try another one.',
        buttonTitle: 'Okay'
      },
      buttonCheckDomain: {
        title: 'Check Domain',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false
      },
      inputDomain: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter at Least 7 Characters',
        rightInputText: ''
      }
    };
  },
  methods: {
    expendDomainCheckForm() {
      this.$refs['checkForm'].classList.toggle('hidden');
      this.$refs['domainList'].classList.add('hidden');
    },
    domainAvailabilityCheck() {
      // this.$refs['checkForm'].classList.toggle('hidden')
      this.$refs['domainList'].classList.add('hidden');
    },
    domainBuyButtonClick() {
      // $event.toElement.classList.toggle('very-small-circle-button-green-filled')
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'RegisterDomainContainer-desktop.scss';
@import 'RegisterDomainContainer-tablet.scss';
@import 'RegisterDomainContainer-mobile.scss';
</style>
