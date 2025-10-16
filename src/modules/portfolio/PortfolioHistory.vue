<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class="!px-4 !pt-3 !pb-1 overflow-hidden  w-full"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-end gap-1">
        <h2 class="text-s-20 font-bold">History</h2>
        <app-tooltip
          text="Aproximate values based on current token holdings."
        />
      </div>
      <div class="text-right">
        <p class="font-bold text-s-11 tracking-sp-06 uppercase leading-p-160">
          Last 24h
        </p>
        <p class="text-s-16 text-error leading-p-160 font-medium">
          -$123.65 (5.67%)
        </p>
      </div>
    </div>
    <history-chart :data="tempData" />
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import HistoryChart from './components/history/HistoryChart.vue'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const tempData = [
  {
    timestamp: 1759971762647,
    price: 123004.7073389183,
  },
  {
    timestamp: 1759975326494,
    price: 122445.95775755803,
  },
  {
    timestamp: 1759978950790,
    price: 121594.1766822819,
  },
  {
    timestamp: 1759982528959,
    price: 122040.70363956786,
  },
  {
    timestamp: 1759986111028,
    price: 122134.62739154362,
  },
  {
    timestamp: 1759989691836,
    price: 122119.51212540246,
  },
  {
    timestamp: 1759993224210,
    price: 121968.03924852247,
  },
  {
    timestamp: 1759996920205,
    price: 121985.73572091841,
  },
  {
    timestamp: 1760000538775,
    price: 121287.21846990881,
  },
  {
    timestamp: 1760004109073,
    price: 121808.64338495776,
  },
  {
    timestamp: 1760007650884,
    price: 122188.30027455505,
  },
  {
    timestamp: 1760011366943,
    price: 122799.10512899117,
  },
  {
    timestamp: 1760014919204,
    price: 123475.01328209444,
  },
  {
    timestamp: 1760018505525,
    price: 122786.938573978,
  },
  {
    timestamp: 1760022025755,
    price: 121363.29636580577,
  },
  {
    timestamp: 1760025691536,
    price: 121192.61184310442,
  },
  {
    timestamp: 1760029360749,
    price: 120322.04794974093,
  },
  {
    timestamp: 1760032945718,
    price: 120776.57159636542,
  },
  {
    timestamp: 1760036481306,
    price: 120721.00670276352,
  },
  {
    timestamp: 1760040077525,
    price: 121014.83772267938,
  },
  {
    timestamp: 1760043735068,
    price: 121176.1725746532,
  },
  {
    timestamp: 1760047319856,
    price: 121496.18411097584,
  },
  {
    timestamp: 1760050879861,
    price: 121740.81237186604,
  },
  {
    timestamp: 1760054521981,
    price: 121698.03066778315,
  },
  {
    timestamp: 1760058130256,
    price: 121820.11241777765,
  },
  {
    timestamp: 1760061683703,
    price: 121679.10760815437,
  },
  {
    timestamp: 1760065337314,
    price: 121061.73402443441,
  },
  {
    timestamp: 1760068825009,
    price: 121139.14938911727,
  },
  {
    timestamp: 1760072721906,
    price: 121225.53384747024,
  },
  {
    timestamp: 1760076136882,
    price: 121599.35874025906,
  },
  {
    timestamp: 1760079733371,
    price: 121414.4188711075,
  },
  {
    timestamp: 1760083315697,
    price: 121125.1481274346,
  },
  {
    timestamp: 1760086938251,
    price: 121500.35795851143,
  },
  {
    timestamp: 1760090428096,
    price: 121328.29141643904,
  },
  {
    timestamp: 1760094144044,
    price: 121549.06769184435,
  },
  {
    timestamp: 1760097712649,
    price: 121625.77040228223,
  },
  {
    timestamp: 1760101324894,
    price: 121581.9697775228,
  },
  {
    timestamp: 1760104932081,
    price: 121561.14703795656,
  },
  {
    timestamp: 1760108504830,
    price: 120477.61929978219,
  },
  {
    timestamp: 1760112378049,
    price: 118812.02216356724,
  },
  {
    timestamp: 1760115641544,
    price: 118315.94366728116,
  },
  {
    timestamp: 1760119239000,
    price: 117715.62522661283,
  },
  {
    timestamp: 1760122937248,
    price: 117315.44990657535,
  },
  {
    timestamp: 1760126544849,
    price: 116954.03031018036,
  },
  {
    timestamp: 1760130397650,
    price: 114758.36619100878,
  },
  {
    timestamp: 1760133710945,
    price: 113553.46205479014,
  },
  {
    timestamp: 1760137223537,
    price: 113879.7376683253,
  },
  {
    timestamp: 1760140840505,
    price: 113043.67586321975,
  },
  {
    timestamp: 1760144533888,
    price: 112645.11065304682,
  },
  {
    timestamp: 1760148435508,
    price: 111770.30703720753,
  },
  {
    timestamp: 1760151663833,
    price: 113306.38533153781,
  },
  {
    timestamp: 1760155433467,
    price: 112320.57533198694,
  },
  {
    timestamp: 1760158827638,
    price: 112862.1293162982,
  },
  {
    timestamp: 1760162567781,
    price: 112551.01870262809,
  },
  {
    timestamp: 1760166012394,
    price: 112189.09314108783,
  },
  {
    timestamp: 1760169702260,
    price: 110481.63913656214,
  },
  {
    timestamp: 1760173404648,
    price: 111418.13541739546,
  },
  {
    timestamp: 1760177069554,
    price: 111795.7765826011,
  },
  {
    timestamp: 1760180448924,
    price: 112234.4172422109,
  },
  {
    timestamp: 1760184096720,
    price: 112323.71307768454,
  },
  {
    timestamp: 1760187720789,
    price: 112461.02631975264,
  },
  {
    timestamp: 1760191269088,
    price: 112356.46649370568,
  },
  {
    timestamp: 1760195021835,
    price: 112138.00716951492,
  },
  {
    timestamp: 1760198487291,
    price: 112030.36462224036,
  },
  {
    timestamp: 1760202025246,
    price: 111909.75187038742,
  },
  {
    timestamp: 1760205691605,
    price: 112032.04769637782,
  },
  {
    timestamp: 1760209466478,
    price: 112042.23298089817,
  },
  {
    timestamp: 1760212980614,
    price: 111322.52027293928,
  },
  {
    timestamp: 1760216698705,
    price: 110389.75589111897,
  },
  {
    timestamp: 1760220046934,
    price: 111018.66093843614,
  },
  {
    timestamp: 1760223812797,
    price: 111134.29648271875,
  },
  {
    timestamp: 1760227404823,
    price: 110655.26975977031,
  },
  {
    timestamp: 1760230981794,
    price: 109883.28741022735,
  },
  {
    timestamp: 1760234692221,
    price: 110195.76140174491,
  },
  {
    timestamp: 1760238086039,
    price: 110198.81941126974,
  },
  {
    timestamp: 1760241605653,
    price: 110809.92567892557,
  },
  {
    timestamp: 1760245313811,
    price: 111600.18576625599,
  },
  {
    timestamp: 1760248931747,
    price: 111804.41628579248,
  },
  {
    timestamp: 1760252679246,
    price: 111880.60944752423,
  },
  {
    timestamp: 1760256024411,
    price: 111610.35181820815,
  },
  {
    timestamp: 1760259751162,
    price: 111424.09313681557,
  },
  {
    timestamp: 1760263352217,
    price: 111715.42597420496,
  },
  {
    timestamp: 1760267063341,
    price: 111673.88492636397,
  },
  {
    timestamp: 1760270484403,
    price: 111881.97093087486,
  },
  {
    timestamp: 1760274241525,
    price: 111730.67039614542,
  },
  {
    timestamp: 1760277942118,
    price: 111392.91511512472,
  },
  {
    timestamp: 1760281342387,
    price: 112780.0801516365,
  },
  {
    timestamp: 1760285326996,
    price: 113766.07316288614,
  },
  {
    timestamp: 1760288527275,
    price: 114138.69413740357,
  },
  {
    timestamp: 1760292254507,
    price: 113916.48201637086,
  },
  {
    timestamp: 1760295752879,
    price: 113920.63195452522,
  },
  {
    timestamp: 1760299351731,
    price: 114410.28595211994,
  },
  {
    timestamp: 1760302899450,
    price: 115102.85953861696,
  },
  {
    timestamp: 1760306489028,
    price: 115159.31139197148,
  },
  {
    timestamp: 1760310046357,
    price: 115481.167676035,
  },
  {
    timestamp: 1760313686553,
    price: 115189.5714637257,
  },
  {
    timestamp: 1760317352465,
    price: 115460.42256128507,
  },
  {
    timestamp: 1760321192548,
    price: 115469.76764925767,
  },
  {
    timestamp: 1760324431762,
    price: 115531.30986841043,
  },
  {
    timestamp: 1760328161664,
    price: 114822.18843005072,
  },
  {
    timestamp: 1760331642875,
    price: 114749.493799974,
  },
  {
    timestamp: 1760335322804,
    price: 114704.85275678411,
  },
  {
    timestamp: 1760338918916,
    price: 115299.61768579362,
  },
  {
    timestamp: 1760342494398,
    price: 115297.5797796327,
  },
  {
    timestamp: 1760346015535,
    price: 115453.51748455205,
  },
  {
    timestamp: 1760349696213,
    price: 115172.1122562179,
  },
  {
    timestamp: 1760353349024,
    price: 114982.10589809314,
  },
  {
    timestamp: 1760356902500,
    price: 114188.711669866,
  },
  {
    timestamp: 1760360420330,
    price: 114530.95349944655,
  },
  {
    timestamp: 1760364109956,
    price: 115185.27520212739,
  },
  {
    timestamp: 1760367746308,
    price: 114004.90391225103,
  },
  {
    timestamp: 1760371274564,
    price: 114460.25520200531,
  },
  {
    timestamp: 1760374879695,
    price: 114804.96443156546,
  },
  {
    timestamp: 1760378720835,
    price: 115053.21874518311,
  },
  {
    timestamp: 1760382128525,
    price: 115195.38142923413,
  },
  {
    timestamp: 1760385739769,
    price: 115933.90325039899,
  },
  {
    timestamp: 1760389321260,
    price: 115683.90289067196,
  },
  {
    timestamp: 1760392929323,
    price: 115774.07201844799,
  },
  {
    timestamp: 1760396504736,
    price: 115638.30336881512,
  },
  {
    timestamp: 1760400118277,
    price: 115222.28302116522,
  },
  {
    timestamp: 1760403730709,
    price: 115036.14482821569,
  },
  {
    timestamp: 1760407276407,
    price: 114364.38519523863,
  },
  {
    timestamp: 1760410925825,
    price: 113814.46413991987,
  },
  {
    timestamp: 1760414778555,
    price: 113637.98369700304,
  },
  {
    timestamp: 1760418132441,
    price: 113029.73083499433,
  },
  {
    timestamp: 1760421723183,
    price: 112655.30013403119,
  },
  {
    timestamp: 1760425328664,
    price: 112094.7164342959,
  },
  {
    timestamp: 1760429166316,
    price: 111669.82382780964,
  },
  {
    timestamp: 1760432448497,
    price: 111901.5346157505,
  },
  {
    timestamp: 1760436151399,
    price: 111209.35444843434,
  },
  {
    timestamp: 1760439682763,
    price: 110735.7337032851,
  },
  {
    timestamp: 1760443345563,
    price: 111452.06269598994,
  },
  {
    timestamp: 1760446936419,
    price: 111029.60238953518,
  },
  {
    timestamp: 1760450541126,
    price: 111074.18245173771,
  },
  {
    timestamp: 1760454294484,
    price: 111599.09482139278,
  },
  {
    timestamp: 1760457610102,
    price: 112668.23161517075,
  },
  {
    timestamp: 1760461339914,
    price: 112683.18897145659,
  },
  {
    timestamp: 1760464846031,
    price: 112870.01637755331,
  },
  {
    timestamp: 1760468535244,
    price: 112929.9397716864,
  },
  {
    timestamp: 1760472080253,
    price: 112715.50165167684,
  },
  {
    timestamp: 1760475744738,
    price: 112990.21580043276,
  },
  {
    timestamp: 1760479641157,
    price: 113442.28069364143,
  },
  {
    timestamp: 1760482942818,
    price: 113253.1113223007,
  },
  {
    timestamp: 1760486528525,
    price: 113156.56943826913,
  },
  {
    timestamp: 1760490128055,
    price: 112995.308511099,
  },
  {
    timestamp: 1760493727227,
    price: 112700.04411105992,
  },
  {
    timestamp: 1760497337003,
    price: 113062.13544234853,
  },
  {
    timestamp: 1760500903917,
    price: 112088.22986745652,
  },
  {
    timestamp: 1760504421531,
    price: 112422.24901596077,
  },
  {
    timestamp: 1760508098084,
    price: 112476.0869349915,
  },
  {
    timestamp: 1760511698095,
    price: 112443.6612941868,
  },
  {
    timestamp: 1760515295647,
    price: 112592.77559223701,
  },
  {
    timestamp: 1760518845005,
    price: 113042.7817158566,
  },
  {
    timestamp: 1760522525933,
    price: 112562.48777658338,
  },
  {
    timestamp: 1760526344204,
    price: 112421.39545765055,
  },
  {
    timestamp: 1760529675195,
    price: 111972.49734494487,
  },
  {
    timestamp: 1760533281923,
    price: 111771.39865374852,
  },
  {
    timestamp: 1760536853142,
    price: 111487.93584452692,
  },
  {
    timestamp: 1760540515608,
    price: 111121.72507506835,
  },
  {
    timestamp: 1760544169419,
    price: 110767.84168895654,
  },
  {
    timestamp: 1760547733738,
    price: 110818.25472180649,
  },
  {
    timestamp: 1760551290619,
    price: 111199.93148834158,
  },
  {
    timestamp: 1760554967320,
    price: 111421.2073092355,
  },
  {
    timestamp: 1760558470893,
    price: 111311.1263122397,
  },
  {
    timestamp: 1760562148482,
    price: 111172.12653064249,
  },
  {
    timestamp: 1760565740311,
    price: 110752.26596267126,
  },
  {
    timestamp: 1760569327391,
    price: 110793.48679619528,
  },
  {
    timestamp: 1760572914012,
    price: 110708.66960879423,
  },
]
</script>
