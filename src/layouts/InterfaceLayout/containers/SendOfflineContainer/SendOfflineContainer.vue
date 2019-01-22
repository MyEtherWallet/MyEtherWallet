<template>
  <div class="send-offline-container">
    <interface-container-title :title="$t('common.offline')" />
    <generate-tx />
  </div>
  <!-- .form-content-container -->
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import GenerateTx from './components/GenerateTx';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'generate-tx': GenerateTx
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
