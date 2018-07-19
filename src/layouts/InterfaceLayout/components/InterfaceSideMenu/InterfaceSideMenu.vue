<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <div @click.prevent="toggle('openSend')" :class="[selectedTab === 'send' || selectedTab === 'offline' ? 'active' : '', 'menu-group-title']">
            <img :src="selectedTab === 'send' || selectedTab === 'offline'? require(`@/assets/images/sidemenu/send-active.svg`): require(`@/assets/images/sidemenu/send.svg`)"/>
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
            <img :src="selectedTab === 'swap'? require(`@/assets/images/sidemenu/swap-active.svg`): require(`@/assets/images/sidemenu/swap.svg`)"/>
            <p>
              {{ $t("reused.swap") }}
            </p>
          </div>
        </li>
        <li @click.prevent="switchTabs('dapps')" >
          <div :class="[selectedTab === 'dapps'? 'active': '', 'menu-group-title']">
            <img :src="selectedTab === 'dapps'? require(`@/assets/images/sidemenu/dapps-active.svg`): require(`@/assets/images/sidemenu/dapps.svg`)"/>
            <p>
              {{ $t("reused.dapps") }}
            </p>
          </div>
        </li>
        <li>
          <div @click.prevent="toggle('openContract')" :class="[selectedTab === 'interactC' || selectedTab === 'deployC' ? 'active' : '', 'menu-group-title']">
            <img :src="selectedTab === 'interactC' || selectedTab === 'deployC'? require(`@/assets/images/sidemenu/contract-active.svg`): require(`@/assets/images/sidemenu/contract.svg`)"/>
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
          this.storePage(param)
      }
    },
    storePage (param) {
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param])
      store.set('sideMenu', param)
    }
  },
  watch: {
    currentTab (newVal) {
      this.selectedTab = newVal

      switch (newVal) {
        case 'send':
          this.showSend = true
          this.showContract = false
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        case 'offline':
          this.showSend = true
          this.showContract = false
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        case 'interactC':
          this.showSend = false
          this.showContract = true
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        case 'deployC':
          this.showSend = false
          this.showContract = true
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        default:
          this.showSend = false
          this.showContract = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceSideMenu.scss";
</style>
