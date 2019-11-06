<template>
  <div>
    <FooterDesktop />
    <FooterMobile />
  </div>
</template>

<script>
import FooterDesktop from './components/FooterDesktop';
import FooterMobile from './components/FooterMobile';

export default {
  name: 'FooterContainer',
  components: {
    FooterDesktop,
    FooterMobile
  }
};
</script>

<style lang="scss" scoped></style>
