<template>
  <mew-overlay :show-overlay="open">
    <template #mewOverlayBody>
      <div class="pa-8">
        <h2 class="text-center mb-10">Add an owned domain</h2>
        <v-sheet color="transparent" width="700px">
          <div class="mb-3"></div>
          <div class="d-flex align-start">
            <mew-input
              :has-clear-btn="true"
              right-label=".ctypto"
              label="Domain name"
              placeholder=" "
              class="mr-3 flex-grow-1"
            />
            <mew-button
              :has-full-width="false"
              btn-size="xlarge"
              title="Search"
            />
          </div>
        </v-sheet>
        <mew6-white-sheet class="pa-3">
          <div
            class="d-flex align-center justify-space-between informationBlock pa-6 border-radius--10px"
          >
            <div class="d-flex align-center">
              <v-icon class="check-icon primary--text mr-3">
                mdi-check-circle-outline
              </v-icon>
              <div>
                <div class="mew-heading-2 primary--text mb-2">Owned domain</div>
                <div class="mew-heading-2">mewdev009.eth</div>
              </div>
            </div>
            <mew-button
              :has-full-width="false"
              btn-size="large"
              title="Add to list"
              btn-style="outline"
            />
          </div>
          <div class="pa-5">
            <table>
              <tbody>
                <tr>
                  <td>Parent</td>
                  <td>ETH</td>
                </tr>
                <tr>
                  <td>Registrant</td>
                  <td class="d-flex align-center">
                    <mew-blockie height="30px" width="30px" class="mr-2" />
                    <div class="mr-2">
                      0xf55914186a692a3335fF44ae107FA724b1074dDC
                    </div>
                    <mew-copy
                      :tooltip="$t('common.copy')"
                      copy-value="0xf55914186a692a3335fF44ae107FA724b1074dDC"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Controller</td>
                  <td class="d-flex align-center">
                    <mew-blockie height="30px" width="30px" class="mr-2" />
                    <div class="mr-2">
                      0xf55914186a692a3335fF44ae107FA724b1074dDC
                    </div>
                    <mew-copy
                      :tooltip="$t('common.copy')"
                      copy-value="0xf55914186a692a3335fF44ae107FA724b1074dDC"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Expiration date</td>
                  <td class="d-flex align-center">
                    03/12/2020 @ 20:30:12
                    <badge
                      class="ml-2"
                      badge-title="Expired"
                      badge-type="error"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.check-icon {
  font-size: 65px !important;
}

table {
  width: 100%;
  border-collapse: collapse;
  tbody {
    tr {
      border-bottom: 1px solid var(--v-inputBorder-base);
      td {
        padding: 20px;
      }
    }
  }
}
</style>
