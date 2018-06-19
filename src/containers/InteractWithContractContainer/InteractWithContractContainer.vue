<template>
  <div class="main-content">
    <div class="content-title">
      <h2>{{ $t('reused.interactWcontract') }}</h2>
    </div>

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
      <router-link :to="{ name: 'InteractWithContract', params: {} }">
        <div class="submit-button large-round-button-green-filled clickable">
          {{ $t('reused.continue') }}
        </div>
      </router-link>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
export default {
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
  },
  methods: {
    expendDomainCheckForm: function () {
      document.querySelector('.domain-check-form').classList.toggle('hidden')
      document.querySelector('.sub-domain-list').classList.add('hidden')
    },
    domainAvailabilityCheck: function () {
      // document.querySelector('.domain-check-form').classList.toggle('hidden')
      document.querySelector('.sub-domain-list').classList.remove('hidden')
    },
    domainBuyButtonClick: function ($event) {
      // $event.toElement.classList.toggle('very-small-circle-button-green-filled')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "InteractWithContractContainer.scss";
</style>
