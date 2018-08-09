<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('common.interactWcontract')"></interface-container-title>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.contractAddr') }}</h4>
          <div class="select-contract no-border">
            <currency-picker :currency="network.type.contracts" v-on:selectedCurrency="selectedCurrency" page="interactWContract" :token="false"></currency-picker>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <input type="text" name="" v-model="address" placeholder="Enter Domain Name or Address" />
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.abiJsonInt') }}</h4>
          <div class="copy-buttons">
            <span v-on:click="clearInputValues('abi-json-interface')">{{ $t('common.clear') }}</span>
            <span v-on:click="copyToClipboard('abi-json-interface')">{{ $t('common.copy') }}</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea class="custom-textarea-1" name="" v-model="abi"></textarea>
      </div>
    </div>

    <div class="submit-button-container">
      <!-- <router-link :to="{ name: 'InteractWithContract', params: {} }"> -->
        <div class="submit-button large-round-button-green-filled clickable">
          {{ $t('common.continue') }}
          <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
        </div>
      <!-- </router-link> -->
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import CurrencyPicker from '../../components/CurrencyPicker'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import InterfaceBottomText from '@/components/InterfaceBottomText'

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'currency-picker': CurrencyPicker
  },
  data () {
    return {
      abi: '',
      address: ''
    }
  },
  methods: {
    selectedCurrency (currency) {
      console.log(currency.address)
      this.abi = JSON.stringify(currency.abi)
      this.address = currency.address
    }
  },
  computed: {
    ...mapGetters({
      network: 'network'
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "InteractWithContractContainer.scss";
</style>
