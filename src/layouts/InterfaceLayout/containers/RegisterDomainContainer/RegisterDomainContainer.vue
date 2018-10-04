<template>
  <div class="register-domain-container">
    <back-button :reset-view="resetView"/>

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
                  @click="expendDomainCheckForm" >
                <span class="slider round"/>
              </label>
            </div>
          </div>
        </div>
        <div
          ref="checkForm"
          class="domain-check-form hidden">
          <div class="domain-checker">
            <input
              type="number"
              name=""
              value=""
              placeholder="Enter Domain Name" >
            <div
              class="check-button"
              @click="domainAvailabilityCheck">
              {{ $t('common.check') }}
            </div>
          </div>
        </div>
        <div
          ref="domainList"
          class="sub-domain-list hidden">
          <h4 class="title">{{ $t('interface.allSubDomains') }}</h4>
          <ul>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border very-small-circle-button-green-filled"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>



      <interface-bottom-text
        :link-text="$t('interface.learnMore')"
        :question="$t('interface.haveIssues')"
        link="/"/>
    </div>

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
@import 'RegisterDomainContainer.scss';
</style>
