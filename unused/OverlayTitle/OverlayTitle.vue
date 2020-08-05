<template>
  <h2 class="text-center pb-8">{{ title }}</h2>
</template>

<script>
export default {
  props: {
    title: { default: '', type: String }
  }
};
</script>
