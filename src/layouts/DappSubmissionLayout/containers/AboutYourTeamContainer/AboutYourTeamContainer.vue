<template>
  <div>
    <b-form>
      <b-form-group>
        <label class="dapp-label">Contract address</label>
        <img
          class="explanation-icon"
          src="~@/assets/images/icons/explanation.png"
        />
        <div class="dapp-input">
          <b-form-input id="contractAddress" type="text" required>
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '../AboutYourDappTeamContainer.scss';
</style>
