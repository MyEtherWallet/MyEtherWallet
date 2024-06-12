<template>
  <!--
  =====================================================================================
    Mew Alert
  =====================================================================================
  -->
  <v-alert
    class="mew-alert mb-0 bs-small"
    :class="[alertClasses, hideAlertIcon ? 'pl-7' : 'pl-4', 'py-3 pr-5']"
    colored-border
    :color="alertColor"
    border="left"
    :icon="alertIcon"
    dismissible
  >
    <!--
  =====================================================================================
   Title + Description + LinkObject
  =====================================================================================
  -->
    <div :class="[hideAlertIcon ? '' : 'pl-1']">
      <span v-if="title" class="mew-body font-weight-bold textDark--text">{{
        title
      }}</span>
      <div v-if="description" class="mew-body textDark--text">
        {{ description }}
        <a
          v-if="linkObject"
          target="_blank"
          class="textDark--text text-decoration-underline"
          :href="linkObject.url"
          >{{ linkObject.text }}</a
        >
      </div>
      <!--
  =====================================================================================
   slot: default (should be used if there is no text or description prop)
  =====================================================================================
  -->
      <slot />
    </div>
    <!--
  =====================================================================================
   Close Button 
   TODO: change this to mew-icon component after icon buttons are finalized.
  =====================================================================================
  -->
    <template #close="{ toggle }">
      <v-btn v-if="!hideCloseIcon" class="close-btn" icon @click="toggle">
        <v-icon :color="alertColor" size="16" class="pa-1"> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// props
const props = defineProps({
  theme: {
    type: String,
    default: 'info'
  },
  hasWhiteBackground: {
    type: Boolean,
    default: false
  },
  hideAlertIcon: {
    type: Boolean,
    default: false
  },
  hideCloseIcon: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  linkObject: {
    type: Object,
    default: () => {}
  }
});

// data
const themes = {
  error: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info'
};

// computed
const isErrorTheme = computed(() => props.theme.toLowerCase() === themes.error);
const isInfoTheme = computed(() => props.theme.toLowerCase() === themes.info);
const isWarningTheme = computed(
  () => props.theme.toLowerCase() === themes.warning
);
const isSuccessTheme = computed(
  () => props.theme.toLowerCase() === themes.success
);
const alertColor = computed(() => {
  if (isWarningTheme.value) {
    return 'orangePrimary';
  }
  if (isInfoTheme.value) {
    return 'bluePrimary';
  }
  if (isErrorTheme.value) {
    return 'redPrimary';
  }
  if (isSuccessTheme.value) {
    return 'greenPrimary';
  }
  return props.theme;
});
const alertIcon = computed(() => {
  if (props.hideAlertIcon) {
    return null;
  }
  if (isWarningTheme.value) {
    return 'mdi-alert';
  }
  if (isInfoTheme.value) {
    return 'mdi-information';
  }
  if (isErrorTheme.value) {
    return 'mdi-close-circle';
  }
  return 'mdi-checkbox-marked-circle';
});
const alertClasses = computed(() => {
  const classes = [];
  if (props.hasWhiteBackground) {
    classes.push('white');
  }
  if (isWarningTheme.value) {
    classes.push('orangeLight');
  }
  if (isInfoTheme.value) {
    classes.push('blueLight');
  }
  if (isErrorTheme.value) {
    classes.push('redLight');
  }
  if (isSuccessTheme.value) {
    classes.push('greenLight');
  }
  return classes;
});
</script>

<style lang="scss" scoped>
/**
  * MEW ALERT STYLES
  */
.mew-alert {
  border-radius: 8px;
  .close-btn {
    height: auto;
    width: auto;
  }
}
</style>
