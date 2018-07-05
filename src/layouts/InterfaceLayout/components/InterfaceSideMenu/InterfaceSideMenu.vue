<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <p @click.prevent="toggle('openSend')" :class="selectedTab === 'send' || selectedTab === 'offline' ? 'active' : ''">{{ $t("txSideMenu.title") }} <i :class="['fa', showSend ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i></p>
          <ul v-show="showSend">
            <li @click.prevent="switchTabs('send')" :class="selectedTab === 'send'? 'active': ''">{{ $t("reused.sendTx") }}</li>
            <li @click.prevent="switchTabs('offline')" :class="selectedTab === 'offline'? 'active': ''">{{ $t("reused.offline") }}</li>
          </ul>
        </li>
        <li @click.prevent="switchTabs('swap')" ><p :class="selectedTab === 'swap'? 'active': ''">{{ $t("reused.swap") }}</p></li>
        <li @click.prevent="switchTabs('dapps')" ><p :class="selectedTab === 'dapps'? 'active': ''">{{ $t("reused.dapps") }}</p></li>
        <li>
          <p @click.prevent="toggle('openContract')" :class="selectedTab === 'interactC' || selectedTab === 'deployC' ? 'active' : ''">{{ $t("txSideMenu.contract") }} <i :class="['fa', showContract ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i></p>
          <ul v-show="showContract">
            <li @click.prevent="switchTabs('interactC')" :class="selectedTab === 'interactC'? 'active': ''">{{ $t("reused.interactWcontract") }}</li>
            <li @click.prevent="switchTabs('deployC')" :class="selectedTab === 'deployC'? 'active': ''">{{ $t("reused.depContract") }}</li>
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
