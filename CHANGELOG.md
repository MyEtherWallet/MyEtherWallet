### devop

* add translations and live editor plugin [#3264](https://github.com/MyEtherWallet/MyEtherWallet/pull/3264)
* upload translation files to lokalise when there are translation files changed [#3341](https://github.com/MyEtherWallet/MyEtherWallet/pull/3341)
* add 3 week release timer for new dapps [#3596](https://github.com/MyEtherWallet/MyEtherWallet/pull/3596)

### fix

* fix missing bitcoin rate for swap [#3584](https://github.com/MyEtherWallet/MyEtherWallet/pull/3584)
* remove error popup when sending transaction with wallet link [#3586](https://github.com/MyEtherWallet/MyEtherWallet/pull/3586)
* move convert unit to tools page [#3587](https://github.com/MyEtherWallet/MyEtherWallet/pull/3587)
* fix back button on create wallet overlay [#3588](https://github.com/MyEtherWallet/MyEtherWallet/pull/3588)
* check for undefined in home feature swap [#3593](https://github.com/MyEtherWallet/MyEtherWallet/pull/3593)
* fix bitbox2 access [#3595](https://github.com/MyEtherWallet/MyEtherWallet/pull/3595)

### Release v6.4.2

### devop

* migrate underscore to lodash [#3564](https://github.com/MyEtherWallet/MyEtherWallet/pull/3564)
* update packages [#3573](https://github.com/MyEtherWallet/MyEtherWallet/pull/3573)
* show private key for mnemonic wallets [#3576](https://github.com/MyEtherWallet/MyEtherWallet/pull/3576)

### fix

* return error when no providers provided [#3531](https://github.com/MyEtherWallet/MyEtherWallet/pull/3531)
* getting stuck at pending on failed transaction [#3558](https://github.com/MyEtherWallet/MyEtherWallet/pull/3558)
* adds estimated fees tooltip [#3558](https://github.com/MyEtherWallet/MyEtherWallet/pull/3558)
* menu highlight on direct navigation to my-blocks [#3558](https://github.com/MyEtherWallet/MyEtherWallet/pull/3558)
* disable swap button in swap when balance is low or 0 [#3561](https://github.com/MyEtherWallet/MyEtherWallet/pull/3561)
* stabilize all hardware wallet access and mnemonic [#3562](https://github.com/MyEtherWallet/MyEtherWallet/pull/3562)
* show cost in confirmation modal [#3563](https://github.com/MyEtherWallet/MyEtherWallet/pull/3563)
* fix mew wallet banner invalid url bug [#3567](https://github.com/MyEtherWallet/MyEtherWallet/pull/3567)
* add in additional ledger error check [#3574](https://github.com/MyEtherWallet/MyEtherWallet/pull/3574)
* add check for reading disconnects [#3575](https://github.com/MyEtherWallet/MyEtherWallet/pull/3575)
* refresh custom token balance after sending [#3580](https://github.com/MyEtherWallet/MyEtherWallet/pull/3580)
* fix ens commit [#3581](https://github.com/MyEtherWallet/MyEtherWallet/pull/3581)

### Release v6.4.1

### feat

* add survey to dashboard [#3565](https://github.com/MyEtherWallet/MyEtherWallet/pull/3565)

### Release v6.4.0-hotfix.1

### fix

* getting stuck at pending on failed transaction adds estimated fees tooltip [#3558](https://github.com/MyEtherWallet/MyEtherWallet/pull/3558)
* menu highlight on direct navigation to my-blocks [#3558](https://github.com/MyEtherWallet/MyEtherWallet/pull/3558)
* add eth blocks landing page section [#3566](https://github.com/MyEtherWallet/MyEtherWallet/pull/3566)

### Release v6.4.0

### feat

* Add ETH blocks dapp ui and functionality, Created New Dapps Header [#3527](https://github.com/MyEtherWallet/MyEtherWallet/pull/3527)
* Added template for dapp store in eth blocks in dappsStore.js [#3527](https://github.com/MyEtherWallet/MyEtherWallet/pull/3527)
* Added new menu in Dapp Wrapper, with routes [#3527](https://github.com/MyEtherWallet/MyEtherWallet/pull/3527)
* update wallet card [#3530](https://github.com/MyEtherWallet/MyEtherWallet/pull/3530)

### devop

* add new templates for issues [#3529](https://github.com/MyEtherWallet/MyEtherWallet/pull/3529)
* temporary release holder [#3538](https://github.com/MyEtherWallet/MyEtherWallet/pull/3538)

### fix

* add convert units page [#3516](https://github.com/MyEtherWallet/MyEtherWallet/pull/3516)
* replace mew-super-button and other buttons with mew-button [#3518](https://github.com/MyEtherWallet/MyEtherWallet/pull/3518)
* fix failed to fetch and wrong prev session [#3525](https://github.com/MyEtherWallet/MyEtherWallet/pull/3525)
* add a check for when tokens undefined or empty [#3526](https://github.com/MyEtherWallet/MyEtherWallet/pull/3526)
* add in connection check [#3532](https://github.com/MyEtherWallet/MyEtherWallet/pull/3532)
* add more error handling for trezor wallet popup [#3535](https://github.com/MyEtherWallet/MyEtherWallet/pull/3535)
* allow users to send custom tokens [#3545](https://github.com/MyEtherWallet/MyEtherWallet/pull/3545)
* change error message when user decides to cancel metamask tx [#3546](https://github.com/MyEtherWallet/MyEtherWallet/pull/3546)
* fix terms on mobile [#3547](https://github.com/MyEtherWallet/MyEtherWallet/pull/3547)
* ens and max amount in send [#3548](https://github.com/MyEtherWallet/MyEtherWallet/pull/3548)
* price error on confirm when sending tokens [#3549](https://github.com/MyEtherWallet/MyEtherWallet/pull/3549)
* check for undefined hardware wallet [#3550](https://github.com/MyEtherWallet/MyEtherWallet/pull/3550)
* fix path issue with hardware wallets [#3553](https://github.com/MyEtherWallet/MyEtherWallet/pull/3553)

### Release v6.3.0-hotfix.2

### fix

* fix token to token swap [#3553](https://github.com/MyEtherWallet/MyEtherWallet/pull/3553)

### Release v6.3.0-hotfix.1

### fix

* fix swap [#3552](https://github.com/MyEtherWallet/MyEtherWallet/pull/3552)

### Release v6.3.0

### devop

* refactor trezor wallet into own component [#3481](https://github.com/MyEtherWallet/MyEtherWallet/pull/3481)
* migrate addressBook store [#3514](https://github.com/MyEtherWallet/MyEtherWallet/pull/3514)
* add back how fees are determined [#3523](https://github.com/MyEtherWallet/MyEtherWallet/pull/3523)

### feat

* eip 1559 support [#3351](https://github.com/MyEtherWallet/MyEtherWallet/pull/3351)

### fix

* fix add in ledger errors back [#3488](https://github.com/MyEtherWallet/MyEtherWallet/pull/3488)
* add in check for swap [#3490](https://github.com/MyEtherWallet/MyEtherWallet/pull/3490)
* reset token amount when switching tokens on send [#3501](https://github.com/MyEtherWallet/MyEtherWallet/pull/3501)
* fix error handling and formatting for custom token [#3503](https://github.com/MyEtherWallet/MyEtherWallet/pull/3503)
* decimal swap undefined error [#3504](https://github.com/MyEtherWallet/MyEtherWallet/pull/3504)
* fix add in more ledger error handling [#3507](https://github.com/MyEtherWallet/MyEtherWallet/pull/3507)
* fix amount undefined [#3511](https://github.com/MyEtherWallet/MyEtherWallet/pull/3511)
* add in links for mew mobile or web [#3513](https://github.com/MyEtherWallet/MyEtherWallet/pull/3513)
* fix balance display [#3515](https://github.com/MyEtherWallet/MyEtherWallet/pull/3515)
* fix keepkey send, update gas every block [#3528](https://github.com/MyEtherWallet/MyEtherWallet/pull/3528)
* fix eip1559 signing issues on MEWconnect and Mnemonic [#3533](https://github.com/MyEtherWallet/MyEtherWallet/pull/3533)
* fix address book issue [#3534](https://github.com/MyEtherWallet/MyEtherWallet/pull/3534)

### Release v6.2.1

### ui

* hide tokens with no image [#3471](https://github.com/MyEtherWallet/MyEtherWallet/pull/3471)
* add get mew wallet overlay [#3497](https://github.com/MyEtherWallet/MyEtherWallet/pull/3497)

### devop

* Pull main back to develop [#3492](https://github.com/MyEtherWallet/MyEtherWallet/pull/3492)
* update README.md with integrations info [#3498](https://github.com/MyEtherWallet/MyEtherWallet/pull/3498)

### fix

* fix trade button on my token value overlay [#3452](https://github.com/MyEtherWallet/MyEtherWallet/pull/3452)
* add in additional error handling [#3466](https://github.com/MyEtherWallet/MyEtherWallet/pull/3466)
* update components package and remove rules for module-address-book [#3467](https://github.com/MyEtherWallet/MyEtherWallet/pull/3467)
* change address book store to custom and fix mew address select dropdown component [#3470](https://github.com/MyEtherWallet/MyEtherWallet/pull/3470)
* fix sentry issue #2507644001 [#3473](https://github.com/MyEtherWallet/MyEtherWallet/pull/3473)
* fix matomo toggle color on wallet page [#3474](https://github.com/MyEtherWallet/MyEtherWallet/pull/3474)
* fix contract interaction input [#3475](https://github.com/MyEtherWallet/MyEtherWallet/pull/3475)
* fix low balance not showing up in send tx [#3476](https://github.com/MyEtherWallet/MyEtherWallet/pull/3476)
* fix sentry issue #2505736127 [#3477](https://github.com/MyEtherWallet/MyEtherWallet/pull/3477)
* fix add in throw for current network [#3482](https://github.com/MyEtherWallet/MyEtherWallet/pull/3482)
* fix add check for substr [#3483](https://github.com/MyEtherWallet/MyEtherWallet/pull/3483)
* fix swap provider list amount [#3485](https://github.com/MyEtherWallet/MyEtherWallet/pull/3485)
* enable custom path for mnemonic, hardware access cleanup [#3486](https://github.com/MyEtherWallet/MyEtherWallet/pull/3486)

### Release v6.2.0-hotfix.1

### fix

* fix swap issues [#3491](https://github.com/MyEtherWallet/MyEtherWallet/pull/3491)

### Release v6.2.0

### ui

* replace all mew-overlays with the new design. [#3367](https://github.com/MyEtherWallet/MyEtherWallet/pull/3367)
* update mnemonic phrase flow, add ens fetch and nickname, add derivation path [#3393](https://github.com/MyEtherWallet/MyEtherWallet/pull/3393)
* add in new ledger ui flow [#3403](https://github.com/MyEtherWallet/MyEtherWallet/pull/3403)
* keepkey ui refresh [#3404](https://github.com/MyEtherWallet/MyEtherWallet/pull/3404)
* fix paperwallet qr code image [#3405](https://github.com/MyEtherWallet/MyEtherWallet/pull/3405)
* add connect wallet page for trezor wallet [#3406](https://github.com/MyEtherWallet/MyEtherWallet/pull/3406)
* coolwallet ui refresh [#3413](https://github.com/MyEtherWallet/MyEtherWallet/pull/3413)
* focus first mnemonic input on mount [#3422](https://github.com/MyEtherWallet/MyEtherWallet/pull/3422)
* load accounts at the same time, add loaders in the meanwhile [#3423](https://github.com/MyEtherWallet/MyEtherWallet/pull/3423)
* show icons while getting rates [#3438](https://github.com/MyEtherWallet/MyEtherWallet/pull/3438)

### devop

* sync develop with main [#3419](https://github.com/MyEtherWallet/MyEtherWallet/pull/3419)
* switch swap api [#3465](https://github.com/MyEtherWallet/MyEtherWallet/pull/3465)
* sync develop to main [#3468](https://github.com/MyEtherWallet/MyEtherWallet/pull/3468)
* remove matomo error [#3469](https://github.com/MyEtherWallet/MyEtherWallet/pull/3469)

### feat

* new hardware wallet access flow [#3398](https://github.com/MyEtherWallet/MyEtherWallet/pull/3398)
* add custom token feature [#3441](https://github.com/MyEtherWallet/MyEtherWallet/pull/3441)

### fix

* fix access wallet side padding [#3374](https://github.com/MyEtherWallet/MyEtherWallet/pull/3374)
* define error for setItem property of null [#3397](https://github.com/MyEtherWallet/MyEtherWallet/pull/3397)
* adding in ethjs util private key check and errors to handlers [#3409](https://github.com/MyEtherWallet/MyEtherWallet/pull/3409)
* handle errors for wrong sessions, multiple devices, and walletlink [#3412](https://github.com/MyEtherWallet/MyEtherWallet/pull/3412)
* call shutdown when intercom instance is booted [#3472](https://github.com/MyEtherWallet/MyEtherWallet/pull/3472)
* add in catch for json parse errors in settings [#3451](https://github.com/MyEtherWallet/MyEtherWallet/pull/3451)
* fix ens name obj is null on split [#3453](https://github.com/MyEtherWallet/MyEtherWallet/pull/3453)
* fix use toast instead for handling connection not open [#3454](https://github.com/MyEtherWallet/MyEtherWallet/pull/3454)
* add svg logo [#3455](https://github.com/MyEtherWallet/MyEtherWallet/pull/3455)

### Release v6.1.0-hotfix.1

### devop

* update swap api [#3465](https://github.com/MyEtherWallet/MyEtherWallet/pull/3465)

### Release v6.1.0

### devop

* BitBox02 naming and fix attestation failure warning [#3342](https://github.com/MyEtherWallet/MyEtherWallet/pull/3342)
* hide total when sending tokens [#3421](https://github.com/MyEtherWallet/MyEtherWallet/pull/3421)
* update walletconnect library [#3442](https://github.com/MyEtherWallet/MyEtherWallet/pull/3442)
* github action to remove old lokalise branches [#3460](https://github.com/MyEtherWallet/MyEtherWallet/pull/3460)

### feat

* add 0x and paraswap providers to swap [#3272](https://github.com/MyEtherWallet/MyEtherWallet/pull/3272)
* add in Matomo analytics and tracking [#3327](https://github.com/MyEtherWallet/MyEtherWallet/pull/3327)
* add Intercom [#3410](https://github.com/MyEtherWallet/MyEtherWallet/pull/3410)
* added go chain network [#3416](https://github.com/MyEtherWallet/MyEtherWallet/pull/3416)
* update interact with contract overlay content [#3429](https://github.com/MyEtherWallet/MyEtherWallet/pull/3429)

### fix

* fix wallet layout bug [#3373](https://github.com/MyEtherWallet/MyEtherWallet/pull/3373)
* handle window.ethereum.on is not a function [#3407](https://github.com/MyEtherWallet/MyEtherWallet/pull/3407)
* adding in ethjs util private key check and errors to handlers [#3409](https://github.com/MyEtherWallet/MyEtherWallet/pull/3409)
* remove out type for transactions to fix metamask send transaction [#3426](https://github.com/MyEtherWallet/MyEtherWallet/pull/3426)
* ens manager error handling [#3428](https://github.com/MyEtherWallet/MyEtherWallet/pull/3428)
* fix undefined issue when deploying contract [#3430](https://github.com/MyEtherWallet/MyEtherWallet/pull/3430)
* remove error throw and only assign known keys that reflect current state [#3435](https://github.com/MyEtherWallet/MyEtherWallet/pull/3435)
* only allow numbers in gas price input [#3436](https://github.com/MyEtherWallet/MyEtherWallet/pull/3436)
* add catch and check whether ref exists before clearing [#3437](https://github.com/MyEtherWallet/MyEtherWallet/pull/3437)
* rerouting on refresh for settings nft manager and network [#3439](https://github.com/MyEtherWallet/MyEtherWallet/pull/3439)
* fix undefined token type or symbol [#3440](https://github.com/MyEtherWallet/MyEtherWallet/pull/3440)
* return array if preToken is undefined [#3443](https://github.com/MyEtherWallet/MyEtherWallet/pull/3443)
* fix token balance for non decimal from showing undefined [#3445](https://github.com/MyEtherWallet/MyEtherWallet/pull/3445)
* fix do not setWallet on accountsChanged event fired on first metamask lock [#3450](https://github.com/MyEtherWallet/MyEtherWallet/pull/3450)
* add in catch for json parse errors in settings [#3451](https://github.com/MyEtherWallet/MyEtherWallet/pull/3451)
* fix use toast instead for handling connection not open [#3454](https://github.com/MyEtherWallet/MyEtherWallet/pull/3454)
* filter out unpaid validators [#3461](https://github.com/MyEtherWallet/MyEtherWallet/pull/3461)

### Release v6.0.6

### ui

* fix paperwallet qr code image [#3405](https://github.com/MyEtherWallet/MyEtherWallet/pull/3405)

### fix

* fix ledger send [#3424](https://github.com/MyEtherWallet/MyEtherWallet/pull/3424)
* define error for setItem property of null [#3397](https://github.com/MyEtherWallet/MyEtherWallet/pull/3397)
* handle errors for wrong sessions, multiple devices, and walletlink [#3412](https://github.com/MyEtherWallet/MyEtherWallet/pull/3412)
* fix swap icons, and providers still showing when amount value errors [#3414](https://github.com/MyEtherWallet/MyEtherWallet/pull/3414)
* only reset send tx once tx is mined [#3415](https://github.com/MyEtherWallet/MyEtherWallet/pull/3415)

### devop

* sync develop with main [#3419](https://github.com/MyEtherWallet/MyEtherWallet/pull/3419)
* update packages for release [#3431](https://github.com/MyEtherWallet/MyEtherWallet/pull/3431)

### Release v6.0.5

### feature

* implement routes on overlays and steppers [#3360](https://github.com/MyEtherWallet/MyEtherWallet/pull/3360)

### fix

* fix undefined symbol in swap [#3387](https://github.com/MyEtherWallet/MyEtherWallet/pull/3387)
* only push token if info is not empty [#3392](https://github.com/MyEtherWallet/MyEtherWallet/pull/3392)
* add submitted to known notification status types, add null hash if hash doesn't exists [#3384](https://github.com/MyEtherWallet/MyEtherWallet/pull/3384)
* allow decimals to be passed on custom gas price [#3382](https://github.com/MyEtherWallet/MyEtherWallet/pull/3382)
* return empty arraay when data doesn't exist when fetching balance [#3380](https://github.com/MyEtherWallet/MyEtherWallet/pull/3380)
* fix reset error [#3379](https://github.com/MyEtherWallet/MyEtherWallet/pull/3379)
* fix access wallet side padding [#3374](https://github.com/MyEtherWallet/MyEtherWallet/pull/3374)
* fix mnemonic auto fill, private key, ens registry [#3400](https://github.com/MyEtherWallet/MyEtherWallet/pull/3400)
* show walletLink when signing [#3383](https://github.com/MyEtherWallet/MyEtherWallet/pull/3383)
  hide swap provider list when there is not enough balance [#3390](https://github.com/MyEtherWallet/MyEtherWallet/pull/3390)

### devop

* add toasts or error handling for known sentry errors [#3371](https://github.com/MyEtherWallet/MyEtherWallet/pull/3371)

### Release v6.0.4-hotfix.1

### feat

* allow users to use other unstoppable tlds, normalise ens domains names [#3377](https://github.com/MyEtherWallet/MyEtherWallet/pull/3377)

### fix

* fix wallet layout bug [#3373](https://github.com/MyEtherWallet/MyEtherWallet/pull/3373)
* fix checking enough eth in contract [#3378](https://github.com/MyEtherWallet/MyEtherWallet/pull/3378)
* fix my public address overlay layout [#3372](https://github.com/MyEtherWallet/MyEtherWallet/pull/3372)
* Make sure everything in address book is checksummed [#3289](https://github.com/MyEtherWallet/MyEtherWallet/pull/3289)

### Release v6.0.4

### devop

* revert mew compoent, update package for build [#3368](https://github.com/MyEtherWallet/MyEtherWallet/pull/3368)
* create a way to avoid changelog conflicts [#3336](https://github.com/MyEtherWallet/MyEtherWallet/pull/3336)
* remove remaining decision tree parts from quickhelp [#3345](https://github.com/MyEtherWallet/MyEtherWallet/pull/3345)
* validate changelog files [#3348](https://github.com/MyEtherWallet/MyEtherWallet/pull/3348)
* update unstoppable domains package [#3352](https://github.com/MyEtherWallet/MyEtherWallet/pull/3352)
* use swap link in all ccswap instances that are active [#3315](https://github.com/MyEtherWallet/MyEtherWallet/pull/3315)
* only require mew component update when it isn't a beta version [#3344](https://github.com/MyEtherWallet/MyEtherWallet/pull/3344)

### fix

* fix gas price going below basefee in eip 1559 [#3370](https://github.com/MyEtherWallet/MyEtherWallet/pull/3370)
* show tokens even if it is not in the network list [#3362](https://github.com/MyEtherWallet/MyEtherWallet/pull/3362)
* fix error when swapping due to currentTrade becoming null [#3366](https://github.com/MyEtherWallet/MyEtherWallet/pull/3366)
* Check if object is there before calling disconnect [#3298](https://github.com/MyEtherWallet/MyEtherWallet/pull/3298)
* Change the refresh icon colors (regular state and hover state) [#3353](https://github.com/MyEtherWallet/MyEtherWallet/pull/3353)
* fix metamask transaction send issue [#3354](https://github.com/MyEtherWallet/MyEtherWallet/pull/3354)
* fix sanitize hex all the spots [#3357](https://github.com/MyEtherWallet/MyEtherWallet/pull/3357)
* fix transaction confirmation total with fee [#3343](https://github.com/MyEtherWallet/MyEtherWallet/pull/3343)
* fix tx confirmation layout [#3335](https://github.com/MyEtherWallet/MyEtherWallet/pull/3335)
* tx confirmation mew help center link [#3323](https://github.com/MyEtherWallet/MyEtherWallet/pull/3323)
* fix verify message layout [#3320](https://github.com/MyEtherWallet/MyEtherWallet/pull/3320)
* fix set ipfs hash button visible while uploading file [#3321](https://github.com/MyEtherWallet/MyEtherWallet/pull/3305)
* Fix disable next button on swap [#3290](https://github.com/MyEtherWallet/MyEtherWallet/pull/3290)
* remove provider from title and fix checkbox alignment [#3314](https://github.com/MyEtherWallet/MyEtherWallet/pull/3314)
* fix sanitize hex utils check [#3285](https://github.com/MyEtherWallet/MyEtherWallet/pull/3285)
* fix polygon gasprice issue [#3312](https://github.com/MyEtherWallet/MyEtherWallet/pull/3312)
* Add ethereum token when from token is not ethereum for swap [#3305](https://github.com/MyEtherWallet/MyEtherWallet/pull/3305)
* fix givenProvider.request\_ is not a function [#3293](https://github.com/MyEtherWallet/MyEtherWallet/pull/3293)
* fix hardware wallet access erroring [#3299](https://github.com/MyEtherWallet/MyEtherWallet/pull/3299)
* fix error by catching it [#3318](https://github.com/MyEtherWallet/MyEtherWallet/pull/3318)
* fix e.wallet undefined error [#3319](https://github.com/MyEtherWallet/MyEtherWallet/pull/3319)
* hide language select [#3317](https://github.com/MyEtherWallet/MyEtherWallet/pull/3317)
* Fix wallet header overlapping issue on mobile [#3308](https://github.com/MyEtherWallet/MyEtherWallet/pull/3308)
* Fix swap display not working correctly [#3326](https://github.com/MyEtherWallet/MyEtherWallet/pull/3326)

### Feat

* remove quick help from v6 [3310](https://github.com/MyEtherWallet/MyEtherWallet/pull/3310)
* reset send and swap forms after pressing next [#3309](https://github.com/MyEtherWallet/MyEtherWallet/pull/3309)
* Add refresh icon to balance card [#3311](https://github.com/MyEtherWallet/MyEtherWallet/pull/3311)

### Release v6.0.3-hotfix.1

### Fix

* fix route import [#3291](https://github.com/MyEtherWallet/MyEtherWallet/pull/3291)
* Add scoped to mew wallet banner scss[#3304](https://github.com/MyEtherWallet/MyEtherWallet/pull/3304)

### Release v6.0.3

### Feature

* Add MEW wallet banner [#3295](https://github.com/MyEtherWallet/MyEtherWallet/pull/3295)

### Fix

* fix error message property of undefined [#3292](https://github.com/MyEtherWallet/MyEtherWallet/pull/3292)
* add mew notification prop to hide indicator [#3302](https://github.com/MyEtherWallet/MyEtherWallet/pull/3302)
* fix footer hiding content [#3296](https://github.com/MyEtherWallet/MyEtherWallet/pull/3296)

### Release v6.0.2

### Devop

* Update mew components and other packages [#3268](https://github.com/MyEtherWallet/MyEtherWallet/pull/3268)
* use v6 mewbuilds [#3257](https://github.com/MyEtherWallet/MyEtherWallet/pull/3257)
* Remove reference to master on checkBranch [#3254](https://github.com/MyEtherWallet/MyEtherWallet/pull/3254)

### Fix

* fix reset is not a function error [#3269](https://github.com/MyEtherWallet/MyEtherWallet/pull/3269)
* fix text overflow on hd wallet balance [#3265](https://github.com/MyEtherWallet/MyEtherWallet/pull/3265)
* fix re-add fix for routes [#3262](https://github.com/MyEtherWallet/MyEtherWallet/pull/3262)
* fix 'change route from watch to verify' and 'fix tools layout' [#3258](https://github.com/MyEtherWallet/MyEtherWallet/pull/3258)
* fix contract button size [#3263](https://github.com/MyEtherWallet/MyEtherWallet/pull/3263)
* fix back button on create wallet [#3241](https://github.com/MyEtherWallet/MyEtherWallet/pull/3241)
* fix prefilled swaps [#3240](https://github.com/MyEtherWallet/MyEtherWallet/pull/3240)
* fix nft send button when empty [#3261](https://github.com/MyEtherWallet/MyEtherWallet/pull/3261)
* use network getter instead of currentNetwork [#3260](https://github.com/MyEtherWallet/MyEtherWallet/pull/3260)
* fix getransferv2 error [#3259](https://github.com/MyEtherWallet/MyEtherWallet/pull/3259)
* fix tolowercase issues [#3276](https://github.com/MyEtherWallet/MyEtherWallet/pull/3276)
* fix create error [#3271](https://github.com/MyEtherWallet/MyEtherWallet/pull/3271)
* fix walletlink clear [#3277](https://github.com/MyEtherWallet/MyEtherWallet/pull/3277)
* fix let toast handle error [#3275](https://github.com/MyEtherWallet/MyEtherWallet/pull/3275)
* fix to address when transferring token [#3282](https://github.com/MyEtherWallet/MyEtherWallet/pull/3282)
* Add value to invalid type notification error message [#3280](https://github.com/MyEtherWallet/MyEtherWallet/pull/3280)
* Remove getTransactionByHash null error msg check and skip balance history apollo query if it is not ETH network [#3235](https://github.com/MyEtherWallet/MyEtherWallet/pull/3235)
* fix quickhelp content [#3287](https://github.com/MyEtherWallet/MyEtherWallet/pull/3287)

### Release v6.0.1

### Fix

* fix show private key in paper wallet for non pubKeyOnly wallets [#3239](https://github.com/MyEtherWallet/MyEtherWallet/pull/3239)
* Fix contract interaction[#3251](https://github.com/MyEtherWallet/MyEtherWallet/pull/3251)
* Format 24 hour change percentage on module balance [#3248](https://github.com/MyEtherWallet/MyEtherWallet/pull/3248)
* fix $store null [#3273](https://github.com/MyEtherWallet/MyEtherWallet/pull/3273)

### Feature

* Add dapp submission page [#3279](https://github.com/MyEtherWallet/MyEtherWallet/pull/3279)
* Change routes from hardcoded string to consts [#3244](https://github.com/MyEtherWallet/MyEtherWallet/pull/3244)
* Remove divider in Staked UI and replace Russ team member photo [#3246](https://github.com/MyEtherWallet/MyEtherWallet/pull/3246)

### Devop

* Fix sentry sourcemaps and add more devmojis [#3245](https://github.com/MyEtherWallet/MyEtherWallet/pull/3245)

### Release v6.0.0

### Fix

* fix routing issue [#3231](https://github.com/MyEtherWallet/MyEtherWallet/pull/3231)

### Devop

* Multiple fixes[#3236](https://github.com/MyEtherWallet/MyEtherWallet/pull/3236)
* Update team page [#3233](https://github.com/MyEtherWallet/MyEtherWallet/pull/3233)
* major wallet related refactor [#3170](https://github.com/MyEtherWallet/MyEtherWallet/pull/3170)
* fix overflow balance on card [3229](https://github.com/MyEtherWallet/MyEtherWallet/pull/3229)
* Fix v6 workflows [#3226](https://github.com/MyEtherWallet/MyEtherWallet/pull/3226)
* Add telegram link to footer [#3184](https://github.com/MyEtherWallet/MyEtherWallet/pull/3184)
* update readme [#3227](https://github.com/MyEtherWallet/MyEtherWallet/pull/3227)
* fix ipfs refetch once receipt, fix multicoin setting, fix txt record setting [#3198](https://github.com/MyEtherWallet/MyEtherWallet/pull/3198)
* remove wallet on back [#3206](https://github.com/MyEtherWallet/MyEtherWallet/pull/3206)
* listen and match metamask changes [#3203](https://github.com/MyEtherWallet/MyEtherWallet/pull/3203)
* fix landing and create wallet ui issues [#3190](https://github.com/MyEtherWallet/MyEtherWallet/pull/3190)
* Disable next button on gas estimation process or error [#3180](https://github.com/MyEtherWallet/MyEtherWallet/pull/3180)
* fix wallet link, fix trade, remove shield icon [#3181](https://github.com/MyEtherWallet/MyEtherWallet/pull/3181)
* fix create wallet flows [#3174](https://github.com/MyEtherWallet/MyEtherWallet/pull/3174)
* Fix swap verification data field [#3176](https://github.com/MyEtherWallet/MyEtherWallet/pull/3176)
* set eth as currency default [#3171](https://github.com/MyEtherWallet/MyEtherWallet/pull/3171)
* Fix swap verification data field [#3162](https://github.com/MyEtherWallet/MyEtherWallet/pull/3162)
* hide provider with 0 rates [#3167](https://github.com/MyEtherWallet/MyEtherWallet/pull/3167)
* fix console errors [#3168](https://github.com/MyEtherWallet/MyEtherWallet/pull/3168)
* btc address check [#3159](https://github.com/MyEtherWallet/MyEtherWallet/pull/3159)
* Fix swap provider list [#3152](https://github.com/MyEtherWallet/MyEtherWallet/pull/3152)
* Add scrollable option to app modal [#3145](https://github.com/MyEtherWallet/MyEtherWallet/pull/3145)
* Fix gas fee not showing up [#3139](https://github.com/MyEtherWallet/MyEtherWallet/pull/3139)
* Move component and update packages [#3141](https://github.com/MyEtherWallet/MyEtherWallet/pull/3141)
* Remove tokens from to selection if it is selected on from and vice versa [#3107](https://github.com/MyEtherWallet/MyEtherWallet/pull/3107)
* Add swap token switch [#3103](https://github.com/MyEtherWallet/MyEtherWallet/pull/3103)
* Fix swap button [#3116](https://github.com/MyEtherWallet/MyEtherWallet/pull/3116)
* Fix swap current balance [#3118](https://github.com/MyEtherWallet/MyEtherWallet/pull/3118)
* Fix ENS icons [#3110](https://github.com/MyEtherWallet/MyEtherWallet/pull/3110)
* Fix Swap store BTC on ETH message [#3106](https://github.com/MyEtherWallet/MyEtherWallet/pull/3106)
* Fix mew-select border issue [#3091](https://github.com/MyEtherWallet/MyEtherWallet/pull/3091)
* Add user msg for swap [#3087](https://github.com/MyEtherWallet/MyEtherWallet/pull/3087)
* Remove compiler [#3115](https://github.com/MyEtherWallet/MyEtherWallet/pull/3115)
* Harmonize errors across wallets [#3051](https://github.com/MyEtherWallet/MyEtherWallet/pull/3051)
* Fix ui issues for aave [#3079](https://github.com/MyEtherWallet/MyEtherWallet/pull/3079)
* Add top right button [#3081](https://github.com/MyEtherWallet/MyEtherWallet/pull/3081)
* Recalculate rates when gas price is switched [#3039](https://github.com/MyEtherWallet/MyEtherWallet/pull/3039)
* Fetch swap quotes only when all fields are in place [#3040](https://github.com/MyEtherWallet/MyEtherWallet/pull/3040)
* swap updates [#3034](https://github.com/MyEtherWallet/MyEtherWallet/pull/3034)
* Fix ui issues for dapps [#3060](https://github.com/MyEtherWallet/MyEtherWallet/pull/3060)
* Fix paper wallet printing bugs [#3050](https://github.com/MyEtherWallet/MyEtherWallet/pull/3050)
* Fix landing page paddings and set min width [#3059](https://github.com/MyEtherWallet/MyEtherWallet/pull/3059)
* Adjust home banner to fit on very large screen size [#3058](https://github.com/MyEtherWallet/MyEtherWallet/pull/3058)
* Hide options when not on mainnet [#3021](https://github.com/MyEtherWallet/MyEtherWallet/pull/3021)
* Update Deposit Borrow Withdraw layouts [#3016](https://github.com/MyEtherWallet/MyEtherWallet/pull/3016)
* Fix custom gas price not loaded after logging in [#3026](https://github.com/MyEtherWallet/MyEtherWallet/pull/3026)
* Note below min amount swaps [#3030](https://github.com/MyEtherWallet/MyEtherWallet/pull/3030)
* Add Switch Address for Hardware wallets [#3042](https://github.com/MyEtherWallet/MyEtherWallet/pull/3042)
* Allows press enter on keystore access [#3043](https://github.com/MyEtherWallet/MyEtherWallet/pull/3043)
* Fix zero tx fee on confirmation screen and in notifications [#3025](https://github.com/MyEtherWallet/MyEtherWallet/pull/3025)
* Find chart timeframe with data on load [#3031](https://github.com/MyEtherWallet/MyEtherWallet/pull/3031)
* Show toast when no web3 wallet is shown [#3037](https://github.com/MyEtherWallet/MyEtherWallet/pull/3037)
* Add mewcard wallet image [#3006](https://github.com/MyEtherWallet/MyEtherWallet/pull/3006)
* Fix ens manage domain [#2997](https://github.com/MyEtherWallet/MyEtherWallet/pull/2997)
* Hide options when not on mainnet [#3021](https://github.com/MyEtherWallet/MyEtherWallet/pull/3021)
* Fix dapps confirmation layout issues [#3017](https://github.com/MyEtherWallet/MyEtherWallet/pull/3017)
* Update Deposit Borrow Withdraw layouts [#3016](https://github.com/MyEtherWallet/MyEtherWallet/pull/3016)
* Fix mobile menu logo and max screen size [#2998](https://github.com/MyEtherWallet/MyEtherWallet/pull/2998)
* Fix ens manage domain [#2997](https://github.com/MyEtherWallet/MyEtherWallet/pull/2997)
* fix not error with invalid keystore file [#3022](https://github.com/MyEtherWallet/MyEtherWallet/pull/3022)
* Fix import configuration, sign message clear [#2985](https://github.com/MyEtherWallet/MyEtherWallet/pull/2985)
* Fix sign message mobile layout [#2990](https://github.com/MyEtherWallet/MyEtherWallet/pull/2990)
* Fix verify message layout [#2987](https://github.com/MyEtherWallet/MyEtherWallet/pull/2987)
* Fix footer CoinGecko link and verify message link [#2957](https://github.com/MyEtherWallet/MyEtherWallet/pull/2957)
* Fix hardware access - network and address select [#2937](https://github.com/MyEtherWallet/MyEtherWallet/pull/2937)
* Fix partners link [#2953](https://github.com/MyEtherWallet/MyEtherWallet/pull/2953)
* Fix print paper wallet [#2956](https://github.com/MyEtherWallet/MyEtherWallet/pull/2956)
* Fix decision-tree support contact link [#2959](https://github.com/MyEtherWallet/MyEtherWallet/pull/2959)
* Fix hardware wallet links [#2963](https://github.com/MyEtherWallet/MyEtherWallet/pull/2963)
* Fix interact with contract dropdown [#2964](https://github.com/MyEtherWallet/MyEtherWallet/pull/2964)
* Fix no balance missing balance card [#2965](https://github.com/MyEtherWallet/MyEtherWallet/pull/2965)
* Fix buy eth button overflow issue on old Chrome browsers [#2966](https://github.com/MyEtherWallet/MyEtherWallet/pull/2966)
* Fix access hardware wallet layout [#2926](https://github.com/MyEtherWallet/MyEtherWallet/pull/2926)
* Update tools page [#2944](https://github.com/MyEtherWallet/MyEtherWallet/pull/2944)
* Update how it works layout [#2925](https://github.com/MyEtherWallet/MyEtherWallet/pull/2925)
* Fix logout [#2950](https://github.com/MyEtherWallet/MyEtherWallet/pull/2950)
* Update side menu [#2949](https://github.com/MyEtherWallet/MyEtherWallet/pull/2949)
* Fix acceass wallet button font size [#2943](https://github.com/MyEtherWallet/MyEtherWallet/pull/2943)
* Update home features [#2935](https://github.com/MyEtherWallet/MyEtherWallet/pull/2935)
* Add MEWconnect [#2934](https://github.com/MyEtherWallet/MyEtherWallet/pull/2934)
* Fix send and sign tx [#2929](https://github.com/MyEtherWallet/MyEtherWallet/pull/2929)
* Fix get started block [#2924](https://github.com/MyEtherWallet/MyEtherWallet/pull/2924)
* Merge UI fixes [#2916](https://github.com/MyEtherWallet/MyEtherWallet/pull/2916)
* Fix create wallet nnemonic layout [#2912](https://github.com/MyEtherWallet/MyEtherWallet/pull/2912)
* Fix create wallet keystore layout [#2911](https://github.com/MyEtherWallet/MyEtherWallet/pull/2911)
* Update wallet side menu content order [#2910](https://github.com/MyEtherWallet/MyEtherWallet/pull/2910)
* Update mobile menu UI [#2900](https://github.com/MyEtherWallet/MyEtherWallet/pull/2900)
* Move tokens to state [#2898](https://github.com/MyEtherWallet/MyEtherWallet/pull/2898)
* Mobile Navigation bar implementationn for wallet, repalce mdi-text icon to svg [#2895](https://github.com/MyEtherWallet/MyEtherWallet/pull/2895)
* Refactor empty balance block, hide elemnents on network switches [#2890](https://github.com/MyEtherWallet/MyEtherWallet/pull/2890)
* Fix langing page header [#2886](https://github.com/MyEtherWallet/MyEtherWallet/pull/2886)
* Refactor access wallet, update ui to make it consistent [#2846](https://github.com/MyEtherWallet/MyEtherWallet/pull/2846)
* Update swap provider list [#2871](https://github.com/MyEtherWallet/MyEtherWallet/pull/2871)
* Settings [#2835h](https://github.com/MyEtherWallet/MyEtherWallet/pull/2835)
* notifications [#2860](https://github.com/MyEtherWallet/MyEtherWallet/pull/2860)
* Created Core wallet layout, fixes for header and footer [#2863](https://github.com/MyEtherWallet/MyEtherWallet/pull/2863)
* Fix sentry [#2858](https://github.com/MyEtherWallet/MyEtherWallet/pull/2858)
* Fix wallet layouts [#2848](https://github.com/MyEtherWallet/MyEtherWallet/pull/2848)
* add commitlint and husky for branch names [#2845](https://github.com/MyEtherWallet/MyEtherWallet/pull/2845)
* Send TX changes [#2797](https://github.com/MyEtherWallet/MyEtherWallet/pull/2797)
* Vuex changes [#2787](https://github.com/MyEtherWallet/MyEtherWallet/pull/2787)
* Add SWAP feature [#2774](https://github.com/MyEtherWallet/MyEtherWallet/pull/2774)
* Add decision tree [#2720](https://github.com/MyEtherWallet/MyEtherWallet/pull/2720)
* Add Privacy and Terms pages [#2733](https://github.com/MyEtherWallet/MyEtherWallet/pull/2733)
* update mobile wallet menu [#2731](https://github.com/MyEtherWallet/MyEtherWallet/pull/2731)
* update mobile front menu [#2726](https://github.com/MyEtherWallet/MyEtherWallet/pull/2726)
* Update team page [#2743](https://github.com/MyEtherWallet/MyEtherWallet/pull/2743)
* Add Press Kit page [#2742](https://github.com/MyEtherWallet/MyEtherWallet/pull/2742)
* Fix mew info card UI issues [#2737](https://github.com/MyEtherWallet/MyEtherWallet/pull/2737)
* Fix how it works UI issues [#2736](https://github.com/MyEtherWallet/MyEtherWallet/pull/2736)
* update mobile dashboard [#2673](https://github.com/MyEtherWallet/MyEtherWallet/pull/2673)
* update mobile notification [#2671](https://github.com/MyEtherWallet/MyEtherWallet/pull/2671)
* update mobile side menu [#2670](https://github.com/MyEtherWallet/MyEtherWallet/pull/2670)
* update mobile tools [#2669](https://github.com/MyEtherWallet/MyEtherWallet/pull/2669)
* update mobile how it works [#2668](https://github.com/MyEtherWallet/MyEtherWallet/pull/2668)
* Update mobile access wallet [#2663](https://github.com/MyEtherWallet/MyEtherWallet/pull/2663)
* Update mobile create wallet [#2661](https://github.com/MyEtherWallet/MyEtherWallet/pull/2661)
* Finalize routes [#2556](https://github.com/MyEtherWallet/MyEtherWallet/pull/2556)
* Update/Add landing, create wallet, access wallet pages [#2493](https://github.com/MyEtherWallet/MyEtherWallet/pull/2493)
* Apply MEW components to dashboard [#2378](https://github.com/MyEtherWallet/MyEtherWallet/pull/2378)
* Add MY TOKENS VALUE component for Dashboard [#2015](https://github.com/MyEtherWallet/MyEtherWallet/pull/2015)
* Update my eth balance component chart [#1987](https://github.com/MyEtherWallet/MyEtherWallet/pull/1987)
* Sign and Verify Message [#2841](https://github.com/MyEtherWallet/MyEtherWallet/pull/2841)
