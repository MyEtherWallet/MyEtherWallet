<template>
  <div class="send-offline-container">
    <interface-container-title :title="$t('common.offline')" />

    <div class="progress-status prevent-user-select">
      <div
        v-for="(tab, idx) in tabs"
        :key="tab.title + idx"
        :class="[isTabActive(tab.name) || isTabActive(tab.name2) ? 'active' : '' ,'genInfo']"
        @click="processChange(tab.name2 ? tab.name2: tab.name)"
      >
        <div class="prevent-pointer-events">
          <p class="title">{{ tab.title }}</p>
          <p class="description prevent-pointer-events">{{ tab.desc }}</p>
        </div>
      </div>
    </div>
    <router-view
      :raw-tx="rawTx"
      :nonce="nonce"
      :gas-limit="gasLimit"
      @nonceUpdate="nonceUpdated"
      @gasLimitUpdate="gasLimitUpdate"
      @createdRawTx="createdRawTx"
      @pathUpdate="processChange"
    />

  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle
  },
  data() {
    return {
      rawTx: '',
      gasLimit: 21000,
      nonce: 0,
      tabs: [
        {
          title: this.$t('interface.online'),
          desc: this.$t('interface.generateInfo'),
          path: 'generate-info',
          name: 'Send Offline',
          name2: 'Offline Generate Information'
        },
        {
          title: this.$t('interface.offline'),
          desc: this.$t('interface.generateTx'),
          path: 'generate-tx',
          name: 'Offline Generate Transaction'
        },
        {
          title: this.$t('interface.online'),
          desc: this.$t('interface.sendPubTx'),
          path: 'send-tx',
          name: 'Offline Send Transaction'
        }
      ]
    };
  },
  watch: {
    gasLimit(newVal) {
      this.gasLimit = newVal;
    },
    nonce(newVal) {
      this.nonce = newVal;
    }
  },
  methods: {
    createdRawTx(e) {
      this.rawTx = e;
    },
    isTabActive(name) {
      return name === this.$route.name;
    },
    gasLimitUpdate(e) {
      this.gasLimit = e;
    },
    nonceUpdated(e) {
      this.nonce = e;
    },
    processChange(name) {
      this.$router.push({ name: name });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineContainer.scss';
</style>
