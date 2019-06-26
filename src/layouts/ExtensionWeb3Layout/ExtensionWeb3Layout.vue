<template>
  <div>
    <router-view />
  </div>
</template>
<script>
window.addEventListener('beforeunload', function() {
  const event = new CustomEvent(`web3${window.chrome.runtime.id}reject`);
  window.dispatchEvent(event);
});
export default {};
</script>
