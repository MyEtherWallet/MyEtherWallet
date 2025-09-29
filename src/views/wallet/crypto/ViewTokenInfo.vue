<template>
  <app-view-as-dialog containerClass="max-w-[900px] ">
    <template #title>
      <h2 class="text-lg font-medium">Token Information</h2>
    </template>
    <template #content>
      <div class="flex flex-col">
        <div
          class="flex items-center justify-end gap-3 mt-2 sm:mt-4 mb-2 mr-[60px]"
        >
          <!--TODO: add link-->
          <app-btn-icon label="Share">
            <share-icon class="h-5 w-5" />
          </app-btn-icon>
          <app-btn-icon label="Star">
            <star-solid-icon v-if="isWatchlisted" class="h-5 w-5" />
            <star-outline-icon v-else class="h-5 w-5" />
          </app-btn-icon>
        </div>
        <!-- Token logo, name, price, price change -->
        <div
          class="flex items-center gap-4 px-3 xs:px-6 md:px-4 md:px-4 lg:px-10"
        >
          <div class="relative">
            <app-token-logo
              :url="tokenData.logoUrl"
              :symbol="tokenData.symbol"
              width="w-10 xs:w-[56px]"
              height="h-10 xs:h-[56px]"
            />
            <app-token-logo
              v-if="selectedChain"
              :url="selectedChain.icon"
              :symbol="selectedChain.name"
              width="w-5"
              height="h-5"
              class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
            />
          </div>

          <div class="flex flex-col">
            <h1 class="text-s-20 xs:text-s-24 leading-p-110 font-bold">
              {{ tokenData.name }} ({{ tokenData.symbol.toUpperCase() }})
              <span
                class="text-s-17 hidden lg:inline-block font-medium uppercase text-info mr-1 tracking-sp-06"
              >
                on {{ selectedChain?.name }}
              </span>
            </h1>
            <div>
              <p class="text-s-20 xs:text-s-24 inline">
                ${{ formatFiatValue(tokenData.price).value }}
              </p>
              <div class="inline-block ml-2">
                <ArrowTrendingDownIcon
                  v-if="tokenData.priceChangePercentage24h < 0"
                  class="w-4 h-4 inline-block text-error"
                />
                <ArrowTrendingUpIcon
                  v-else
                  class="w-4 h-4 inline-block text-success"
                />
                <span
                  :class="[
                    {
                      'text-success': tokenData.priceChangePercentage24h >= 0,
                      'text-error': tokenData.priceChangePercentage24h < 0,
                    },
                    'ml-1 text-s-14 xs:text-s-17 ',
                  ]"
                >
                  {{ tokenData.priceChangePercentage24h.toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <p
          class="text-s-8 md:text-s-11 tracking-sp-06 lg:hidden font-bold uppercase text-info px-3 xs:px-6 ml-[58px] xs:ml-[74px] md:ml-[66px]"
        >
          on {{ selectedChain?.name }}
        </p>
        <hr class="h-px bg-grey-10 border-0 w-full my-3 xs:mt-5" />
        <!-- Chart and balance -->
        <div
          class="flex flex-col px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 gap-3 sm:gap-4"
        >
          <div class="w-full">
            <app-btn-group
              v-model:selected="selectedChartFilter"
              :btn-list="
                isXS ? chartFilterOptions.slice(0, 3) : chartFilterOptions
              "
              size="xs"
              class="ml-auto mb-1 sm:mb-3"
            >
              <template #btn-content="{ data }">
                {{ data.label }}
              </template>
              <template #custom>
                <app-select
                  v-if="isXS"
                  v-model:selected="selectedChartFilter"
                  :options="
                    chartFilterOptions.slice(3, chartFilterOptions.length)
                  "
                  position="-right-1"
                  class="text-s-12"
                >
                  <template #select-button="{ toggleSelect }">
                    <button
                      class="rounded-full hoverNoBG p-2 h-6 min-w-[46px] !text-s-12 flex items-center"
                      @click="toggleSelect"
                    >
                      <p>More</p>
                      <chevron-down-icon class="w-4 h-4 ml-1" />
                    </button>
                  </template>
                </app-select>
              </template>
            </app-btn-group>
            <div
              class="w-full bg-surface h-[200px] sm:h-[320px] rounded-lg"
            ></div>
            <!-- Balance -->
            <div class="flex flex-wrap items-center mt-2 sm:mt-5">
              <h2
                class="basis-full xs:basis-auto font-bold text-s-17 xs:text-s-24"
              >
                Your Balance:
              </h2>
              <div class="flex mt-1 items-center">
                <div class="relative xs:ml-4">
                  <app-token-logo
                    :url="tokenData.logoUrl"
                    :symbol="tokenData.symbol"
                    width=" w-9 xs:w-[28px]"
                    height="h-9 xs:h-[28px]"
                  />
                  <app-token-logo
                    v-if="selectedChain"
                    :url="selectedChain.icon"
                    :symbol="selectedChain.name"
                    width="w-3"
                    height="h-3"
                    class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
                  />
                </div>
                <div
                  class="flex flex-col xs:flex-row xs:items-center ml-3 xs:ml-2"
                >
                  <p class="text-s-17 xs:text-s-24 font-bold leading-p-110">
                    {{ formatFloatingPointValue(tokenData.balance).value }}
                    {{ tokenData.symbol.toUpperCase() }}
                  </p>
                  <p
                    class="xs:ml-2 font-medium text-s-14 xs:text-s-24 text-info"
                  >
                    ${{ formatFiatValue(tokenData.balance).value }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="h-px bg-grey-10 border-0 w-full my-5" />
        <!-- Balance on other chains -->
        <div class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10">
          <h3 class="text-s-20 font-bold mb-1">
            {{ tokenData.symbol.toUpperCase() }} balance on other chains:
          </h3>
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-start py-2 xs:max-w-[250px]"
          >
            <div class="relative mr-4">
              <app-token-logo
                :url="tokenData.logoUrl"
                :symbol="tokenData.symbol"
                width="w-[24px]"
                height="h-[24px]"
              />
              <app-token-logo
                v-if="selectedChain"
                :url="selectedChain.icon"
                :symbol="selectedChain.name"
                width="w-3"
                height="h-3"
                class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
              />
            </div>
            <div>
              <p class="text-s-16 font-medium">
                0.345 {{ tokenData.symbol.toUpperCase() }}
              </p>
              <p class="text-info text-s-12 leading-p-110">on Ethereum</p>
            </div>
            <p class="text-right ml-auto text-info text-s-14 leading-p-110">
              ${{ formatFiatValue(35.67).value }}
            </p>
          </div>
        </div>
        <hr class="h-px bg-grey-10 border-0 w-full my-5" />
        <!-- Market Data -->
        <div
          class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 grid grid-cols-2 xs:grid-cols-3 gap-4 max-w-[700px]"
        >
          <div
            v-for="(item, index) in marketData"
            :key="index"
            class="flex flex-col py-2"
          >
            <p class="text-s-14 text-info mb-1">{{ item.label }}</p>
            <p class="text-s-16 font-medium">{{ item.value }}</p>
          </div>
        </div>
        <hr class="h-px bg-grey-10 border-0 w-full my-5" />
        <!-- About -->
        <div class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10">
          <h3 class="text-s-20 font-bold mb-2">About {{ tokenData.name }}</h3>
          <p class="text-s-14 text-info max-w-[700px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr class="h-px bg-grey-10 border-0 w-full my-5" />
        <!-- Supported Chains -->
        <div class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 mb-5">
          <h3 class="text-s-20 font-bold mb-2">Supported Chains</h3>
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-start py-2 max-w-[250px]"
          >
            <div class="relative mr-4">
              <app-blockie
                address="0x300D2f8ECBe670a0ECb8a418598dC914E0dD91cE"
                :scale="8"
                class=""
              />
              <app-token-logo
                v-if="selectedChain"
                :url="selectedChain.icon"
                :symbol="selectedChain.name"
                width="w-4"
                height="h-4"
                class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
              />
            </div>
            <div>
              <p class="text-s-16 font-medium leading-p-100">Ethereum (ETH)</p>
              <div class="flex items-center gap-[2px]">
                <p class="text-info text-s-12 leading-p-110 truncate">
                  {{
                    truncateAddress(
                      '0x300D2f8ECBe670a0ECb8a418598dC914E0dD91cE',
                      16,
                    )
                  }}
                </p>
                <app-btn-copy
                  text="0x300D2f8ECBe670a0ECb8a418598dC914E0dD91cE"
                  class="ml-2"
                  width="w-7"
                  height="h-7"
                  icon-class="w-4 h-4"
                />
                <app-btn-icon label="View on Explorer" width="w-7" height="h-7">
                  <ArrowUturnRightIcon class="w-4 h-4" />
                </app-btn-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </app-view-as-dialog>
</template>

<script setup lang="ts">
import AppViewAsDialog from '@/components/AppViewAsDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import { ShareIcon, StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import {
  StarIcon as StarOutlineIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  ArrowUturnRightIcon,
} from '@heroicons/vue/24/outline'
import { computed, ref, onMounted } from 'vue'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSelect from '@/components/AppSelect.vue'
import { truncateAddress } from '@/utils/filters'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

defineProps({
  networkId: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
})

const { isXS, isMDAndUp } = useAppBreakpoints()

/** --------------------
 * Wallet Menu Buttons
 --------------------*/
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

onMounted(() => {
  if (!isMDAndUp.value && isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(false)
  }
})
/** --------------------
 * Chart Filter
 --------------------*/
interface Item {
  label: string
  value: string
}
const chartFilterOptions = ref<Item[]>([
  { label: '1h', value: '1h' },
  { label: '7d', value: '7d' },
  { label: '1m', value: '1m' },
  { label: '3m', value: '3m' },
  { label: '1y', value: '1y' },
  { label: 'all', value: 'all' },
])

const selectedChartFilter = ref(chartFilterOptions.value[0])

/** --------------------
 * Market Data
 --------------------*/

const marketData = computed<Item[]>(() => {
  return [
    {
      label: 'Market Cap',
      value: `$${formatFiatValue(tokenData.value.marketCap).value}`,
    },
    { label: 'Max Supply', value: '$21,000,000' },
    {
      label: 'Total Volume',
      value: `$${formatFiatValue(tokenData.value.totalVolume).value}`,
    },
    { label: 'Circulating Supply', value: '$19,244,662 ' },
    { label: '24h Trading Volume', value: '$48,242,324' },
    {
      label: 'Fully Diluted Valuation',
      value: `$${formatFiatValue(tokenData.value.marketCap).value}`,
    },
    { label: '24h High', value: `$120,234.42` },
    { label: '24h Low', value: `$110,343,234.12` },
  ]
})

/**
 * CHART FILTER
 */

/**
 * TEMP DATA FOR UI
 */
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const tokenData = ref({
  balance: 1.2345,
  balanceInFiat: 1234.56,
  coinId: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  price: 117344,
  priceChangePercentage1h: -0.1973938102015114,
  priceChangePercentage24h: 1.13026,
  priceChangePercentage7d: 2.571203116739959,
  marketCap: 2339230573449,
  addresses: {},
  logoUrl:
    'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  totalVolume: 46494511169,
  sparklineIn7d: [
    114546.6290692586, 114309.82612735903, 114435.8890920037,
    114402.34864966485, 114531.97774766892, 115251.54504573994,
    115503.16663193036, 116083.02684089626, 115541.43745371678,
    115321.70299565145, 115198.04689576305, 115430.88537282546,
    115656.41297780728, 115339.65347651657, 115143.92060273138,
    115090.51727175506, 114977.79702489631, 114970.87662702953,
    114944.79334030187, 115175.7456241166, 115182.63512744215,
    115285.82631433172, 115142.91591236314, 115501.53307003953,
    115870.54337234636, 116488.13043144876, 116704.71486571954,
    116206.13807664244, 115951.31496911978, 116094.98634284323,
    116160.14344594491, 116299.90574103985, 115817.78761225037,
    115929.71072468456, 115987.13156450838, 115761.02619141128,
    115744.35387449336, 115790.53202643781, 115828.38046332698,
    116027.12405597334, 116073.3506135664, 116017.51962998649,
    116020.66710769299, 116060.83417133584, 115768.32118748053,
    115842.8482057885, 115784.10669515507, 115342.81410658239,
    115567.65641109124, 115688.73490201971, 115837.62867738264,
    115975.60665830794, 115902.80087265448, 115914.67697398618,
    115974.8873939637, 115972.63064708588, 116020.94225644319,
    115908.55482647114, 115771.51295218767, 115806.95820776705,
    115931.29222477932, 115782.5467124972, 115800.96862956286,
    115974.03122043426, 116143.86978301249, 116069.58488194742,
    115882.85033622767, 115816.94199120873, 115335.02449154813,
    115424.06207419037, 115264.81046966574, 115525.17752438669,
    115618.63633362162, 115440.71361146877, 115673.89884462305,
    115854.91350751821, 115965.65715814185, 116031.2706523723,
    115278.55251586219, 115079.57387944871, 115221.82820884661,
    115416.66833998004, 115501.3042235996, 116039.88908636587,
    116552.24107354402, 116168.09610340101, 115792.1934414128,
    114850.5440850557, 114911.21426941568, 114801.40925717361,
    115033.54381311937, 114744.92311789298, 114843.50523291624,
    114840.07931502667, 114798.22619184008, 114696.00606119882,
    114913.60325521955, 115354.79218701142, 115314.09587210546,
    115315.75715379852, 115507.66358734564, 115299.78030175949,
    115356.68489564986, 115085.03010859179, 115069.45354548478,
    115082.07756660205, 115398.77427960283, 115487.13956192977,
    115983.38149554328, 115753.79463886896, 115909.95804182389,
    115685.4644022894, 115485.19680005405, 115397.94847350479,
    115345.7791919205, 115432.89206598123, 115019.09578002297,
    115260.95453487385, 115918.68063027997, 116158.42752272532,
    116536.31650559162, 116454.5775062696, 116804.43867134045,
    116882.78170087388, 116776.27134667119, 116872.96755173472,
    116797.00205991932, 116629.3763135545, 116688.52098718812,
    116732.50964139415, 116423.14743464273, 116319.91427503152,
    117162.75477621086, 117256.58549060355, 117225.48665434263,
    116877.6478033946, 116606.4783652071, 116382.44528065142,
    116279.78693685924, 116198.55483548675, 116193.74724346046,
    115634.27808614414, 115894.70808566172, 115717.01610782724,
    116031.58519047528, 115194.3078037463, 115721.45993062394,
    115649.82358310322, 116214.03190192967, 116863.39240749434,
    116455.94648225319, 116381.22893627378, 116761.69147901927,
    116969.14904686039, 117742.98005985272, 117494.17334517208,
    117217.1473590896, 117081.79397034168, 117100.80353259912,
    117246.48259706644, 117330.37185111486, 117233.96564668287,
    117085.66810721309, 117189.92910452069, 117553.27644964374,
    117735.87157682037, 117676.42476236634, 117644.58180662621,
  ],
})
const isWatchlisted = ref(true)
</script>
