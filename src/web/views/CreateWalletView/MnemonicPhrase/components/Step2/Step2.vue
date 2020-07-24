<template>
  <div>
    <v-sheet>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="mb-10">
        <div class="headline font-weight-bold">Verification</div>
        <div>
          Please select the correct words based on their numbers, and enter the
          extra word if you have one.
        </div>
      </div>

      <v-sheet max-width="600px" class="mx-auto">
        <PhraseBlock class="mb-2 d-flex align-center">
          <div style="min-width: 60px;">5.</div>
          <v-radio-group
            v-model="radioGroup1"
            hide-details
            class="width--100-percent"
          >
            <v-row>
              <v-col v-for="n in 3" :key="n" lg="4">
                <v-radio :label="`Radio ${n}`" :value="n"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </PhraseBlock>
        <PhraseBlock class="mb-2 d-flex align-center">
          <div style="min-width: 60px;">5.</div>
          <v-radio-group
            v-model="radioGroup2"
            hide-details
            class="width--100-percent"
          >
            <v-row>
              <v-col v-for="n in 3" :key="n" lg="4">
                <v-radio :label="`Radiaaaao ${n}`" :value="n"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </PhraseBlock>
        <PhraseBlock class="mb-2 d-flex align-center">
          <div style="min-width: 60px;">5.</div>
          <v-radio-group
            v-model="radioGroup3"
            hide-details
            class="width--100-percent"
          >
            <v-row>
              <v-col v-for="n in 3" :key="n" lg="4">
                <v-radio :label="`Radiaaaao ${n}`" :value="n"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </PhraseBlock>
        <mew-input
          label="Extra word"
          placeholder="Please confirm your extra word"
          class="mt-10 mb-3"
        />
      </v-sheet>
      <div class="d-flex justify-center mb-3">
        <mew-button
          title="Verify"
          button-size="xlarge"
          :has-full-width="false"
          @click.native="linkToStep(3)"
        />
      </div>
    </v-sheet>

    <warning-sheet title="NOT RECOMMENDED" description="Not recommanded" />
  </div>
</template>

<script>
import PhraseBlock from '../PhraseBlock';

export default {
  components: { PhraseBlock },
  data: () => ({
    radioGroup1: '',
    radioGroup2: '',
    radioGroup3: '',
    warningData: [
      {
        img: require('@/assets/images/icons/icon-paper-plane-mew.svg'),
        title: "Don't lose it",
        description: 'Be careful, it can not be recovered if you lose it.'
      },
      {
        img: require('@/assets/images/icons/icon-money-bag-mew.svg'),
        title: "Don't share it",
        description:
          'Your funds will be stolen if you use this file on a malicious phishing site.'
      },
      {
        img: require('@/assets/images/icons/icon-copy-mew.svg'),
        title: 'Make a backup',
        description:
          'Secure it like the millions of dollars it may one day be worth.'
      }
    ]
  }),
  methods: {
    linkToStep(step) {
      this.$router.push({
        path: '/create-wallet/mnemonic',
        query: { step: step }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
  margin-bottom: 0;
}
.v-input--selection-controls {
  margin: 0;
  padding: 0;
}
</style>
