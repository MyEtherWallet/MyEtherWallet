<template>
  <div v-if="show" class="px-8 py-4 gdpr-banner">
    <v-row no-gutters>
      <v-col cols="12" lg="9" class="text-style">
        We use cookies and similar technologies to enhance your experience,
        analyze site usage, and support our operations. By continuing to use our
        site, you agree to our use of cookies and our data processing practices
        as detailed in our Privacy and Cookie Policy. You can choose to decline
        or withdraw your consent at any time. For more information see our
        <a href="https://www.myetherwallet.com/privacy-policy" target="_blank"
          >Privacy Policy</a
        >.
      </v-col>
      <v-col
        cols="12"
        lg="3"
        class="d-flex align-center justify-center justify-md-space-around pt-10 pt-lg-0"
      >
        <v-btn
          class="reject-button mr-3"
          large
          outlined
          @click.stop="handleReject"
        >
          Reject
        </v-btn>
        <v-btn class="accept-button" large @click.stop="handleAccept">
          Accept</v-btn
        >
      </v-col>
    </v-row>
    <a class="close-icon" href="#" @click.stop="() => handleReject()">
      <v-icon>mdi-close</v-icon>
    </a>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import isEU from '@/core/helpers/isEU.js';
import { usePopupStore } from '@/core/store/popups';

// injections/use
const { shownChoiceEU, setShownEu, setTrackingConsent } = usePopupStore();

// data
const show = ref(false);

// mounted
onMounted(() => {
  checkToShow();
});

// methods
const checkToShow = async () => {
  const isFromEU = await isEU();
  show.value = !shownChoiceEU && isFromEU;
};

const handleReject = () => {
  setShownEu();
  setTrackingConsent(false);
};
const handleAccept = () => {
  setShownEu();
  setTrackingConsent(true);
};
</script>

<style lang="less" scoped>
.close-icon {
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;

  i.v-icon.v-icon {
    color: black !important;
  }
}

.gdpr-banner {
  background-color: white;
  position: fixed !important;
  bottom: 0 !important;
  z-index: 500;
}
.text-style {
  font-size: 16px;
  line-height: 25px;

  a {
    text-decoration: none;
  }
}
.reject-button {
  border: 1px solid #2962ff;
  color: #2962ff;
}
.accept-button {
  background: #2962ff !important;
  color: white;
}
</style>
