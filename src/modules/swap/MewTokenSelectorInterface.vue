<template>
  <div class="token-selector-interface">
    <div class="border-container" :class="border">
      <!-- ============================================================================= -->
      <!-- Token selector interface -->
      <!-- ============================================================================= -->
      <template v-if="!loading">
        <div class="monospace input-block-title textMedium--text">
          {{ title }}
        </div>
        <div class="d-flex align-center">
          <mew-button
            btn-style="transparent"
            color-theme="basic"
            style="padding: 0 10px !important; margin-left: -10px"
            @click.native="handleShow"
          >
            <!-- ========================================= -->
            <!-- Token detail button -->
            <!-- ========================================= -->
            <template v-if="token">
              <mew-token-container size="25px" :img="token.img" />
              <div class="mew-heading-1 ml-3 font-weight-bold textDark--text">
                {{ token.symbol }}
              </div>
              <v-icon color="textDark">mdi-menu-down</v-icon>
            </template>

            <!-- ========================================= -->
            <!-- Just a text button -->
            <!-- ========================================= -->
            <template v-else>
              <div class="mew-heading-1 font-weight-bold textDark--text">
                {{ btnText }}
              </div>
              <v-icon color="textDark">mdi-menu-down</v-icon>
            </template>
          </mew-button>
          <v-spacer />
          <v-text-field
            :value="value"
            class="swap-input"
            :placeholder="placeholder"
            :readonly="readOnly"
            solo
            flat
            hide-details
            @input="input"
          />
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="textMedium--text pointer" @click="maxButton">
            {{ leftText }}
          </div>
          <div :class="!error ? 'textMedium--text' : 'error--text'">
            {{ error || rightText }}
          </div>
        </div>
        <v-dialog :value="show" width="440" @click:outside="handleShow">
          <v-sheet v-if="show" class="pa-3">
            <div class="mew-heading-1 mt-2 mb-5">{{ popupTitle }}</div>
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              filled
              placeholder="Search"
              :value="query"
              @keydown="setQuery"
            />
            <div class="token-container">
              <div v-for="(t, i) in tokenResults" :key="i" class="mb-3">
                <v-lazy :options="{ threshold: 0.5 }">
                  <div v-if="t.header" class="mew-heading-3 text mb-2">
                    {{ t.header }}
                  </div>
                  <div
                    v-else
                    :key="t.contract"
                    class="d-flex align-center pt-2 pb-2"
                  >
                    <mew-token-container
                      size="medium"
                      class="mr-3"
                      :img="t.img"
                    />
                    <div class="flex-column">
                      <div>
                        {{ t.symbol }}
                      </div>
                      <div>
                        {{ t.subtext }}
                      </div>
                    </div>
                    <div class="flex-column ml-auto mr-3 mb-auto text-right">
                      <div>
                        {{ t.price }}
                      </div>
                      <div>
                        {{ t.balancef }}
                      </div>
                    </div>
                  </div>
                </v-lazy>
              </div>
            </div>
          </v-sheet>
        </v-dialog>
      </template>

      <!-- ============================================================================= -->
      <!-- Skeleton loader for loading -->
      <!-- ============================================================================= -->
      <template v-else>
        <v-skeleton-loader
          class="mt-2 mb-2"
          width="90px"
          height="20px"
          type="image"
        />
        <div class="d-flex align-center">
          <v-skeleton-loader
            width="170px"
            height="40px"
            type="image"
          ></v-skeleton-loader>
          <v-spacer />
          <v-skeleton-loader
            width="120px"
            height="40px"
            type="image"
          ></v-skeleton-loader>
        </div>
        <div class="d-flex align-center justify-space-between mt-3 mb-2">
          <v-skeleton-loader
            width="140px"
            height="20px"
            type="image"
          ></v-skeleton-loader>
          <v-skeleton-loader
            width="100px"
            height="20px"
            type="image"
          ></v-skeleton-loader>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TokenSelectorInterface',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    token: {
      type: Object,
      default: () => {}
    },
    tokens: {
      type: Array,
      default: () => []
    },
    input: {
      type: Function,
      default: () => {}
    },
    tokenSelect: {
      type: Function,
      default: () => {}
    },
    swap: {
      type: Function,
      default: () => {}
    },
    btnText: {
      type: String,
      default: ''
    },
    popupTitle: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: ''
    },
    maxButton: {
      type: Function,
      default: () => {}
    },
    rightText: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      query: ''
    };
  },
  computed: {
    border() {
      return this.error ? 'errorBorder' : this.selected ? 'selected' : '';
    },
    tokenResults() {
      return this.query
        ? this.tokens.filter(t => {
            if (t.header) return;
            const reg = RegExp(this.query, 'gi');
            return t.name?.search(reg) || t.subtext?.search(reg);
          })
        : this.tokens;
    }
  },
  methods: {
    handleShow() {
      this.show = !this.show;
    },
    setQuery(e) {
      this.query = e.target.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.token-container {
  overflow: scroll;
  overflow-x: hidden;
  max-height: 600px;
}
.border-container {
  padding: 15px 17px;
  border-radius: 12px;
  border: 2px solid #e3e9ed;
  transition: border 0.15s ease;
  &.selected {
    border: 2px solid var(--v-greenPrimary-base);
  }
  &.errorBorder {
    border: 2px solid var(--v-redPrimary-base);
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
