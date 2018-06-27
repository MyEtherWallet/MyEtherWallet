<template>
  <div class="swap">

    <!-- Modal =================================== -->
    <b-modal ref="success" centered hide-footer hide-header class="bootstrap-modal">
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true"></i>
        <h2 class="title">Succeed</h2>
      </div>
      <div class="button-container">
        <router-link to="/interact-with-contract">
          <b-btn class="mid-round-button-green-filled close-button" @click="showModal = false">
            Ok
          </b-btn>
        </router-link>
      </div>
    </b-modal>
    <!-- Modal =================================== -->

    <vue-header></vue-header>
    <div class="wrap">
      <div class="side-nav">
        <transactions-side-menu></transactions-side-menu>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div class="">
            <transaction-address />
          </div>
          <div class="">
            <transaction-balance />
          </div>
          <div class="">
            <transaction-network />
          </div>
          <div class="main-content">
            <div class="content-title">
              <h2>Interact With Contract</h2>
            </div>

            <div class="send-form">
              <div class="title-container">
                <div class="title">
                  <h4>Read / Write Contract</h4>
                </div>
              </div>
              <div class="the-form contract-address">
                <div class="address">
                  <p>Contract Address: 0x34738943904fnrtrth3948fh394hf9348fh934htf934htf39thrth834w</p>
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
                <router-link to="/interact-with-contract">
                  <div class="submit-button large-round-button-green-border clickable">
                    Back
                  </div>
                </router-link>
                <div v-on:click="successModalOpen" class="submit-button large-round-button-green-filled clickable">
                  Read
                </div>
              </div>
              <div class="bottom-text">
                <p>Have any issues? <a href="/">Learn more</a></p>
              </div>
            </div>

          </div>
          <div class="tokens">
            <transaction-tokens />
          </div>
        </div>
      </div>
    </div>
    <vue-footer></vue-footer>
  </div>
</template>

<script>
export default {
  name: 'Interact',
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
    },
    successModalOpen () {
      this.$refs.success.show()
    }
  },
  mounted () {
  },
  watch: {
    showModal: function () {
      if (this.showModal === false) {
        this.showModal = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InteractWithContract2.scss";
</style>
