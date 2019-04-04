<template>
  <div class="hardware-layout">
    <div class="hardware-container">
      <div class="hardware-text">
        <h2>Buy a Hardware wallet</h2>
        <p>
          Purchase a hardware wallet for the highest security when accessing
          your crypto.
        </p>
      </div>
      <div class="hardware-items-container">
        <div v-for="item in items" :key="item.name" class="hardware-item">
          <div class="hardware-item-text">
            <p class="starting-from">Starting From</p>
            <div class="price-container">
              <p>
                <span>{{ item.currency }}</span>
                {{ item.price }}
              </p>
            </div>
            <p class="item-description">
              {{ item.description }}
            </p>
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              See More >
            </a>
          </div>
          <div class="hardware-item-logo">
            <img
              :src="require(`@/assets/images/affiliates/${item.name}.jpg`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          name: 'ledger',
          price: '59.00',
          description:
            'A light, yet solid multicurrency hardware wallet for cryptocurrencies. It is easy to carry everywhere thanks to its USB format.',
          link: 'https://www.ledger.com?r=fa4b',
          currency: '$'
        },
        {
          name: 'finney',
          price: '999.00',
          description: 'Uncompromised Security In a Blockchain Smartphone',
          link:
            'http://shop.sirinlabs.com?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf',
          currency: '$'
        },
        {
          name: 'bitbox',
          price: '59.00',
          description:
            'Our aim is to equip you for independence, with ease, in the digital world.',
          link: 'https://digitalbitbox.com/?ref=mew',
          currency: '€'
        },
        {
          name: 'trezor',
          price: '83.49',
          description:
            'The most trusted hardware wallet in the world. Get yours today!',
          link: 'https://trezor.io/?offer_id=12&aff_id=2029',
          currency: '€'
        },
        {
          name: 'secalot',
          price: '50.00',
          description:
            'Your all-in-one digital security companion. it is a small USB dongle that packs a wide range of features.',
          link: 'https://www.secalot.com/',
          currency: '$'
        },
        {
          name: 'keepkey',
          price: '79.00',
          description:
            'Protect your cryptocurrencies, store your private keys offline, and safeguard your assets from hackers.',
          link: 'http://keepkey.go2cloud.org/aff_c?offer_id=1&aff_id=5561',
          currency: '$'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'HardwaresLayout.scss';
</style>
