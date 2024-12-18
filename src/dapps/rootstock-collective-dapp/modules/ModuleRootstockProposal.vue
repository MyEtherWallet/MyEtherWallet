<template>
  <div class="pegin-container">
    <h2 class="text-center text-uppercase font-weight-bold mt-2">
      Latest Proposals
    </h2>
    <list-proposal> </list-proposal>
  </div>
</template>

<script>
export default {
  components: {
    ListProposal: () => import('../components/proposal/ListProposal')
  }
};
</script>
