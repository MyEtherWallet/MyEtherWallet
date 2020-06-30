<template>
  <v-menu
    v-model="isMenuOpen"
    open-on-hover
    :content-class="getContentClasses()"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <span
        :class="[textColor, styleClasses, 'cursor-pointer', isMenuOpen ? 'font-weight-medium' : '']"
        v-on="on"
      >
        {{ listObj.name }}
        <v-icon
          v-if="!isMenuOpen"
          :class="['title', textColor]"
        >mdi-chevron-down</v-icon>
        <v-icon
          v-if="isMenuOpen"
          :class="['title', textColor]"
        >mdi-chevron-up</v-icon>
      </span>
    </template>
    <v-list
      class="pa-0"
      v-for="(item, index) in listObj.items"
      :key="index"
    >
      <v-list-item
        @click="goTo(item.to)"
        class="cursor-pointer"
      >
        <v-list-item-title class="mew-body basic--text">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'MewMenu',
  data() {
    return {
      isMenuOpen: false
    }
  },
  props: {
    /**
     * Applies a white top arrow, Only works with a colored background.
     */
    // hasTopArrow: {
    //   type: Boolean,
    //   default: false
    // },
    /**
     * Menu content.
     */
    listObj: {
      type: Object,
      default: function() {
        return {};
      }
    },
    /**
     * Text color. Accepts a class. 
     */
    textColor: {
      type: String,
      default: 'basic--text'
    },
    /**
     * Classes to style the content
     */
    styleClasses: {
      type: String,
      default: ''
    }
  },
  methods: {
    getContentClasses() {
      let classes = 'mew-menu-content elevation-2 '
      // this.hasTopArrow  ? classes += 'menu-content-arrow' : '';
      return classes;
    },
    goTo(link) {
      this.$emit('goToPage', link);
    }
  }
}
</script>

<style lang="scss">
.mew-menu-content {
  border: none !important;
  // &.menu-content-arrow {
  //   overflow: visible;
  //   margin-top: 25px;
  //   contain: initial;
  //   &:before {
  //     border-left: 7px solid transparent;
  //     border-right: 7px solid transparent;
  //     border-bottom: 7px solid var(--v-white-base);
  //     content: "";
  //     left: 0;
  //     right: 0;
  //     margin: 0 auto;
  //     position: absolute;
  //     top: 0;
  //     transform: translateY(-100%);
  //     width: 1px;
  //     z-index: 20;
  //   }
  // }

  .v-list {
    border-radius: 0;
  }

  .v-list-item--link {
    border-top: none;
    min-height: 35px;

    &:hover {
      background-color: var(--v-primary-base);
    }
  }

  .v-list:first-of-type > .v-list-item--link {
    padding-top: 15px;
  }

 .v-list:last-of-type > .v-list-item--link {
    padding-bottom: 15px;
  }

}
</style>