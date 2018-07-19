<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('reused.interactWcontract')"></interface-container-title>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.contractAddr') }}</h4>
          <div class="select-contract no-border">
            <v-select :options="existingContracts" placeholder="Choose existing contract"></v-select>
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
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import InterfaceBottomText from '@/components/InterfaceBottomText'

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText
  },
  data () {
    return {
      existingContracts: [
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '1'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '2'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '3'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
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
