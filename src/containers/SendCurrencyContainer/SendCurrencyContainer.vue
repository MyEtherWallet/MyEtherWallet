<template>
  <div class="main-content">
    <div class="content-title">
      <h2>{{ $t('reused.sendTx') }}</h2>
    </div>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>{{ $t("reused.sendTx") }}</h4>
          </div>
          <div class="dropdown-select-search-1">
            <v-select :options="['foo','bar']"></v-select>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
          <div class="the-form amount-number">
            <input type="number" name="" value="" placeholder="Amount">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>{{ $t("sendTx.toAddr") }}</h4>
            <img class="icon" src="~@/assets/images/icons/avatar.svg">
            <!-- <p v-on:click="copyAddress" class="copy-button">Copy</p> -->
            <p class="copy-button">{{ $t('reused.copy') }}</p>
          </div>
          <div class="the-form address-block">
            <textarea id="address" name="name" v-model="address"></textarea>
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div> <!-- .to-address -->
      </div> <!-- .form-block .amount-to-address -->
      <div class="error-message-container">
        <p>{{ $t('reused.dontHaveEnough') }}</p>
      </div>
    </div> <!-- .send-form -->

    <div class="send-form">
      <div class="title">
        <h4>{{ $t("reused.speedTx") }}</h4>
        <p>{{ $t("reused.txFee") }}: 0.000013 ETH ($1.234)</p>
        <div class="buttons">
          <div class="small-circle-button-green-border">
            {{ $t('reused.slow') }}
          </div>
          <div class="small-circle-button-green-border active">
            {{ $t('reused.regular') }}
          </div>
          <div class="small-circle-button-green-border">
            {{ $t('reused.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" value="" placeholder="Gas Amount">
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <div class="send-form advanced">
      <div class="advanced-content">
        <h4>{{ $t('reused.advanced') }}</h4>
        <div class="toggle-button">
          <span>{{ $t('interface.dataGas') }}</span>
          <!-- Rounded switch -->
          <div class="sliding-switch-white">
            <label class="switch">
              <input type="checkbox">
              <span class="slider round"></span>
            </label>
          </div>

        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="submit-button large-round-button-green-filled clickable">
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
export default {
  props: ['address']
}
</script>

<style lang="scss" scoped>
  @import "SendCurrencyContainer.scss";
</style>
