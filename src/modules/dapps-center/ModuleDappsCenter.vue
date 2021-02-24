<template>
  <div class="d-block">
    <mew6-white-sheet>
      <mew-banner :text-obj="title" :banner-img="bannerImage" />
      <div class="pa-8">
        <div class="mew-heading-1 px-4 mb-2">MEW Dapps</div>
        <v-row>
          <v-col
            v-for="(dapp, key) in mewDapps"
            :key="key"
            cols="12"
            md="6"
            lg="4"
          >
            <mew-super-button
              :cols-num="8"
              :title="dapp.title"
              :subtitle="dapp.subtitle"
              :tag="dapp.tag"
              :is-new="dapp.isNew"
              :title-icon-type="dapp.titleIconType"
              :title-icon="dapp.titleIcon"
              :right-icon-type="dapp.rightIconType"
              :right-icon="dapp.rightIcon"
              @click.native="routeTo(dapp.path)"
            />
          </v-col>
        </v-row>
      </div>
      <div class="pa-8">
        <div class="mew-heading-1 px-4 mb-2">Recent</div>
        <v-row>
          <v-col
            v-for="(dapp, key) in recent"
            :key="key"
            cols="12"
            sm="6"
            lg="4"
          >
            <mew-super-button
              :title="dapp.title"
              :subtitle="dapp.subtitle"
              :tag="dapp.tag"
              :is-new="dapp.isNew"
              :title-icon-type="dapp.titleIconType"
              :title-icon="dapp.titleIcon"
              :right-icon-type="dapp.rightIconType"
              :right-icon="dapp.rightIcon"
            />
          </v-col>
        </v-row>
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.png';
export default {
  components: {},
  data() {
    return {
      bannerImage: bannerImage,
      title: {
        title: 'Explore MEW Dapps'
      },
      dapps: {
        MakerDAO: {
          title: 'MakerDAO',
          subtitle: 'Collateralize & Generate DAI',
          tag: '#Exchanges',
          isNew: true,
          titleIconType: 'mdi',
          titleIcon: 'mdi-thumb-up',
          rightIconType: 'mew',
          rightIcon: 'makerdao'
        },
        ENSManager: {
          title: 'ENS manager',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Property',
          rightIconType: 'mew',
          rightIcon: 'ensManager',
          path: 'ENSManager'
        },
        SafeSendTX: {
          title: 'SafeSend transaction',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Security',
          rightIconType: 'mew',
          rightIcon: 'lock'
        },
        ScheduleTX: {
          title: 'Schedule a transaction',
          subtitle: 'Using the decentralized ETH alarm clock prototype',
          tag: '#Exchange',
          rightIconType: 'mew',
          rightIcon: 'calendar'
        }
      }
    };
  },
  computed: {
    mewDapps() {
      return [
        this.dapps.MakerDAO,
        this.dapps.ENSManager,
        this.dapps.ENSManager,
        this.dapps.SafeSendTX,
        this.dapps.ScheduleTX,
        this.dapps.ENSManager
      ];
    },
    recent() {
      return [
        this.dapps.MakerDAO,
        this.dapps.ENSManager,
        this.dapps.ENSManager
      ];
    }
  },
  methods: {
    routeTo(path) {
      this.$router.push({ name: path });
    }
  }
};
</script>
