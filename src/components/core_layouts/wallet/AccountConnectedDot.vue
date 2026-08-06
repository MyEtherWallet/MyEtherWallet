<template>
  <!-- Connected-account indicator (Figma "Connected indicator"): a 6px dot
       centered in a 12px slot so it aligns with the 12px watch-only eye icon.
       Shared by the header pill, the active card, and saved-address rows. -->
  <span
    class="w-3 h-3 flex items-center justify-center flex-shrink-0"
    aria-hidden="true"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-[#05c0a5]" />
  </span>
</template>
