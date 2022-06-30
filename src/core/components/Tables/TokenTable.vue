<template>
  <table-component
    :full-width="fullWidth"
    :background="background"
    :border-around="borderAround"
    :loading="loading"
    :hover-effect="hoverEffect"
    :flat="flat"
    :title="title"
    :divider="divider"
    :padding-around="paddingAround"
  >
    <table>
      <thead>
        <tr>
          <td>Token</td>
          <td>Address</td>
          <td>Balance</td>
          <td class="pa-0" style="width: 30px"></td>
          <td style="width: 80px">Show</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 5" :key="n">
          <td>
            <div class="d-flex align-center">
              <img
                src="@/assets/images/currencies/btc.png"
                height="20"
                class="mr-2"
              />
              <div>Bitcoin</div>
            </div>
          </td>
          <td>
            <div class="d-flex align-center">
              <mew-blockie
                address="0xAB3Afc314e75dC1648A2E31c06861A07a048C059"
                flat
                width="20px"
                height="20px"
                class="mr-2"
              />
              <div class="mr-2">0xAB3Afc4...8C059</div>
              <v-btn small icon color="white">
                <!-- <v-icon small color="greenPrimary">mdi-content-copy</v-icon> -->
                <img
                  src="@/assets/images/icons/icon-copy-green.svg"
                  alt="copy"
                  height="13"
                />
              </v-btn>
            </div>
          </td>
          <td>2.20585 PSN</td>
          <td class="pa-0">
            <v-btn small icon color="white">
              <img
                src="@/assets/images/icons/icon-trash-gray.svg"
                alt="trash"
                height="13"
              />
            </v-btn>
          </td>
          <td>
            <v-btn small icon color="white">
              <v-icon small color="greenPrimary">mdi-check-circle</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </table-component>
</template>

<script>
import TableComponent from '@/core/components/Tables/Table';

export default {
  name: 'TokenTable',
  components: { TableComponent },
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    },
    hoverEffect: {
      type: Boolean,
      default: false
    },
    background: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    borderAround: {
      type: Boolean,
      default: false
    },
    divider: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    paddingAround: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped></style>
