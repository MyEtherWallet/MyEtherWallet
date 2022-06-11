<template>
  <!--
  =====================================================================================
    Mew Menu
  =====================================================================================
  -->
  <v-menu
    v-model="isMenuOpen"
    open-on-hover
    min-width="200"
    :content-class="contentClasses"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <span
        :class="[
          activatorTextColor,
          'cursor-pointer',
          isMenuOpen ? 'font-weight-medium' : '',
        ]"
        v-on="on"
      >
        {{ listObj.name }}
        <v-icon
          v-if="!isMenuOpen"
          :class="['title', activatorTextColor]"
        >mdi-chevron-down</v-icon>
        <v-icon
          v-if="isMenuOpen"
          :class="['title', activatorTextColor]"
        >mdi-chevron-up</v-icon>
      </span>
    </template>
    <!--
  =====================================================================================
    Menu List Content
  =====================================================================================
  -->
    <v-list
      v-for="(item, index) in listObj.items"
      :key="index"
    >
      <!--
  =====================================================================================
   slot: 'mewMenuItem' + menu item number
  =====================================================================================
  -->
      <slot :name="'mewMenuItem' + (i + 1)" />
      <v-list-item v-if="item.title">
        <v-list-item-title class="basic--text mew-heading-3 titleItem">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-for="(subItem, idx) in item.items"
        :key="subItem + idx"
        @click="goTo(subItem.to)"
        class="cursor-pointer"
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
  </v-menu>
</template>

<script>
export default {
  name: 'MewMenu',
  data() {
    return {
      isMenuOpen: false,
    };
  },
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
      },
    },
    /**
     * Text color for activator title. Accepts a class.
     */
    activatorTextColor: {
      type: String,
      default: 'basic--text',
    },
  },
  computed: {
    contentClasses() {
      return 'mew-menu-content elevation-2 ';
    },
  },
  methods: {
    goTo(link) {
      this.$emit('goToPage', link);
    },
  },
};
</script>

<style lang="scss">
/**
  * Mew Menu
  */
.mew-menu-content {
  border: none !important;
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
</style>
