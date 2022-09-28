<template>
  <!--
  =====================================================================================
    Mew Expand Panel
  =====================================================================================
  -->
  <v-expansion-panels
    v-model="expandIdxArr"
    :multiple="isToggle"
    class="mew-expand-panel rounded"
    :flat="true"
  >
    <v-expansion-panel
      v-for="(item, i) in panelItems"
      :key="i"
      :disabled="item.disabled"
      :class="item.hasActiveBorder ? 'active-border' : ''"
    >
      <v-divider v-if="hasDividers" />
      <!--
    =====================================================================================
      Panel Header 
    =====================================================================================
    -->
      <v-expansion-panel-header
        :class="[
          'rounded',
          'titlePrimary--text',
          'mew-heading-3',
          isToggle ? 'pa-3 no-pointer-events' : 'pa-5'
        ]"
        :color="item.colorTheme"
      >
        <!--
    =====================================================================================
      Panel Header - Left 
    =====================================================================================
    -->
        <div class="d-flex align-center">
          <span
            :class="[
              'mew-heading-3',
              item.tooltip ? 'd-flex align-center' : ''
            ]"
          >
            {{ item.name }}
            <mew-tooltip
              v-if="item.tooltip"
              class="ml-1"
              :text="item.tooltip"
            />
          </span>
          <span
            v-if="!item.tooltip && item.warningBadge"
            :class="[
              item.warningBadge.color,
              'ml-2',
              'text-center',
              'white--text',
              'px-2',
              'py-1',
              'rounded',
              'mew-caption'
            ]"
            >{{ item.warningBadge.text }}</span
          >
        </div>
        <!--
    =====================================================================================
      Panel Header - Right
    =====================================================================================
    -->
        <div v-if="item.disabled" class="text-right">
          <mew-button
            btn-style="transparent"
            btn-size="xlarge"
            color-theme="primary"
            :title="rightActionText"
            @click.native="onActionClick"
          />
        </div>
        <div slot="actions" class="d-flex align-center justify-center">
          <span class="inputLabel--text mew-body mx-2 text-right">{{
            item.subtext
          }}</span>
          <!--
  =====================================================================================
    Slot: mewExpandPanelActions (used to place custom ui on the right side of the expand panel header)
  =====================================================================================
  -->
          <slot name="mewExpandPanelActions" />
          <mew-switch
            v-if="isToggle && !item.disabled"
            ref="switch"
            @click.native="onSwitch"
          />
          <span v-if="!isToggle && !item.disabled">
            <img
              v-if="!isExpanded(i)"
              height="30"
              src="@/assets/images/icons/edit.svg"
            />
            <v-icon v-if="isExpanded(i)"> mdi-chevron-down </v-icon>
          </span>
        </div>
      </v-expansion-panel-header>
      <!--
  =====================================================================================
    Panel Content, has slot: 'panelBody' + the number of the panel (used to place content in the panel body)
  =====================================================================================
  -->
      <v-expansion-panel-content color="white">
        <slot :name="'panelBody' + (i + 1)" />
      </v-expansion-panel-content>
      <v-divider v-if="hasDividers" />
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import MewSwitch from '@/components/MewSwitch/MewSwitch.vue';
import MewTooltip from '@/components/MewTooltip/MewTooltip.vue';
import MewButton from '@/components/MewButton/MewButton.vue';

export default {
  name: 'MewExpandPanel',
  components: {
    MewSwitch,
    MewButton,
    MewTooltip
  },
  props: {
    /**
     * Applies text to the right action button when panel is disabled.
     */
    rightActionText: {
      type: String,
      default: ''
    },
    /**
     * Applies dividers to the expand panel.
     */
    idxToExpand: {
      type: Number,
      default: 0
    },
    /**
     * Applies dividers to the expand panel.
     */
    hasDividers: {
      type: Boolean,
      default: false
    },
    /**
     * Turns the panel actions to a toggle btn. The subtext attribute in panelItems becomes the switch label.
     */
    isToggle: {
      type: Boolean,
      default: false
    },
    /**
     * Accepts an array of panel objects, i.e [{ name: '', tooltip: '', subtext: '', link: '', disabled: false }]
     */
    panelItems: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      expandIdxArr: []
    };
  },
  watch: {
    idxToExpand(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.expandIdxArr = newVal;
      }
    }
  },
  mounted() {
    this.expandIdxArr = this.idxToExpand;
  },
  methods: {
    setToggle(val) {
      if (val === true && !this.expandIdxArr.includes(0)) {
        this.expandIdxArr.push(0);
      }
      if (val === false && this.expandIdxArr.includes(0)) {
        this.expandIdxArr.pop();
      }
      this.$refs.switch[0].setToggle(val);
    },
    isExpanded(idx) {
      if (
        (Array.isArray(this.expandIdxArr) && this.expandIdxArr.includes(idx)) ||
        this.expandIdxArr === idx
      ) {
        return true;
      }
      return false;
    },
    onActionClick() {
      this.$emit('onActionClick');
    },
    onSwitch() {
      this.$emit('toggled');
    }
  }
};
</script>

<style lang="scss">
.mew-expand-panel {
  .v-expansion-panel {
    margin-bottom: 10px;
    .v-expansion-panel-content__wrap {
      padding: 0;
    }
  }
  .v-item--active.active-border {
    border: 1px solid var(--v-primary-base);
    .v-expansion-panel-header {
      border-bottom: 1px solid var(--v-primary-base) !important;
      border-radius: 4px 4px 0 0 !important;
    }
  }
}
</style>
