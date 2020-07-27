<template>
  <mew6-white-sheet>
    <mew-banner :text-obj="title" />
    <div class="pa-8">
      <div class="mew-heading-1 px-4">MEW Dapps</div>
      <v-row>
        <v-col v-for="(dapp, key) in mewDapps" :key="key" cols="4" sm="4">
          <mew-super-button
            :title="dapp.title"
            :subtitle="dapp.subtitle"
            :tag="dapp.tag"
            :is-new="dapp.isNew"
            :right-icon="dapp.icon"
            :title-icon="dapp.thumbsup"
            icon-type="mew"
          />
        </v-col>
      </v-row>
    </div>
    <div class="pa-8">
      <div class="mew-heading-1 px-4">Recent</div>
      <v-row>
        <v-col v-for="(dapp, key) in recent" :key="key" cols="4" sm="4">
          <mew-super-button
            :title="dapp.title"
            :subtitle="dapp.subtitle"
            :tag="dapp.tag"
            :is-new="dapp.isNew"
            :right-icon="dapp.icon"
            :title-icon="dapp.thumbsup"
          />
        </v-col>
      </v-row>
    </div>
  </mew6-white-sheet>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: {
        title: 'Explore MEW Dapps'
      },
      dapps: {
        MakerDAO: {
          title: 'MakerDAO',
          subtitle: 'Collateralize & Generate DAI',
          tag: '#Exchanges',
          isNew: true,
          icon: 'MAKERDAO',
          thumbsup: 'mdi-thumb-up'
        },
        ENSManager: {
          title: 'ENS manager',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Property',
          icon: 'ENSMANAGER'
        },
        SafeSendTX: {
          title: 'SafeSend transaction',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Security',
          icon: 'LOCK'
        },
        ScheduleTX: {
          title: 'Schedule a transaction',
          subtitle: 'Using the decentralized ETH alarm clock prototype',
          tag: '#Exchange',
          icon: 'CALENDAR'
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
