<template>
  <div class="mew-component--claimable-tokens-popup">
    <simple-dialog v-model="isDialogOpen" no-title>
      <v-row>
        <v-col cols="12" sm="4" class="d-flex justify-center">
          <img
            src="@/assets/images/snippets/claimable-tokens.svg"
            alt="Claimable tokens"
            style="max-width: 200px"
          />
        </v-col>
        <v-col cols="12" sm="8" class="text-center text-sm-left">
          <div class="mew-heading-2 mb-1">Good news!</div>
          <div class="mew-heading-2 mb-3">You have claimable tokens.</div>
          <div class="mb-8">
            There are tokens you can claim. You can see all the claimable tokens
            in your wallet by clicking button below.
          </div>
          <div class="ma-n1">
            <mew-button title="Show claimable tokens" class="ma-1"></mew-button>
            <mew-button
              btn-style="outline"
              title="Close"
              class="ma-1"
              @click.native="isDialogOpen = false"
            ></mew-button>
          </div>
        </v-col>
      </v-row>
    </simple-dialog>
  </div>
</template>

<script>
import SimpleDialog from '@/core/components/AppSimpleDialog';

export default {
  name: 'ClaimableTokens',
  components: { SimpleDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { isDialogOpen: false };
  },
  watch: {
    show(newVal) {
      this.isDialogOpen = newVal;
    }
  }
};
</script>
