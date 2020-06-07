<template>
  <SuperButton>
    <div class="border--white border-radius--10px py-8 px-10">
      <div class="d-flex align-center">
        <div class="white--text headline font-weight-bold mb-2 mr-2">
          Software
        </div>
        <p class="mb-1 orange--text font-italic">
          (Keystore files / Mnemonic phrase)
        </p>
      </div>
      <p class="white--text mb-4">
        Ipsum consetetur sit dolores ipsum consetetur diam et. Elitr magna ipsum
        aliquyam magna at. Consetetur sit dolor eos eirmod amet.
      </p>
      <div class="d-flex align-center">
        <v-icon color="orange" class="mr-1">mdi-alert</v-icon>
        <p class="ma-0 orange--text font-weight-bold">Not recommanded</p>
      </div>
    </div>
  </SuperButton>
</template>

<script>
import SuperButton from '@/web/components/Buttons/SuperButton';
export default {
  components: { SuperButton },
  data: () => ({})
};
</script>
