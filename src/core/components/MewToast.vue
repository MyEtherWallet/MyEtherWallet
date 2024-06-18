<template>
  <!--
=====================================================================================
  Mew Toast 
=====================================================================================
-->
  <v-bottom-sheet
    ref="toast"
    v-model="showsToast"
    :hide-overlay="true"
    :retain-focus="false"
    :persistent="persistent"
  >
    <v-sheet
      class="text-center"
      :tile="true"
      height="80"
      :color="toastType.toLowerCase() === toastTypes.info ? 'white' : toastType"
    >
      <v-container fill-height>
        <v-row
          :class="['font-weight-medium', getRowClasses()]"
          justify="center"
          align="center"
        >
          <div class="d-flex align-center">
            <v-icon
              v-if="toastTypes.info !== toastType.toLowerCase()"
              :color="
                toastTypes.warning === toastType.toLowerCase()
                  ? 'warning darken-1'
                  : 'white'
              "
            >
              {{ getIcon() }}
            </v-icon>
            {{ text }}
            <a :class="getLinkClasses()" @click="onClick"
              >{{ linkObj.title }}
            </a>
            <!--
=====================================================================================
  Slot: infoBtn (used to place custom ui in the toast body)
=====================================================================================
-->
            <slot name="infoBtn" />
          </div>
          <v-icon
            v-if="canClose"
            color="titlePrimary"
            class="close cursor-pointer"
            @click="close"
          >
            mdi-close
          </v-icon>
        </v-row>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// emits
const emits = defineEmits(['onClick', 'closed']);

// props
const props = defineProps(
  {
    /**
     * Toast types: success, warning, error.
     */
    toastType: {
      type: String,
      default: ''
    },
    /**
     * The duration of the toast. 0 is indefinite.
     */
    duration: {
      type: Number,
      default: 0
    },
    /**
     * The toast text.
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * Applies the link url to the end of the text. Takes title and url, i.e. {title: '', url: ''}
     */
    linkObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * Clicking outside of the element will not deactivate it.
     */
    persistent: {
      type: Boolean,
      default: false
    },
    /**
     * Clicking outside of the element will deactivate it.
     */
    canClose: {
      type: Boolean,
      default: false
    }
  },
  { emit: emits }
);

// data
const toastTypes = {
  warning: 'warning',
  error: 'error',
  success: 'success',
  info: 'info'
};
const showsToast = ref(false);

// watch
watch(
  () => props.toastType,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      showToast();
    }
  }
);

// mounted
onMounted(() => {
  setTimer();
});

// methods
const close = () => {
  showsToast.value = false;
};

const onClick = () => {
  props.linkObj.url !== '' && props.linkObj.url
    ? window.open(props.linkObj.url)
    : emits('onClick');
};

const showToast = () => {
  showsToast.value = true;
  setTimer();
};

const getLinkClasses = () => {
  if (
    toastTypes.warning === props.toastType.toLowerCase() ||
    toastTypes.info === props.toastType.toLowerCase()
  ) {
    return 'primary--text';
  }
  return 'white--text';
};

const getRowClasses = () => {
  if (
    toastTypes.warning === props.toastType.toLowerCase() ||
    toastTypes.info === props.toastType.toLowerCase()
  ) {
    return 'titlePrimary--text';
  }
  return 'white--text';
};

const getIcon = () => {
  const toastType = props.toastType.toLowerCase();
  if (toastType === toastTypes.warning) {
    return 'mdi-alert';
  } else if (toastType === toastTypes.success) {
    return 'mdi-check-circle';
  } else if (toastType === toastTypes.error) {
    return 'mdi-close-circle';
  }
};

const setTimer = () => {
  if (props.duration > 0 && showsToast.value === true && !props.persistent) {
    setTimeout(() => (showsToast.value = false), props.duration);
  }
};
</script>

<style lang="scss" scoped>
.close {
  font-size: 20px;
  position: absolute;
  right: 20px;
}
</style>
