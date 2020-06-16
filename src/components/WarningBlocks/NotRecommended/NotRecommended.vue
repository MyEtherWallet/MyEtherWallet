<template>
  <v-sheet color="yellow lighten-5" class="py-7 px-11 border-radius--10px">
    <div class="d-flex align-center mb-1">
      <mew6-icon-warning class="mr-2" />
      <div class="text-uppercase font-weight-bold subtitle-1">
        Not recommended
      </div>
    </div>
    <div class="pl-8">
      This information is sensitive, and these options should only be used in
      offline settings by experienced crypto users. And MEW "CAN NOT" change
      your password. Please "DO NOT FORGET" to save your password, and it is
      your private key. You will need this "Password + Keystore file" to access
      your wallet.
    </div>
  </v-sheet>
</template>

<script>
export default {
  data: () => ({})
};
</script>
