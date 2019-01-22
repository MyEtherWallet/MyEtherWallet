<template>
  <div class="send-offline-container">
    <interface-container-title :title="$t('common.offline')" />
    <div class="scroll-container">
      <div class="progress-status prevent-user-select">
        <div
          v-for="(tab, idx) in tabs"
          :key="tab.title + idx"
          :class="[
            isTabActive(tab.name) || isTabActive(tab.name2) ? 'active' : '',
            'genInfo'
          ]"
          @click="processChange(tab.name2 ? tab.name2 : tab.name)"
        >
          <div class="prevent-pointer-events">
            <p class="title">{{ tab.title }}</p>
            <p class="description prevent-pointer-events">{{ tab.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- .form-content-container -->
    <div class="form-content-container">
      <router-view
        :raw-tx="rawTx"
        :nonce="nonce"
        :gas-limit="gasLimit"
        :tokens="tokens"
        :highest-gas="highestGas"
        @nonceUpdate="nonceUpdated"
        @gasLimitUpdate="gasLimitUpdate"
        @createdRawTx="createdRawTx"
        @pathUpdate="processChange"
      />
    </div>
  </div>
  <!-- .form-content-container -->
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle
  },
  props: {
    tokens: {
      type: Array,
      default: function() {
        return [];
      }
    },
    highestGas: {
      type: Number,
      default: 0
    }
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

<style lang="scss" scoped file="SendOfflineContainer.scss">
@import 'SendOfflineContainer.scss';
</style>
