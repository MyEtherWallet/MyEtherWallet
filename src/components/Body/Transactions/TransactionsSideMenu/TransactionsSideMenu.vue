<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>

        <li>
          <router-link to="/send-eth-and-tokens">
            <div class="menu-group-title" v-if="!menuStates.send">
              <img src="~@/assets/images/sidemenu/send-2.svg">
              <p class="active">Send</p>
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <div class="menu-group-title active" v-if="menuStates.send">
              <img src="~@/assets/images/sidemenu/send-1.svg">
              <p class="active">Send</p>
              <i class="fa fa-angle-up" aria-hidden="true"></i>
            </div>
          </router-link>
          <ul v-if="menuStates.send">
            <li>
              <div v-if="!menuStates.sendEth">
                <router-link to="/send-eth-and-tokens">
                  Send ETH & Tokens
                </router-link>
              </div>
              <div class="active" v-if="menuStates.sendEth">
                <router-link to="/send-eth-and-tokens">
                  Send ETH & Tokens
                </router-link>
              </div>
            </li>
            <li v-if="!menuStates.sendOffline">
              <router-link to="/send-offline">
                Send Offline
              </router-link>
            </li>
            <li class="active" v-if="menuStates.sendOffline">
              <router-link to="/send-offline">
                Send Offline
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          <router-link to="/swap">
            <div class="menu-group-title" v-if="!menuStates.swap">
              <img src="~@/assets/images/sidemenu/swap-2.svg">
              <p>Swap</p>
            </div>
            <div class="menu-group-title active" v-if="menuStates.swap">
              <img src="~@/assets/images/sidemenu/swap-1.svg">
              <p>Swap</p>
            </div>
          </router-link>
        </li>

        <li>
          <router-link to="/dapps">
            <div class="menu-group-title" v-if="!menuStates.dapps">
              <img src="~@/assets/images/sidemenu/dapps-2.svg">
              <p>Dapps</p>
            </div>
            <div class="menu-group-title active" v-if="menuStates.dapps">
              <img src="~@/assets/images/sidemenu/dapps-1.svg">
              <p>Dapps</p>
            </div>
          </router-link>
        </li>

        <li>
          <router-link to="/interact-with-contract">
            <div class="menu-group-title" v-if="!menuStates.contract">
              <img src="~@/assets/images/sidemenu/contract-2.svg">
              <p>Contract</p>
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <div class="menu-group-title active" v-if="menuStates.contract">
              <img src="~@/assets/images/sidemenu/contract-1.svg">
              <p>Contract</p>
              <i class="fa fa-angle-up" aria-hidden="true"></i>
            </div>
          </router-link>
          <ul v-if="menuStates.contract">
            <li>
              <div v-if="!menuStates.interactContract">
                <router-link to="/interact-with-contract">
                  Interact With Contract
                </router-link>
              </div>
              <div class="active" v-if="menuStates.interactContract">
                <router-link to="/interact-with-contract">
                  Interact With Contract
                </router-link>
              </div>
            </li>
            <li>
              <div v-if="!menuStates.deployContract">
                <router-link to="/deploy-contract">
                  Deploy Contract
                </router-link>
              </div>
              <div class="active" v-if="menuStates.deployContract">
                <router-link to="/deploy-contract">
                  Deploy Contract
                </router-link>
              </div>
            </li>
          </ul>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    menuStates: function () {
      return this.$store.state.state.pageStates.txSideMenu
    }
  },
  mounted () {
    // Set page location variable
    this.$store.state.state.pageStates.pageLocation = 'tx'
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionsSideMenu.scss";
</style>
