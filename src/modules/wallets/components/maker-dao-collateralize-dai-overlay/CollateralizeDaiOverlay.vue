<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">
          Collateralize DAI
        </h2>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            width="700px"
            class="px-8 py-1 mew-component--aave-borrow-overlay"
          >
            <table class="width--full">
              <tbody>
                <tr>
                  <td class="font-weight-bold vertical-align--middle py-8">
                    Upgrade SAI to DAI
                  </td>
                  <td class="text-right">
                    <mew-button title="Upgrade" btn-style="outline" />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold vertical-align--middle py-8">
                    Migrate Single Collateral CDP to Multi-Collateral Vault
                  </td>
                  <td class="text-right">
                    <mew-button title="Upgrade" btn-style="outline" />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold vertical-align--middle py-8">
                    DAI Savings
                  </td>
                  <td class="text-right">
                    <mew-button title="Upgrade" btn-style="outline" />
                  </td>
                </tr>
              </tbody>
            </table>
          </v-sheet>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  components: {},
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
table {
  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--v-inputBorder-base);
      }
    }
  }
}
</style>
