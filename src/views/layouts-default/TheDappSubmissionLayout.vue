<template>
  <div class="mew-component--dapp-submission">
    <the-layout-header title="Dapp Submission Form" />
    <v-container class="my-10">
      <v-row>
        <v-col cols="12" md="6">
          <div class="border pa-6">
            <mew-input label="Authors"></mew-input>
            <mew-input label="My full name"></mew-input>
            <mew-input label="My email"></mew-input>

            <div>Company social links</div>
            <div class="border social-media pa-6">
              <div v-for="s in socialLinks" :key="s.name">
                <img :src="s.icon" :alt="s.name" />
                <v-text-field label="Facebook"></v-text-field>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="border walletBg pa-6">
            <mew-input label="Authors"></mew-input>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';

export default {
  name: 'DappSubmition',
  components: { TheLayoutHeader },
  data: () => ({
    socialLinks: [
      {
        name: 'Facebook',
        icon: require('@/assets/images/icons/socials/svg/facebook.svg')
      }
    ]
  }),
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid var(--v-selectHover-base);
  border-radius: 5px;
}

.social-media {
  & > div {
    display: flex;
    align-items: center;
  }

  img {
    width: 22px;
    margin-right: 15px;
    filter: opacity(0.2);
  }
}
</style>
