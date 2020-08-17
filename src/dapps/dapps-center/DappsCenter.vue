<template>
  <mew6-white-sheet class="mew-component--dapps-center">
    <mew-banner :text-obj="title" :banner-img="bannerImage" />
    <div class="pa-8">
      <div class="mew-heading-1 px-4 mb-2">MEW Dapps</div>
      <v-row>
        <v-col v-for="(dapp, key) in mewDapps" :key="key" cols="4" sm="4">
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
    <div class="pa-8">
      <div class="mew-heading-1 px-4 mb-2">Recent</div>
      <v-row>
        <v-col v-for="(dapp, key) in recent" :key="key" cols="4" sm="4">
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
          rightIcon: 'ensManager'
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
    adapps() {}
  }
};
</script>

<style lang="scss">
.mew-component--dapps-center {
  .mew-banner {
    min-height: 250px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    .exit-container {
      display: none;
    }

    .mew-subtitle {
      font-size: 36px !important;
    }
  }
  .v-btn__content {
    height: 150px !important;
    display: block !important;
  }

  .label-container {
    border-right: 20px solid var(--v-secondary-base) !important;
    border-top: 20px solid var(--v-secondary-base) !important;
    border-left: 20px solid transparent !important;
    border-bottom: 20px solid transparent !important;
    height: 0 !important;

    .label {
      font-size: 10px !important;
      margin-top: -14px !important;
      margin-left: -7px !important;
    }
  }

  .text-right {
    margin-right: -15px;
  }

  .text-left {
    & > div:nth-child(2) {
      font-weight: 400 !important;
      max-height: 45px;
      overflow: hidden;
      margin-bottom: 10px;
    }
  }

  .right-icon {
    img {
      height: 70px;
    }
  }

  .mew-super-button {
    .title-icon {
      color: var(--v-primary-base) !important;
      margin-top: -5px;
      padding-left: 2px;
    }
  }
}
</style>
