<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :has-elevation="true"
    :has-indicator="true"
    title="NFT Manager"
  >
    <template #moduleBody>
      <mew-tabs :items="items" is-vertical>
        <template
          v-for="(item, idx) in items"
          :slot="'tabItemContent' + (idx + 1)"
        >
          <div :key="idx">
            <v-card
              v-for="(kitty, key) in CryptoKitties"
              :key="key"
              flat
              color="tableHeader"
              class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center">
                <img height="100" :src="kitty.image" alt="Crypto Kitty" />
                <div class="ml-5">#{{ kitty.number }}</div>
              </div>
              <mew-button
                :has-full-width="false"
                btn-style="outline"
                title="Send"
                btn-size="large"
              />
            </v-card>
          </div>
        </template>
      </mew-tabs>
    </template>
  </mew-module>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          name: 'CryptoKitties (3)'
        },
        {
          name: 'Gods Unchained (2)'
        },
        {
          name: 'CryptoFlowers (0)'
        },
        {
          name: 'MyCryptoHeros (1)'
        }
      ],

      CryptoKitties: [
        {
          image: require('@/assets/images/temp/cryptokitties1.svg'),
          number: '4534'
        },
        {
          image: require('@/assets/images/temp/cryptokitties2.svg'),
          number: '4537'
        },
        {
          image: require('@/assets/images/temp/cryptokitties3.svg'),
          number: '4589'
        }
      ]
    };
  }
};
</script>
