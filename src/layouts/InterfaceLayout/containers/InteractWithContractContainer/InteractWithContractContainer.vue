<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('reused.interactWcontract')"></interface-container-title>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.contractAddr') }}</h4>
          <div class="select-contract no-border">
            <currency-picker :currency="existingContracts" page="interactWContract" :token="false"></currency-picker>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <input type="number" name="" value="" placeholder="Enter Domain Name or Address">
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.abiJsonInt') }}</h4>
          <div class="copy-buttons">
            <span>{{ $t('reused.clear') }}</span>
            <span>{{ $t('reused.copy') }}</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea class="custom-textarea-1" name=""></textarea>
      </div>
    </div>

    <div class="submit-button-container">
      <!-- <router-link :to="{ name: 'InteractWithContract', params: {} }"> -->
        <div class="submit-button large-round-button-green-filled clickable">
          {{ $t('reused.continue') }}
        </div>
      <!-- </router-link> -->
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
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
      existingContracts: [
        {
          name: 'Battle Of Thermopy wefweoifjwfo ewrofijweo',
          value: '1'
        },
        {
          name: 'Battle Of Thermopy wefweoifjwfo ewrofijweo g',
          value: '2'
        },
        {
          name: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '3'
        },
        {
          name: 'Battle Of Thermopy wefweoifjwfo ewrofijw',
          value: '4'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InteractWithContractContainer.scss";
</style>
