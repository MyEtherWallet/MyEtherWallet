### v5.9.2
* Fix cx always opening enkrypt migration

### v5.9.1
* Fix my wallets opening enkrypt instead of allowing users to access

### v5.9.0
* CX migration notice, remove access via cx dashboard, remove quicksend

### v5.8.9

* CX deprecation notice update

### v5.8.8

### Fixes

* Update packages, merge fix from bitbox

### v5.8.7

### Fixes

* Update packages, fix resolution issue

### v5.8.6

### Fixes

* Update unstoppable resolutions package and name resolution flows [#3402](https://github.com/MyEtherWallet/MyEtherWallet/pull/3402)

### v5.8.5

### Fixes

* Bitbox 1 fix [#3340](https://github.com/MyEtherWallet/MyEtherWallet/pull/3340)

### v5.8.4

### Fixes

* fix: a bunch of fixes for v5 [#3266](https://github.com/MyEtherWallet/MyEtherWallet/pull/3266)

### v5.8.3

### Feat

* Update welcome modal text [#3232](https://github.com/MyEtherWallet/MyEtherWallet/pull/3232)

### v5.8.2

### Devop

* prep for v6 release move v5 to v5.myetherwallet.com [#3197](https://github.com/MyEtherWallet/MyEtherWallet/pull/3197)

### v5.8.1

### Devop

* update packages and token images [#3177](https://github.com/MyEtherWallet/MyEtherWallet/pull/3177)

### v5.8.0

### Bug

* remove switch addres for wallet connect [#3111](https://github.com/MyEtherWallet/MyEtherWallet/pull/3111)
* fix decimal property checks for one inch [#3105](https://github.com/MyEtherWallet/MyEtherWallet/pull/3105)

### v5.7.30

### Bug

* fix address property checks for one inch[#3094](https://github.com/MyEtherWallet/MyEtherWallet/pull/3094)
* send offline helper bug checksum address issue [#3092](https://github.com/MyEtherWallet/MyEtherWallet/pull/3092)

### Release v5.7.29

### Devop

* Add security policy link to footer [#3085](https://github.com/MyEtherWallet/MyEtherWallet/pull/3085)
* Add One Inch Exchange to swap [#3061](https://github.com/MyEtherWallet/MyEtherWallet/pull/3061)
* Update changelly swap handling [#3046](https://github.com/MyEtherWallet/MyEtherWallet/pull/3046)

### Bug

* Fix network change on send tx page [#3086](https://github.com/MyEtherWallet/MyEtherWallet/pull/3086)
* Add catch when selected address doesn't match signer [#3065](https://github.com/MyEtherWallet/MyEtherWallet/pull/3065)
* Fix paper wallet blockie color issue [#3064](https://github.com/MyEtherWallet/MyEtherWallet/pull/3064)

### Release v5.7.28

### Bug

* Fix UD 2.0 version upgrade [#3033](https://github.com/MyEtherWallet/MyEtherWallet/pull/3033)

### Devop

* Update packages and add MATIC network [#3035](https://github.com/MyEtherWallet/MyEtherWallet/pull/3035)

### Release v5.7.27

### Bug

* Fix mnemonic address generation with Extra word on mew cx [#3002](https://github.com/MyEtherWallet/MyEtherWallet/pull/3002)
* Fix path for Avalanche [#2897](https://github.com/MyEtherWallet/MyEtherWallet/pull/2897)
* fix checking estimateGas after estimateGas failure [#3005](https://github.com/MyEtherWallet/MyEtherWallet/pull/3005)

### Release v5.7.26

### Bug

* fix send offline data issue with BSC [#2941](https://github.com/MyEtherWallet/MyEtherWallet/pull/2941)

### Devop

* Add affiliate link for alchemy [#2940](https://github.com/MyEtherWallet/MyEtherWallet/pull/2940)
* Add Aqua node [#2942](https://github.com/MyEtherWallet/MyEtherWallet/pull/2942)

### Release v5.7.25-majorupdate.1

### Devop

* Update component [#2946](https://github.com/MyEtherWallet/MyEtherWallet/pull/2946)

### Release v5.7.25

### Bug

* fix send offline helper issue [#2930](https://github.com/MyEtherWallet/MyEtherWallet/pull/2930)

### Release v5.7.24

### Bug

* fix send offline helper issue with bignumber [#2907](https://github.com/MyEtherWallet/MyEtherWallet/pull/2907)
* Add some space for ledger paths [#2905](https://github.com/MyEtherWallet/MyEtherWallet/pull/2905)
* add loading tokens to fetch correct balance [#2904](https://github.com/MyEtherWallet/MyEtherWallet/pull/2904)

### Release v5.7.23-hotfix.1

### Bug

* Fix weird token issue when tokens has way too long of a symbol [#2894](https://github.com/MyEtherWallet/MyEtherWallet/pull/2894)

### Release v5.7.23

### Bug

* Remove tokens with no balance so users can manually add and load tokens [#2892](https://github.com/MyEtherWallet/MyEtherWallet/pull/2892)
* Fix checking gas when swap from is not on ethereum [#2879](https://github.com/MyEtherWallet/MyEtherWallet/pull/2879)

### Devop

* consolidate node PRs [#2883](https://github.com/MyEtherWallet/MyEtherWallet/pull/2883)
* Address no decimals for NEO [#2783](https://github.com/MyEtherWallet/MyEtherWallet/pull/2783)
* change the way we are checking lend balance[#2893](https://github.com/MyEtherWallet/MyEtherWallet/pull/2893)

### Release v5.7.22

### Bug

* Fix token loading issue [#2871](https://github.com/MyEtherWallet/MyEtherWallet/pull/2871)
* Fix coolwallet bug when accessing for first time [#2863](https://github.com/MyEtherWallet/MyEtherWallet/pull/2863)

### Release v5.7.21

### Bug

* Reset stepper on init [#2840](https://github.com/MyEtherWallet/MyEtherWallet/pull/2840)
* Fix ETC send offline helper bug[#2852](https://github.com/MyEtherWallet/MyEtherWallet/pull/2852)

### Devop

* Use api instead of token balance for web [#2839](https://github.com/MyEtherWallet/MyEtherWallet/pull/2839)

### Release v5.7.20

### Bug

* Disable button on init [#2832](https://github.com/MyEtherWallet/MyEtherWallet/pull/2832)
* Fix #2761 [#2811](https://github.com/MyEtherWallet/MyEtherWallet/pull/2811)
* Fix CryptoKitties UI for Russian language [#2824](https://github.com/MyEtherWallet/MyEtherWallet/pull/2824)
* store cw appId to prevent reregistering MEW, fix error catch [#2808](https://github.com/MyEtherWallet/MyEtherWallet/pull/2808)
* Fix send entire amount to contracts [#2820](https://github.com/MyEtherWallet/MyEtherWallet/pull/2820)

### Devop

* Add exited popup for staked status [#2828](https://github.com/MyEtherWallet/MyEtherWallet/pull/2828)
* Update packages from snyk and from the script [#2806](https://github.com/MyEtherWallet/MyEtherWallet/pull/2806)

### Release v5.7.19-hotfix.1

### Devop

* Revert aave package [#2793](https://github.com/MyEtherWallet/MyEtherWallet/pull/2793)
* Revert aave change [#2794](https://github.com/MyEtherWallet/MyEtherWallet/pull/2794)

### Release v5.7.19

### Devop

* Add terms for changelly [#2783](https://github.com/MyEtherWallet/MyEtherWallet/pull/2783)

### Bug

* Fix amount unit for Lend Migrator [#2776](https://github.com/MyEtherWallet/MyEtherWallet/pull/2776)

### Release v5.7.18

### Bug

* Update gas limit for Lend Migrator [#2765](https://github.com/MyEtherWallet/MyEtherWallet/pull/2765)
* Fix build name for cx [#2763](https://github.com/MyEtherWallet/MyEtherWallet/pull/2763)

### Devop

* Update team [#2782](https://github.com/MyEtherWallet/MyEtherWallet/pull/2782)
* Improve start script [#2647](https://github.com/MyEtherWallet/MyEtherWallet/pull/2647)
* Forwatch ninja.besu patch [#2764](https://github.com/MyEtherWallet/MyEtherWallet/pull/2764)
* Update Bity Max [#2758](https://github.com/MyEtherWallet/MyEtherWallet/pull/2758)

### Release v5.7.17

### Feature

* Staked validators status [#2748](https://github.com/MyEtherWallet/MyEtherWallet/pull/2748)

### Bug

* Fix wrong values passed to estimateGas in eth_signTransaction method [#2753](https://github.com/MyEtherWallet/MyEtherWallet/pull/2753)
* mew cx ens bug fix [#2745](https://github.com/MyEtherWallet/MyEtherWallet/pull/2745)
* mew cx remove duplicate notification due to checksum [#2732](https://github.com/MyEtherWallet/MyEtherWallet/pull/2732)

### Release v5.7.16

### Feature

* Add Swap alternatives [#2679](https://github.com/MyEtherWallet/MyEtherWallet/pull/2679)

### Devop

* Remove terms and privacy ona translations [#2723](https://github.com/MyEtherWallet/MyEtherWallet/pull/2723)

### Bug

* Fix contract interaction when arrays have set params [#2719](https://github.com/MyEtherWallet/MyEtherWallet/pull/2719)
* Fix contract interaction inputs [#2729](https://github.com/MyEtherWallet/MyEtherWallet/pull/2729)
* Fix GLN copy [#2717](https://github.com/MyEtherWallet/MyEtherWallet/pull/2717)
* Fix GNT migrator balance not showing sometimes [#2728](https://github.com/MyEtherWallet/MyEtherWallet/pull/2728)
* Fix LTC validation for Unstoppable [#2699](https://github.com/MyEtherWallet/MyEtherWallet/pull/2699)
* Add exeption for GameCredits token [#2727](https://github.com/MyEtherWallet/MyEtherWallet/pull/2727)
* Fix missing decimal for ETH and handle new est. gas error [#2730](https://github.com/MyEtherWallet/MyEtherWallet/pull/2730)

### Release v5.7.15

### Feature

* Eth2 Staking Feature [#2662](https://github.com/MyEtherWallet/MyEtherWallet/pull/2662)

### Bug

* Fixed various bugs from asana [#2693](https://github.com/MyEtherWallet/MyEtherWallet/pull/2693)
* Fix error on print [#2676](https://github.com/MyEtherWallet/MyEtherWallet/pull/2676)

### Release v5.7.14

### Feature

* Golem GNT -> GLM Migrator [#2672](https://github.com/MyEtherWallet/MyEtherWallet/pull/2672)

### Bug

* Fix subdomain transfer [#2675](https://github.com/MyEtherWallet/MyEtherWallet/pull/2675)

### Devop

* Update Musicoin with new node [#2667](https://github.com/MyEtherWallet/MyEtherWallet/pull/2667)

### Release v5.7.13

### Bug

* Update rates and min dai for makerDao [#2646](https://github.com/MyEtherWallet/MyEtherWallet/pull/2646)
* Disable button when swap expires, disable click outside swap modal [#2648](https://github.com/MyEtherWallet/MyEtherWallet/pull/2648)
* Add allowance check for LEND migrator [#2649](https://github.com/MyEtherWallet/MyEtherWallet/pull/2649)

### Devop

* Update address validation package [#2652](https://github.com/MyEtherWallet/MyEtherWallet/pull/2652)
* normalize address when verifying massages [#2650](https://github.com/MyEtherWallet/MyEtherWallet/pull/2650)

### Release v5.7.12

## Devop

* Check that user has enough (amount + gas price) to proceed even before they click to continue in swap [#2655](https://github.com/MyEtherWallet/MyEtherWallet/pull/2655)

### Bug

* Gas price bug on batch tx [#2654](https://github.com/MyEtherWallet/MyEtherWallet/pull/2654)

### Release v5.7.12-hotfix.1

### Bug

* Add BSC imports [#2645](https://github.com/MyEtherWallet/MyEtherWallet/pull/2645)

### Release v5.7.12

### Feature

* Add support for currency type [#2631](https://github.com/MyEtherWallet/MyEtherWallet/pull/2631)

### Devop

* Update packages [#2634](https://github.com/MyEtherWallet/MyEtherWallet/pull/2634)

### Bug

* Handle changelly rep as repv2 [#2632](https://github.com/MyEtherWallet/MyEtherWallet/pull/2632)
* fix interact with contract constant check to an existence check [#2627](https://github.com/MyEtherWallet/MyEtherWallet/pull/2627)
* Add ethereum token for ens domain and fix removeElements in AddrResolver

### Release v5.7.11

### Feature

* Unstoppable Domains Twitter verification [#2591](https://github.com/MyEtherWallet/MyEtherWallet/pull/2591)

### Bug

* CX backup fix, generate wallet redirect fix, notifications fix [#2624](https://github.com/MyEtherWallet/MyEtherWallet/pull/2624)

### Devop

* Better handling of new ABI structure[#2622](https://github.com/MyEtherWallet/MyEtherWallet/pull/2622)

### Release v5.7.10

### Feature

* Add LEND to AAVE migrator [#2606](https://github.com/MyEtherWallet/MyEtherWallet/pull/2606)
* Unstoppable add to cart and suggested search [#2516](https://github.com/MyEtherWallet/MyEtherWallet/pull/2516)

### Bug

* fix weird interaction with favorites, speed up loading wallets and favorites, fix some issues when adding wallets via mnemonic, use keystore filename when backing up instead of nickname [#2612](https://github.com/MyEtherWallet/MyEtherWallet/pull/2612)

### Release v5.7.9

### Devop

* remove prior restriction on dexes displayed when using dexag [#2601](https://github.com/MyEtherWallet/MyEtherWallet/pull/2601)
* Add low gas price warning [#2582](https://github.com/MyEtherWallet/MyEtherWallet/pull/2582)

### Bug

* Weird gasprice setting [#2595](https://github.com/MyEtherWallet/MyEtherWallet/pull/2595)
* Get Eth token icons from ethereum-lists for swap [#2592](https://github.com/MyEtherWallet/MyEtherWallet/pull/2592)

### Release v5.7.8-hotfix.2

### Bug

* Only send gas limit value as 'gas' to phone for signing [#2586](https://github.com/MyEtherWallet/MyEtherWallet/pull/2586)
* Fix erroneously showing view transaction button with metamask [#2586](https://github.com/MyEtherWallet/MyEtherWallet/pull/2586)

### Release v5.7.8-hotfix.1

### Devop

* Add option to use EthVM [#2582](https://github.com/MyEtherWallet/MyEtherWallet/pull/2582)

### Release v5.7.8

### Bug

* Add from field if missing for MEW wallet [#2573](https://github.com/MyEtherWallet/MyEtherWallet/pull/2573)
* Gas estimate calculation fix [#2566](https://github.com/MyEtherWallet/MyEtherWallet/pull/2566)

### Feature

* Add warning when user enters a contract [#2574](https://github.com/MyEtherWallet/MyEtherWallet/pull/2574)

### Release v5.7.7

### Bug

* Add a max check to Aave withdraw [#2540](https://github.com/MyEtherWallet/MyEtherWallet/pull/2540)

### Devop

* Update gasprice calculations [#2559](https://github.com/MyEtherWallet/MyEtherWallet/pull/2559)
* Allow users to renew expired ENS names [#2554](https://github.com/MyEtherWallet/MyEtherWallet/pull/2554)

### Release v5.7.6-hotfix.1

### Devop

* Remove twitter popup [#2551](https://github.com/MyEtherWallet/MyEtherWallet/pull/2551)

### Release v5.7.6

### Bug

* Better token load on offline and cx gas price [#2545](https://github.com/MyEtherWallet/MyEtherWallet/pull/2545)
* Fix missed cases for gas price too high, add warning for VET [#2544](https://github.com/MyEtherWallet/MyEtherWallet/pull/2544)

### Devop

* Add Press kit page [#2547](https://github.com/MyEtherWallet/MyEtherWallet/pull/2547)
* Add transaction fee estimate and high gas warning to swap [#2549](https://github.com/MyEtherWallet/MyEtherWallet/pull/2549)

### Release v5.7.5

### Devop

* Update MEW wallet from MEWconnect [#2542](https://github.com/MyEtherWallet/MyEtherWallet/pull/2542)

### Release v5.7.4

### Devop

* Update empty decision tree md files [#2538](https://github.com/MyEtherWallet/MyEtherWallet/pull/2538)

### Bug

* Fix modal UI bug [#2537](https://github.com/MyEtherWallet/MyEtherWallet/pull/2537)
* Fix cx networks import [#2529](https://github.com/MyEtherWallet/MyEtherWallet/pull/2529)

### Release v5.7.3-hotfix.1

### Devop

* Twitter popup [#2533](https://github.com/MyEtherWallet/MyEtherWallet/pull/2533)

### Bug

* Fix sign message for bcvault [#2527](https://github.com/MyEtherWallet/MyEtherWallet/pull/2527)

### Release v5.7.3

### Devop

* Add gas check for kyber swaps [#2524](https://github.com/MyEtherWallet/MyEtherWallet/pull/2524)

### Bug

* Change token so even if contract succeeds some can still be loaded, show renew ens [#2523](https://github.com/MyEtherWallet/MyEtherWallet/pull/2523)
* CW error catch, Gaslimit warning for collection, more bcvault fixes [#2521](https://github.com/MyEtherWallet/MyEtherWallet/pull/2521)
* Remove contract when not sending tokens [#2525](https://github.com/MyEtherWallet/MyEtherWallet/pull/2525)
* Fix sign message for bcvault [#2527](https://github.com/MyEtherWallet/MyEtherWallet/pull/2527)

### Release v5.7.2

### Bug

* Remove disabled message and button on firefox for bcvault, add error when no account received [#2499](https://github.com/MyEtherWallet/MyEtherWallet/pull/2499)
* CX hang possible fix [#2507](https://github.com/MyEtherWallet/MyEtherWallet/pull/2507)

### Devop

* Use Batch EstimateGas [#2417](https://github.com/MyEtherWallet/MyEtherWallet/pull/2417)

### Release v5.7.1

### Bug

* Fix logos for tokens with src not from masterfile [#2500](https://github.com/MyEtherWallet/MyEtherWallet/pull/2500)
* Sentry fixes y [#2479](https://github.com/MyEtherWallet/MyEtherWallet/pull/2479)
* Sentry fixes j [#2474](https://github.com/MyEtherWallet/MyEtherWallet/pull/2474)
* Whitelist prkl correctly [#2502](https://github.com/MyEtherWallet/MyEtherWallet/pull/2502)
* Cx tokens not showing [#2492](https://github.com/MyEtherWallet/MyEtherWallet/pull/2492)
* Revert walletconnect library [#2503](https://github.com/MyEtherWallet/MyEtherWallet/pull/2503)

### Release v5.7.0

### Bug

* Remove sai [#2462](https://github.com/MyEtherWallet/MyEtherWallet/pull/2462)
* Remove normalize on string check [#2463](https://github.com/MyEtherWallet/MyEtherWallet/pull/2463)
* Update Aave withdraw and healthfactor [#2460](https://github.com/MyEtherWallet/MyEtherWallet/pull/2460)

### Devop

* Merge node changes #2470, #2469, #2468, and #2467 [#2481](https://github.com/MyEtherWallet/MyEtherWallet/pull/2481)
* Update Maker Libraries for Maker Dai Dapp [#2437](https://github.com/MyEtherWallet/MyEtherWallet/pull/2437)
* add check for market impact when finalizing swap details [#2484](https://github.com/MyEtherWallet/MyEtherWallet/pull/2484)

### Feature

* Update MEW Wallet modal [#2483](https://github.com/MyEtherWallet/MyEtherWallet/pull/2483)

### Release v5.6.6-hotfix.2

### Hotfix

* Revert mewconnect library [#2472](https://github.com/MyEtherWallet/MyEtherWallet/pull/2472)

### Bug

* check gas if only one side of the swap is on ethereum [#2473](https://github.com/MyEtherWallet/MyEtherWallet/pull/2473)

### Release v5.6.6-hotfix.1

### Devop

* Update aave protocol lib to 1.0.0 [#2452](https://github.com/MyEtherWallet/MyEtherWallet/pull/2452)
* Add EWT and FUSE support [#2438](https://github.com/MyEtherWallet/MyEtherWallet/pull/2438)
* dont overrwrite master file on error [#2443](https://github.com/MyEtherWallet/MyEtherWallet/pull/2443)

### Feature

* Add gas price warning to send offline helper [#2449](https://github.com/MyEtherWallet/MyEtherWallet/pull/2449)
* support unstoppable domains with dashes [#2456](https://github.com/MyEtherWallet/MyEtherWallet/pull/2456)

### Release v5.6.6

### Feature

* Ipfs implementation for ENS manager [#2412](https://github.com/MyEtherWallet/MyEtherWallet/pull/2412)

### Bug

* Remove view wallet layout [#2454](https://github.com/MyEtherWallet/MyEtherWallet/pull/2454)
* Remove private keys when irrelevant on print wallets [#2453](https://github.com/MyEtherWallet/MyEtherWallet/pull/2453)

### Devop

* Replace icons and font color on side menu [#2455](https://github.com/MyEtherWallet/MyEtherWallet/pull/2455)

### Release v5.6.5

### Bug

* cx guard [#2422](https://github.com/MyEtherWallet/MyEtherWallet/pull/2422)
* Fix text mixup [#2420](https://github.com/MyEtherWallet/MyEtherWallet/pull/2420)
* Fix email validation [#2421](https://github.com/MyEtherWallet/MyEtherWallet/pull/2421)
* Fix some cx bugs [#2429](https://github.com/MyEtherWallet/MyEtherWallet/pull/2429)
* Sentry fixes s [#2433](https://github.com/MyEtherWallet/MyEtherWallet/pull/2433)
* Sentry fixes y [#2431](https://github.com/MyEtherWallet/MyEtherWallet/pull/2431)
* Sentry fixes k [#2430](https://github.com/MyEtherWallet/MyEtherWallet/pull/2430)
* Sentry fixes j [#2432](https://github.com/MyEtherWallet/MyEtherWallet/pull/2432)

### Release v5.6.4

### Feature

* Unstoppable domains combined [#2353](https://github.com/MyEtherWallet/MyEtherWallet/pull/2353)

### Devop

* Modify Simplex order flow [#2409](https://github.com/MyEtherWallet/MyEtherWallet/pull/2409)

### Bug

* Also display token icon if submitted and is not found in the masterfile [#2404](https://github.com/MyEtherWallet/MyEtherWallet/pull/2404)
* Sentry fixes s [#2406](https://github.com/MyEtherWallet/MyEtherWallet/pull/2406)
* Sentry fixes k [#2411](https://github.com/MyEtherWallet/MyEtherWallet/pull/2411)

### Release v5.6.3

### Bug

* Sentry fixes y [#2400](https://github.com/MyEtherWallet/MyEtherWallet/pull/2400)
* Sentry fixes j [#2396](https://github.com/MyEtherWallet/MyEtherWallet/pull/2396)
* Fix address not getting returned for unable to validate addresses and disable swap when recalculating rates[#2397](https://github.com/MyEtherWallet/MyEtherWallet/pull/2397)
* Fix errors from sentry [#2393](https://github.com/MyEtherWallet/MyEtherWallet/pull/2393)
* Fix perkle network connection [#2389](https://github.com/MyEtherWallet/MyEtherWallet/pull/2389)
* Fix errors from sentry [#2388](https://github.com/MyEtherWallet/MyEtherWallet/pull/2388)

### Devop

* Fix MEW CX build [#2403](https://github.com/MyEtherWallet/MyEtherWallet/pull/2403)
* Update terms of service [#2394](https://github.com/MyEtherWallet/MyEtherWallet/pull/2394)
* Fix sentry releases [#2395](https://github.com/MyEtherWallet/MyEtherWallet/pull/2395)

### Release v5.6.2

### Feature

* Multimanage ens [#2376](https://github.com/MyEtherWallet/MyEtherWallet/pull/2376)

### Devop

* Cleanup token with the new package update [#2338](https://github.com/MyEtherWallet/MyEtherWallet/pull/2338)
* Mingrate sentry/fix contracts [#2366](https://github.com/MyEtherWallet/MyEtherWallet/pull/2366)
* Remove CW promo [#2377](https://github.com/MyEtherWallet/MyEtherWallet/pull/2377)

### Bug

* Fix error when user has no ens name [#2384](https://github.com/MyEtherWallet/MyEtherWallet/pull/2384)

### Release v5.6.1

### Devop

* Remove Maker SAI and replace with info and links regarding its shutdown [#2355](https://github.com/MyEtherWallet/MyEtherWallet/pull/2355)
* Implement small refinements to dex.ag[#2323](https://github.com/MyEtherWallet/MyEtherWallet/pull/2323)
* Remove etc classic [#2331](https://github.com/MyEtherWallet/MyEtherWallet/pull/2331)
* Fix mobile menu icons [#2305](https://github.com/MyEtherWallet/MyEtherWallet/pull/2305)
* Add warning for gas too high [#2363](https://github.com/MyEtherWallet/MyEtherWallet/pull/2363)

### Bug

* Hide custom networks when not local [#2328](https://github.com/MyEtherWallet/MyEtherWallet/pull/2328)
* Add hide feature to mew wallet banner [##2315](https://github.com/MyEtherWallet/MyEtherWallet/pull/2315)
* Aave: Disable withdraw/borrow with healthfactor below 1 [#2314](https://github.com/MyEtherWallet/MyEtherWallet/pull/2314)
* Token sizing [#2327](https://github.com/MyEtherWallet/MyEtherWallet/pull/2327)
* Fix ambrpay subscription status' [#2350](https://github.com/MyEtherWallet/MyEtherWallet/pull/2350)

### Release v5.6.0

### Devop

* Update packages [#2310](https://github.com/MyEtherWallet/MyEtherWallet/pull/2310)
* Remove unstoppable domains promo [#2308](https://github.com/MyEtherWallet/MyEtherWallet/pull/2308)
* Add MEW security policy page [#2294](https://github.com/MyEtherWallet/MyEtherWallet/pull/2294)

### Feature

* Add Dex.ag [#2099](https://github.com/MyEtherWallet/MyEtherWallet/pull/2099)

### Release v5.5.5-hotfix.1

### Devop

* Migrate Bity api from V1 to V2 [#2257](https://github.com/MyEtherWallet/MyEtherWallet/pull/2257)

### Release v5.5.5

### Feature

* Turn addresses to links in hardware modal [#2254](https://github.com/MyEtherWallet/MyEtherWallet/pull/2254)
* Add/update mobile interface Address, Balance, Network blocks [#2273](https://github.com/MyEtherWallet/MyEtherWallet/pull/2273)
* Lazy load token icons [#2290](https://github.com/MyEtherWallet/MyEtherWallet/pull/2290)

### Bug

* Reimplement cx account create on account request [#2271](https://github.com/MyEtherWallet/MyEtherWallet/pull/2271)
* Bitbox sizing mismatch [#2265](https://github.com/MyEtherWallet/MyEtherWallet/pull/2265)

### Devop

* Add lint to workflows [#2292](https://github.com/MyEtherWallet/MyEtherWallet/pull/2292)
* Token Icons [#2276](https://github.com/MyEtherWallet/MyEtherWallet/pull/2276)

### Release v5.5.4

### Feature

* ENS Avatar [#2238](https://github.com/MyEtherWallet/MyEtherWallet/pull/2238)
* Unstoppable domain buy domain [#2229](https://github.com/MyEtherWallet/MyEtherWallet/pull/2229)

### Devop

* Update ATH node [#2189](https://github.com/MyEtherWallet/MyEtherWallet/pull/2189)
* Update EthCore node [#2251](https://github.com/MyEtherWallet/MyEtherWallet/pull/2251)
* Update packages [#2254](https://github.com/MyEtherWallet/MyEtherWallet/pull/2254)
* Cx workflow [#2237](https://github.com/MyEtherWallet/MyEtherWallet/pull/2237)

### Release v5.5.3

### Devop

* Scale AdEx ad to fit screen [#2245](https://github.com/MyEtherWallet/MyEtherWallet/pull/2245)
* Update packages [#2241](https://github.com/MyEtherWallet/MyEtherWallet/pull/2241)
* Update coolwallet affiliate link [#2244](https://github.com/MyEtherWallet/MyEtherWallet/pull/2244)

### Release v5.5.2

### Feature

* CX updated ui and some optimization [#1864](https://github.com/MyEtherWallet/MyEtherWallet/pull/1864)

### Devop

* Greenkeeper packages [#2227](https://github.com/MyEtherWallet/MyEtherWallet/pull/2227)
* Remove mew wallet pop up [#2217](https://github.com/MyEtherWallet/MyEtherWallet/pull/2217)

### Bug

* Fix AdEx width on smaller screens [#2232](https://github.com/MyEtherWallet/MyEtherWallet/pull/2232)
* Cx checksum address fix on sign message and tx [#2203](https://github.com/MyEtherWallet/MyEtherWallet/pull/2203)

### Release v5.5.1-hotfix.1

### Devop

* Remove woof version [#2196](https://github.com/MyEtherWallet/MyEtherWallet/pull/2196)

### Release v5.5.1

### Feature

* Add AdEx ads [#2119](https://github.com/MyEtherWallet/MyEtherWallet/pull/2119)
* Add in QR code for mew wallet [#2173](https://github.com/MyEtherWallet/MyEtherWallet/pull/2173)
* Add telegram social icon [#2167](https://github.com/MyEtherWallet/MyEtherWallet/pull/2167)
* Add BitBox 2 support [#1957](https://github.com/MyEtherWallet/MyEtherWallet/pull/1957)

### Bug

* Fix mobile menu [#1873](https://github.com/MyEtherWallet/MyEtherWallet/pull/1873)
* Fix bcvault and coolwallet [#2175](https://github.com/MyEtherWallet/MyEtherWallet/pull/2175)

### Devop

* Remove galaxy links [#2190](https://github.com/MyEtherWallet/MyEtherWallet/pull/2190)
* Update access wallet page [#2188](https://github.com/MyEtherWallet/MyEtherWallet/pull/2188)
* Switch CI to Github actions [#2168](https://github.com/MyEtherWallet/MyEtherWallet/pull/2168)
* Add force resolutions for vulnerable packages [#2174](https://github.com/MyEtherWallet/MyEtherWallet/pull/2174)

### Release v5.5.0-hotfix.1

### Bugs

* Fix walletconnet and walletlink buttons [#2169](https://github.com/MyEtherWallet/MyEtherWallet/pull/2169)

### Release v5.5.0

### Feature

* Cool Wallet integration [#2087](https://github.com/MyEtherWallet/MyEtherWallet/pull/2087)
* BCVault integration [#1990](https://github.com/MyEtherWallet/MyEtherWallet/pull/1990)
* WalletConnect & WalletLink Support [#1924](https://github.com/MyEtherWallet/MyEtherWallet/pull/1924)

### Bug

* Fix exit-to-fiat dropdown, iban indicator [#2134](https://github.com/MyEtherWallet/MyEtherWallet/pull/2134)
* Fix button positions [#2125](https://github.com/MyEtherWallet/MyEtherWallet/pull/2125)

### Devop

* Update BitBox Logo [#2120](https://github.com/MyEtherWallet/MyEtherWallet/pull/2120)
* Update BitBox Logo [#2141](https://github.com/MyEtherWallet/MyEtherWallet/pull/2141)
* Update greenkeeper packages [#2131](https://github.com/MyEtherWallet/MyEtherWallet/pull/2131)
* Add security.txt to repo [#2140](https://github.com/MyEtherWallet/MyEtherWallet/pull/2140)

### Release v5.4.3

### Devop

* Update greenkeeper packages [#2106](https://github.com/MyEtherWallet/MyEtherWallet/pull/2106)

### Feature

* Add warning for high gwei price [#2113](https://github.com/MyEtherWallet/MyEtherWallet/pull/2113)

### Bugs

* MEW Wallet modal ui changes [#2112](https://github.com/MyEtherWallet/MyEtherWallet/pull/2112)

### Release v5.4.2-hotfix.1

### Bugs

* Fix russian translations [#2105](https://github.com/MyEtherWallet/MyEtherWallet/pull/2105)

### Release v5.4.2

### Feature

* MEW Wallet UI changes [#2048](https://github.com/MyEtherWallet/MyEtherWallet/pull/2048)

### Bugs

* Fix CX issue with quicksend and network, and add more space for interface ad [#2094](https://github.com/MyEtherWallet/MyEtherWallet/pull/2094)
* Fix offline helper fee conversion [#2063](https://github.com/MyEtherWallet/MyEtherWallet/pull/2063)
* Fix logout error and fix aave bug [#2082](https://github.com/MyEtherWallet/MyEtherWallet/pull/2082)

### Devop

* New etherscan api key [#2089](https://github.com/MyEtherWallet/MyEtherWallet/pull/2089)
* ropsten ens .test set resolver [#2090](https://github.com/MyEtherWallet/MyEtherWallet/pull/2090)
* Update greenkeeper packages [#2088](https://github.com/MyEtherWallet/MyEtherWallet/pull/2088)
* Update greenkeeper packages [#2078](https://github.com/MyEtherWallet/MyEtherWallet/pull/2078)

### Release v5.4.1-hotfix.1

### Bugs

* Fix MEWconnect disconnecting soon after connecting [#2064](https://github.com/MyEtherWallet/MyEtherWallet/pull/2064)

### Release v5.4.1

### Bugs

* Fix network changer [#2054](https://github.com/MyEtherWallet/MyEtherWallet/pull/2054)
* Send Offline helper transaction fee [#2058](https://github.com/MyEtherWallet/MyEtherWallet/pull/2058)
* Add burner address warning, redo store so all addresses currently stored are uniform [#2049](https://github.com/MyEtherWallet/MyEtherWallet/pull/2049)
* Revert one time check [#2053](https://github.com/MyEtherWallet/MyEtherWallet/pull/2053)
* Fix Buy ETH Widget bug [#2046](https://github.com/MyEtherWallet/MyEtherWallet/pull/2046)
* Fix KB link [#2047](https://github.com/MyEtherWallet/MyEtherWallet/pull/2047)

### Devop

* WS reconnect on disconnect [#2057](https://github.com/MyEtherWallet/MyEtherWallet/pull/2057)
* Hardcode russian translation for first time welcome modal [#2041](https://github.com/MyEtherWallet/MyEtherWallet/pull/2041)
* update client library for mew mobile and fix 500 DAI + kyber swap gas limit [#2029](https://github.com/MyEtherWallet/MyEtherWallet/pull/2029)
* Add aave referral code [#2040](https://github.com/MyEtherWallet/MyEtherWallet/pull/2040/files)
* Update packages [#2040](https://github.com/MyEtherWallet/MyEtherWallet/pull/2040)
* Sync master to develop, fix uuid issue [#2023](https://github.com/MyEtherWallet/MyEtherWallet/pull/2023)
* Harden CSP [#2016](https://github.com/MyEtherWallet/MyEtherWallet/pull/2016)

### Release v5.4.0

### Feature

* Aave [#1728](https://github.com/MyEtherWallet/MyEtherWallet/pull/1728)

### Devop

* Change translation string [#2000](https://github.com/MyEtherWallet/MyEtherWallet/pull/2000)
* Fix Exit to Fiat to correspond with backend changes [#2002](https://github.com/MyEtherWallet/MyEtherWallet/pull/2002)
* Update aave copy [#2011](https://github.com/MyEtherWallet/MyEtherWallet/pull/2011)
* Change social icons display [#2003](https://github.com/MyEtherWallet/MyEtherWallet/pull/2003)
* Update aave copy [#2020](https://github.com/MyEtherWallet/MyEtherWallet/pull/2020)

### Bugs

* Fix save ui [#1972](https://github.com/MyEtherWallet/MyEtherWallet/pull/1972)
* Partial fix to downloading keystore file in view wallet [#1997](https://github.com/MyEtherWallet/MyEtherWallet/pull/1997)
* Fix aave bugs [#2018](https://github.com/MyEtherWallet/MyEtherWallet/pull/2018)

### Release v5.3.3-hotfix.2

### Hotfix

* remove keepalive net_version calls [#2009](https://github.com/MyEtherWallet/MyEtherWallet/pull/2009)

### Release v5.3.3-hotfix.1

### Hotfix

* Fix NFT load issue [#2001](https://github.com/MyEtherWallet/MyEtherWallet/pull/2001)

### Bug

* check if reset copy exists before replacing nft list with copy [#2013](https://github.com/MyEtherWallet/MyEtherWallet/pull/2013)

### Release v5.3.3

### Bug

* Fix mnemonic phrase for current version [#1985](https://github.com/MyEtherWallet/MyEtherWallet/pull/1985)
* Fix incorrect variable used to check maker setup complete [#1985](https://github.com/MyEtherWallet/MyEtherWallet/pull/1985)
* Some bug fixes [#1978](https://github.com/MyEtherWallet/MyEtherWallet/pull/1978)
* Fix DAI Icon [#1977](https://github.com/MyEtherWallet/MyEtherWallet/pull/1977)

### Devop

* Add CAD and JPY as Simplex currencies [#1887](https://github.com/MyEtherWallet/MyEtherWallet/pull/1887)
* Update NFT manager to use new API [#1898](https://github.com/MyEtherWallet/MyEtherWallet/pull/1898)
* Remove iosiro as blacklist source - Update NFT manager to use new API [#1997](https://github.com/MyEtherWallet/MyEtherWallet/pull/1997)

### Release v5.3.2-hotfix.1

### Hotfix

* Resolver domains ens url [#1974](https://github.com/MyEtherWallet/MyEtherWallet/pull/1974)

### Release v5.3.2

### Feature

* Update icons [#1961](https://github.com/MyEtherWallet/MyEtherWallet/pull/1961)

### Devop

* Update greenkeeper package [#1954](https://github.com/MyEtherWallet/MyEtherWallet/pull/1954)
* Update team page [#1952](https://github.com/MyEtherWallet/MyEtherWallet/pull/1952)
* Maintenace due to new ENS registry [#1951](https://github.com/MyEtherWallet/MyEtherWallet/pull/1951)

### Bug

* Link fixes [#1963](https://github.com/MyEtherWallet/MyEtherWallet/pull/1963)

### Release v5.3.1-hotfix.1

### Bug

* Remove excessive web3 calls from cx [#1955](https://github.com/MyEtherWallet/MyEtherWallet/pull/1955)

### Release v5.3.1

### Devop

* add support for lang based paths /en /ru [#1915](https://github.com/MyEtherWallet/MyEtherWallet/pull/1915)
* Update web3 packages [#1912](https://github.com/MyEtherWallet/MyEtherWallet/pull/1912)
* Green keeper packages [#1938](https://github.com/MyEtherWallet/MyEtherWallet/pull/1938)

### Release v5.3.0-hotfix.1

### Devop

* Support for new ENS registry [#1923](https://github.com/MyEtherWallet/MyEtherWallet/pull/1923)

### Release v5.3.0

### Feature

* ENS functionality for address book [#1888](https://github.com/MyEtherWallet/MyEtherWallet/pull/1888)

### Devop

* Update packages from Greenkeeper [#1920](https://github.com/MyEtherWallet/MyEtherWallet/pull/1920)
* Update help to quick help [#1899](https://github.com/MyEtherWallet/MyEtherWallet/pull/1899)
* Update packages from Greenkeeper [#1896](https://github.com/MyEtherWallet/MyEtherWallet/pull/1896)
* Modularize store state [#1722](https://github.com/MyEtherWallet/MyEtherWallet/pull/1722)

### Bug

* Fix broken string [#1918](https://github.com/MyEtherWallet/MyEtherWallet/pull/1918)
* Change translations placement [#1901](https://github.com/MyEtherWallet/MyEtherWallet/pull/1901)
* Fix community icons spacing and size [#1889](https://github.com/MyEtherWallet/MyEtherWallet/pull/1889)
* Fix background image for welcome popup [#1886](https://github.com/MyEtherWallet/MyEtherWallet/pull/1886)
* Fix footer text wrapping issue [#1892](https://github.com/MyEtherWallet/MyEtherWallet/pull/1892)
* Set ENS in offline helper [#1891](https://github.com/MyEtherWallet/MyEtherWallet/pull/1891)
* Fix modularize state bugs [#1897](https://github.com/MyEtherWallet/MyEtherWallet/pull/1897)

### Release v5.2.11

### Feature

* Add vkontakte icon to social home page and add first time russian popup [#1872](https://github.com/MyEtherWallet/MyEtherWallet/pull/1872)
* Add unstoppable domains [#1857](https://github.com/MyEtherWallet/MyEtherWallet/pull/1857)

### Devop

* Update ledger packages [#1884](https://github.com/MyEtherWallet/MyEtherWallet/pull/1884)
* Run update:swap with other update script [#1859](https://github.com/MyEtherWallet/MyEtherWallet/pull/1859)
* Update translations [#1870](https://github.com/MyEtherWallet/MyEtherWallet/pull/1870)
* Update Packages from greenkeeper [#1863](https://github.com/MyEtherWallet/MyEtherWallet/pull/1863)
* Remove Price bar [#1876](https://github.com/MyEtherWallet/MyEtherWallet/pull/1876)

### Bug

* Fix tx hash link, switch address, and make cx connection with popup more stable [#1853](https://github.com/MyEtherWallet/MyEtherWallet/pull/1853)
* Disable web3 detection [#1840](https://github.com/MyEtherWallet/MyEtherWallet/pull/1840)
* Improve error messages for outdated dependencies [#1848](https://github.com/MyEtherWallet/MyEtherWallet/pull/1848)
* Remove excess maker wording and add to translations [#1853](https://github.com/MyEtherWallet/MyEtherWallet/pull/1853)
* Remove permanent hide on issue modal [#1856](https://github.com/MyEtherWallet/MyEtherWallet/pull/1856)

### Release v5.2.10

### Bug

* Avoid incompatible Node 12 [#1845](https://github.com/MyEtherWallet/MyEtherWallet/pull/1845)
* Fix error log details size [#1837](https://github.com/MyEtherWallet/MyEtherWallet/pull/1837)
* Hide other translations on mobile [#1834](https://github.com/MyEtherWallet/MyEtherWallet/pull/1834)
* Fix translations for address book [#1833](https://github.com/MyEtherWallet/MyEtherWallet/pull/1833)
* Fix checks/updates for address [#1842](https://github.com/MyEtherWallet/MyEtherWallet/pull/1842)

### Devop

* Add EtherCore support [#1825](https://github.com/MyEtherWallet/MyEtherWallet/pull/1825)
* Migrate Webchain to Mintme [#1824](https://github.com/MyEtherWallet/MyEtherWallet/pull/1824)
* Update ETC explorrer links [#1855](https://github.com/MyEtherWallet/MyEtherWallet/pull/1855)
* Update packages [#1852](https://github.com/MyEtherWallet/MyEtherWallet/pull/1852/files#diff-b9cfc7f2cdf78a7f4b91a753d10865a2R61)

### Release v5.2.9

### Feature

* Update error log modal design [#1816](https://github.com/MyEtherWallet/MyEtherWallet/pull/1816)
* Update address book [#1795](https://github.com/MyEtherWallet/MyEtherWallet/pull/1795)

### Devop

* Release cleanup [#1817](https://github.com/MyEtherWallet/MyEtherWallet/pull/1817)
* Update NFT manager UI [#1808](https://github.com/MyEtherWallet/MyEtherWallet/pull/1808)
* Notification pruning[#1755](https://github.com/MyEtherWallet/MyEtherWallet/pull/1755)
* Enable translations dropdown and add in the other languages [#1703](https://github.com/MyEtherWallet/MyEtherWallet/pull/1703)
* Reduce injected web3 file size to less than 1mb [#1813](https://github.com/MyEtherWallet/MyEtherWallet/pull/1813)
* Display information related to kyber slippage for high values [#1794](https://github.com/MyEtherWallet/MyEtherWallet/pull/1794)
* Notification pruning[#1755](https://github.com/MyEtherWallet/MyEtherWallet/pull/1755)
* Add gasLimit field to batch transactions[#1702](https://github.com/MyEtherWallet/MyEtherWallet/pull/1702)
* Manually update locally stored networks [#1810](https://github.com/MyEtherWallet/MyEtherWallet/pull/1810)

### Bug

* Fix footer elements margin and paddings [#1827](https://github.com/MyEtherWallet/MyEtherWallet/pull/1827)
* Fix swap confirmation modal text break [#1821](https://github.com/MyEtherWallet/MyEtherWallet/pull/1821)
* Fix swap confirmation modal text break [#1819](https://github.com/MyEtherWallet/MyEtherWallet/pull/1819)
* Fix currency picker freeze [#1820](https://github.com/MyEtherWallet/MyEtherWallet/pull/1820)
* Ui fix maker dai [#1787](https://github.com/MyEtherWallet/MyEtherWallet/pull/1787)
* Hide blockexplorrer link on irrelevant pages and add back tx history for cx header [#1800](https://github.com/MyEtherWallet/MyEtherWallet/pull/1800)
* Fix issue with withdrawing ETH from CDP [#1811](https://github.com/MyEtherWallet/MyEtherWallet/pull/1811)
* Fix header items for other languages [#1791](https://github.com/MyEtherWallet/MyEtherWallet/pull/1791)
* Fix NFT Loading [#1831](https://github.com/MyEtherWallet/MyEtherWallet/pull/1831)
* Update mewcx wording [#1829](https://github.com/MyEtherWallet/MyEtherWallet/pull/1829)
* Sort address book and compare add address by lowercase [#1828](https://github.com/MyEtherWallet/MyEtherWallet/pull/1828)

### Release v5.2.8-hotfix.2

### Bug

* Fix error with send-offline-helper page load [#1790](https://github.com/MyEtherWallet/MyEtherWallet/pull/1790)

### Release v5.2.8-hotfix.1

### Bug

* Fix Schedule View [#1781](https://github.com/MyEtherWallet/MyEtherWallet/pull/1781)

### Release v5.2.8

### Bug

* Catch error when cryptokitties api 500s [#1775](https://github.com/MyEtherWallet/MyEtherWallet/pull/1775)
* Fix resolver when currency is ethereum token [#1774](https://github.com/MyEtherWallet/MyEtherWallet/pull/1774)
* Might be a fix to that intermittent error after logging out [#1773](https://github.com/MyEtherWallet/MyEtherWallet/pull/1773)
* Receive function instead of attaching to parent on standard button [#1763](https://github.com/MyEtherWallet/MyEtherWallet/pull/1763)
* Fix offline send helper & out of memory error on local build [#1741](https://github.com/MyEtherWallet/MyEtherWallet/pull/1741)
* Fix Schedule Transaction, Drop Down Bug [#1747](https://github.com/MyEtherWallet/MyEtherWallet/pull/1747)
* Unable to unzip message on Windows and Mac OSX because of two files with same name but different case [#1757](https://github.com/MyEtherWallet/MyEtherWallet/pull/1757)
* Fix leftover issue with token search [#1749](https://github.com/MyEtherWallet/MyEtherWallet/pull/1749)
* Check correct balance when determining ability to withdraw[#1754](https://github.com/MyEtherWallet/MyEtherWallet/pull/1754)
* Fix offline send helper & out of memory error on local build [#1741](https://github.com/MyEtherWallet/MyEtherWallet/pull/1741)
* Fix Chrome ex medium size layout for every components [#1730](https://github.com/MyEtherWallet/MyEtherWallet/pull/1730)

### Devop

* Revert trezor version back to 7[#1737](https://github.com/MyEtherWallet/MyEtherWallet/pull/1772)
* Refactor maker translations[#1737](https://github.com/MyEtherWallet/MyEtherWallet/pull/1737)
* Add new MEW nodes[#1750](https://github.com/MyEtherWallet/MyEtherWallet/pull/1750)
* Fix UI overflow [#1776](https://github.com/MyEtherWallet/MyEtherWallet/pull/1776)

### Release v5.2.7

### Bug

* Fix verify signature [#1729](https://github.com/MyEtherWallet/MyEtherWallet/pull/1729)
* Fix top banner buttons [#1715](https://github.com/MyEtherWallet/MyEtherWallet/pull/1715)
* MEW CX memory leak on access wallet + fix mnemonic [#1733](https://github.com/MyEtherWallet/MyEtherWallet/pull/1733)
* Fix text align and font sizes for Policy and Terms of Service [#1734](https://github.com/MyEtherWallet/MyEtherWallet/pull/1734)

### Devop

* Refactor translations [#1732](https://github.com/MyEtherWallet/MyEtherWallet/pull/1732)

### Release v5.2.6

### Bug

* Fix ens on custom networks [#1714](https://github.com/MyEtherWallet/MyEtherWallet/pull/1714)
* Fix clear, dropdown, change ENS char translations [#1713](https://github.com/MyEtherWallet/MyEtherWallet/pull/1713)
* Fix message signature not showing up [#1719](https://github.com/MyEtherWallet/MyEtherWallet/pull/1719)
* Fix nft send [#1724](https://github.com/MyEtherWallet/MyEtherWallet/pull/1724)
* Fix clear on send that switches to always eth instead of network currency [#1723](https://github.com/MyEtherWallet/MyEtherWallet/pull/1723)

### Release v5.2.5-hotfix.1

### Bug

* Fix resolver to include BTC and other currencies [#1706](https://github.com/MyEtherWallet/MyEtherWallet/pull/1706)
* Add link terms of service link. [#1704](https://github.com/MyEtherWallet/MyEtherWallet/pull/1704)

### Release v5.2.5

### Bug

* Fix MEWCX mobile ui [#1657](https://github.com/MyEtherWallet/MyEtherWallet/pull/1657)
* Redirect MEWconnect link [#1687](https://github.com/MyEtherWallet/MyEtherWallet/pull/1687)
* ENS name, translations, styles [#1684](https://github.com/MyEtherWallet/MyEtherWallet/pull/1684)

### Devop

* Update makerDAO dai branding [#1668](https://github.com/MyEtherWallet/MyEtherWallet/pull/1668)
* Update translations[#1651](https://github.com/MyEtherWallet/MyEtherWallet/pull/1651)
* Display token symbol [#1674](https://github.com/MyEtherWallet/MyEtherWallet/pull/1674)
* Refactor translations [#1682](https://github.com/MyEtherWallet/MyEtherWallet/pull/1682)
* Add support for MEWconnect api v2 [#1288](https://github.com/MyEtherWallet/MyEtherWallet/pull/1288)

### Feature

* Add MEWconnect footer link [#1675](https://github.com/MyEtherWallet/MyEtherWallet/pull/1675)
* Display label paths [#1681](https://github.com/MyEtherWallet/MyEtherWallet/pull/1681)
* Address book [#1647](https://github.com/MyEtherWallet/MyEtherWallet/pull/1647)
* Add MEWconnect footer link [#1675](https://github.com/MyEtherWallet/MyEtherWallet/pull/1675)
* Add clear btn to forms [#1673](https://github.com/MyEtherWallet/MyEtherWallet/pull/1673)
* Add Mult-Collateral Dai support [#1575](https://github.com/MyEtherWallet/MyEtherWallet/pull/1575)
* Update TOS [#1685](https://github.com/MyEtherWallet/MyEtherWallet/pull/1685)

### Release v5.2.4

### Devop

* Gas limit update for large eth to dai via kyber, disable usdt for changelly [#1671](https://github.com/MyEtherWallet/MyEtherWallet/pull/1671)
* Update packages [#1669](https://github.com/MyEtherWallet/MyEtherWallet/pull/1669)
* Make use of River nodes [#1568](https://github.com/MyEtherWallet/MyEtherWallet/pull/1568)

### Release v5.2.3-hotfix.2

### Devop

* Use ens register with config to optimize ens registration [#1646](https://github.com/MyEtherWallet/MyEtherWallet/pull/1646)

### Bug

* Fix toBuffer [#1658](https://github.com/MyEtherWallet/MyEtherWallet/pull/1658)
* Fix dashboard dapps [#1650](https://github.com/MyEtherWallet/MyEtherWallet/pull/1650)
* Fix MEWCX PromiEvent [#1646](https://github.com/MyEtherWallet/MyEtherWallet/pull/1646)

### Release v5.2.3-hotfix.1

### Bug

* Fix send transaction page

### Release v5.2.3

### Devop

* Add translation guidelines to dapp_integration.md and PR guide [#1617](https://github.com/MyEtherWallet/MyEtherWallet/pull/1617)
* reduce coin image count from 656 to 34 [#1601](https://github.com/MyEtherWallet/MyEtherWallet/pull/1601)pull/1618)
* Sort Dapps by integration/release dates [#1619](https://github.com/MyEtherWallet/MyEtherWallet/pull/1619)
* Update web3 icons [#1614](https://github.com/MyEtherWallet/MyEtherWallet/pull/1614)
* Update ENS length [#1636](https://github.com/MyEtherWallet/MyEtherWallet/pull/1636)
* reduce coin image count from 656 to 34 [#1601](https://github.com/MyEtherWallet/MyEtherWallet/pull/1601)
* Add rel="noopener noreferrer" to links [#1618](https://github.com/MyEtherWallet/MyEtherWallet/pull/1618)
* Refactor translations [#1475](https://github.com/MyEtherWallet/MyEtherWallet/pull/1475)
* Improve handling of failure to get rates, offline, and restrict usage to main net [#1587](https://github.com/MyEtherWallet/MyEtherWallet/pull/1587)

### Bug

* Web3 modal weird behavior [#1613](https://github.com/MyEtherWallet/MyEtherWallet/pull/1613)
* Fix sentry error on user login [#1615](https://github.com/MyEtherWallet/MyEtherWallet/pull/1615)
* Send Offline Helper export actual data [#1637](https://github.com/MyEtherWallet/MyEtherWallet/pull/1637)
* Reset modal variable so it reopens account request [#1640](https://github.com/MyEtherWallet/MyEtherWallet/pull/1640)

### Release v5.2.2

### Feature

* XWallet Integration [#1609](https://github.com/MyEtherWallet/MyEtherWallet/pull/1609)

### Release v5.2.1-hotfix.1

### Bug

* Correct wrong property path for config object in wallet.worker.js [#1604](https://github.com/MyEtherWallet/MyEtherWallet/pull/1604)
* Increase ENS register wait time to 90 seconds to provide an additional buffer [#1605](https://github.com/MyEtherWallet/MyEtherWallet/pull/1605)
* Fix web3 out of gas error [#1607](https://github.com/MyEtherWallet/MyEtherWallet/pull/1607)
* Fix spacing between footer list items [#1599](https://github.com/MyEtherWallet/MyEtherWallet/pull/1599)

### Release v5.2.1

### Feature

* Ambrpay Integration [#1441](https://github.com/MyEtherWallet/MyEtherWallet/pull/1441)
* Update Dapp Submission UI [#1585](https://github.com/MyEtherWallet/MyEtherWallet/pull/1585)

### Bug

* Various web and cx bugs [#1594](https://github.com/MyEtherWallet/MyEtherWallet/pull/1594)
* Fix copy to actually copy signed tx, not raw on offline tx [#1590](https://github.com/MyEtherWallet/MyEtherWallet/pull/1590)
* Remove lighstreams on ledger options, show custom if found [#1589](https://github.com/MyEtherWallet/MyEtherWallet/pull/1589)
* Various web and cx bugs [#1594](https://github.com/MyEtherWallet/MyEtherWallet/pull/1594)

### Release v5.2.0

### Feature

* Chrome Extension Beta release [#1151](https://github.com/MyEtherWallet/MyEtherWallet/pull/1151)

### Bug

* Fix dashboard buttons, fix missing image [#1588](https://github.com/MyEtherWallet/MyEtherWallet/pull/1588)

### Devop

* Add hackerone link to README for vulnerability reporting [#1577](https://github.com/MyEtherWallet/MyEtherWallet/pull/1577)
* bitbox: update semantic versioning to be less restrictive [#1582](https://github.com/MyEtherWallet/MyEtherWallet/pull/1582)

### Release v5.1.9

### Devop

* persist selected swap provider over rate refresh cycles [#1552](https://github.com/MyEtherWallet/MyEtherWallet/pull/1552)

### Feature

* Ens TXT records support [#1559](https://github.com/MyEtherWallet/MyEtherWallet/pull/1559)

### Bug

* Fix scrolltop issue, keep one collapse open on network address modal [#1561](https://github.com/MyEtherWallet/MyEtherWallet/pull/1561)
* Fix ENS empty address issue [#1573](https://github.com/MyEtherWallet/MyEtherWallet/pull/1573)
* Fix Schedule Transaction button [#1574](https://github.com/MyEtherWallet/MyEtherWallet/pull/1574)

### Release v5.1.8-hotfix.1

### Hotfix

* Update list to bring back contract addresses [#1567](https://github.com/MyEtherWallet/MyEtherWallet/pull/1567)

### Release v5.1.8

### Bug

* Fix total NFT issue [#1550](https://github.com/MyEtherWallet/MyEtherWallet/pull/1550)

### Devop

* Fix new BTC multicoin encoding and add new currency types [#1551](https://github.com/MyEtherWallet/MyEtherWallet/pull/1551)
* update egem [#1548](https://github.com/MyEtherWallet/MyEtherWallet/pull/1548)

### Release v5.1.7

### Feature

* Multicoin ENS support [#1521](https://github.com/MyEtherWallet/MyEtherWallet/pull/1521)
* Move State of the Dapp text to the left column [#1518](https://github.com/MyEtherWallet/MyEtherWallet/pull/1518)

### Bug

* transferDomain func fix on ROP [#1538](https://github.com/MyEtherWallet/MyEtherWallet/pull/1538)
* Fix mnemonic phrase validation [#1506](https://github.com/MyEtherWallet/MyEtherWallet/pull/1506)
* Fix value on interact/deploy contract [#1502](https://github.com/MyEtherWallet/MyEtherWallet/pull/1502)
* Fix ENS subdomain issue [#1547](https://github.com/MyEtherWallet/MyEtherWallet/pull/1547)

### Devop

* Fix static "help" and "tutorial" button size and position [#1531](https://github.com/MyEtherWallet/MyEtherWallet/pull/1531)
* Remove Ethereum commonwealth nodes in case they shut it down [#1507](https://github.com/MyEtherWallet/MyEtherWallet/pull/1507)
* App optimization [#1519](https://github.com/MyEtherWallet/MyEtherWallet/pull/1519)
* changelly timeout error handling [#1522](https://github.com/MyEtherWallet/MyEtherWallet/pull/1522)

### Release v5.1.6

### Feature

* Dapp submission page [#1339](https://github.com/MyEtherWallet/MyEtherWallet/pull/1339)

### Devop

* Remove Aldo from team page [#1482](https://github.com/MyEtherWallet/MyEtherWallet/pull/1482)
* Add decision tree [#1442](https://github.com/MyEtherWallet/MyEtherWallet/pull/1442)
* Update packages [#1474](https://github.com/MyEtherWallet/MyEtherWallet/pull/1474)

### Bug

* Fix Goerli erroring when set to default [#1488](https://github.com/MyEtherWallet/MyEtherWallet/pull/1488)

### Release v5.1.5

### Feature

* Add network to query [#1460](https://github.com/MyEtherWallet/MyEtherWallet/pull/1460)

### Bug

* Fix check for login to metamask wallet [#1457](https://github.com/MyEtherWallet/MyEtherWallet/pull/1457)

### Devop

* Custom NFTs [#1403](https://github.com/MyEtherWallet/MyEtherWallet/pull/1403)
* Fix browser audit issues [#1428](https://github.com/MyEtherWallet/MyEtherWallet/pull/1428)
* Update greenkeeper packages [#1453](https://github.com/MyEtherWallet/MyEtherWallet/pull/1453)
* Update Ella links [#1454](https://github.com/MyEtherWallet/MyEtherWallet/pull/1454)
* Font fix [#1465](https://github.com/MyEtherWallet/MyEtherWallet/pull/1465)

### Release v5.1.4

### Devop

* More tests [#1435](https://github.com/MyEtherWallet/MyEtherWallet/pull/1435)

### Bug

* Fix generate mnemonic [#1439](https://github.com/MyEtherWallet/MyEtherWallet/pull/1439)
* Gas price not saving properly [#1434](https://github.com/MyEtherWallet/MyEtherWallet/pull/1434)
* Fix u2f timeout for bitbox on windows [#1423](https://github.com/MyEtherWallet/MyEtherWallet/pull/1423)

### Release v5.1.3

### Feature

* Add ETC Coop Node [#1418](https://github.com/MyEtherWallet/MyEtherWallet/pull/1418)
* Add Ethercluster and ETC Coop Node [#1407](https://github.com/MyEtherWallet/MyEtherWallet/pull/1407)

### Bug

* Network changing throws an error [#1424](https://github.com/MyEtherWallet/MyEtherWallet/pull/1424)
* Fix network mismatch when using metamask [#1384](https://github.com/MyEtherWallet/MyEtherWallet/pull/1384)
* Restrict gas price minimum to 1 gwei [#1386](https://github.com/MyEtherWallet/MyEtherWallet/pull/1386)
* Fix the bug when user expend the token list, footer breaks [#1396](https://github.com/MyEtherWallet/MyEtherWallet/pull/1396)
* Fix the Buy subdomain feature and removed auction from ENS [#1409](https://github.com/MyEtherWallet/MyEtherWallet/pull/1409)
* Remove deedOwner from ManageENS and fix getting ENS owner [#1425](https://github.com/MyEtherWallet/MyEtherWallet/pull/1425)

### Devop

* Sentry fixes, additional ledger errors, handle unlock wallet if wallet is null [#1394](https://github.com/MyEtherWallet/MyEtherWallet/pull/1394)
* Fix finney modal layout [#1392](https://github.com/MyEtherWallet/MyEtherWallet/pull/1392)
* Updated Bootstrap Vue. [#1393](https://github.com/MyEtherWallet/MyEtherWallet/pull/1393)
* Compress images, Remove unused images and components [#1389](https://github.com/MyEtherWallet/MyEtherWallet/pull/1389)
* Restore valid Lightsreams network [#1350](https://github.com/MyEtherWallet/MyEtherWallet/pull/1350)
* Update packages [#1419](https://github.com/MyEtherWallet/MyEtherWallet/pull/1419)

### Release v5.1.2

### Devop

* Fix dashboard "MEW connect", "Buy ETH" buttons layout [#1376](https://github.com/MyEtherWallet/MyEtherWallet/pull/1376)
* Fix Buy Eth to Buy ETH [#1361](https://github.com/MyEtherWallet/MyEtherWallet/pull/1361)
* Dashboard -> Actions & Swap button style update [#1365](https://github.com/MyEtherWallet/MyEtherWallet/pull/1365)
* Add warning message to HTTP Basic Access Authentication [#1364](https://github.com/MyEtherWallet/MyEtherWallet/pull/1364)
* Upgrade web3.js to 1.2.1 [#1348](https://github.com/MyEtherWallet/MyEtherWallet/pull/1348)
* Update qrcode modal to be mobile friendly [#1366](https://github.com/MyEtherWallet/MyEtherWallet/pull/1366)
* Update UI custom token UI [1367](https://github.com/MyEtherWallet/MyEtherWallet/pull/1367)
* Fix Buy Eth to Buy ETH [#1361](https://github.com/MyEtherWallet/MyEtherWallet/pull/1361)
* Add "Please wait while we generate your keystore file..." to keystorebutton. [#1363](https://github.com/MyEtherWallet/MyEtherWallet/pull/1363)

### Bug

* Fix incorrect rate display [#1368](https://github.com/MyEtherWallet/MyEtherWallet/pull/1368)
* Fix scroll up animation glitch on mobile [#1358](https://github.com/MyEtherWallet/MyEtherWallet/pull/1358)

### Release v5.1.1-hotfix.1

### Bug

* Fix issues related to address switching [#1355](https://github.com/MyEtherWallet/MyEtherWallet/pull/1355)
* Fix missing buttons in maker dapp, and some general housekeeping [#1352](https://github.com/MyEtherWallet/MyEtherWallet/pull/1352)

### Devop

* Remove Safesend Dapp [#1346](https://github.com/MyEtherWallet/MyEtherWallet/pull/1346)
* Add hover effect to Dashboard -> Swap buttons [#1353](https://github.com/MyEtherWallet/MyEtherWallet/pull/1353)
* Add Changelly to Dashboard -> Swap description [#1356](https://github.com/MyEtherWallet/MyEtherWallet/pull/1356)

### Release v5.1.1

### Feature

* Add Buy Eth Button to nav bar, standardize dapp header layout [#1330](https://github.com/MyEtherWallet/MyEtherWallet/pull/1330)

### Devop

* Update packages [#1344](https://github.com/MyEtherWallet/MyEtherWallet/pull/1344)
* Update UI frontpage FAQs block [#1332](https://github.com/MyEtherWallet/MyEtherWallet/pull/1332)
* Add xss custom config [#1326](https://github.com/MyEtherWallet/MyEtherWallet/pull/1326)

### Bug

* Fix scroll up button position [#1331](https://github.com/MyEtherWallet/MyEtherWallet/pull/1331)
* Fix text translations [#1329](https://github.com/MyEtherWallet/MyEtherWallet/pull/1329)
* Fix Mobile UI Scan to Download mobile [#1333](https://github.com/MyEtherWallet/MyEtherWallet/pull/1333)
* By Mnemonic Phrase layout bug fix [#1347](https://github.com/MyEtherWallet/MyEtherWallet/pull/1347)

### Release v5.1.0

### Feature

* Add Dashboard and NFT Manager [#1269](https://github.com/MyEtherWallet/MyEtherWallet/pull/1269)

### Release v5.0.16-hotfix.1

### Devop

* Fix toast xss issue [#1306](https://github.com/MyEtherWallet/MyEtherWallet/pull/1306)
* Set gasPrice of TXs to Global value [#1305](https://github.com/MyEtherWallet/MyEtherWallet/pull/1305)
* Update team info and pictures [#1304](https://github.com/MyEtherWallet/MyEtherWallet/pull/1304)

### Release v5.0.16

### Feature

* Lightstreams network support [#1257](https://github.com/MyEtherWallet/MyEtherWallet/pull/1257)

### Devop

* Add new team members into the team page [#1302](https://github.com/MyEtherWallet/MyEtherWallet/pull/1302)
* Add proxy notice to moveCDP modal, improve swap widget [#1251](https://github.com/MyEtherWallet/MyEtherWallet/pull/1251)

### Bug

* Fix #1249 and #1205 [#1250](https://github.com/MyEtherWallet/MyEtherWallet/pull/1250)
* Display "Advanced" section on "Send Transaction" page if data or gas limit fields are prefilled by url query params [#1260](https://github.com/MyEtherWallet/MyEtherWallet/pull/1260)
* Fix custom network addition and notifications when you send gazillion ETH [#1293](https://github.com/MyEtherWallet/MyEtherWallet/pull/1293)
* Logout warning modal redirect to current page instead of home page [#1297](https://github.com/MyEtherWallet/MyEtherWallet/pull/1297)
* Custom networks not showing on send offline helper [#1285](https://github.com/MyEtherWallet/MyEtherWallet/pull/1285)
* Fix webworker error when origin is null [#1273](https://github.com/MyEtherWallet/MyEtherWallet/pull/1273)

### Devop

* Add MEWTopia link [#1275](https://github.com/MyEtherWallet/MyEtherWallet/pull/1275)
* Sentry Fixes [#1295](https://github.com/MyEtherWallet/MyEtherWallet/pull/1295)

### Release v5.0.15

### Bug

* Fix withdraw ETH with infinite collateralization [#1244](https://github.com/MyEtherWallet/MyEtherWallet/pull/1244)
* Fix the BitBox hardware wallet communication error introduced with Chrome 73 [#1209](https://github.com/MyEtherWallet/MyEtherWallet/pull/1209)
* Fix error message display for the BitBox hardware wallet [#1209](https://github.com/MyEtherWallet/MyEtherWallet/pull/1209)

### Release v5.0.14-hotfix.2

### Bug

* Fix Typo [#1198](https://github.com/MyEtherWallet/MyEtherWallet/pull/1198)
* Fix Secalot throwing exception [#1194](https://github.com/MyEtherWallet/MyEtherWallet/pull/1194)

### Devop

* Cleanup greenkeeper branches [#1203](https://github.com/MyEtherWallet/MyEtherWallet/pull/1203)
* Add subdomains [#1186](https://github.com/MyEtherWallet/MyEtherWallet/pull/1186)

### Release v5.0.14-hotfix.1

### Bug

* Fix send tx for custom chains [#1184](https://github.com/MyEtherWallet/MyEtherWallet/pull/1184)

### Release v5.0.14

### Feature

* Maker Integration [#740](https://github.com/MyEtherWallet/MyEtherWallet/pull/740)
* Pocket Network Integration [#1226](https://github.com/MyEtherWallet/MyEtherWallet/pull/1262)

### Bug

* Fix getAddressString null issue, update ethereumjs-tx [#1163](https://github.com/MyEtherWallet/MyEtherWallet/pull/1163)
* Add better errors on send, disable register on ens when no balance [#1173](https://github.com/MyEtherWallet/MyEtherWallet/pull/1173)
* Fix Private Key network error on access [#1166](https://github.com/MyEtherWallet/MyEtherWallet/pull/1166)

### Release v5.0.13

### Devop

* AWS sync with --exact-timestamps flag [#1117](https://github.com/MyEtherWallet/MyEtherWallet/pull/1117)
* Support 32bits chainID [#959](https://github.com/MyEtherWallet/MyEtherWallet/pull/959)

### Bug

* Broken link in getting started [#1154](https://github.com/MyEtherWallet/MyEtherWallet/pull/1154)
* Fix broken custom derivation paths & Remove -1 as an allowed gas limit value [#1133](https://github.com/MyEtherWallet/MyEtherWallet/pull/1133)
* Various fixes for Metamask, Trezor, interact with contract, and deploy contract [#1125](https://github.com/MyEtherWallet/MyEtherWallet/pull/1125)
* Fix front page spaceman animation [#1147](https://github.com/MyEtherWallet/MyEtherWallet/pull/1147)
* Update UI for Verify Message page [#1146](https://github.com/MyEtherWallet/MyEtherWallet/pull/1146)
* Fix UI for Hardware modal [#1140](https://github.com/MyEtherWallet/MyEtherWallet/pull/1140)
* Ui fix for password modal [#1135](https://github.com/MyEtherWallet/MyEtherWallet/pull/1135)
* UI update for mobile network, balance [#1134](https://github.com/MyEtherWallet/MyEtherWallet/pull/1134)
* UI update for Send Offline Helper, Convert Units, Buy a Hardware wallet [#1129](https://github.com/MyEtherWallet/MyEtherWallet/pull/1129)
* Term and conditions, Privacy policy UI fix [#1128](https://github.com/MyEtherWallet/MyEtherWallet/pull/1128)

### Release v5.0.12-hotfix.2

### Bug

* Fix ENS migrate owner check [#1103](https://github.com/MyEtherWallet/MyEtherWallet/pull/1103)
* Fixes refresh page on mnemonic wallet submit [#1108](https://github.com/MyEtherWallet/MyEtherWallet/pull/1108)

### Release v5.0.12-hotfix.1

### Bug

* Use u2f in windows for ledger [#1100](https://github.com/MyEtherWallet/MyEtherWallet/pull/1100)

### Devop

* Possible random error fix, and sync master to develop [#1101](https://github.com/MyEtherWallet/MyEtherWallet/pull/1101)

### Release v5.0.12

### Feature

* Have Simplex KYC form open in new tab [#1031](https://github.com/MyEtherWallet/MyEtherWallet/pull/1031)
* Ledger webusb option [#1081](https://github.com/MyEtherWallet/MyEtherWallet/pull/1081)

### Bug

* Use native browser checking for online status. [#1032](https://github.com/MyEtherWallet/MyEtherWallet/pull/1032)
* UI fix for mnemonic phrase key verification modal [#1029](https://github.com/MyEtherWallet/MyEtherWallet/pull/1029)
* set up a fallback if GAS_LIMIT check fails [#1076](https://github.com/MyEtherWallet/MyEtherWallet/pull/1076)
* Fix owner check for permanent registrar names [#1054](https://github.com/MyEtherWallet/MyEtherWallet/pull/1054)
* Web3 wallet promievent fix [#1063](https://github.com/MyEtherWallet/MyEtherWallet/pull/1063)
* Catch ledger error [#1091](https://github.com/MyEtherWallet/MyEtherWallet/pull/1091)

### Devop

* Ledger custom paths [#1037](https://github.com/MyEtherWallet/MyEtherWallet/pull/1037)
* Update Richie's profile [#1036](https://github.com/MyEtherWallet/MyEtherWallet/pull/1036)
* Change PWA name to MEW [#1030](https://github.com/MyEtherWallet/MyEtherWallet/pull/1030)
* Address validation on swap [#1090](https://github.com/MyEtherWallet/MyEtherWallet/pull/1090)

### Release v5.0.11-ens.1

* Permanent registry [#965](https://github.com/MyEtherWallet/MyEtherWallet/pull/965)

### Release v5.0.11

### Devop

* Update Access My Wallet modal UI [#1033](https://github.com/MyEtherWallet/MyEtherWallet/pull/1033)
* Access by Software UI change [#1021](https://github.com/MyEtherWallet/MyEtherWallet/pull/1021)
* Fix multiple sentry issues [#1015](https://github.com/MyEtherWallet/MyEtherWallet/pull/1015)
* Update hardware icons [#994](https://github.com/MyEtherWallet/MyEtherWallet/pull/994)
* Add trezor eth path to ledger [#1020](https://github.com/MyEtherWallet/MyEtherWallet/pull/1020)
* Add presale eth and old mew eth wallet support [#985](https://github.com/MyEtherWallet/MyEtherWallet/pull/985)
* Check private key format [#1014](https://github.com/MyEtherWallet/MyEtherWallet/pull/1014)
* Update usage of Kyber supplied gas limits and serverless provider [#969](https://github.com/MyEtherWallet/MyEtherWallet/pull/969)
* Fix hardware access icons not displaying [#1025](https://github.com/MyEtherWallet/MyEtherWallet/pull/1025)
* Fix none assignment issue on Send Offline Container [#982](https://github.com/MyEtherWallet/MyEtherWallet/pull/982)

### Bug

* Reimplement support for web3 wallets [#976](https://github.com/MyEtherWallet/MyEtherWallet/pull/976)
* Strip whitespace in address inputs [#1016](https://github.com/MyEtherWallet/MyEtherWallet/pull/1016)
* Fix token load issue when searching token list [#1001](https://github.com/MyEtherWallet/MyEtherWallet/pull/1001)

### Feature

* Add warning signs to Create wallet page and update mnemonic input [#1041](https://github.com/MyEtherWallet/MyEtherWallet/pull/1041)
* DEXON network support [#977](https://github.com/MyEtherWallet/MyEtherWallet/pull/977)
* Metadium network support [#928](https://github.com/MyEtherWallet/MyEtherWallet/pull/928)
* Solidum network support [#957](https://github.com/MyEtherWallet/MyEtherWallet/pull/957)
* Support local nodes [#973](https://github.com/MyEtherWallet/MyEtherWallet/pull/973)

### Release v5.0.10

### Bug

* Better Ledger app support flow [#910](https://github.com/MyEtherWallet/MyEtherWallet/pull/910)
* Fixes send offline token value and deploy contract errors [#920](https://github.com/MyEtherWallet/MyEtherWallet/pull/920)
* Update TOMO explorrer links [#918](https://github.com/MyEtherWallet/MyEtherWallet/pull/918)

### Devop

* only clone the most recent commit [#937](https://github.com/MyEtherWallet/MyEtherWallet/pull/937)
* Fix send offline helper, update webchain [#932](https://github.com/MyEtherWallet/MyEtherWallet/pull/932)
* MEWCX build fix [#935](https://github.com/MyEtherWallet/MyEtherWallet/pull/935)
* Update Metamask Integration with listeners [#938](https://github.com/MyEtherWallet/MyEtherWallet/pull/938)
* Sentry migration [#922](https://github.com/MyEtherWallet/MyEtherWallet/pull/922)
* remove utf8 convertion for hex strings [#941](https://github.com/MyEtherWallet/MyEtherWallet/pull/941)

### Feature

* Scan each mewbuild with virustotal [#934](https://github.com/MyEtherWallet/MyEtherWallet/pull/934)
* Can debug via [VSCODE](https://github.com/Microsoft/vscode-recipes/tree/master/vuejs-cli) [#960](https://github.com/MyEtherWallet/MyEtherWallet/pull/960)
* Update hardware modal options [#923](https://github.com/MyEtherWallet/MyEtherWallet/pull/923)

### Release v5.0.9

### Devop

* Add gas amount to send tx page [#925](https://github.com/MyEtherWallet/MyEtherWallet/pull/925)
* Better data catch for url params [#909](https://github.com/MyEtherWallet/MyEtherWallet/pull/909)
* Update hardwares [#906](https://github.com/MyEtherWallet/MyEtherWallet/pull/906)
* Add monospace font[#898](https://github.com/MyEtherWallet/MyEtherWallet/pull/898)
* Add Gage on team page [#853](https://github.com/MyEtherWallet/MyEtherWallet/pull/853)
* Fixes Bitbox error and Hardware wallet error handling [#893](https://github.com/MyEtherWallet/MyEtherWallet/pull/893)
* Use Kyber supplied gas limits [#892](https://github.com/MyEtherWallet/MyEtherWallet/pull/892)

### Feature

* Update verify message [#854](https://github.com/MyEtherWallet/MyEtherWallet/pull/854)
* Add hardware page [#862](https://github.com/MyEtherWallet/MyEtherWallet/pull/862)
* Reimplement query params for send offline and regular send [#803](https://github.com/MyEtherWallet/MyEtherWallet/pull/803)
* Show token transfer data in notification body [#840](https://github.com/MyEtherWallet/MyEtherWallet/pull/840)
* Add curency symbol to config [#809](https://github.com/MyEtherWallet/MyEtherWallet/pull/809)
* Add Browser options for Metamask on Safari [#867](https://github.com/MyEtherWallet/MyEtherWallet/pull/867)
* Add TX history menu[#865](https://github.com/MyEtherWallet/MyEtherWallet/pull/865)

### Bug

* Fix side menu bugs, logout warning modal bug[#896](https://github.com/MyEtherWallet/MyEtherWallet/pull/896)
* Add network icon background[#897](https://github.com/MyEtherWallet/MyEtherWallet/pull/897)
* Fix custom token validation [#852](https://github.com/MyEtherWallet/MyEtherWallet/pull/852)
* Change mobile side menu button title from "Change" to "Menu" [#887](https://github.com/MyEtherWallet/MyEtherWallet/pull/887)
* Fix notification to show max 5 notification popups[#873](https://github.com/MyEtherWallet/MyEtherWallet/pull/873)
* Display final re-calculated values on swap confirmation[#841](https://github.com/MyEtherWallet/MyEtherWallet/pull/841)
* Fix batch send success modal[#843](https://github.com/MyEtherWallet/MyEtherWallet/pull/843)
* Fix hardware wallet scroll bug[#890](https://github.com/MyEtherWallet/MyEtherWallet/pull/890)
* Allow zero as nonce for offline transaction [#860](https://github.com/MyEtherWallet/MyEtherWallet/pull/860)
* Resolve spinner on interact contract [#861](https://github.com/MyEtherWallet/MyEtherWallet/pull/841)
* Fix incorrect signing of messages starts with 0x [#899](https://github.com/MyEtherWallet/MyEtherWallet/pull/899)

### Hotfix v5.0.8-hotfix.1

* Display final re-calculated values on swap confirmation[#841](https://github.com/MyEtherWallet/MyEtherWallet/pull/841)
* Fix batch send success modal[#843](https://github.com/MyEtherWallet/MyEtherWallet/pull/843)

### Release v5.0.8

### Bug

* Better Ipad Catch [#814](https://github.com/MyEtherWallet/MyEtherWallet/pull/814)
* Fix success modal not linking to unlock wallet page [#825](https://github.com/MyEtherWallet/MyEtherWallet/pull/825)
* Currency in notifications shown correctly [#824](https://github.com/MyEtherWallet/MyEtherWallet/pull/824)
* Fix Token details not sending to mewconnect [#839](https://github.com/MyEtherWallet/MyEtherWallet/pull/839)

### Feature

* Implement DNS for ENS [#792](https://github.com/MyEtherWallet/MyEtherWallet/pull/792)
* Add ethereum classic path as presented in mew v3 [#812](https://github.com/MyEtherWallet/MyEtherWallet/pull/812)
* Shows the recipient and the contract address [#822](https://github.com/MyEtherWallet/MyEtherWallet/pull/822)
* Add ledger support for ThunderCore [#827](https://github.com/MyEtherWallet/MyEtherWallet/pull/827)

### Devop

* Add zh_TW (Traditional Chinese) translation [#820](https://github.com/MyEtherWallet/MyEtherWallet/pull/820)

### Release v5.0.7

### Feature

* Add Finney Modal [#782](https://github.com/MyEtherWallet/MyEtherWallet/pull/782)
* Sentry Fixes [#777](https://github.com/MyEtherWallet/MyEtherWallet/pull/777)
* Add Thundercore node [#780](https://github.com/MyEtherWallet/MyEtherWallet/pull/780)

### Release v5.0.6

### Feature

* DApp: Schedule transaction using Ethereum Alarm Clock [#545](https://github.com/MyEtherWallet/MyEtherWallet/pull/545)

### Bug

* Fix block 0 on mobile [#767](https://github.com/MyEtherWallet/MyEtherWallet/pull/767)
* Update infura endpoint [#763](https://github.com/MyEtherWallet/MyEtherWallet/pull/763)
* Chrome 72 compatibility for Secalot [#766](https://github.com/MyEtherWallet/MyEtherWallet/pull/766)

### Hotfix v5.0.5-hotfix.1

### Bug

* Fix network addresses with discussed concat, fixes settings dollar amount, Token manual load fix, Ipad modal catch, Mozilla value error, update packages, fix verify feedback, and signed msg copy, await token fetch [#752](https://github.com/MyEtherWallet/MyEtherWallet/pull/752)

### Release v5.0.5

### Bug

* Update success modal for transaction and swap [#666](https://github.com/MyEtherWallet/MyEtherWallet/pull/666)
* Fix Interface -> Address block UI & Print sheet UI [#733](https://github.com/MyEtherWallet/MyEtherWallet/pull/733)

### Devop

* Update notification dot animation [#700](https://github.com/MyEtherWallet/MyEtherWallet/pull/700)
* Update README instructions, fix #731 and #727 [#732](https://github.com/MyEtherWallet/MyEtherWallet/pull/732)

### Release v5.0.4

### Feature

* Add animation to FAQs [#691](https://github.com/MyEtherWallet/MyEtherWallet/pull/691)

### Devop

* Reverse the tx order for metamask batch txs [#723](https://github.com/MyEtherWallet/MyEtherWallet/pull/723)
* Add minimum buffer to Kyber Swaps, improve changelly fixed rate check, show swap reference number in notifications [#711](https://github.com/MyEtherWallet/MyEtherWallet/pull/711)
* Update keepkey, add popovers on disabled options [#709](https://github.com/MyEtherWallet/MyEtherWallet/pull/709)
* Add noscript page [#710](https://github.com/MyEtherWallet/MyEtherWallet/pull/710)
* Fix list fetching issue on travis and couple of sentry issues [#692](https://github.com/MyEtherWallet/MyEtherWallet/pull/692)
* Redo wallet errors, include translations [#685](https://github.com/MyEtherWallet/MyEtherWallet/pull/685)
* Identical build for production and gh-pages-history [#712](https://github.com/MyEtherWallet/MyEtherWallet/pull/712)
* Optimized batch transaction processing and ws block subscription [#704](https://github.com/MyEtherWallet/MyEtherWallet/pull/704)

### Bug

* Fix Mnemonic Phrase print page UI [#721](https://github.com/MyEtherWallet/MyEtherWallet/pull/721)
* Fix Send TX confirmation modal [#694](https://github.com/MyEtherWallet/MyEtherWallet/pull/694)
* Fix offline Worker issue [#690](https://github.com/MyEtherWallet/MyEtherWallet/pull/690)
* Fix information block UI [#693](https://github.com/MyEtherWallet/MyEtherWallet/pull/693)
* Fix header UI bug [#701](https://github.com/MyEtherWallet/MyEtherWallet/pull/701)
* Update Inteface side menu button UI [#698](https://github.com/MyEtherWallet/MyEtherWallet/pull/698)

### Feature

* Sort by network support, add row gap [#720](https://github.com/MyEtherWallet/MyEtherWallet/pull/720)
* Print ENS bid details [#699](https://github.com/MyEtherWallet/MyEtherWallet/pull/699)
* Add Prefilled form for contact support [#697](https://github.com/MyEtherWallet/MyEtherWallet/pull/697)

### Release v5.0.3

### Bug

* Fix NaN issue on settings modal [#682](https://github.com/MyEtherWallet/MyEtherWallet/pull/682)
* Multiple Sentry fixes, custom paths, Safari worker fix [#680](https://github.com/MyEtherWallet/MyEtherWallet/pull/680)

### Devop

* Add disabled access wallet buttons [#665](https://github.com/MyEtherWallet/MyEtherWallet/pull/665)
* Update Send offline helper UI [#663](https://github.com/MyEtherWallet/MyEtherWallet/pull/663)
* Include Service worker error [#660](https://github.com/MyEtherWallet/MyEtherWallet/pull/660)
* Update Front-Page UI [#677](https://github.com/MyEtherWallet/MyEtherWallet/pull/677)
* Update notification dot [#679](https://github.com/MyEtherWallet/MyEtherWallet/pull/679)
* Add Missing nodes from v3 [#672](https://github.com/MyEtherWallet/MyEtherWallet/pull/672)
* Update hdkey 1.1.1 & imagemin-webpack-plugin 2.4.2 [#668](https://github.com/MyEtherWallet/MyEtherWallet/pull/668)

### Feature

* Add nonce and gas to offline [#661](https://github.com/MyEtherWallet/MyEtherWallet/pull/661)
* Detect when user not in interface and prompt [#684](https://github.com/MyEtherWallet/MyEtherWallet/pull/684)
* Add Exit to Fiat via Bity [#669](https://github.com/MyEtherWallet/MyEtherWallet/pull/669)

### Release v5.0.2

### Bug

* Fix Popover UI bugs [#676](https://github.com/MyEtherWallet/MyEtherWallet/pull/676)
* Fix mobile settings [#651](https://github.com/MyEtherWallet/MyEtherWallet/pull/651)
* Mandatory password input for Get a New Wallet -> Mnemonic Phrase [#649](https://github.com/MyEtherWallet/MyEtherWallet/pull/649)
* fix data copy error on FF, and MEWconnect disconnect modal [#648](https://github.com/MyEtherWallet/MyEtherWallet/pull/648)
* Fix Access my wallet modals [#647](https://github.com/MyEtherWallet/MyEtherWallet/pull/647)
* Reset tokens when adding custom token, fetch balance on load [#646](https://github.com/MyEtherWallet/MyEtherWallet/pull/646)
* Fix Ui Access by Software modal [#645](https://github.com/MyEtherWallet/MyEtherWallet/pull/645)
* Various bug fixes and package updates [#637](https://github.com/MyEtherWallet/MyEtherWallet/pull/637)
* Reduce side paddings of footer links to make them fit to mobile width [#636](https://github.com/MyEtherWallet/MyEtherWallet/pull/636)
* Fix welcome modal UI [#632](https://github.com/MyEtherWallet/MyEtherWallet/pull/632)
* Reenable mewconnect on Safari and Opera [#631](https://github.com/MyEtherWallet/MyEtherWallet/pull/631)
* Fix NetworkAddress layout responsiveness [#629](https://github.com/MyEtherWallet/MyEtherWallet/pull/629)

### Feature

* Add reusable global toasts. Add examples [#617](https://github.com/MyEtherWallet/MyEtherWallet/pull/617)

### Devop

* Make toasts stay longer, update packages [#658](https://github.com/MyEtherWallet/MyEtherWallet/pull/658)

### Release v5.0.1

### Devop

* Fix foreach issue in settings [#619](https://github.com/MyEtherWallet/MyEtherWallet/pull/619)
* Disable HWs if not supported [#618](https://github.com/MyEtherWallet/MyEtherWallet/pull/618)

### Bug

* Reenable Metamask when web3 is not found [#622](https://github.com/MyEtherWallet/MyEtherWallet/pull/622)
* Fix Mew connect modal content [#616](https://github.com/MyEtherWallet/MyEtherWallet/pull/616)
* Fix Getting started page [#615](https://github.com/MyEtherWallet/MyEtherWallet/pull/615)
* Fix various user found errors [#611](https://github.com/MyEtherWallet/MyEtherWallet/pull/611)
* Fix mnemonic phrase radio button [#611](https://github.com/MyEtherWallet/MyEtherWallet/pull/611)

### Release v5.0.0

### Feature

* Implement SafeSend Dapp [#299](https://github.com/MyEtherWallet/MyEtherWallet/pull/299)
* Implement SafeSend Tweaks [#597](https://github.com/MyEtherWallet/MyEtherWallet/pull/597)

### Devop

* Add disconnected modal [#635](https://github.com/MyEtherWallet/MyEtherWallet/pull/635)
* Add medium link [#598](https://github.com/MyEtherWallet/MyEtherWallet/pull/598)

### Release v5.0.0-rc.1

### Feature

* Update internal partner currency list [#596](https://github.com/MyEtherWallet/MyEtherWallet/pull/596)
* Disable tabs and buttons based on app status [#591](https://github.com/MyEtherWallet/MyEtherWallet/pull/591)
* Added ENS test name registration to ROP, RIN and Goerli [#589](https://github.com/MyEtherWallet/MyEtherWallet/pull/589)

### Bug

* Sentry bug fixes [#589](https://github.com/MyEtherWallet/MyEtherWallet/pull/589)
* store addresses validation differently, better handling of kyber api no response [#588](https://github.com/MyEtherWallet/MyEtherWallet/pull/588)
* Handle failure to fetch errors [#590](https://github.com/MyEtherWallet/MyEtherWallet/pull/590)

### Hotfix

* partner rate correction [#595](https://github.com/MyEtherWallet/MyEtherWallet/pull/595)

### Release v5.0.0-rc.0

### Devop

* simplex swap revision [#580](https://github.com/MyEtherWallet/MyEtherWallet/pull/580)
* Swap fix, sentry version addition, deploy contract deteministic updates, JSON parsing [#575](https://github.com/MyEtherWallet/MyEtherWallet/pull/575)
* Refactor custom token, import v3 token [#583](https://github.com/MyEtherWallet/MyEtherWallet/pull/583)
* Add keepkey affiliate link, link out to mewconnect, vintage mew header, fix getting started [#581](https://github.com/MyEtherWallet/MyEtherWallet/pull/581)

### Bug

* Supply gasPrice to estimateGas for token transfers [#554](https://github.com/MyEtherWallet/MyEtherWallet/pull/554)
* Fix provider selector UI [#579](https://github.com/MyEtherWallet/MyEtherWallet/pull/579)
* Fix Getting started layout bugs for mobile and desktop [#569](https://github.com/MyEtherWallet/MyEtherWallet/pull/569)
* Fix mobile menu [#564](https://github.com/MyEtherWallet/MyEtherWallet/pull/564)

### Devop

* Supply gasPrice to estimateGas for token transfers [#554](https://github.com/MyEtherWallet/MyEtherWallet/pull/554)

### Release v5.0.0-beta.4

### Feature

* Add welcome to mew modal [#571](https://github.com/MyEtherWallet/MyEtherWallet/pull/571)
* Add [Görli](https://github.com/goerli/testnet) testnet [#552](https://github.com/MyEtherWallet/MyEtherWallet/pull/552)
* Make use of address darklist from ethereum-list [#521](https://github.com/MyEtherWallet/MyEtherWallet/pull/521)

### Devop

* Catch byte32\[] and use constant types [#561](https://github.com/MyEtherWallet/MyEtherWallet/pull/561)
* Setup Sentry [#573](https://github.com/MyEtherWallet/MyEtherWallet/pull/573)
* Upgrade keepkey and use bip32ToAddressNList [#543](https://github.com/MyEtherWallet/MyEtherWallet/pull/543)
* Fixes from meeting [#538](https://github.com/MyEtherWallet/MyEtherWallet/pull/538)
* Add display of swap partners [#537](https://github.com/MyEtherWallet/MyEtherWallet/pull/537)
* Refactor interact w contract [#536](https://github.com/MyEtherWallet/MyEtherWallet/pull/536)
* Set server side headers on webpack dev server [#534](https://github.com/MyEtherWallet/MyEtherWallet/pull/534)
* Hide switch on web3 wallet, update logout text, add package exception for webpack [#529](https://github.com/MyEtherWallet/MyEtherWallet/pull/529)
* Improve notification handling of tx errors [#524](https://github.com/MyEtherWallet/MyEtherWallet/pull/524)
* Enable custom HD paths (fixes #509) [#550](https://github.com/MyEtherWallet/MyEtherWallet/pull/550)

### Release v5.0.0-beta.3

### Hotfix

* Fix "New wallet", "Access" buttons on header [#549](https://github.com/MyEtherWallet/MyEtherWallet/pull/549)
* Fix Token Transfer [#498](https://github.com/MyEtherWallet/MyEtherWallet/pull/498)
* Fix KeepKey network modal issue [#510](https://github.com/MyEtherWallet/MyEtherWallet/pull/510)

### Bug

* Fix deploy contract params and validation issue [#502](https://github.com/MyEtherWallet/MyEtherWallet/pull/502)

### Feature

* Add Crypto to Fiat swap option [#325](https://github.com/MyEtherWallet/MyEtherWallet/pull/325)

### Devop

* Add Send Offline Helper page [#535](https://github.com/MyEtherWallet/MyEtherWallet/pull/535)
* Update UI design for Send Offline [#522](https://github.com/MyEtherWallet/MyEtherWallet/pull/522)
* Update Logo for Kyber Network [#518](https://github.com/MyEtherWallet/MyEtherWallet/pull/518)
* Send Transaction container refactor [#499](https://github.com/MyEtherWallet/MyEtherWallet/pull/499)
* Fix weird interaction in side menu [#494](https://github.com/MyEtherWallet/MyEtherWallet/pull/494)
* Upload history build to gh-pages-history [#504](https://github.com/MyEtherWallet/MyEtherWallet/pull/504)

### Bug

* Fix Access My Wallet buttons position [#566](https://github.com/MyEtherWallet/MyEtherWallet/pull/566)
* Fix #513 [#516](https://github.com/MyEtherWallet/MyEtherWallet/pull/516)
* Fix deploy contract params and validation issue [#502](https://github.com/MyEtherWallet/MyEtherWallet/pull/502)

### Feature

* Componentize wallet options, change all wallet address instance to coinbase [#511](https://github.com/MyEtherWallet/MyEtherWallet/pull/511)

### Release v5.0.0-beta.2

### Hotfix

* Logout buttons [#484](https://github.com/MyEtherWallet/MyEtherWallet/pull/484)

### Bug

* Fix interact contract disabled [#469](https://github.com/MyEtherWallet/MyEtherWallet/pull/469)
* Dapps back issue [#472](https://github.com/MyEtherWallet/MyEtherWallet/pull/472)
* Make routes with child set first child active #437 [#473](https://github.com/MyEtherWallet/MyEtherWallet/pull/473)
* Fix UI Interface -> Message [#475](https://github.com/MyEtherWallet/MyEtherWallet/pull/475)
* Fix UI Interface -> Contract [#474](https://github.com/MyEtherWallet/MyEtherWallet/pull/474)
* Fix UI Interface -> Dapps [#462](https://github.com/MyEtherWallet/MyEtherWallet/pull/462)
* Fix #438 - Error message for empty to address in swap [#458](https://github.com/MyEtherWallet/MyEtherWallet/pull/458)
* Fix slide on mobile, fix network default, json -> keystore instance [#410](https://github.com/MyEtherWallet/MyEtherWallet/pull/410)
* Fix UI Interface -> Swap [#457](https://github.com/MyEtherWallet/MyEtherWallet/pull/457)
* Fix UI Interface -> Send Offline [#444](https://github.com/MyEtherWallet/MyEtherWallet/pull/444)
* Fix slide on mobile, fix network default, json -> keystore instance [#410](https://github.com/MyEtherWallet/MyEtherWallet/pull/410)

### Feature

* Add KeepKey [#350](https://github.com/MyEtherWallet/MyEtherWallet/pull/350)
* Add MEW Websocket node [#483](https://github.com/MyEtherWallet/MyEtherWallet/pull/483)

### Devop

* Swap Revision [#458](https://github.com/MyEtherWallet/MyEtherWallet/pull/458)
* Address checksum validation based on the network (RSK) [#461](https://github.com/MyEtherWallet/MyEtherWallet/pull/461)

### Release v5.0.0-beta.1

### Devop

* Add node_modules cache to TravisCI for faster builds, and remove Brotli compression from offline [#435](https://github.com/MyEtherWallet/MyEtherWallet/pull/435)
* Prep release and multiple fixes: #412, #409, #408, #413, #414, #433, #419, #415, #425, #427, #430, and #410 [#407](https://github.com/MyEtherWallet/MyEtherWallet/pull/407)

### Release v5.0.0-beta.0

### Bug

* Fix New wallet, Access buttons [#326](https://github.com/MyEtherWallet/MyEtherWallet/pull/326)
* Fix front interface bugs [#344](https://github.com/MyEtherWallet/MyEtherWallet/pull/344)
* Hide header on getting start [#341](https://github.com/MyEtherWallet/MyEtherWallet/pull/341)
* Fix small bugs [#383](https://github.com/MyEtherWallet/MyEtherWallet/pull/383)
* Only show security button on specific pages [#334](https://github.com/MyEtherWallet/MyEtherWallet/pull/334)
* Fix/replace apple qr code [#323](https://github.com/MyEtherWallet/MyEtherWallet/pull/323)
* Fix ENS resolver/error placement [#324](https://github.com/MyEtherWallet/MyEtherWallet/pull/324)
* Fix header settings modal styles [#287](https://github.com/MyEtherWallet/MyEtherWallet/pull/287)
* Fix fixed buttons, scroll-up, security [#282](https://github.com/MyEtherWallet/MyEtherWallet/pull/282)
* Fix Github issues [#276](https://github.com/MyEtherWallet/MyEtherWallet/pull/276)
* Fix network modal issues pt 2 [#279](https://github.com/MyEtherWallet/MyEtherWallet/pull/279)
* Fix network modal [#255](https://github.com/MyEtherWallet/MyEtherWallet/pull/255)
* Fall back for token fetch [#262](https://github.com/MyEtherWallet/MyEtherWallet/pull/262)
* Fix footer links [#235](https://github.com/MyEtherWallet/MyEtherWallet/pull/235)
* Fix multiple issues: #195, #198, #199, #202, #203, #207, #209, #213, #210, #191, #224, #201, #225, #220, and #208 [#215](https://github.com/MyEtherWallet/MyEtherWallet/pull/215)
* Fix network and address modal dropdown issue [#234](https://github.com/MyEtherWallet/MyEtherWallet/pull/234)
* Fix missing text issue on getting started modal [#173](https://github.com/MyEtherWallet/MyEtherWallet/pull/173)
* Reimplement logout with the new logout modal [#177](https://github.com/MyEtherWallet/MyEtherWallet/pull/177)
* Close modal when adding a custom token [#175](https://github.com/MyEtherWallet/MyEtherWallet/pull/175)
* Fix balance modal, and show equivalent values [#176](https://github.com/MyEtherWallet/MyEtherWallet/pull/176)
* Fix for issue where amount can add too many decimal places [#166](https://github.com/MyEtherWallet/MyEtherWallet/pull/166)

### Feature

* Remove print in creating a json wallet, create mnemonic paper, enhance paper wallet, fix #371 [#387](https://github.com/MyEtherWallet/MyEtherWallet/pull/387)
* Update Getting Started page contents [#386](https://github.com/MyEtherWallet/MyEtherWallet/pull/386)
* Add detailed Notifications [#231](https://github.com/MyEtherWallet/MyEtherWallet/pull/231)
* Manual refresh for balance and token [#342](https://github.com/MyEtherWallet/MyEtherWallet/pull/342)
* implement settings config [#298](https://github.com/MyEtherWallet/MyEtherWallet/pull/298)
* Path saver + send offline tx refactor [#159](https://github.com/MyEtherWallet/MyEtherWallet/pull/159)
* implement nonce cache [#149](https://github.com/MyEtherWallet/MyEtherWallet/pull/149)
* Redo Metamask with the breaking changes [#145](https://github.com/MyEtherWallet/MyEtherWallet/pull/145)
* Mnemonic Phrase auto populate [#140](https://github.com/MyEtherWallet/MyEtherWallet/pull/140)
* Implement Buying Subdomains dapps. [#122](https://github.com/MyEtherWallet/MyEtherWallet/pull/122)
* Add support for Ledger live paths. [#216](https://github.com/MyEtherWallet/MyEtherWallet/pull/216)
* Implement Swap [#127](https://github.com/MyEtherWallet/MyEtherWallet/pull/127)

### Devop

* Refactors, validations, and fixes: #311, #362, #389, #359, #366, #369, #368, #367, #370, #361, #344, #341, #375, #377, #364, #347, #346, #380, #394, #388, #391, #392, #382, #393, #399, #398, #376, #356, #401, and #374 [#345](https://github.com/MyEtherWallet/MyEtherWallet/pull/345)
* Resize team container [#337](https://github.com/MyEtherWallet/MyEtherWallet/pull/337)
* Change pricebar animation [#338](https://github.com/MyEtherWallet/MyEtherWallet/pull/338)
* Left align pricebar contents [#336](https://github.com/MyEtherWallet/MyEtherWallet/pull/336)
* Adjust header size [#335](https://github.com/MyEtherWallet/MyEtherWallet/pull/335)
* Show rates based on from amount, Add switch order of selected currencies [#372](https://github.com/MyEtherWallet/MyEtherWallet/pull/372)
* Enable metamask compatibility with mew.sendBatchTransaction fixes #351 [#352](https://github.com/MyEtherWallet/MyEtherWallet/pull/352)
* Fix #316, #317, #318, #319, #320, #321 [#322](https://github.com/MyEtherWallet/MyEtherWallet/pull/322)
* Add RSK network [#291](https://github.com/MyEtherWallet/MyEtherWallet/pull/291)
* Replace temporary notice to check if hardware wallet is attached to a final version [#309](https://github.com/MyEtherWallet/MyEtherWallet/pull/309)
* Cleanup unused files [#308](https://github.com/MyEtherWallet/MyEtherWallet/pull/308)
* Remove ETC epool [#307](https://github.com/MyEtherWallet/MyEtherWallet/pull/307)
* Revise and update docs [#301](https://github.com/MyEtherWallet/MyEtherWallet/pull/301)
* Greenkeeper chores [#302](https://github.com/MyEtherWallet/MyEtherWallet/pull/302)
* Add all derivation paths to HD wallets [#297](https://github.com/MyEtherWallet/MyEtherWallet/pull/297)
* Prevent excessive polling of eth_getTransactionReceipt [#266](https://github.com/MyEtherWallet/MyEtherWallet/pull/266)
* Check and verify npm package versions [#233](https://github.com/MyEtherWallet/MyEtherWallet/pull/233)
* Setup automated travis builds and release [#280](https://github.com/MyEtherWallet/MyEtherWallet/pull/280)
* Safe external links and meta descriptions [#261](https://github.com/MyEtherWallet/MyEtherWallet/pull/261)
* Update FAQ content, refactor how FAQ is implemented [#245](https://github.com/MyEtherWallet/MyEtherWallet/pull/245)
* Fixes #237, #238, #236, #260, #253, #283, #284, #286 [#274](https://github.com/MyEtherWallet/MyEtherWallet/pull/274)
* Lazy loading components for faster loading [#181](https://github.com/MyEtherWallet/MyEtherWallet/pull/181)
* ChainID calculation refactoring and BitBox v5 support [#206](https://github.com/MyEtherWallet/MyEtherWallet/pull/206)
* Generate deterministic builds [#217](https://github.com/MyEtherWallet/MyEtherWallet/pull/217)
* Use token package [#183](https://github.com/MyEtherWallet/MyEtherWallet/pull/183)
* Update nonce properly on send and fetch, parse response properly [#185](https://github.com/MyEtherWallet/MyEtherWallet/pull/185)
* Replace heroku urls [#178](https://github.com/MyEtherWallet/MyEtherWallet/pull/178)
* Crowdin translations [#75](https://github.com/MyEtherWallet/MyEtherWallet/pull/75)
* refinalize copy based on new version [#165](https://github.com/MyEtherWallet/MyEtherWallet/pull/165)
* fix invalid chain id error [#164](https://github.com/MyEtherWallet/MyEtherWallet/pull/164)
* Devop/fix router mode [#162](https://github.com/MyEtherWallet/MyEtherWallet/pull/162)
* Move text to translations [#157](https://github.com/MyEtherWallet/MyEtherWallet/pull/157)
* Update packages [#151](https://github.com/MyEtherWallet/MyEtherWallet/pull/151)
* Refactor state [#148](https://github.com/MyEtherWallet/MyEtherWallet/pull/148)
* Refactor web3 provider [#141](https://github.com/MyEtherWallet/MyEtherWallet/pull/141)
* Refactor Wallet interface [#129](https://github.com/MyEtherWallet/MyEtherWallet/pull/129)
* Normalise ens-resolver, use resolved address in send container [#126](https://github.com/MyEtherWallet/MyEtherWallet/pull/126)

### Hotfix

* Some fixes for the ENS Registrar, and validate and normalise ens domains [#120](https://github.com/MyEtherWallet/MyEtherWallet/pull/120)

### Release v5.0.0.alpha.4

### Devop

* Use new contract getter [#119](https://github.com/MyEtherWallet/MyEtherWallet/pull/119)
* Fix access wallet link, pop success when user clicks download [#115](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/115)
* Add more nodes [#90](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/90)

### Feature

* Metamask Integration [#96](https://github.com/MyEtherWallet/MyEtherWallet/pull/96)
* Finish unit conversion [#114](https://github.com/MyEtherWallet/MyEtherWallet/pull/114)
* Finish ENS registrar dapp [#81](https://github.com/MyEtherWallet/MyEtherWallet/pull/81)

### Release v5.0.0.alpha.3

### Feature

* Landing page mobile design [#97](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/97)
* Adds some more inputs for custom network [#86](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/86)
* Add light border to flags [#85](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/85)
* Decompress images on build [#77](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/77)
* Integrate secalot [#76](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/76)
* Additional hardware wallets [#57](https://github.com/MyEtherWallet/MyEtherWallet/pull/57)
* Implement ENS resolver directive, move directives to its own folder [#56](https://github.com/MyEtherWallet/MyEtherWallet/pull/56)
* Intercept and override signTransaction and signMessage to force confirm modal display and approval [#51](https://github.com/MyEtherWallet/MyEtherWallet/pull/51)
* Integrate Ledger hardware wallet [#48](https://github.com/MyEtherWallet/MyEtherWallet/pull/48)
* Feature/verify message [#52](https://github.com/MyEtherWallet/MyEtherWallet/pull/52)
* override web3 methods [#47](https://github.com/MyEtherWallet/MyEtherWallet/pull/47)
* Let users deploy and/or interact with contracts [#45](https://github.com/MyEtherWallet/MyEtherWallet/pull/45)

### UI/UX

* Add Swap confirmation modal [#78](https://github.com/MyEtherWallet/MyEtherWallet/pull/78)
* Add FAQs page [#58](https://github.com/MyEtherWallet/MyEtherWallet/pull/58)
* Add Create Wallet warning page [#46](https://github.com/MyEtherWallet/MyEtherWallet/pull/46)

### Devop

* Add stale integration config [#70](https://github.com/MyEtherWallet/MyEtherWallet/pull/70)
* Refactor network modal and sidemenu [#64](https://github.com/MyEtherWallet/MyEtherWallet/pull/64)
* Cleanup linting error [#54](https://github.com/MyEtherWallet/MyEtherWallet/pull/54)
* Merge all open PRS [#53](https://github.com/MyEtherWallet/MyEtherWallet/pull/53)
* Add Network logo and change dot colors [#49](https://github.com/MyEtherWallet/MyEtherWallet/pull/49)
* Fetch tokens and contract abi [#41](https://github.com/MyEtherWallet/MyEtherWallet/pull/41)

### Release v5.0.0.alpha.2

### Feature

* additional pages [#28](https://github.com/MyEtherWallet/MyEtherWallet/pull/28)
* Adding custom tokens and Adding custom networks [#27](https://github.com/MyEtherWallet/MyEtherWallet/pull/27)

### Devop

* Update footer to match design [#29](https://github.com/MyEtherWallet/MyEtherWallet/pull/29)
* Miscellaneous cleanup and changes. [#22](https://github.com/MyEtherWallet/MyEtherWallet/pull/22)

### Release v5.0.0.alpha.1

### Devop

* Miscellaneous cleanup and changes. [#14](https://github.com/MyEtherWallet/MyEtherWallet/pull/14)
