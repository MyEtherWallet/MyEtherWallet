<template>
  <div class="send-offline-container">
    <div class="content-title">
      <h2>{{ $t("reused.offline") }}</h2>
    </div>

    <div class="online-status">
      <div class="">
        <p class="title">{{ $t("interface.online") }}</p>
        <p class="description">{{ $t("interface.generateInfo") }}</p>
      </div>
      <div class="">
        <p class="title">{{ $t("interface.offline") }}</p>
        <p class="description">{{ $t("interface.generateTx") }}</p>
      </div>
      <div class="">
        <p class="title">{{ $t("interface.online") }}</p>
        <p class="description">{{ $t("interface.sendPubTx") }}</p>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('reused.speedTx' )}}</h4>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" value="" placeholder="Please Enter the Address">
      </div>
    </div>
    <div class="submit-button-container">
      <div class="submit-button large-round-button-green-filled clickable">
        {{ $t('interface.generate') }}
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
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
    copyAddress: function () {
      alert('This doesn\'t work for now.')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendOfflineContainer.scss";
</style>
