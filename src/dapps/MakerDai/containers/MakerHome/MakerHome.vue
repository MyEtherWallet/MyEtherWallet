<template>
  <div class="boundary">
    <div class="grid-col-2 promo-cards">
      <div class="card-block create-wallet" @click="migrateDai">
        <div class="flex-col-vertical-center">
          <div class="card-content">
            <h2 class="color-white">
              {{ $t('dappsMaker.migrate-old-dai-to-new-dai') }}
            </h2>
            <p class="button">
              {{ $t('dappsMaker.sai-to-dai') }}
              <img src="~@/assets/images/icons/right-arrow.png" />
            </p>
          </div>
        </div>
      </div>

      <div class="card-block unlock-wallet" @click="migrateCDP">
        <div class="flex-col-vertical-center">
          <div class="card-content">
            <h2 class="color-white">
              {{
                $t('dappsMaker.migrate-single-collateral-to-multi-collateral')
              }}
            </h2>
            <p class="button">
              {{ $t('dappsMaker.migrate') }}
              <img src="~@/assets/images/icons/right-arrow.png" />
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-col-2 promo-cards">
      <div class="card-block create-wallet" @click="goToManage">
        <div v-show="makerActive" class="flex-col-vertical-center">
          <div class="card-content">
            <h2 class="color-white">
              {{ $t('dappsMaker.manage-your-vault') }}
            </h2>
            <p class="button">
              {{ $t('dappsMaker.manage') }}
              <img src="~@/assets/images/icons/right-arrow.png" />
            </p>
          </div>
        </div>
        <div v-show="!makerActive" class="flex-col-vertical-center">
          <loading-sign
            :loadingmessage1="loadingMessage"
            :loadingmessage2="$t('dappsMaker.initial-loading-two')"
          />
        </div>
      </div>

      <div class="card-block unlock-wallet" @click="gotoCreate">
        <div v-show="makerActive" class="flex-col-vertical-center">
          <div class="card-content">
            <h2 class="color-white">{{ $t('dappsMaker.create-a-vault') }}</h2>
            <p class="button">
              {{ $t('dappsMaker.create') }}
              <img src="~@/assets/images/icons/right-arrow.png" />
            </p>
          </div>
        </div>
        <div v-show="!makerActive" class="flex-col-vertical-center">
          <loading-sign
            :loadingmessage1="loadingMessage"
            :loadingmessage2="$t('dappsMaker.initial-loading-two')"
          />
        </div>
      </div>
    </div>

    <div class="grid-col-2 promo-cards">
      <div class="card-block unlock-wallet" @click="goToSave">
        <div class="flex-col-vertical-center">
          <div class="card-content">
            <h2 class="color-white">
              {{ $t('dappsMaker.dai-savings') }}
            </h2>
            <p class="button">
              {{ $t('dappsMaker.save') }}
              <img src="~@/assets/images/icons/right-arrow.png" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSign from '@/components/LoadingSign';
// IDEA is to place all the functionality and links to 'what is this?', 'how do I...?' in one place.
export default {
  components: {
    'loading-sign': LoadingSign
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
      return this.loadingState;
      // return `Loading: ${this.loadingState}`
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
  mounted() {},
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
            // The listing screen may not work and can be removed
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

<style lang="scss" scoped>
@import 'MakerHome';
</style>
