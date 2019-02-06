<template>
  <div :class="menuOpen ? 'open' : ''" class="mobile-language-selector">
    <div class="backdrop" @click="$emit('isopen', false)"></div>
    <div class="language-menu-content-container">
      <ul>
        <li v-for="lan in supportedLanguages" :key="lan.key">{{ lan.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      supportedLanguages: [
        // { name: 'Deutsch', flag: 'de', langCode: 'de_DL' },
        // { name: 'Ελληνικά', flag: 'gr', langCode: 'gr_GR' },
        { name: 'English', flag: 'en', langCode: 'en_US' },
        { name: 'Español', flag: 'es', langCode: 'es_ES' },
        // { name: 'Farsi', flag: 'ir', langCode: 'ir_IR' },
        // { name: 'Suomi', flag: 'fi', langCode: 'fi_FI' },
        // { name: 'Magyar', flag: 'hu', langCode: 'hu_HU' },
        // { name: 'Haitian Creole', flag: 'ht', langCode: 'ht_HT' },
        // { name: 'Bahasa Indonesia', flag: 'id', langCode: 'id_ID' },
        // { name: 'Italiano', flag: 'it', langCode: 'it_IT' },
        { name: '日本語', flag: 'ja', langCode: 'ja_JP' },
        { name: '한국어', flag: 'ko', langCode: 'ko_KR' },
        // { name: 'Nederlands', flag: 'nl', langCode: 'nl_NL' },
        // { name: 'Norsk Bokmål', flag: 'no', langCode: 'no_NO' },
        // { name: 'Polski', flag: 'pl', langCode: 'pl_PL' },
        // { name: 'Português', flag: 'pt', langCode: 'pt_PT' },
        { name: 'Русский', flag: 'ru', langCode: 'ru_RU' },
        // { name: 'ภาษาไทย', flag: 'th', langCode: 'th_TH' },
        // { name: 'Türkçe', flag: 'tr', langCode: 'tr_TR' },
        // { name: 'Tiếng Việt', flag: 'vn', langCode: 'vn_VN' },
        // { name: '简体中文', flag: 'zh-Hans', langCode: 'zh_CS' }
        { name: '繁體中文', flag: 'zh-Hant', langCode: 'zh_CN' }
      ],
      currentName: 'English',
      currentFlag: 'en',
      menuOpen: false
    };
  },
  computed: {},
  watch: {
    open(newVal) {
      this.menuOpen = newVal;
    }
  },
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MobileLanguageSelector.scss';
</style>
