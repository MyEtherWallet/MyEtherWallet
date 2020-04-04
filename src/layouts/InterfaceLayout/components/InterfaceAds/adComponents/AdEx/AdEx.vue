<template>
  <div>
    <div class="ad-image-container">
      <div class="inner-adex" v-if="active">
        <iframe
          src="https://viewm.moonicorn.network/#%7B%22options%22%3A%7B%22publisherAddr%22%3A%220x6F0B465eC1B0d32fb3D7eCe31723677092Fb2e81%22%2C%22whitelistedTokens%22%3A%5B%220x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359%22%2C%220x6B175474E89094C44Da98b954EedeAC495271d0F%22%5D%2C%22whitelistedType%22%3A%22legacy_468x60%22%2C%22randomize%22%3Atrue%2C%22targeting%22%3A%5B%7B%22tag%22%3A%22blockchain%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22cryptocurrency%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22computer%20security%22%2C%22score%22%3A23%7D%2C%7B%22tag%22%3A%22crypto%20fintech%22%2C%22score%22%3A50%7D%5D%2C%22width%22%3A%22468%22%2C%22height%22%3A%2260%22%2C%22minPerImpression%22%3A%220%22%2C%22minTargetingScore%22%3A%220%22%2C%22fallbackUnit%22%3A%22QmdRTZy8taRkcERKVgu268y6wEKfyTmoHCKLDqnj6ZFij8%22%2C%22marketSlot%22%3A%22QmPNqgXMRqpKB7QEekBPJHRnDb5mrkWwXiVpb5PdgbjFWW%22%7D%7D"
          width="468"
          height="60"
          scrolling="no"
          frameborder="0"
          style="border: 0;"
          onload="window.addEventListener('message', function(ev) {
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
    return {
      active: process.env.NODE_ENV === 'production'
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'AdEx';
</style>
