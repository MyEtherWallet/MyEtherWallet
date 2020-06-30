<template>
  <v-expansion-panels
    v-model="expandIdxArr"
    multiple
    :class="[isToggle ? 'no-pointer-events' : '', 'mew-expand-panel']"
    :flat="true"
  >
    <v-expansion-panel
      v-for="(item,i) in panelItems"
      :key="i"  
    >
      <v-divider v-if="hasDividers" />
      <v-expansion-panel-header
        :class="['titlePrimary--text', 'mew-heading-3', isToggle ? 'pa-3' : 'pa-5']"
        :color="colorTheme"
      > 
        <div class="header-container">
          <span :class="['ml-2', item.tooltip? 'd-flex align-center' :'']"> 
            {{ item.name }}
            <tooltip
              class="ml-1"
              :text="item.tooltip"
              v-if="item.tooltip"
            />
          </span>
          <span
            v-if="!item.tooltip"
            :class="[warningBadge.color, 'ml-2', 'text-center', 'white--text', 'px-2', 'py-1', 'badge-type', 'mew-caption']"
          >{{ warningBadge.text }}</span>
        </div>

        <div
          slot="actions"
          class="d-flex align-center justify-centers"
        >
          <span
            class="inputLabel--text mew-body mr-2"
          >{{ item.subtext }}</span>
          <slot name="mewExpandPanelActions" />
          <mew-switch
            v-if="isToggle"
          />
          <span v-if="!isToggle">
            <img
              v-if="!isExpand(i)"
              height="30"
              class="edit-icon"
              src="@/assets/images/icons/edit.svg"
            >
            <v-icon v-if="isExpand(i)">
              mdi-chevron-down
            </v-icon>
          </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content color="white">
        <slot :name="'panelBody' + i" />
      </v-expansion-panel-content>
      <v-divider v-if="hasDividers" />
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import MewSwitch from '@/components/MewSwitch/MewSwitch.vue';
import Tooltip from '@/components/InfoTooltip/InfoTooltip.vue';

export default {
  components: {
    'mew-switch': MewSwitch,
    'tooltip': Tooltip
  },
  data() {
    return {
      expandIdxArr: []
    }
  },   

  props: {
  /**
   * Applies a warning badge next to the header.
   */
  warningBadge: {
    type: Object,
    default: function() {
      return {color: '' , text: ''}
    }
  },
  /**
   * Applies a background color.
   */
  colorTheme: {
    type: String,
    default: 'white'
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
   * Accepts an array of panel objects, i.e [{ name: '', tooltip: '', subtext: '' }]
   */
    panelItems: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    isExpand(idx) {
      if (this.expandIdxArr.includes(idx)) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style lang="scss">
.mew-expand-panel {
  .v-expansion-panel  {
    border-radius: 12px;
    margin-bottom: 10px;
  }
  .v-expansion-panel-header,  .v-expansion-panel-content {
    border-radius: 12px;
  }
  .badge-type {
    border-radius: 4px;
    font-size: 11px !important;
  }
}
</style>