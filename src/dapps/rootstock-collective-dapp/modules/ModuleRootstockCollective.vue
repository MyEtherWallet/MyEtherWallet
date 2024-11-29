<template>
  <div class="pegin-container">
    <h2 class="text-uppercase font-weight-bold mt-2">Balances</h2>
    <list-collective></list-collective>
  </div>
</template>

<script>
export default {
  components: {
    ListCollective: () => import('../components/collection/ListCollective')
  }
};
</script>
