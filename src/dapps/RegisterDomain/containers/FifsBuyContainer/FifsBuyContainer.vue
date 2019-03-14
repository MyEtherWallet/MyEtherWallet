<template lang="html">
  <div>
    <div class="name-available-container">
      <div class="content-header">
        <div>
          <h3>{{ fullDomain }}</h3>
          <p>{{ $t('dapps.domainIsAvailable') }}</p>
        </div>
      </div>
      <div class="buttons-container" @click="registerFifsName()">
        <div class="submit-button large-round-button-green-filled">
          Register
        </div>
      </div>
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
    tld: {
      type: String,
      default: ''
    },
    registerFifsName: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    fullDomain() {
      return `${this.domainName}.${this.tld}`;
    }
  },
  mounted() {
    if (this.domainName === '')
      this.$router.replace('/interface/dapps/register-domain');
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'FifsBuyContainer.scss';
</style>
