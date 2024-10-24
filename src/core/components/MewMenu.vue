<template>
  <!-- ===================================================================================== -->
  <!-- Mew Menu -->
  <!-- ===================================================================================== -->
  <v-menu
    v-model="isMenuOpen"
    open-on-hover
    min-width="220"
    content-class="mew-menu-content"
    offset-y
  >
    <template #activator="{ on }">
      <div
        :id="activatorId"
        ref="menuActivator"
        :class="[
          activatorTextColor,
          'cursor-pointer',
          isMenuOpen ? 'font-weight-medium' : ''
        ]"
        @mouseover="adjustTopArrowPosition"
        v-on="on"
      >
        {{ listObj.name }}
        <v-icon
          :class="['title', activatorTextColor, isMenuOpen ? 'opened' : '']"
          class="mew-menu--direction-arrow"
        >
          mdi-chevron-down
        </v-icon>
      </div>
    </template>

    <div class="content-container">
      <!-- ================================================================== -->
      <!-- Top arrow for content window -->
      <!-- ================================================================== -->
      <div v-if="topArrow" class="top-arrow" :style="topArrowStyle" />

      <!-- ===================================================================================== -->
      <!-- Menu List Content -->
      <!-- ===================================================================================== -->
      <div class="list-content">
        <v-list v-for="(item, index) in listObj.items" :key="index">
          <!-- ===================================================================================== -->
          <!-- slot: 'mewMenuItem' + menu item number -->
          <!-- ===================================================================================== -->
          <slot :name="'mewMenuItem' + (item + 1)" />
          <v-list-item v-if="item.title">
            <v-list-item-title class="basic--text mew-heading-3 titleItem">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(subItem, idx) in item.items"
            :key="subItem + idx"
            class="cursor-pointer"
            @click="goTo(subItem.to)"
          >
            <v-list-item-title
              class="mew-body basic--text subItem d-flex align-center"
            >
              <v-icon
                v-if="subItem.iconName"
                class="mr-1 basic--text"
                size="14px"
              >
                {{ subItem.iconName }}
              </v-icon>
              {{ subItem.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'MewMenu',
  props: {
    /**
     * Menu content. Accepts an object, i.e, { name: '', items: [{ title: '', items: [{ title: '' , iconName: ''}]}]}.
     * Name and title takes any string and iconName takes material icon name.
     * If you are using a slot then you just have to return the number of menu item categories you would like to have, i.e { name: '', items: 4 }.
     */
    listObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    topArrow: {
      type: Boolean,
      default: false
    },
    /**
     * Text color for activator title. Accepts a class.
     */
    activatorTextColor: {
      type: String,
      default: 'basic--text'
    }
  },
  data() {
    return {
      isMenuOpen: false,
      activatorId: '',
      topArrowStyle: ''
    };
  },
  computed: {
    activatorWidth() {
      return document.getElementById(this.activatorId).offsetWidth;
    }
  },
  beforeMount() {
    this.setActivatorId();
  },
  methods: {
    goTo(link) {
      this.$emit('goToPage', link);
    },
    setActivatorId() {
      this.activatorId = 'menu-' + Math.floor(Math.random() * 1000);
    },
    adjustTopArrowPosition() {
      this.topArrowStyle = `left: calc(${this.activatorWidth}px / 2)`;
    }
  }
};
</script>

<style lang="scss">
/**
  * Mew Menu
  */
.mew-menu-content {
  box-shadow: unset !important;
  padding: 12px 10px 10px 10px;
  margin-left: -10px;
  border: none !important;
  .content-container {
    position: relative;
  }
  .list-content {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 5px 5px -3px rgb(13 41 66 / 20%),
      0 8px 10px 1px rgb(13 41 66 / 14%), 0 3px 14px 2px rgb(13 41 66 / 12%);
  }
  // ======================================================================
  // top arrow
  // ======================================================================
  .top-arrow {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid white;
    position: absolute;
    z-index: 1000;
    top: -7px;
    left: 50%;
    pointer-events: none;
  }

  .v-list-item--link {
    border-top: 1px solid var(--v-selectHover-base);

    &:hover {
      background-color: var(--v-selectHover-base) !important;
    }
  }
  .v-list {
    border-radius: 0;

    .v-list-item {
      min-height: 30px;
    }
    .v-list-item--link {
      border-top: none;

      &:hover {
        background-color: var(--v-primary-base);
      }
    }
  }
  .v-list:first-of-type > .v-list-item:first-of-type {
    margin-top: 10px;
  }

  .v-list:last-of-type > .v-list-item:last-of-type {
    margin-bottom: 10px;
  }
}
.mew-menu--direction-arrow {
  transition: all 0.3s ease;
  &.opened {
    transform: rotate(180deg);
  }
}
</style>
