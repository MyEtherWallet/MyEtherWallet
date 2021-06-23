<template>
  <v-container class="position--relative pa-0">
    <!--
    =====================================================================================
    ICON: absolute icon in the middle
    =====================================================================================
    -->
    <div
      :class="[
        $vuetify.breakpoint.smAndUp ? 'swap-icon-sm-and-up' : 'swap-icon-xs',
        isSwap ? 'swap-icon' : '',
        'arrow-icon align-center'
      ]"
    >
      <img
        :src="swapIcon"
        :class="[
          $vuetify.breakpoint.smAndUp ? '' : 'xs-svg',
          'pa-1',
          {
            [$vuetify.breakpoint.smAndUp ? 'pl-2' : 'pr-2']: !isSwap
          }
        ]"
        width="30px"
        contain
      />
    </div>

    <v-row no-gutters>
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        sm="6"
        :class="{
          [$vuetify.breakpoint.smAndUp ? 'pr-1' : 'pb-1']:
            isSwap && isEven(index),
          [$vuetify.breakpoint.smAndUp ? 'pad-l' : 'pad-t']:
            !isSwap && !isEven(index),
          [$vuetify.breakpoint.smAndUp ? 'pad-r' : 'pad-b']:
            !isSwap && isEven(index)
        }"
      >
        <!--
        =====================================================================================
          SWAP: grey value conatiners
        =====================================================================================
        -->
        <div v-if="isSwap" class="value-container text-center py-6">
          <div class="mew-caption searchText--text pb-2">
            {{ item.title }}
          </div>
          <mew-token-container :icon="item.icon" size="medium" />
          <div class="mew-heading-4 font-weight-medium black--text pt-2">
            {{ item.value }}
            <span class="mew-body font-weight-medium"> {{ item.type }} </span>
          </div>
        </div>
        <!--
        =====================================================================================
          SEND: grey value conatiners
        =====================================================================================
        -->
        <div
          v-else
          class="
            value-container
            d-flex
            align-center
            justify-start
            pa-6
            fill-height
          "
        >
          <!--
            =====================================================================================
              ICONS:
            =====================================================================================
            -->
          <div v-if="item.amount && item.icon">
            <v-img
              :src="item.icon"
              max-height="24px"
              max-width="24px"
              contain
            />
          </div>
          <div v-if="!item.amount">
            <v-img
              v-if="item.avatar && item.avatar !== ''"
              :src="avatar"
              height="24px"
              width="24px"
              class="circle"
            />
            <mew-blockie
              v-else
              :address="item.address"
              width="24px"
              height="24px"
            />
          </div>
          <!--
            =====================================================================================
              TEXT:
            =====================================================================================
            -->
          <div class="pl-2">
            <div class="mew-caption searchText--text font-weight-medium">
              {{ item.amount ? 'Sending' : 'To Address' }}
            </div>
            <!--
            =====================================================================================
              TEXT: amount
            =====================================================================================
            -->
            <div v-if="item.amount" class="pt-2">
              <div class="mew-heading-2 black--text">
                {{ item.amount }}
                <span class="mew-body font-weight-medium">
                  {{ item.type }}
                </span>
              </div>
              <div class="mew-heading-4 textBlack2--text">${{ item.usd }}</div>
            </div>
            <!--
            =====================================================================================
              TEXT: address
            =====================================================================================
            -->
            <div v-else class="pt-2">
              <div
                v-if="item.nickname !== ''"
                class="mew-heading-3 black--text text-truncate"
              >
                {{ item.nickname }}
              </div>
              <div class="addr">
                <mew-transform-hash
                  v-if="item.nickname !== ''"
                  :hash="item.address"
                  class="textBlack2--text mew-body"
                />
                <p v-else class="text-wrap textBlack2--text mew-body mb-0">
                  {{ item.address }}
                </p>
              </div>
              <div v-if="item.ensName !== ''" class="primary--text mew-body">
                {{ item.ensName }}
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import SwapIcon from '@/assets/images/icons/swap-arrow.svg';
export default {
  props: {
    items: {
      default: function () {
        return [];
      },
      type: Array
    },
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({ swapIcon: SwapIcon }),
  methods: {
    isEven(_value) {
      return _value % 2 == 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.value-container {
  border-radius: 8px;
  background-color: #f9f9f9;
}
.arrow-icon {
  position: absolute;
  height: 30px;
  width: 30px;
}
.swap-icon {
  border-radius: 50%;
  background-color: white !important;
}
.swap-icon-sm-and-up {
  left: 47%;
  top: 42%;
}
.swap-icon-xs {
  left: 45%;
  top: 44%;
}
.xs-svg {
  transform: rotate(90deg);
}
.addr {
  max-width: 160px;
  .text-wrap {
    overflow-wrap: break-word;
  }
}
.pad-b {
  padding-bottom: 15px !important;
}
.pad-t {
  padding-top: 15px !important;
}
.pad-l {
  padding-left: 15px !important;
}
.pad-r {
  padding-right: 15px !important;
}
</style>
