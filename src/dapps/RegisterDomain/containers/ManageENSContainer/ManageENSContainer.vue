<template>
  <div class="manage-ens-container">
    <h3>Manage {{ domainName }}.eth</h3>
    <div class="form-container">
      <form class="manage-form">
        <label for="updateResolver">
          Update Resolver Address:
        </label>
        <input 
          v-model="resolverAddress" 
          type="text" 
          name="updateResolver" 
          placeholder="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D">
        <div class="submit-container">
          <button 
            :class="!$store.state.web3.utils.isAddress(resolverAddress) ? 'disabled' : ''" 
            type="submit" 
            @click.prevent="updateResolver(resolverAddress)">Update</button>
        </div>
      </form>
    </div>
    <div class="form-container">
      <form class="manage-form">
        <label for="transferEns">
          Transfer ENS to:
        </label>
        <input 
          v-model="transferTo" 
          type="text" 
          name="transferEns" 
          placeholder="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D">
        <div class="submit-container">
          <button 
            :class="!$store.state.web3.utils.isAddress(transferTo) ? 'disabled': ''" 
            type="submit" 
            @click.prevent="">Transfer</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    domainName: {
      type: String,
      default: ''
    },
    updateResolver: {
      type: Function,
      default: function() {}
    },
    transferEns: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      resolverAddress: '',
      transferTo: ''
    };
  }
};
</script>
<style lang="scss" scoped>
@import 'ManageENSContainer.scss';
</style>
