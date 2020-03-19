<template>
  <div>
    <div class="ad-image-container">
      <iframe
        src="https://viewm.moonicorn.network/#%7B%22options%22%3A%7B%22publisherAddr%22%3A%220x6F0B465eC1B0d32fb3D7eCe31723677092Fb2e81%22%2C%22whitelistedTokens%22%3A%5B%220x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359%22%2C%220x6B175474E89094C44Da98b954EedeAC495271d0F%22%5D%2C%22whitelistedType%22%3A%22legacy_300x250%22%2C%22randomize%22%3Atrue%2C%22targeting%22%3A%5B%7B%22tag%22%3A%22cryptocurrency%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22crypto%20fintech%22%2C%22score%22%3A1%7D%2C%7B%22tag%22%3A%22blockchain%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22computers%20%26%20electronics%22%2C%22score%22%3A1%7D%5D%2C%22width%22%3A%22300%22%2C%22height%22%3A%22250%22%2C%22minPerImpression%22%3A%220%22%2C%22minTargetingScore%22%3A%220%22%2C%22fallbackUnit%22%3A%22QmUvECaaFuAHYePCSpGL7E1NHCrGTqkn7ZhsEyKvBMZkKG%22%2C%22marketSlot%22%3A%22QmYbwYbEi3symTT6ooG1CBSYx21JzdT7kViK54mdAJP8Yr%22%7D%7D"
        width="468"
        height="137"
        scrolling="no"
        frameborder="0"
        style="border: 0;"
        onload="window.addEventListener('message', function(ev) {
          console.log(ev); // todo remove dev item
		if (ev.data.hasOwnProperty('adexHeight') && ('https://viewm.moonicorn.network' === ev.origin)) {
			for (let f of document.getElementsByTagName('iframe')) {
				if (f.contentWindow === ev.source) {
					f.height = ev.data.adexHeight;
				}
			}
		}
	}, false)"
      ></iframe>
    </div>
  </div>

</template>

<script>
export default {
  components: {},
  props: {
    image: {
      type: String,
      default: 'mewconnect.png'
    },
    url: {
      type: String,
      default: 'https://mewconnect.myetherwallet.com/#/'
    }
  },
  data() {
    return {};
  },
  watch: {},
  methods: {
    useImage(name) {
      if (name === '') name = 'mewconnect.jpeg';
      // eslint-disable-next-line security/detect-non-literal-require
      return require(`@/assets/images/ads/${name}`);
    },
    useUrl(url) {
      if (url === '') url = 'https://mewconnect.myetherwallet.com/#/';
      return url;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AdEx';
</style>
