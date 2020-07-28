<template>
  <div>
    <HeaderDesktop />
    <HeaderMobile />
  </div>
</template>

<script>
import HeaderDesktop from './components/HeaderDesktop';
import HeaderMobile from './components/HeaderMobile';

export default {
  name: 'HeaderContainer',
  components: {
    HeaderDesktop,
    HeaderMobile
  }
};
</script>

<style lang="scss" scoped></style>
