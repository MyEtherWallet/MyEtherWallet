<template>
  <div>
    <b-row align-content="stretch">
      <b-col cols="12" xl="6" lg="6" md="6" class="mb-4">
        <card
          :title="$t('dappsMCDMaker.migrate-old-dai-to-new-dai')"
          :text="$t('dappsMCDMaker.migrate-description')"
          button="Go"
          :click="migrateDai"
        />
      </b-col>
      <b-col cols="12" xl="6" lg="6" md="6" class="mb-4">
        <card
          :title="
            $t('dappsMCDMaker.migrate-single-collateral-to-multi-collateral')
          "
          :text="$t('dappsMCDMaker.transfer-cdp-description')"
          button="Go"
          :click="migrateCDP"
        />
      </b-col>
      <b-col cols="12" xl="6" lg="6" md="6" class="mb-4">
        <card
          :title="$t('dappsMCDMaker.manage-your-vault')"
          :text="$t('dappsMCDMaker.transfer-cdp-description')"
          button="Go"
          :click="goToManage"
          :loading="!makerActive ? true : false"
          :loading-msg="loadingMessage"
      /></b-col>
      <b-col cols="12" xl="6" lg="6" md="6" class="mb-4">
        <card
          :title="$t('dappsMCDMaker.create-a-vault')"
          :text="$t('dappsMCDMaker.create-vault-description')"
          button="Go"
          :click="gotoCreate"
          :loading="!makerActive ? true : false"
          :loading-msg="loadingMessage"
      /></b-col>
      <b-col cols="12" xl="6" lg="6" md="6" class="mb-4">
        <card
          :title="$t('dappsMCDMaker.dai-savings')"
          :text="$t('dappsMCDMaker.create-vault-description')"
          button="Go"
          :click="goToSave"
      /></b-col>
    </b-row>
  </div>
</template>

<script>
import Card1 from '@/components/Card1';
// IDEA is to place all the functionality and links to 'what is this?', 'how do I...?' in one place.
export default {
  components: {
    card: Card1
  },
  props: {
    cdps: {
      type: Array,
      default: function() {
        return [];
      }
    },
    cdpsWithoutProxy: {
      type: Array,
      default: function() {
        return [];
      }
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    loadingState: {
      type: String,
      default: 'none'
    }
  },
  data() {
    return {};
  },
  computed: {
    loadingMessage() {
      return this.$t(this.loadingState);
    },
    hasCdps() {
      return this.cdps.length > 0;
    },
    showManage() {
      return (
        this.listCdps ||
        (this.cdps.length >= 1 && this.cdpsWithoutProxy.length >= 1)
      );
    },
    listCdps() {
      return this.cdps.length > 1 || this.cdpsWithoutProxy.length > 1;
    }
  },
  methods: {
    gotoCreate() {
      if (this.$route.path.includes('maker-dai')) {
        if (this.makerActive) {
          this.activeValues = this.systemValues;
          this.$router.push({
            name: 'create'
          });
        } else {
          this.$emit('proceedtoCreateOrManage');
          this.$emit('setAfterLoadPage', 'CREATE');
          this.$router.push({
            name: 'makerLoading'
          });
        }
      }
    },
    migrateDai() {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'migrateDAI'
        });
      }
    },
    migrateCDP() {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'migrateCDP'
        });
      }
    },
    gotoLoading() {
      this.$emit('proceedtoCreateOrManage');
      if (!this.makerActive) {
        this.$router.push({
          name: 'makerLoading'
        });
      } else {
        this.goToManage();
      }
    },
    goToSave() {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'save'
        });
      }
    },
    goToManage() {
      if (this.$route.path.includes('maker-dai')) {
        if (this.makerActive) {
          if (this.cdps.length === 1) {
            this.$router.push({
              name: 'manage',
              params: {
                cdpId: this.cdps[0]
              }
            });
          } else if (this.cdpsWithoutProxy.length === 1) {
            this.$router.push({
              name: 'migrate',
              params: {
                cdpId: this.cdpsWithoutProxy[0]
              }
            });
          } else if (this.showManage) {
            this.$router.push({
              name: 'select'
            });
          } else {
            this.gotoCreate();
          }
        } else {
          this.$emit('proceedtoCreateOrManage');
          this.$emit('setAfterLoadPage', 'MANAGE');
          this.$router.push({
            name: 'makerLoading'
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
