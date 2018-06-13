<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <p @click.prevent="toggle('openSend')" :class="selectedTab === 'send' || selectedTab === 'offline' ? 'active' : ''">{{ $t("txSideMenu.title") }} <i :class="['fa', showSend ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i></p>
          <ul v-show="showSend">
            <li @click.prevent="switchTabs('send')" :class="selectedTab === 'send'? 'active': ''">{{ $t("reused.sendTx") }}</li>
            <li @click.prevent="switchTabs('offline')" :class="selectedTab === 'offline'? 'active': ''">{{ $t("txSideMenu.offline") }}</li>
          </ul>
        </li>
        <li @click.prevent="switchTabs('swap')" ><p :class="selectedTab === 'swap'? 'active': ''">{{ $t("reused.swap") }}</p></li>
        <li @click.prevent="switchTabs('dapps')" ><p :class="selectedTab === 'dapps'? 'active': ''">{{ $t("txSideMenu.dapps") }}</p></li>
        <li>
          <p @click.prevent="toggle('openContract')" :class="selectedTab === 'interactC' || selectedTab === 'deployC' ? 'active' : ''">{{ $t("txSideMenu.contract") }} <i :class="['fa', showContract ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i></p>
          <ul v-show="showContract">
            <li @click.prevent="switchTabs('interactC')" :class="selectedTab === 'interactC'? 'active': ''">{{ $t("txSideMenu.interactWcontract") }}</li>
            <li @click.prevent="switchTabs('deployC')" :class="selectedTab === 'deployC'? 'active': ''">{{ $t("txSideMenu.depContract") }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
    toggle: function (param) {
      const self = this
      switch (param) {
        case 'openSend':
          self.showSend = !self.showSend
          self.showContract = false
          break
        case 'openContract':
          self.showSend = false
          self.showContract = !self.showContract
          break
        default:
          self.showSend = false
          self.showContract = false
      }
    },
    storePage: function (param) {
      window.localStorage.setItem('curPage', param)
    }
  },
  watch: {
    currentTab: function (newVal) {
      const self = this
      self.selectedTab = newVal

      switch (newVal) {
        case 'send':
          self.showSend = true
          self.showContract = false
          break
        case 'offline':
          self.showSend = true
          self.showContract = false
          break
        case 'interactC':
          self.showSend = false
          self.showContract = true
          break
        case 'deployC':
          self.showSend = false
          self.showContract = true
          break
        default:
          self.showSend = false
          self.showContract = false
      }

      window.localStorage.setItem('curPage', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceSideMenu.scss";
</style>
