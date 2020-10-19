<template>
  <mew-overlay :show-overlay="open" @closeOverlay="$emit('close')">
    <template #mewOverlayBody>
      <div class="width--full">
        <h2 class="text-center mb-10">Add an owned domain</h2>
        <v-sheet
          color="transparent"
          max-width="500px"
          width="100%"
          class="mx-auto"
        >
          <div class="mb-3"></div>
          <div class="d-block d-lg-flex align-start">
            <mew-input
              :has-clear-btn="true"
              right-label=".ctypto"
              label="Domain name"
              placeholder=" "
              class="mr-lg-3 flex-grow-1"
            />
            <mew-button
              :has-full-width="$vuetify.breakpoint.mdAndDown"
              class="mt-n3 mt-lg-0"
              btn-size="xlarge"
              title="Search"
            />
          </div>
        </v-sheet>

        <v-sheet max-width="500px" width="100%" class="mx-auto">
          <mew6-white-sheet class="pa-3 mt-5">
            <div
              class="d-block d-lg-flex align-center justify-space-between informationBlock pa-6 border-radius--10px"
            >
              <div class="d-flex align-center">
                <v-icon class="check-icon primary--text mr-3">
                  mdi-check-circle-outline
                </v-icon>
                <div>
                  <div class="mew-heading-2 primary--text mb-2">
                    Owned domain
                  </div>
                  <div class="mew-heading-2">mewdev009.eth</div>
                </div>
              </div>
              <mew-button
                class="mt-4 mt-lg-0"
                :has-full-width="$vuetify.breakpoint.mdAndDown"
                btn-size="large"
                title="Add to list"
                btn-style="outline"
              />
            </div>
            <div class="pa-3 pa-lg-5">
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
                      <div
                        class="mr-2 flex-shrink-1 text-overflow--ellipsis"
                        style="max-width: 20vw"
                      >
                        0xf55914186a692a3335fF44ae107FA724b1074dDC
                      </div>
                      <copy-button
                        text="0xf55914186a692a3335fF44ae107FA724b1074dDC"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Controller</td>
                    <td class="d-flex align-center">
                      <mew-blockie height="30px" width="30px" class="mr-2" />
                      <div
                        class="mr-2 text-overflow--ellipsis"
                        style="max-width: 20vw"
                      >
                        0xf55914186a692a3335fF44ae107FA724b1074dDC
                      </div>
                      <copy-button
                        text="0xf55914186a692a3335fF44ae107FA724b1074dDC"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Expiration date</td>
                    <td class="d-block d-lg-flex align-center">
                      <div>03/12/2020 @ 20:30:12</div>
                      <mew-badge
                        class="ml-lg-2 mt-2 mt-lg-0"
                        badge-title="Expired"
                        badge-type="error"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mew6-white-sheet>
        </v-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import copyButton from '@/components/buttons/copy-button/CopyButton';

export default {
  components: { copyButton },
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
        padding: 10px;
      }
    }
  }
}
</style>
