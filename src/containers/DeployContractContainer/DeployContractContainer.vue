<template>
  <div class="deploy-contract-container">
    <success-modal message="" linkMessage="Ok"></success-modal>
    <div class="content-title">
      <h2>{{ $t('reused.depContract') }}</h2>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.readWriteC') }}</h4>
        </div>
      </div>
      <div class="the-form contract-address">
        <div class="address">
          <p>{{ $t('interface.contractAddr') }}: 0x34738943904fnrtrth3948fh394hf9348fh934htf934htf39thrth834w</p>
        </div>
        <div class="select-contract">
          <div class="dropdown-select-search-2">
            <v-select :options="functions" placeholder="Function"></v-select>
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>String</h4>
        </div>
      </div>
      <div class="the-form unit">
        <input type="number" name="" value="" placeholder="">
        <div class="input-overlay">
          256(UNIT) <i aria-hidden="true" class="fa fa-check-circle good-button not-good"></i>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div class="submit-button large-round-button-green-border clickable">
          {{ $t('reused.back') }}
        </div>
        <div v-on:click="successModalOpen" class="submit-button large-round-button-green-filled clickable">
          {{ $t('interface.read') }}
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import SuccessModal from '@/components/SuccessModal'
import InterfaceBottomText from '@/components/InterfaceBottomText'

export default {
  name: 'Interact',
  components: {
    'success-modal': SuccessModal,
    'interface-bottom-text': InterfaceBottomText
  },
  data () {
    return {
      showModal: true,
      functions: [
        {
          label: 'function1',
          value: '1'
        },
        {
          label: 'function1',
          value: '2'
        },
        {
          label: 'function1',
          value: '3'
        }
      ]
    }
  },
  methods: {
    expendDomainCheckForm () {
      document.querySelector('.domain-check-form').classList.toggle('hidden')
      document.querySelector('.sub-domain-list').classList.add('hidden')
    },
    domainAvailabilityCheck () {
      // document.querySelector('.domain-check-form').classList.toggle('hidden')
      document.querySelector('.sub-domain-list').classList.remove('hidden')
    },
    domainBuyButtonClick ($event) {
      // $event.toElement.classList.toggle('very-small-circle-button-green-filled')
    },
    successModalOpen () {
      this.$children[0].$refs.success.show()
    }
  },
  mounted () {
  },
  watch: {
    showModal () {
      if (this.showModal === false) {
        this.showModal = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DeployContractContainer.scss";
</style>
