<template>
  <!--
=====================================================================================
 Derivation Path Component - Access Wallet 
=====================================================================================
-->
  <mew-dropdown popup-title="Select a derivation path">
    <template #activatorBtnText>
      <span class="titlePrimary--text mew-body capitalize">
        {{ selectedPath.name }}
      </span>
      <span class="path mew-body capitalize">{{ selectedPath.value }}</span>
    </template>
    <template #cardContent>
      <div>
        <mew-search class="mb-8" placeholder="find a path" is-search-block />
        <div
          v-for="(path, idx) in paths"
          :key="path + idx"
          class="
            titlePrimary--text
            mb-7
            d-flex
            align-center
            justify-space-between
          "
        >
          <div class="d-flex align-center">
            <v-img
              :src="require('@/assets/images/currencies/icon-eth-grey.svg')"
              contain
              max-height="24px"
              max-width="24px"
            />
            {{ path.name }}
          </div>
          <span class="path">
            {{ path.value }}
          </span>
        </div>
      </div>
    </template>
  </mew-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    paths: {
      type: Array,
      default: () => []
    },
    selectedPath: {
      type: Object,
      default: () => {
        return {
          name: 'Ethereum',
          value: "m/44'/60'/0'/0"
        };
      }
    }
  },
  data() {
    return {
      ledgerApp: {}
    };
  },
  mounted() {
    console.error('adadf', this.network)
  },
  computed: {
    ...mapGetters('global', ['network'])
    /**
     * Property returns defualt Paths + Custom paths, used in Select Path component
     * Property Interface:
     * {  name = string -> Name of the Path,
     *    subtext = string --> Derivation Path,
     *    value = tring --> Derivation Path
     * }
     */
    // parsedPaths() {
    //   console.error('apths', this.paths)
    //   return this.paths.map(item => {
    //     const newObj = {};
    //     newObj['name'] = item['name'];
    //     newObj['path'] = item['value'];
    //     return newObj;
    //   });
    // }
  },
  watch: {
    path(newVal) {
      this.$emit('setPath', newVal);
    },
    ledgerApp(newVal) {
      this.$emit('setLedgerApp', newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.path {
  color: rgba(11, 40, 64, 0.5);
}
</style>
