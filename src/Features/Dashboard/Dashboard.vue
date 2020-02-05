<template>
  <div>
    <EthBalance />
    <Spacer />
    <TokensValue />
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import EthBalance from './EthBalance';
import TokensValue from './TokensValue';

export default {
  components: { Spacer, EthBalance, TokensValue }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
