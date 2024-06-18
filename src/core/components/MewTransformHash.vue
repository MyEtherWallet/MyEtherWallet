<template>
  <!--
  =====================================================================================
    Mew Transform Hash 
  =====================================================================================
  -->
  <div
    :class="[
      'd-flex hash-container mew-address',
      justifyStart ? 'justify-start' : 'justify-end'
    ]"
  >
    <span class="firstPart">{{ start }}</span
    ><span class="lastPart">{{ end }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// props
const props = defineProps({
  /**
   * Hash to truncate.
   */
  hash: {
    type: String,
    default: ''
  },
  /**
   * Adds justify start to parent div
   * instead of justify end
   */
  justifyStart: {
    type: Boolean,
    default: false
  }
});

// computed
const start = computed(() => {
  const n = props.hash.length;
  return props.hash.slice(0, n - 4);
});

const end = computed(() => {
  const n = props.hash.length;
  return props.hash.slice(n - 4, n);
});
</script>

<style lang="scss" scoped>
// Variables to control the truncation behaviour
$startFixedChars: 4; // Number of chars before ellipsis - have priority over end chars
$endFixedChars: 5; // Number of chars after ellipsis  - lower priority than start chars
$fontFaceScaleFactor: 0.5; // Magic number dependent on font face - set by trial and error

// Derived from the 3 variables above
$startWidth: 1em * $fontFaceScaleFactor * ($startFixedChars + 3);
$endWidth: 1em * $fontFaceScaleFactor * $endFixedChars;

.firstPart,
.lastPart {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
}
.firstPart {
  max-width: calc(100% - #{$endWidth});
  min-width: $startWidth;
  text-overflow: ellipsis;
}
.lastPart {
  max-width: calc(100% - #{$startWidth});
  direction: rtl;
}
.hash-container {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
}
</style>
