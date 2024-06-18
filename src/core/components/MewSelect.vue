<template>
  <!-- ===================================================================================== -->
  <!-- Mew Select -->
  <!-- ===================================================================================== -->
  <v-select
    v-model="selectModel"
    class="mew-select rounded-lg"
    color="primary"
    append-icon="mdi-chevron-down"
    :items="selectItems"
    item-text="name"
    item-value="value"
    :label="label"
    :hide-selected="loading"
    :disabled="disabled"
    :error-messages="errorMessages"
    return-object
    :menu-props="{ bottom: true, offsetY: true, maxHeight: '419px' }"
    outlined
    @click="onClick"
  >
    <!-- ===================================================================================== -->
    <!-- Mew select: Error Messages -->
    <!-- ===================================================================================== -->
    <template #message="item">
      <span class="mew-label">
        {{ item.message }}
        <a
          v-if="buyMoreStr"
          rel="noopener noreferrer"
          class="mew-label"
          @click="emitBuyMore"
        >
          {{ buyMoreStr }}
        </a>
      </span>
    </template>

    <!-- ===================================================================================== -->
    <!-- Filter for dropdown items -->
    <!-- ===================================================================================== -->
    <template #prepend-item>
      <v-text-field
        v-if="hasFilter || isCustom"
        ref="filterTextField"
        v-model="search"
        height="35"
        class="px-2 mew-select-search d-flex align-center"
        color="disabled"
        :placeholder="filterPlaceholder"
        flat
        solo
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
      />
    </template>
    <template #selection="{ item }">
      <!-- ===================================================================================== -->
      <!-- Select Token Placeholder -->
      <!-- ===================================================================================== -->
      <div
        v-if="item.selectLabel"
        class="d-flex align-center flex-row justify-space-between full-width basic--text"
      >
        <span>{{ item.text }}</span>
        <v-skeleton-loader
          v-if="loading"
          class="no-pointer-events"
          type="chip"
        />
        <div
          v-if="!loading && item.imgs && !normalDropdown"
          class="flex-row d-flex align-center"
        >
          <mew-token-container
            v-for="(url, idx) in item.imgs"
            :key="url + idx"
            class="label-token-img"
            :loading="loading"
            :img="url"
            size="small"
          />
          <div
            class="total-token-placeholder inputBorder d-flex align-center justify-center mew-caption"
          >
            <span class="textSecondary--text">+{{ item.total }}</span>
          </div>
        </div>
      </div>

      <!-- ===================================================================================== -->
      <!-- Selected item -->
      <!-- ===================================================================================== -->
      <div v-if="!item.selectLabel" class="d-flex align-center justify-center">
        <mew-token-container
          v-if="!normalDropdown"
          class="ml-1 flex-shrink-0"
          :loading="loading"
          :img="item.img"
          :name="item.name || item"
          size="small"
        />
        <span
          :class="noCapitalize ? '' : 'text-capitalize'"
          class="mt-1 ml-2 basic--text"
          >{{ item.name ? item.name : item }}
          <span
            v-if="item.subtext"
            :class="noCapitalize ? '' : 'text-capitalize'"
            class="searchText--text"
            >- {{ item.subtext }}</span
          ></span
        >
      </div>
    </template>
    <template #item="data">
      <!-- ===================================================================================== -->
      <!-- Loading Select Dropdown items -->
      <!-- ===================================================================================== -->
      <v-skeleton-loader
        v-if="loading"
        class="no-pointer-events mew-select-loading"
        min-width="100%"
        type="list-item-avatar"
      />

      <!-- ===================================================================================== -->
      <!-- Default Select Dropdown items -->
      <!-- ===================================================================================== -->
      <div
        v-if="!isCustom && !loading"
        class="d-flex align-center justify-center"
      >
        <span :class="noCapitalize ? '' : 'text-capitalize'" class="ml-2 mt-1"
          >{{ data.item.name ? data.item.name : data.item }}
          <span
            v-if="data.item.subtext"
            :class="noCapitalize ? '' : 'text-capitalize'"
            class="textSecondary--text"
            >- {{ data.item.subtext }}</span
          ></span
        >
      </div>

      <!-- ===================================================================================== -->
      <!-- Custom Select Dropdown items -->
      <!-- ===================================================================================== -->
      <div v-if="isCustom && !loading" class="d-flex align-center full-width">
        <!-- ===================================================================================== -->
        <!-- Empty Wallet Link -->
        <!-- ===================================================================================== -->
        <div
          v-if="data.item.hasNoEth"
          class="no-pointer-events titlePrimary--text"
        >
          {{ data.item.text }}
          <a
            class="all-pointer-events"
            target="_blank"
            :href="data.item.link"
            >{{ data.item.linkText }}</a
          >
        </div>

        <!-- ===================================================================================== -->
        <!-- Custom Dropdown Item -->
        <!-- ===================================================================================== -->
        <div
          v-if="data.item.name"
          class="d-flex align-center justify-space-between full-width"
        >
          <div v-if="!loading" class="d-flex align-center">
            <mew-token-container
              v-if="!normalDropdown"
              class="mr-1"
              :loading="loading"
              :img="!data.item.img ? null : data.item.img"
              :name="data.item.name"
              size="small"
            />
            <span
              :class="noCapitalize ? '' : 'text-capitalize'"
              class="ml-2 my-2 d-flex flex-column"
              >{{ data.item.symbol || data.item.name || data.item }}
              <span
                v-if="data.item.tokenBalance || data.item.subtext"
                :class="noCapitalize ? '' : 'text-capitalize'"
                class="mew-caption font-weight-regular textSecondary--text"
                >{{
                  data.item.tokenBalance
                    ? data.item.tokenBalance + ' ' + data.item.symbol
                    : data.item.subtext
                }}</span
              ></span
            >
          </div>
          <div class="d-flex justify-center flex-column align-end">
            <span>{{ data.item.totalBalance || data.item.price }}</span>
            <span
              v-if="data.item.totalBalance"
              class="mew-caption font-weight-regular textSecondary--text"
              >@ {{ data.item.price }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </v-select>
</template>
<script setup>
import get from 'lodash/get';

import MewTokenContainer from './MewTokenContainer.vue';
import { computed, onMounted, ref, watch } from 'vue';

// emits
const emits = defineEmits(['input', 'buyMore']);

// props
const props = defineProps({
  /**
   * Adds a "Buy more" string to the end of the first index of the errorMessages prop.
   */
  buyMoreStr: {
    type: String,
    default: ''
  },
  /**
   * Error messages to display
   */
  errorMessages: {
    type: [String, Array],
    default: ''
  },
  /**
   * Adds filter to select items
   */
  hasFilter: {
    type: Boolean,
    default: true //  change to false
  },
  /**
   * Filter placeholder
   */
  filterPlaceholder: {
    type: String,
    default: 'Search token name'
  },
  /**
   * MEW select value
   */
  value: {
    type: Object,
    default: () => {
      return {};
    }
  },
  /**
   * Disables the select dropdown.
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Can be an array of objects or array of strings. When using objects, will look for a text and value field.
   * Can also add an img attribute to the object to append an img to the value.
   * Also takes in header objs and a select token label obj, i.e. {text: 'Select Token', imgs: [], total: '', selectLabel: true, divider: true}
   * Please check customItems for more info
   * Example: { name: "Eth", subtext: "Ethereum", value: "Ethereum", img: ethIcon }
   */
  items: {
    type: Array,
    default: () => {
      return [];
    }
  },
  /**
   * Sets the select label
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Applies Custom Select styles
   */
  isCustom: {
    type: Boolean,
    default: false
  },
  /**
   * Loading state
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * Normal dropdown with no icon
   */
  normalDropdown: {
    type: Boolean,
    default: false
  },
  /**
   * Remove Capitalize style from all forms
   */
  noCapitalize: {
    type: Boolean,
    default: false
  }
});

// data
const selectModel = ref(null);
const selectItems = ref([]);
const search = ref('');
const filterTextField = ref(null);

// computed
const defaultItem = computed(() => {
  return props.items.value.find(obj => {
    return obj.selectLabel || obj.name;
  });
});

// watch
watch(
  () => props.search,
  newVal => {
    const dropdown = document.querySelector('div.menuable__content__active');
    if (dropdown) {
      dropdown.scroll(0, 0);
    }
    if (newVal === '' || newVal === null) {
      selectItems.value = props.items;
    } else {
      const foundItems = props.items.reduce((foundTokens, item) => {
        const searchValue = String(newVal).toLowerCase();
        const value = String(get(item, 'value', '')).toLowerCase();
        const name = String(get(item, 'name', '')).toLowerCase();
        const subtext = String(get(item, 'subtext', '')).toLowerCase();
        if (
          name === searchValue ||
          subtext === searchValue ||
          value === searchValue
        ) {
          foundTokens.unshift(item);
        } else if (
          name.includes(searchValue) ||
          subtext.includes(searchValue) ||
          value.includes(searchValue)
        ) {
          foundTokens.push(item);
        }
        return foundTokens;
      }, []);
      selectItems.value = foundItems;
    }
  }
);

watch(
  () => props.selectModel,
  newVal => {
    setTimeout(() => {
      search.value = '';
    }, 1000);
    emits('input', newVal);
  }
);

watch(
  () => props.value,
  newVal => {
    selectModel.value =
      newVal && Object.keys(newVal).length !== 0 ? newVal : defaultItem.value;
  }
);

watch(
  () => props.loading,
  () => {
    if (!props.loading) {
      togglePointerEventStyle();
      selectModel.value =
        props.value && Object.keys(props.value).length !== 0
          ? props.value
          : defaultItem.value;
    }
  }
);

watch(
  () => props.items,
  newVal => {
    selectItems.value = newVal;
    selectModel.value =
      props.value && Object.keys(props.value).length !== 0
        ? props.value
        : defaultItem.value;
  },
  { deep: true }
);

// mounted
onMounted(() => {
  selectItems.value = props.items;
  selectModel.value =
    props.value && Object.keys(props.value).length !== 0
      ? props.value
      : defaultItem.value;
});

// methods
const emitBuyMore = () => {
  emits('buyMore');
};

const togglePointerEventStyle = () => {
  const elems = document.querySelectorAll('div.v-list-item--link');
  if (elems) {
    const pointerEventStyle = props.loading ? 'none' : 'all';
    for (let i = 0; i < elems.length; i++) {
      elems[i].style.pointerEvents = pointerEventStyle;
    }
  }
};

const onClick = () => {
  if (!props.hasFilter && !props.isCustom) {
    return;
  }
  setTimeout(() => {
    togglePointerEventStyle();
    if (filterTextField.value) {
      filterTextField.value.input.focus();
    }
  }, 100);
};
</script>

<style lang="scss">
/**
  * Mew Select styles
  */
.mew-select {
  height: 62px;
  .mdi-chevron-down {
    color: var(--v-titlePrimary-base);
    cursor: pointer;
    font-size: 20px;
  }
  .label-token-img {
    margin-right: -13px;
  }
  .total-token-placeholder {
    border-radius: 50%;
    font-size: 8px;
    height: 24px;
    width: 24px;
  }
  &.v-text-field--enclosed .v-input__append-inner {
    height: 100%;
    margin-top: 0;

    .v-input__icon {
      height: 100%;
    }
  }
  /**
  * Readonly input is not being used (since we are using our own ui via slots) and is taking up unnecessary space
  * so will hide for now
  */
  .v-select__selections {
    input {
      display: none;
    }
  }
}
/**
  * Mew Select Search
  */
.mew-select-search {
  background: var(--v-inputPrimary-base);
  border-bottom: 1px solid var(--v-dropdownBorder-base);
  border-radius: 0px;
  height: 42px;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 9999;
  .v-icon {
    color: var(--v-textMedium-base) !important;
    font-size: 18px;
  }
  .disabled--text {
    color: var(--v-textMedium-base) !important;
  }
}
/**
  * Mew Select Loading
  */
.mew-select-loading {
  .v-skeleton-loader__list-item-avatar {
    .v-skeleton-loader__avatar {
      height: 22px;
      width: 22px;
    }
    .v-skeleton-loader__text {
      height: 14px;
    }
  }
}
.v-select-list.theme--dark {
  background-color: var(--v-inputPrimary-base) !important;
  .v-input__slot {
    background-color: var(--v-inputPrimary-base) !important;
  }
  .v-list-item {
    border-bottom: 0 !important;
  }
}
.v-subheader.theme--dark {
  background-color: var(--v-inputPrimary-base) !important;
  border: 0 !important;
}
</style>
