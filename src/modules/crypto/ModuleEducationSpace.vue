<template>
  <section
    class="rounded-2xl text-center shadow-sm bg-gradient-to-t from-blue-3 to-blue-2 flex items-center h-[200px] cursor-pointer relative"
    @click="navigateToMewtopia"
  >
    <img src="@/assets/icons/mewtopia-dog.svg" class="w-[115px] absolute" />
    <div class="text-left pl-[35%] w-full">
      <h3 class="text-white text-s-24">MEWtopia</h3>
      <p class="text-white text-s-12">A Blog by MyEtherWallet</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const navigateToMewtopia = () => {
  window.open('https://mewtopia.com', '_blank')
}
</script>
