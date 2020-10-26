<template>
  <div>
    <div class="d-block d-lg-none">
      <tips mobile class="mb-4" />
      <mainContent />
    </div>
    <div class="d-none d-lg-flex">
      <div class="flex-grow-1">
        <mainContent />
      </div>
      <div class="pa-4"></div>
      <div>
        <tips />
      </div>
    </div>
  </div>
</template>

<script>
import tips from '@/modules/wallets/components/tips/Tips';
import mainContent from './components/main-content/MainContent';

export default {
  components: {
    tips,
    mainContent
  },
  data() {
    return {};
  }
};
</script>
