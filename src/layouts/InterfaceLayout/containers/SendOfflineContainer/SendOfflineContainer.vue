<template>
  <div class="send-offline-container">
    <interface-container-title :title="$t('common.offline')"/>

    <div class="progress-status prevent-user-select">
      <div 
        :class="[currentPage === 'genInfo' ? 'active' : '' ,'genInfo']" 
        @click="processChange('genInfo')">
        <div class="prevent-pointer-events">
          <p class="title">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateInfo") }}</p>
        </div>
      </div>
      <div 
        :class="[currentPage === 'genTx' ? 'active' : '' ,'genTx']" 
        @click="processChange('genTx')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.offline") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateTx") }}</p>
        </div>
      </div>
      <div 
        :class="[currentPage === 'sendPubTx' ? 'active' : '' ,'sendPubTx']" 
        @click="processChange('sendPubTx')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.sendPubTx") }}</p>
        </div>
      </div>
    </div>

    <generate-info 
      v-if="currentPage === 'genInfo'" 
      :nonce="nonce" 
      :gas-limit="gasLimit" 
      @pathUpdate="processChange" 
      @nonceUpdate="nonceUpdated" 
      @gasLimitUpdate="gasLimitUpdate"/>
    <generate-tx 
      v-if="currentPage === 'genTx'" 
      :nonce="nonce" 
      :gas-limit="gasLimit" 
      @pathUpdate="processChange" 
      @nonceUpdate="nonceUpdated" 
      @gasLimitUpdate="gasLimitUpdate" 
      @createdRawTx="createdRawTx"/>
    <send-tx 
      v-if="currentPage === 'sendPubTx'" 
      :raw-tx="rawTx"/>

  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import GenerateInfo from '../../components/GenerateInfo';
import GenerateTx from '../../components/GenerateTx';
import SendTx from '../../components/SendTx';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'generate-info': GenerateInfo,
    'generate-tx': GenerateTx,
    'send-tx': SendTx
  },
  data() {
    return {
      rawTx: '',
      gasLimit: 21000,
      nonce: 0,
      currentPage: 'genInfo'
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
  mounted() {
    this.currentPage = 'genInfo';
  },
  methods: {
    createdRawTx(e) {
      this.rawTx = e;
    },
    gasLimitUpdate(e) {
      this.gasLimit = e;
    },
    nonceUpdated(e) {
      this.nonce = e;
    },
    processChange(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineContainer.scss';
</style>
