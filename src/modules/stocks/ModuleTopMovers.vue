<template>
  <div class="grid grid-cols-12 w-full items-stretch">
    <div class="col-span-12 gap-4">
      <div
        class="snap-x flex items-stretch justify-start gap-4 overflow-scroll-auto py-1 px-1"
      >
        <app-slide-group
          :totalItems="stockIndexes.length"
          title="Top Movers"
          paginateLocation="top"
        >
          <template
            v-for="(stock, idx) in stockIndexes"
            :key="`item-${idx}`"
            #[`item-${idx}`]
          >
            <top-mover :stock="stock" class="snap-center" />
          </template>
        </app-slide-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TopMover from './components/TopMover.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
interface Stock {
  name: string
  ticker: string
  price: number
  percent_change_24h: number
  prices: Array<{ timestamp: number; price: number }>
  icon_url: string
}
const stockIndexes = ref<Stock[]>([])
onMounted(() => {
  stockIndexes.value = new Array(30).fill(null).map(() => ({
    name: 'NVIDIAon',
    ticker: 'NVIDIA',
    price: Math.random() * 10000 - 1000,
    percent_change_24h: (Math.floor(Math.random() * 1000) - 100) / 100,
    prices: [
      {
        timestamp: 1763597431595,
        price: 195.70301441888603,
      },
      {
        timestamp: 1763597725930,
        price: 195.35413740630656,
      },
      {
        timestamp: 1763598024053,
        price: 195.35479694314031,
      },
      {
        timestamp: 1763598323467,
        price: 195.5401499630291,
      },
      {
        timestamp: 1763598631072,
        price: 195.48673228528241,
      },
      {
        timestamp: 1763599019871,
        price: 196.09544639592204,
      },
      {
        timestamp: 1763599332331,
        price: 196.26025133923798,
      },
      {
        timestamp: 1763599618433,
        price: 196.26006693416943,
      },
      {
        timestamp: 1763599909592,
        price: 196.14690519715225,
      },
      {
        timestamp: 1763600213727,
        price: 195.83941844200314,
      },
      {
        timestamp: 1763600533824,
        price: 195.5229622121317,
      },
      {
        timestamp: 1763600802478,
        price: 195.62848439561805,
      },
      {
        timestamp: 1763601107819,
        price: 195.6327346048118,
      },
      {
        timestamp: 1763601418990,
        price: 195.48605228792448,
      },
      {
        timestamp: 1763601702871,
        price: 195.494565020154,
      },
      {
        timestamp: 1763602001843,
        price: 195.61047244890253,
      },
      {
        timestamp: 1763602295539,
        price: 195.67973505994388,
      },
      {
        timestamp: 1763602614108,
        price: 195.74063885185546,
      },
      {
        timestamp: 1763602897775,
        price: 195.76931104759768,
      },
      {
        timestamp: 1763603247662,
        price: 195.751747630467,
      },
      {
        timestamp: 1763603505506,
        price: 195.751747630467,
      },
      {
        timestamp: 1763603735798,
        price: 195.751747630467,
      },
      {
        timestamp: 1763603987153,
        price: 195.751747630467,
      },
      {
        timestamp: 1763604338642,
        price: 195.693816878174,
      },
      {
        timestamp: 1763604814448,
        price: 195.79883739332598,
      },
      {
        timestamp: 1763605130320,
        price: 195.81177190093172,
      },
      {
        timestamp: 1763605615484,
        price: 195.85797209280508,
      },
      {
        timestamp: 1763605960711,
        price: 195.79184755145354,
      },
      {
        timestamp: 1763606254412,
        price: 195.7460155556893,
      },
      {
        timestamp: 1763606559706,
        price: 195.77250370704738,
      },
      {
        timestamp: 1763606759970,
        price: 195.71769547603262,
      },
      {
        timestamp: 1763607061053,
        price: 195.61715543707695,
      },
      {
        timestamp: 1763607352681,
        price: 195.68950639173107,
      },
      {
        timestamp: 1763607662781,
        price: 195.61435135889147,
      },
      {
        timestamp: 1763607956677,
        price: 195.7214649524832,
      },
      {
        timestamp: 1763608254093,
        price: 195.59963608019717,
      },
      {
        timestamp: 1763608565144,
        price: 195.58659165648737,
      },
      {
        timestamp: 1763608860711,
        price: 195.618094800444,
      },
      {
        timestamp: 1763609153500,
        price: 195.5520307452035,
      },
      {
        timestamp: 1763609425498,
        price: 195.6251423550859,
      },
      {
        timestamp: 1763609736847,
        price: 195.7127027886349,
      },
      {
        timestamp: 1763610028894,
        price: 196.02066021370123,
      },
      {
        timestamp: 1763610336205,
        price: 196.01912802734205,
      },
      {
        timestamp: 1763610632150,
        price: 195.91944108369694,
      },
      {
        timestamp: 1763610933297,
        price: 196.00077491688353,
      },
      {
        timestamp: 1763611241667,
        price: 196.31694278924152,
      },
      {
        timestamp: 1763611535880,
        price: 196.31736067361325,
      },
      {
        timestamp: 1763611831673,
        price: 196.78880913946344,
      },
      {
        timestamp: 1763612138421,
        price: 197.24041986800248,
      },
      {
        timestamp: 1763612425502,
        price: 197.2815999132573,
      },
      {
        timestamp: 1763612736915,
        price: 197.23642039007808,
      },
      {
        timestamp: 1763613035760,
        price: 197.15166447893847,
      },
      {
        timestamp: 1763613320187,
        price: 196.98622843245596,
      },
      {
        timestamp: 1763613628027,
        price: 196.92478735101608,
      },
      {
        timestamp: 1763613910479,
        price: 197.07003293558273,
      },
      {
        timestamp: 1763614208593,
        price: 197.0673801517282,
      },
      {
        timestamp: 1763614518363,
        price: 197.11635028679055,
      },
      {
        timestamp: 1763614824094,
        price: 197.1133150114457,
      },
      {
        timestamp: 1763615115349,
        price: 197.1031277278268,
      },
      {
        timestamp: 1763615415787,
        price: 197.34085444971373,
      },
      {
        timestamp: 1763615718041,
        price: 197.01997994387438,
      },
      {
        timestamp: 1763616014741,
        price: 196.99193431423987,
      },
      {
        timestamp: 1763616316284,
        price: 196.73678588486933,
      },
      {
        timestamp: 1763616619744,
        price: 196.72236373002886,
      },
      {
        timestamp: 1763616927270,
        price: 196.5044265414795,
      },
      {
        timestamp: 1763617232825,
        price: 196.5245620385927,
      },
      {
        timestamp: 1763617528698,
        price: 196.51593125375084,
      },
      {
        timestamp: 1763617839345,
        price: 196.6555309972444,
      },
      {
        timestamp: 1763618132988,
        price: 196.64865084415663,
      },
      {
        timestamp: 1763618439554,
        price: 196.55805156168995,
      },
      {
        timestamp: 1763618731646,
        price: 196.5330325419007,
      },
      {
        timestamp: 1763619034079,
        price: 196.68600841406183,
      },
      {
        timestamp: 1763619328290,
        price: 196.8682126315376,
      },
      {
        timestamp: 1763619665647,
        price: 196.56051091001405,
      },
      {
        timestamp: 1763619931085,
        price: 196.56953124511074,
      },
      {
        timestamp: 1763620227205,
        price: 196.43295138416565,
      },
      {
        timestamp: 1763620518441,
        price: 196.50315724852115,
      },
      {
        timestamp: 1763620824008,
        price: 196.74765886016957,
      },
      {
        timestamp: 1763621114902,
        price: 196.98062723327712,
      },
      {
        timestamp: 1763621496132,
        price: 197.24193207761684,
      },
      {
        timestamp: 1763621790836,
        price: 197.33134443115944,
      },
      {
        timestamp: 1763622349348,
        price: 197.5203921627074,
      },
      {
        timestamp: 1763622677082,
        price: 197.7010733096449,
      },
      {
        timestamp: 1763622980856,
        price: 197.26908400350536,
      },
      {
        timestamp: 1763623288364,
        price: 197.4458141404603,
      },
      {
        timestamp: 1763623598894,
        price: 197.7037066570156,
      },
      {
        timestamp: 1763623896476,
        price: 197.90096604335213,
      },
      {
        timestamp: 1763624186658,
        price: 198.25062828667194,
      },
      {
        timestamp: 1763624446498,
        price: 198.0051769618001,
      },
      {
        timestamp: 1763624750173,
        price: 197.74922653889033,
      },
      {
        timestamp: 1763625047145,
        price: 197.85080675325534,
      },
      {
        timestamp: 1763625343375,
        price: 197.92359149803139,
      },
      {
        timestamp: 1763625663593,
        price: 197.87156607176405,
      },
      {
        timestamp: 1763625955402,
        price: 197.83211369786613,
      },
      {
        timestamp: 1763626250024,
        price: 197.78326387228685,
      },
      {
        timestamp: 1763626550899,
        price: 197.23462321259547,
      },
      {
        timestamp: 1763626849328,
        price: 197.0791770421409,
      },
      {
        timestamp: 1763627151754,
        price: 196.95804348625268,
      },
      {
        timestamp: 1763627457845,
        price: 196.81025512885682,
      },
      {
        timestamp: 1763627714511,
        price: 196.84184500896086,
      },
      {
        timestamp: 1763628024497,
        price: 196.7526865594727,
      },
      {
        timestamp: 1763628350734,
        price: 196.69897506126816,
      },
      {
        timestamp: 1763628694192,
        price: 196.6960777816778,
      },
      {
        timestamp: 1763629104582,
        price: 196.74803027997098,
      },
      {
        timestamp: 1763629257789,
        price: 196.74803027997098,
      },
      {
        timestamp: 1763629597176,
        price: 196.74950995279255,
      },
      {
        timestamp: 1763629928185,
        price: 196.74940497458374,
      },
      {
        timestamp: 1763630144131,
        price: 196.82329714171064,
      },
      {
        timestamp: 1763630535434,
        price: 196.4321217603827,
      },
      {
        timestamp: 1763630774432,
        price: 196.49753191142324,
      },
      {
        timestamp: 1763631015799,
        price: 196.5947943409758,
      },
      {
        timestamp: 1763631314311,
        price: 196.56038152047,
      },
      {
        timestamp: 1763631614985,
        price: 196.56391894185182,
      },
      {
        timestamp: 1763631917337,
        price: 196.59926337336145,
      },
      {
        timestamp: 1763632218715,
        price: 196.13801705255167,
      },
      {
        timestamp: 1763632515006,
        price: 196.03938806678866,
      },
      {
        timestamp: 1763632815479,
        price: 195.51407067990988,
      },
      {
        timestamp: 1763633139494,
        price: 195.406616052489,
      },
      {
        timestamp: 1763633415706,
        price: 194.7375362270565,
      },
      {
        timestamp: 1763633710737,
        price: 194.6443643437365,
      },
      {
        timestamp: 1763634007637,
        price: 194.69135886399874,
      },
      {
        timestamp: 1763634314626,
        price: 194.88402921832883,
      },
      {
        timestamp: 1763634698735,
        price: 195.11114388732256,
      },
      {
        timestamp: 1763634995290,
        price: 195.2179170457596,
      },
      {
        timestamp: 1763635290629,
        price: 195.28532998480344,
      },
      {
        timestamp: 1763635601732,
        price: 195.07001969876444,
      },
      {
        timestamp: 1763635894680,
        price: 195.18371633977193,
      },
      {
        timestamp: 1763636196091,
        price: 195.45932480795673,
      },
      {
        timestamp: 1763636503956,
        price: 195.4813047330556,
      },
      {
        timestamp: 1763636790944,
        price: 195.6656989900561,
      },
      {
        timestamp: 1763637128640,
        price: 195.45301929534983,
      },
      {
        timestamp: 1763637400435,
        price: 195.31491659052665,
      },
      {
        timestamp: 1763637697742,
        price: 195.0860645512254,
      },
      {
        timestamp: 1763638000238,
        price: 194.7386681132369,
      },
      {
        timestamp: 1763638288472,
        price: 194.68493354207385,
      },
      {
        timestamp: 1763638597674,
        price: 194.8708052147501,
      },
      {
        timestamp: 1763638929489,
        price: 195.18743836874165,
      },
      {
        timestamp: 1763639240016,
        price: 195.6119797199524,
      },
      {
        timestamp: 1763639529025,
        price: 195.40609210593811,
      },
      {
        timestamp: 1763639837383,
        price: 195.17654428370435,
      },
      {
        timestamp: 1763640171965,
        price: 195.2457309063157,
      },
      {
        timestamp: 1763640430499,
        price: 195.33308880915345,
      },
      {
        timestamp: 1763640729285,
        price: 195.19473399445593,
      },
      {
        timestamp: 1763641034945,
        price: 195.0941593795571,
      },
      {
        timestamp: 1763641342443,
        price: 194.98168237812337,
      },
      {
        timestamp: 1763641645766,
        price: 195.27030648801238,
      },
      {
        timestamp: 1763641936909,
        price: 195.2346175668052,
      },
      {
        timestamp: 1763642244334,
        price: 195.1994900028374,
      },
      {
        timestamp: 1763642538795,
        price: 195.24638163935097,
      },
      {
        timestamp: 1763642712286,
        price: 195.2458431487375,
      },
      {
        timestamp: 1763643014620,
        price: 195.26420561733778,
      },
      {
        timestamp: 1763643312214,
        price: 195.1895572924153,
      },
      {
        timestamp: 1763643618091,
        price: 195.54810996916183,
      },
      {
        timestamp: 1763643921936,
        price: 195.23634813679212,
      },
      {
        timestamp: 1763644213954,
        price: 195.47258735925124,
      },
      {
        timestamp: 1763644508063,
        price: 195.8289807305386,
      },
      {
        timestamp: 1763644844276,
        price: 195.93084215138822,
      },
      {
        timestamp: 1763645110803,
        price: 195.8815124127558,
      },
      {
        timestamp: 1763645480487,
        price: 195.76771094548667,
      },
      {
        timestamp: 1763645780661,
        price: 195.87375165879752,
      },
      {
        timestamp: 1763646076236,
        price: 195.71127714281155,
      },
      {
        timestamp: 1763646377841,
        price: 195.76611165635885,
      },
      {
        timestamp: 1763646685566,
        price: 195.5112709099752,
      },
      {
        timestamp: 1763646971157,
        price: 195.90858332077133,
      },
      {
        timestamp: 1763647284518,
        price: 195.66867700658565,
      },
      {
        timestamp: 1763647589077,
        price: 195.64602453671617,
      },
      {
        timestamp: 1763647871807,
        price: 195.83175085467326,
      },
      {
        timestamp: 1763648172655,
        price: 195.73540634094553,
      },
      {
        timestamp: 1763648474485,
        price: 195.83287459795156,
      },
      {
        timestamp: 1763648782595,
        price: 195.71953840552825,
      },
      {
        timestamp: 1763649080889,
        price: 195.73716357602075,
      },
      {
        timestamp: 1763649370384,
        price: 194.75114400785682,
      },
      {
        timestamp: 1763649627176,
        price: 193.03134278081407,
      },
      {
        timestamp: 1763649933692,
        price: 193.25209520179558,
      },
      {
        timestamp: 1763650227572,
        price: 194.04373888498327,
      },
      {
        timestamp: 1763650525977,
        price: 193.76775515244145,
      },
      {
        timestamp: 1763650823530,
        price: 194.50404643845022,
      },
      {
        timestamp: 1763651122390,
        price: 194.7209329587858,
      },
      {
        timestamp: 1763651430480,
        price: 193.36062395839434,
      },
      {
        timestamp: 1763651722206,
        price: 193.3950262037979,
      },
      {
        timestamp: 1763652029915,
        price: 193.37110550467247,
      },
      {
        timestamp: 1763652329971,
        price: 193.37353606844962,
      },
      {
        timestamp: 1763652629440,
        price: 193.36055042634752,
      },
      {
        timestamp: 1763652996824,
        price: 193.59379964218425,
      },
      {
        timestamp: 1763653290668,
        price: 193.97793915802106,
      },
      {
        timestamp: 1763653600613,
        price: 193.8449047351628,
      },
      {
        timestamp: 1763653888523,
        price: 192.9722355126365,
      },
      {
        timestamp: 1763654201109,
        price: 192.82565939871017,
      },
      {
        timestamp: 1763654523791,
        price: 192.1219993886194,
      },
      {
        timestamp: 1763654776070,
        price: 191.90068406241386,
      },
      {
        timestamp: 1763655087589,
        price: 190.82416971954444,
      },
      {
        timestamp: 1763655390393,
        price: 190.82409689160247,
      },
      {
        timestamp: 1763655689145,
        price: 189.29714258269198,
      },
      {
        timestamp: 1763656002003,
        price: 189.14145534353696,
      },
      {
        timestamp: 1763656296267,
        price: 189.4665591895211,
      },
      {
        timestamp: 1763656597689,
        price: 189.5055466072667,
      },
      {
        timestamp: 1763656849748,
        price: 187.82253890762155,
      },
      {
        timestamp: 1763657162326,
        price: 187.56007100781963,
      },
      {
        timestamp: 1763657465620,
        price: 187.01332507253736,
      },
      {
        timestamp: 1763657766957,
        price: 186.45909345056648,
      },
      {
        timestamp: 1763658068576,
        price: 185.35686292924,
      },
      {
        timestamp: 1763658363917,
        price: 185.83694033245595,
      },
      {
        timestamp: 1763658686170,
        price: 184.9969348772599,
      },
      {
        timestamp: 1763658964741,
        price: 184.3781460221039,
      },
      {
        timestamp: 1763659303659,
        price: 183.10983081352944,
      },
      {
        timestamp: 1763659560818,
        price: 182.9674419394285,
      },
      {
        timestamp: 1763659861114,
        price: 183.4297752766187,
      },
      {
        timestamp: 1763660158658,
        price: 182.94177000970586,
      },
      {
        timestamp: 1763660442555,
        price: 182.22779907121108,
      },
      {
        timestamp: 1763660745248,
        price: 182.46479779221593,
      },
      {
        timestamp: 1763661045462,
        price: 182.34376174367003,
      },
      {
        timestamp: 1763661348377,
        price: 182.73787231932457,
      },
      {
        timestamp: 1763661644248,
        price: 183.24187144679803,
      },
      {
        timestamp: 1763661953236,
        price: 183.55520268720838,
      },
      {
        timestamp: 1763662256723,
        price: 184.18581393527788,
      },
      {
        timestamp: 1763662544587,
        price: 184.7148702204328,
      },
      {
        timestamp: 1763662870964,
        price: 184.5590179726525,
      },
      {
        timestamp: 1763663139872,
        price: 184.59803088605017,
      },
      {
        timestamp: 1763663443574,
        price: 184.30505412662674,
      },
      {
        timestamp: 1763663806814,
        price: 183.98908508415514,
      },
      {
        timestamp: 1763664105587,
        price: 183.23717595871548,
      },
      {
        timestamp: 1763664405168,
        price: 182.99106403676126,
      },
      {
        timestamp: 1763664706096,
        price: 182.90050227168348,
      },
      {
        timestamp: 1763665007790,
        price: 181.7651404636759,
      },
      {
        timestamp: 1763665317871,
        price: 181.9985988489138,
      },
      {
        timestamp: 1763665604334,
        price: 181.52477551189838,
      },
      {
        timestamp: 1763665902675,
        price: 181.4459115315626,
      },
      {
        timestamp: 1763666207817,
        price: 181.16208734461333,
      },
      {
        timestamp: 1763666490977,
        price: 181.92271342521812,
      },
      {
        timestamp: 1763666797879,
        price: 181.7843596676465,
      },
      {
        timestamp: 1763667098235,
        price: 182.0637130812677,
      },
      {
        timestamp: 1763667407423,
        price: 181.58428117475987,
      },
      {
        timestamp: 1763667644577,
        price: 181.5179991130594,
      },
      {
        timestamp: 1763667935886,
        price: 181.3645335336115,
      },
      {
        timestamp: 1763668242850,
        price: 181.61738663361658,
      },
      {
        timestamp: 1763668540044,
        price: 182.12269294376415,
      },
      {
        timestamp: 1763668839216,
        price: 182.4673113040921,
      },
      {
        timestamp: 1763669154889,
        price: 182.3614097040567,
      },
      {
        timestamp: 1763669442682,
        price: 182.31470614994495,
      },
      {
        timestamp: 1763669744234,
        price: 181.98857531779484,
      },
      {
        timestamp: 1763670037083,
        price: 182.01721522898796,
      },
      {
        timestamp: 1763670343099,
        price: 182.27672614579717,
      },
      {
        timestamp: 1763670641906,
        price: 181.80716750505437,
      },
      {
        timestamp: 1763670909735,
        price: 182.06045132444052,
      },
      {
        timestamp: 1763671253814,
        price: 181.22621799940583,
      },
      {
        timestamp: 1763671508481,
        price: 180.74286717950113,
      },
      {
        timestamp: 1763671814658,
        price: 180.51687985767575,
      },
      {
        timestamp: 1763672114296,
        price: 180.2675030222678,
      },
      {
        timestamp: 1763672893779,
        price: 180.36889525051524,
      },
      {
        timestamp: 1763673025459,
        price: 180.4219701187344,
      },
      {
        timestamp: 1763673319266,
        price: 180.55259081046603,
      },
      {
        timestamp: 1763673609211,
        price: 180.74652768020042,
      },
      {
        timestamp: 1763673909766,
        price: 180.355880090399,
      },
      {
        timestamp: 1763674319971,
        price: 180.22541644652304,
      },
      {
        timestamp: 1763674616657,
        price: 180.37293523079396,
      },
      {
        timestamp: 1763674907796,
        price: 179.9224954469858,
      },
      {
        timestamp: 1763675216403,
        price: 179.2722343664934,
      },
      {
        timestamp: 1763675559084,
        price: 179.17050853988704,
      },
      {
        timestamp: 1763675820841,
        price: 179.45120377296044,
      },
      {
        timestamp: 1763676132045,
        price: 179.3553983021534,
      },
      {
        timestamp: 1763676411668,
        price: 179.55147781853222,
      },
      {
        timestamp: 1763676712592,
        price: 179.76808364963827,
      },
      {
        timestamp: 1763677011665,
        price: 179.21598959375928,
      },
      {
        timestamp: 1763677310952,
        price: 179.0538533093854,
      },
      {
        timestamp: 1763677609210,
        price: 178.6235210892524,
      },
      {
        timestamp: 1763677945852,
        price: 178.56122762851857,
      },
      {
        timestamp: 1763678222710,
        price: 178.27835055947838,
      },
      {
        timestamp: 1763678521393,
        price: 178.75972565702196,
      },
      {
        timestamp: 1763678822090,
        price: 178.74922295319985,
      },
      {
        timestamp: 1763679126006,
        price: 178.56017741230542,
      },
      {
        timestamp: 1763679424598,
        price: 178.50832298363378,
      },
      {
        timestamp: 1763679746138,
        price: 178.82908733104756,
      },
      {
        timestamp: 1763680101618,
        price: 178.9069916617277,
      },
      {
        timestamp: 1763680350436,
        price: 178.9169070078156,
      },
      {
        timestamp: 1763680618334,
        price: 178.6757701678544,
      },
      {
        timestamp: 1763680918870,
        price: 178.68981923447785,
      },
      {
        timestamp: 1763681218105,
        price: 179.26521373011929,
      },
      {
        timestamp: 1763681518207,
        price: 179.29891652319998,
      },
      {
        timestamp: 1763681823594,
        price: 179.73787604371796,
      },
      {
        timestamp: 1763682132589,
        price: 179.97208201301726,
      },
      {
        timestamp: 1763682446356,
        price: 180.4127893056393,
      },
      {
        timestamp: 1763682738406,
        price: 180.30468424669314,
      },
      {
        timestamp: 1763683038093,
        price: 180.23560114882176,
      },
      {
        timestamp: 1763683375119,
        price: 180.46172492714894,
      },
      {
        timestamp: 1763683637123,
        price: 180.07986456701977,
      },
    ],
    icon_url:
      'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png?1756130268',
  }))
})
</script>
