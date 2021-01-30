<template>
  <div class="searchText--text">v{{ version }}</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      version: process.env.VERSION
    };
  }
};
</script>
