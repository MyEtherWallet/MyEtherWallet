<template>
  <div>
    <privacy-warning />
  </div>
</template>

<script>
import privacyWarning from './components/PrivacyWarning/PrivacyWarning';

export default {
  name: 'GlobalElementsContainer',
  components: {
    privacyWarning
  }
};
</script>

<style lang="scss" scoped></style>
