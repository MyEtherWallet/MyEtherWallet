<template>
  <div>
      </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    open: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      ledger: false,
      bitbox: false,
      finney: false,
      secalot: false,
      keepKey: false,
      trezor: false,
      coolWallet: false,
      bcVault: false,
      xWallet: false
    };
  },
  watch: {
    open(newVal) {
      if (newVal === '') {
        return;
      }

      switch (newVal.toLowerCase()) {
        case 'ledger':
          this.ledger = true;
          break;
        case 'bitbox':
          this.bitbox = true;
          break;
        case 'finney':
          this.finney = true;
          break;
        case 'secalot':
          this.secalot = true;
          break;
        case 'keepkey':
          this.keepKey = true;
          break;
        case 'trezor':
          this.trezor = true;
          break;
        case 'coolwallet':
          this.coolWallet = true;
          break;
        case 'bcvault':
          this.bcVault = true;
          break;
        case 'xwallet':
          this.xWallet = true;
          break;
        default:
      }

      this.$emit('reset');
    }
  }
};
</script>
