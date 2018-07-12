<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <div @click.prevent="toggle('openSend')" :class="[selectedTab === 'send' || selectedTab === 'offline' ? 'active' : '', 'menu-group-title']">
            <img src="@/assets/images/sidemenu/send.svg" v-show="selectedTab !== 'send' && selectedTab !== 'offline'"/>
            <img src="@/assets/images/sidemenu/send-active.svg" v-show="selectedTab === 'send' || selectedTab === 'offline'"/>
            <p>{{ $t("txSideMenu.title") }}</p>
            <i :class="['fa', showSend ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i>
          </div>
          <ul v-show="showSend">
            <li @click.prevent="switchTabs('send')" :class="selectedTab === 'send'? 'active': ''">
              {{ $t("reused.sendTx") }}
            </li>
            <li @click.prevent="switchTabs('offline')" :class="selectedTab === 'offline'? 'active': ''">
              {{ $t("reused.offline") }}
            </li>
          </ul>
        </li>
        <li @click.prevent="switchTabs('swap')" >
          <div :class="[selectedTab === 'swap'? 'active': '', 'menu-group-title']">
            <img src="@/assets/images/sidemenu/swap.svg" v-show="selectedTab !== 'swap'"/>
            <img src="@/assets/images/sidemenu/swap-active.svg" v-show="selectedTab === 'swap'"/>
            <p>
              {{ $t("reused.swap") }}
            </p>
          </div>
        </li>
        <li @click.prevent="switchTabs('dapps')" >
          <div :class="[selectedTab === 'dapps'? 'active': '', 'menu-group-title']">
            <img src="@/assets/images/sidemenu/dapps.svg" v-show="selectedTab !== 'dapps'"/>
            <img src="@/assets/images/sidemenu/dapps-active.svg" v-show="selectedTab === 'dapps'"/>
            <p>
              {{ $t("reused.dapps") }}
            </p>
          </div>
        </li>
        <li>
          <div @click.prevent="toggle('openContract')" :class="[selectedTab === 'interactC' || selectedTab === 'deployC' ? 'active' : '', 'menu-group-title']">
            <img src="@/assets/images/sidemenu/contract.svg" v-show="selectedTab !== 'interactC' && selectedTab !== 'deployC'"/>
            <img src="@/assets/images/sidemenu/contract-active.svg" v-show="selectedTab === 'interactC' || selectedTab === 'deployC'"/>
            <p>{{ $t("txSideMenu.contract") }}</p>
            <i :class="['fa', showContract ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i>
          </div>
          <ul v-show="showContract">
            <li @click.prevent="switchTabs('interactC')" :class="selectedTab === 'interactC'? 'active': ''">
              {{ $t("reused.interactWcontract") }}
            </li>
            <li @click.prevent="switchTabs('deployC')" :class="selectedTab === 'deployC'? 'active': ''">
              {{ $t("reused.depContract") }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from 'store'
export default {
  props: ['currentTab', 'switchTabs'],
  data () {
    return {
      selectedTab: this.currentTab,
      showSend: false,
      showContract: false
    }
  },
  methods: {
    toggle (param) {
      this.storePage(param)
      switch (param) {
        case 'openSend':
          this.showSend = !this.showSend
          this.showContract = false
          break
        case 'openContract':
          this.showSend = false
          this.showContract = !this.showContract
          break
        default:
          this.showSend = false
          this.showContract = false
      }
    },
    storePage (param) {
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param])
      store.set('curPage', param)
    }
  },
  watch: {
    currentTab (newVal) {
      this.selectedTab = newVal

      switch (newVal) {
        case 'send':
          this.showSend = true
          this.showContract = false
          break
        case 'offline':
          this.showSend = true
          this.showContract = false
          break
        case 'interactC':
          this.showSend = false
          this.showContract = true
          break
        case 'deployC':
          this.showSend = false
          this.showContract = true
          break
        default:
          this.showSend = false
          this.showContract = false
      }

      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
      store.set('curPage', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceSideMenu.scss";
</style>
