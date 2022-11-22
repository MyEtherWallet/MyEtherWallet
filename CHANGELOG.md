### Release v6.6.11

### ui

* Disable upload button when input is empty [#4336](https://github.com/MyEtherWallet/MyEtherWallet/pull/4336)

### devop

* replace network icons with mew-token-container [#4246](https://github.com/MyEtherWallet/MyEtherWallet/pull/4246)
* update dapps icons, update AAVE header [#4324](https://github.com/MyEtherWallet/MyEtherWallet/pull/4324)
* add path for print wallet [#4354](https://github.com/MyEtherWallet/MyEtherWallet/pull/4354)
* Add hash build on releases [#4355](https://github.com/MyEtherWallet/MyEtherWallet/pull/4355)

### fix

* fix dapp button capitalization [#4225](https://github.com/MyEtherWallet/MyEtherWallet/pull/4225)
* swap rate > replace large eth icon to right size icon [#4236](https://github.com/MyEtherWallet/MyEtherWallet/pull/4236)
* Dont own token error when token's decimals are 0 [#4294](https://github.com/MyEtherWallet/MyEtherWallet/pull/4294)
* fix history notification overlap [#4298](https://github.com/MyEtherWallet/MyEtherWallet/pull/4298)
* replace default list icon with arrow icon [#4309](https://github.com/MyEtherWallet/MyEtherWallet/pull/4309)
* adjust top padding for mobile overlays [#4312](https://github.com/MyEtherWallet/MyEtherWallet/pull/4312)
* fix nft send button active with no address input [#4322](https://github.com/MyEtherWallet/MyEtherWallet/pull/4322)
* fix select network shows broken layout revert [#4325](https://github.com/MyEtherWallet/MyEtherWallet/pull/4325)
* fix bitbox price euro to usd [#4326](https://github.com/MyEtherWallet/MyEtherWallet/pull/4326)
* Remove MEWconnect app store links from security policy [#4328](https://github.com/MyEtherWallet/MyEtherWallet/pull/4328)
* fix dashboard table text, fix table page buttons [#4333](https://github.com/MyEtherWallet/MyEtherWallet/pull/4333)
* Fix USDT value 0 on landing page [#4338](https://github.com/MyEtherWallet/MyEtherWallet/pull/4338)
* disabled compounding on stakewise [#4344](https://github.com/MyEtherWallet/MyEtherWallet/pull/4344)
* fix missing box shadow for dashboard taken balance block [#4348](https://github.com/MyEtherWallet/MyEtherWallet/pull/4348)
* fix XDC network [#4361](https://github.com/MyEtherWallet/MyEtherWallet/pull/4361)
* add tooltip to show full address on settings address table [#4368](https://github.com/MyEtherWallet/MyEtherWallet/pull/4368)
* Fix 'Address verified' message displaying without verifying on Trezor [#4371](https://github.com/MyEtherWallet/MyEtherWallet/pull/4371)
* Fix cannot read properties 'mintData' on ETH Blocks [#4372](https://github.com/MyEtherWallet/MyEtherWallet/pull/4372)

### Release v6.6.10-hotfix.1

* update matic api endpoint [#4353](https://github.com/MyEtherWallet/MyEtherWallet/pull/4353)

### Release v6.6.10

### devop

* devop landing page enkrypt bottom padding [#4302](https://github.com/MyEtherWallet/MyEtherWallet/pull/4302)
* devop dapp button too wide fix [#4308](https://github.com/MyEtherWallet/MyEtherWallet/pull/4308)
* devop wallet carousel animation remove arrows [#4315](https://github.com/MyEtherWallet/MyEtherWallet/pull/4315)
* add matomo event for user exit [#4332](https://github.com/MyEtherWallet/MyEtherWallet/pull/4332)
* add more matomo tracking [#4339](https://github.com/MyEtherWallet/MyEtherWallet/pull/4339)

### feat

* ledger prompt [#4233](https://github.com/MyEtherWallet/MyEtherWallet/pull/4233)

### fix

* added toast errorhandler, removed popup error [#4239](https://github.com/MyEtherWallet/MyEtherWallet/pull/4239)
* fix button titles to give uniform button look [#4273](https://github.com/MyEtherWallet/MyEtherWallet/pull/4273)
* ToS link on confirmation pop up [#4284](https://github.com/MyEtherWallet/MyEtherWallet/pull/4284)
* Offline helper sends transaction when signer doesnt match selected address [#4287](https://github.com/MyEtherWallet/MyEtherWallet/pull/4287)
* Fix ETH Blocks max year selection [#4290](https://github.com/MyEtherWallet/MyEtherWallet/pull/4290)
* Fix buy/sell selection empty when searching [#4295](https://github.com/MyEtherWallet/MyEtherWallet/pull/4295)
* Fix Aave deposit max amount to token balance [#4297](https://github.com/MyEtherWallet/MyEtherWallet/pull/4297)
* fix privacy policy header padding [#4300](https://github.com/MyEtherWallet/MyEtherWallet/pull/4300)
* fix select network button overlapping issue [#4304](https://github.com/MyEtherWallet/MyEtherWallet/pull/4304)
* Sentry Error ContractNoAddressDefinedError on sell pop up [#4306](https://github.com/MyEtherWallet/MyEtherWallet/pull/4306)
* Sentry Error blockExplorerTX is undefined (formatNotification) [#4307](https://github.com/MyEtherWallet/MyEtherWallet/pull/4307)
* fix broken paperwallet layout [#4314](https://github.com/MyEtherWallet/MyEtherWallet/pull/4314)
* Update path when switching Ledger app [#4318](https://github.com/MyEtherWallet/MyEtherWallet/pull/4318)
* Bug where Ledger Live address would show on first connect [#4327](https://github.com/MyEtherWallet/MyEtherWallet/pull/4327)

### Release v6.6.9

### devop

* update mew-tabs and mew-stepper on tabs page [#4036](https://github.com/MyEtherWallet/MyEtherWallet/pull/4036)
* Update custom derivation path [#4215](https://github.com/MyEtherWallet/MyEtherWallet/pull/4215)
* Remove links when using MEW Offline [#4221](https://github.com/MyEtherWallet/MyEtherWallet/pull/4221)
* replace settings address table component with new table, replace dashboard token table with new table component [#4249](https://github.com/MyEtherWallet/MyEtherWallet/pull/4249)
* swap cross chain e2e test [#4253](https://github.com/MyEtherWallet/MyEtherWallet/pull/4253)
* eth to erc swap e2e test [#4260](https://github.com/MyEtherWallet/MyEtherWallet/pull/4260)
* Contract interaction e2e test [#4263](https://github.com/MyEtherWallet/MyEtherWallet/pull/4263)
* Contract deployment e2e test [#4265](https://github.com/MyEtherWallet/MyEtherWallet/pull/4265)
* Remove EventBus instances before destroying component [#4288](https://github.com/MyEtherWallet/MyEtherWallet/pull/4288)
* sync develop [#4292](https://github.com/MyEtherWallet/MyEtherWallet/pull/4292)

### feat

* cool wallet pro [#3589](https://github.com/MyEtherWallet/MyEtherWallet/pull/3589)
* add tx broadcaster [#4319](https://github.com/MyEtherWallet/MyEtherWallet/pull/4319)

### fix

* fix type error minmax.minFrom [#3813](https://github.com/MyEtherWallet/MyEtherWallet/pull/3813)
* fix sentry type error filter undefined [#3815](https://github.com/MyEtherWallet/MyEtherWallet/pull/3815)
* fix sentry nonce too low [#3818](https://github.com/MyEtherWallet/MyEtherWallet/pull/3818)
* set max-width for manage domain tab to give uniform look [#4065](https://github.com/MyEtherWallet/MyEtherWallet/pull/4065)
* add error handling for unhandled promise error in matic swap [#4079](https://github.com/MyEtherWallet/MyEtherWallet/pull/4079)
* remove swap user warning message box [#4207](https://github.com/MyEtherWallet/MyEtherWallet/pull/4207)
* fix adding custom path without alias [#4228](https://github.com/MyEtherWallet/MyEtherWallet/pull/4228)
* fix sentry type error balance card [#4237](https://github.com/MyEtherWallet/MyEtherWallet/pull/4237)
* replace remove address button with mew-button [#4245](https://github.com/MyEtherWallet/MyEtherWallet/pull/4245)
* Sentry issue Given address "null" is not a valid Ethereum address [#4251](https://github.com/MyEtherWallet/MyEtherWallet/pull/4251)
* Sentry issue Cannot read properties of null (reading 'meta') [#4252](https://github.com/MyEtherWallet/MyEtherWallet/pull/4252)
* Sentry issue Cannot read properties of null (reading 'toLowerCase') [#4254](https://github.com/MyEtherWallet/MyEtherWallet/pull/4254)
* fix toast for receiving dash [#4256](https://github.com/MyEtherWallet/MyEtherWallet/pull/4256)
* Fix Ledger swap debug data typo [#4259](https://github.com/MyEtherWallet/MyEtherWallet/pull/4259)
* Sentry error removeListener is not a function [#4262](https://github.com/MyEtherWallet/MyEtherWallet/pull/4262)
* fix sentry type error refs [#4264](https://github.com/MyEtherWallet/MyEtherWallet/pull/4264)
* fix wallet connect popup exit error [#4270](https://github.com/MyEtherWallet/MyEtherWallet/pull/4270)
* Keystore back button doesn't clear password [#4272](https://github.com/MyEtherWallet/MyEtherWallet/pull/4272)
* fix inconsistent labels for tokens in swap dropdown [#4279](https://github.com/MyEtherWallet/MyEtherWallet/pull/4279)
* fix tooltip alignment [#4281](https://github.com/MyEtherWallet/MyEtherWallet/pull/4281)
* Fix double confirmation when swapping on mnemonic [#4289](https://github.com/MyEtherWallet/MyEtherWallet/pull/4289)
* Buy popup cant select crypto when amount invalid [#4293](https://github.com/MyEtherWallet/MyEtherWallet/pull/4293)
* fix sentry moonpay suppurted fiat symbol type error [#4296](https://github.com/MyEtherWallet/MyEtherWallet/pull/4296)
* Sentry issue currencyName is undefined in AddressBook [#4301](https://github.com/MyEtherWallet/MyEtherWallet/pull/4301)

### Release v6.6.8

### devop

* Add tracking to Buy Sell component [#4220](https://github.com/MyEtherWallet/MyEtherWallet/pull/4220)
* Switch offline network with imported JSON [#4222](https://github.com/MyEtherWallet/MyEtherWallet/pull/4222)
* Add e2e send transaction test [#4240](https://github.com/MyEtherWallet/MyEtherWallet/pull/4240)
* print wallet e2e testing [#4244](https://github.com/MyEtherWallet/MyEtherWallet/pull/4244)
* change workflow to only run on staging [#4248](https://github.com/MyEtherWallet/MyEtherWallet/pull/4248)
* add new matomo changes [#4267](https://github.com/MyEtherWallet/MyEtherWallet/pull/4267)
* add more matomo changes [#4275](https://github.com/MyEtherWallet/MyEtherWallet/pull/4275)

### feat

* add back kleros [#4255](https://github.com/MyEtherWallet/MyEtherWallet/pull/4255)

### fix

* Fix Aave health factor displaying NaN or '-1.000' [#4164](https://github.com/MyEtherWallet/MyEtherWallet/pull/4164)
* Handles e as input in Module Send [#4206](https://github.com/MyEtherWallet/MyEtherWallet/pull/4206)
* Fix duplicate DOGE token on swap page [#4211](https://github.com/MyEtherWallet/MyEtherWallet/pull/4211)
* fix decimal input gets deleted [#4214](https://github.com/MyEtherWallet/MyEtherWallet/pull/4214)
* add aave to features section [#4217](https://github.com/MyEtherWallet/MyEtherWallet/pull/4217)
* fix live learn more link [#4219](https://github.com/MyEtherWallet/MyEtherWallet/pull/4219)
* Fix Moonbeam switch error pertaining to incorrect block number [#4223](https://github.com/MyEtherWallet/MyEtherWallet/pull/4223)
* Fix Sentry Cannot read properties of undefined (reading 'contract') [#4224](https://github.com/MyEtherWallet/MyEtherWallet/pull/4224)
* Disable Sign button when no input [#4226](https://github.com/MyEtherWallet/MyEtherWallet/pull/4226)
* Fix Sentry Cannot read properties of undefined (reading 'toLowerCase') on MoonpayBuy [#4227](https://github.com/MyEtherWallet/MyEtherWallet/pull/4227)
* fix mint me token not showing issue [#4231](https://github.com/MyEtherWallet/MyEtherWallet/pull/4231)
* fix eth block search result alignment [#4232](https://github.com/MyEtherWallet/MyEtherWallet/pull/4232)
* Network change not updating ENS reverse domains [#4234](https://github.com/MyEtherWallet/MyEtherWallet/pull/4234)
* Sentry Error Cannot read properties of null (reading 'message') on TheWalletView [#4235](https://github.com/MyEtherWallet/MyEtherWallet/pull/4235)

### Release v6.6.7

### ui

* Fix button texts being cut off in 'Generate Keystore' [#4180](https://github.com/MyEtherWallet/MyEtherWallet/pull/4180)
* Update Buy Eth banner [#4193](https://github.com/MyEtherWallet/MyEtherWallet/pull/4193)

### devop

* change components and json to dynamic imports [#4080](https://github.com/MyEtherWallet/MyEtherWallet/pull/4080)
* Add cross chain tokens to 'To Tokens' swap dropdown [#4137](https://github.com/MyEtherWallet/MyEtherWallet/pull/4137)
* custom token symbols are now editable [#4158](https://github.com/MyEtherWallet/MyEtherWallet/pull/4158)
* Optimize Website [#4161](https://github.com/MyEtherWallet/MyEtherWallet/pull/4161)
* buy sell pop up padding [#4167](https://github.com/MyEtherWallet/MyEtherWallet/pull/4167)
* devop fix qr pop up 'x' padding and margin [#4168](https://github.com/MyEtherWallet/MyEtherWallet/pull/4168)
* Change Swap flow tracking for Matomo [#4192](https://github.com/MyEtherWallet/MyEtherWallet/pull/4192)
* invalid dates are no longer selectable for eth blocks [#4199](https://github.com/MyEtherWallet/MyEtherWallet/pull/4199)
* hide x button on successful modal [#4200](https://github.com/MyEtherWallet/MyEtherWallet/pull/4200)
* Added minimum required message [#4201](https://github.com/MyEtherWallet/MyEtherWallet/pull/4201)

### fix

* Fix default derivation path for Ledger [#4117](https://github.com/MyEtherWallet/MyEtherWallet/pull/4117)
* reserve eth blocks design fix [#4176](https://github.com/MyEtherWallet/MyEtherWallet/pull/4176)
* Fix incorrect nonce for swaps that need approval [#4177](https://github.com/MyEtherWallet/MyEtherWallet/pull/4177)
* fix mew logo inside qr code not showing from safari browser [#4178](https://github.com/MyEtherWallet/MyEtherWallet/pull/4178)
* remove up down buttons for input fields [#4179](https://github.com/MyEtherWallet/MyEtherWallet/pull/4179)
* fix missing dollar sign on swap [#4183](https://github.com/MyEtherWallet/MyEtherWallet/pull/4183)
* remove ens-lookup dropdown icons [#4184](https://github.com/MyEtherWallet/MyEtherWallet/pull/4184)
* Fix settings opening a different page on close [#4185](https://github.com/MyEtherWallet/MyEtherWallet/pull/4185)
* Fix error when switching tokens on swap page [#4186](https://github.com/MyEtherWallet/MyEtherWallet/pull/4186)
* Add negative check for certain tokens in Swap [#4188](https://github.com/MyEtherWallet/MyEtherWallet/pull/4188)
* update buttons on contract and message pages [#4189](https://github.com/MyEtherWallet/MyEtherWallet/pull/4189)
* fix unavailable partner link [#4190](https://github.com/MyEtherWallet/MyEtherWallet/pull/4190)
* fix invalid selected-network value when user search for network on offline helper [#4191](https://github.com/MyEtherWallet/MyEtherWallet/pull/4191)
* Fix ENS Manage multicall is not a function [#4194](https://github.com/MyEtherWallet/MyEtherWallet/pull/4194)
* Check for balance and gas estimation in Stakewise [#4198](https://github.com/MyEtherWallet/MyEtherWallet/pull/4198)
* access and create wallet button badge position for mobile [#4208](https://github.com/MyEtherWallet/MyEtherWallet/pull/4208)
* Fix MetaMask network error message [#4209](https://github.com/MyEtherWallet/MyEtherWallet/pull/4209)
* fix moonpay domain name resolver [#4213](https://github.com/MyEtherWallet/MyEtherWallet/pull/4213)
* fix develop bugs [#4218](https://github.com/MyEtherWallet/MyEtherWallet/pull/4218)

### Release v6.6.6

### ui

* Remove full width on Remove Address button in Settings [#4147](https://github.com/MyEtherWallet/MyEtherWallet/pull/4147)

### devop

* Add prompt to open app for Ledger device [#4031](https://github.com/MyEtherWallet/MyEtherWallet/pull/4031)
* remove mew products button from mobile button, apply new menu design, make menu scrollable [#4125](https://github.com/MyEtherWallet/MyEtherWallet/pull/4125)
* added option to remove custom paths [#4138](https://github.com/MyEtherWallet/MyEtherWallet/pull/4138)
* Add tracking metrics to Stakewise [#4150](https://github.com/MyEtherWallet/MyEtherWallet/pull/4150)
* Add tracking metrics to Aave [#4151](https://github.com/MyEtherWallet/MyEtherWallet/pull/4151)
* devop add matomo tracking to ens manager [#4152](https://github.com/MyEtherWallet/MyEtherWallet/pull/4152)
* Changed placeholder text for staked search bar [#4154](https://github.com/MyEtherWallet/MyEtherWallet/pull/4154)
* add matomo tracking for stake functions [#4162](https://github.com/MyEtherWallet/MyEtherWallet/pull/4162)
* release fixes and cleanup [#4187](https://github.com/MyEtherWallet/MyEtherWallet/pull/4187)
* offline test and build [#4196](https://github.com/MyEtherWallet/MyEtherWallet/pull/4196)

### feat

* add hide tokens feature [#3872](https://github.com/MyEtherWallet/MyEtherWallet/pull/3872)
* feature unstoppable reverse resolver [#4118](https://github.com/MyEtherWallet/MyEtherWallet/pull/4118)

### fix

* sentry error maxblock tobn [#3952](https://github.com/MyEtherWallet/MyEtherWallet/pull/3952)
* fix enkrypt button links and add mobile enkrypt buttons [#4128](https://github.com/MyEtherWallet/MyEtherWallet/pull/4128)
* Fix undefined swap tooltips and 0 rate swaps [#4133](https://github.com/MyEtherWallet/MyEtherWallet/pull/4133)
* Fix default gaslimit not updating when switching tokens on send page [#4140](https://github.com/MyEtherWallet/MyEtherWallet/pull/4140)
* Fix unable to add custom token and autopopulate token info [#4142](https://github.com/MyEtherWallet/MyEtherWallet/pull/4142)
* Fix custom token symbol length placeholder [#4143](https://github.com/MyEtherWallet/MyEtherWallet/pull/4143)
* Add padding for all resolutions in Stakewise Rewards section [#4146](https://github.com/MyEtherWallet/MyEtherWallet/pull/4146)
* Fix negative amount when gas limit is too high on send [#4148](https://github.com/MyEtherWallet/MyEtherWallet/pull/4148)
* Fix addressbook get nickname issue [#4153](https://github.com/MyEtherWallet/MyEtherWallet/pull/4153)
* added error catch for nonce [#4155](https://github.com/MyEtherWallet/MyEtherWallet/pull/4155)
* clear balance on network change [#4160](https://github.com/MyEtherWallet/MyEtherWallet/pull/4160)
* Fix offline send transaction 'Generate' button not working [#4163](https://github.com/MyEtherWallet/MyEtherWallet/pull/4163)
* Update Aave dApp subtitle [#4165](https://github.com/MyEtherWallet/MyEtherWallet/pull/4165)
* [#4181](https://github.com/MyEtherWallet/MyEtherWallet/pull/4181)

### sentry

* use lodash isNaN instead [#4044](https://github.com/MyEtherWallet/MyEtherWallet/pull/4044)

### Release v6.6.5

### devop

* replace token images with mew-token-container for uniform look [#4040](https://github.com/MyEtherWallet/MyEtherWallet/pull/4040)
* Integrated Kleros name tags to address book [#4057](https://github.com/MyEtherWallet/MyEtherWallet/pull/4057)
* Switch network toast for web3 extensions [#4145](https://github.com/MyEtherWallet/MyEtherWallet/pull/4145)

### feat

* Add Aave graphql mixin [#3133](https://github.com/MyEtherWallet/MyEtherWallet/pull/3133)
* add Aave v2 dApp [#3879](https://github.com/MyEtherWallet/MyEtherWallet/pull/3879)

### fix

* fix release bugs [#4157](https://github.com/MyEtherWallet/MyEtherWallet/pull/4157)
* fix invalid ledger derivation path [#4052](https://github.com/MyEtherWallet/MyEtherWallet/pull/4052)
* fix error switching networks metamask [#4087](https://github.com/MyEtherWallet/MyEtherWallet/pull/4087)
* fix eth blocks transaction fee wording [#4093](https://github.com/MyEtherWallet/MyEtherWallet/pull/4093)
* Fix offline send transaction [#4095](https://github.com/MyEtherWallet/MyEtherWallet/pull/4095)
* fix token switch interaction in Swap [#4099](https://github.com/MyEtherWallet/MyEtherWallet/pull/4099)
* add up arrow and add animation to open close indicator arrow [#4105](https://github.com/MyEtherWallet/MyEtherWallet/pull/4105)
* Added listener for settings [#4107](https://github.com/MyEtherWallet/MyEtherWallet/pull/4107)
* added info for blank tokens [#4113](https://github.com/MyEtherWallet/MyEtherWallet/pull/4113)
* Fix 'create another wallet' not resetting extra word verification [#4115](https://github.com/MyEtherWallet/MyEtherWallet/pull/4115)
* Fix Mnemonic Phrase not loading selected network [#4127](https://github.com/MyEtherWallet/MyEtherWallet/pull/4127)
* Added check for undefined token baseList [#4130](https://github.com/MyEtherWallet/MyEtherWallet/pull/4130)
* Fix multiple ETH and BNB swap options [#4131](https://github.com/MyEtherWallet/MyEtherWallet/pull/4131)
* fix ens domain register and text changes [#4134](https://github.com/MyEtherWallet/MyEtherWallet/pull/4134)
* Fix moonpay token unselected on network change and undefined symbol [#4135](https://github.com/MyEtherWallet/MyEtherWallet/pull/4135)
* Fix missing dollar sign on sell tab [#4139](https://github.com/MyEtherWallet/MyEtherWallet/pull/4139)

### Release v6.6.4-hotfix.1

### fix

* add more tracking for matomo [#4129](https://github.com/MyEtherWallet/MyEtherWallet/pull/4129)
* add ledger debug warning [#4141](https://github.com/MyEtherWallet/MyEtherWallet/pull/4141)

### Release v6.6.4

### devop

* devop metamask network [#3854](https://github.com/MyEtherWallet/MyEtherWallet/pull/3854)
* swap token prices not showing [#4096](https://github.com/MyEtherWallet/MyEtherWallet/pull/4096)
* Consistent address book identicons [#4102](https://github.com/MyEtherWallet/MyEtherWallet/pull/4102)

### fix

* fix Renew Domain Wording on ENS [#4003](https://github.com/MyEtherWallet/MyEtherWallet/pull/4003)
* Fix swap 404 & 500 errors [#4012](https://github.com/MyEtherWallet/MyEtherWallet/pull/4012)
* add padding to total value text [#4053](https://github.com/MyEtherWallet/MyEtherWallet/pull/4053)
* Fix max token balance autofill on send page [#4055](https://github.com/MyEtherWallet/MyEtherWallet/pull/4055)
* Fix buy page daily limit tooltip [#4058](https://github.com/MyEtherWallet/MyEtherWallet/pull/4058)
* Fix error message for invalid mnemonic [#4059](https://github.com/MyEtherWallet/MyEtherWallet/pull/4059)
* Fix fiat values for sell popup on landing page [#4063](https://github.com/MyEtherWallet/MyEtherWallet/pull/4063)
* Fix swap loading forever when token value changed during rates check [#4064](https://github.com/MyEtherWallet/MyEtherWallet/pull/4064)
* Fix MetaMask login error message [#4068](https://github.com/MyEtherWallet/MyEtherWallet/pull/4068)
* Fix Ledger access wallet back button [#4070](https://github.com/MyEtherWallet/MyEtherWallet/pull/4070)
* fix mew-tooltip content word wrap issue [#4081](https://github.com/MyEtherWallet/MyEtherWallet/pull/4081)
* fix view on etherscan network text [#4082](https://github.com/MyEtherWallet/MyEtherWallet/pull/4082)
* Hide network fee if out of wallet [#4085](https://github.com/MyEtherWallet/MyEtherWallet/pull/4085)
* fix buy more link [#4097](https://github.com/MyEtherWallet/MyEtherWallet/pull/4097)
* Fix Create Wallet page software text capitalization [#4098](https://github.com/MyEtherWallet/MyEtherWallet/pull/4098)
* fix team page background color [#4103](https://github.com/MyEtherWallet/MyEtherWallet/pull/4103)
* remove periods from dapps menu [#4109](https://github.com/MyEtherWallet/MyEtherWallet/pull/4109)
* remove bottom close button\* fix layout of top right close button
  [#4110](https://github.com/MyEtherWallet/MyEtherWallet/pull/4110)
* added check for network switch out of wallet [#4116](https://github.com/MyEtherWallet/MyEtherWallet/pull/4116)
* fixed network switch bug not switching correctly [#4119](https://github.com/MyEtherWallet/MyEtherWallet/pull/4119)
* fix wallet side menu error \[method "isOpenNetworkOverlay" is not defined] [#4121](https://github.com/MyEtherWallet/MyEtherWallet/pull/4121)

### Release v6.6.3-hotfix.3

### devop

* swap token prices not showing [#4096](https://github.com/MyEtherWallet/MyEtherWallet/pull/4096)

### fix

* added checks for missing properties [#4091](https://github.com/MyEtherWallet/MyEtherWallet/pull/4091)

### Release v6.6.3-hotfix.2

### fix

* show matching tokens in Send and Dashboard [#4034](https://github.com/MyEtherWallet/MyEtherWallet/pull/4034)
* fix popups, usdt out of gas [#4086](https://github.com/MyEtherWallet/MyEtherWallet/pull/4086)

### Release v6.6.3-hotfix.1

### devop

* add opera link [#4077](https://github.com/MyEtherWallet/MyEtherWallet/pull/4077)

### fix

* fix banner link, redo intercom [#4072](https://github.com/MyEtherWallet/MyEtherWallet/pull/4072)

### Release v6.6.3

### devop

* update desktop header [#4005](https://github.com/MyEtherWallet/MyEtherWallet/pull/4005)
* add enkrpt ad strip on landing page [#4015](https://github.com/MyEtherWallet/MyEtherWallet/pull/4015)
* Added wallet enkrypt ad popup [#4016](https://github.com/MyEtherWallet/MyEtherWallet/pull/4016)
* update wallet slider content [#4025](https://github.com/MyEtherWallet/MyEtherWallet/pull/4025)
* enkrypt marketing [#4038](https://github.com/MyEtherWallet/MyEtherWallet/pull/4038)

### feat

* feature ens reverse lookup [#3884](https://github.com/MyEtherWallet/MyEtherWallet/pull/3884)
* feat enkrypt homepage popup [#4009](https://github.com/MyEtherWallet/MyEtherWallet/pull/4009)
* feature add enkrypt home buttons [#4013](https://github.com/MyEtherWallet/MyEtherWallet/pull/4013)
* feature enkrypt in wallet snackbar [#4020](https://github.com/MyEtherWallet/MyEtherWallet/pull/4020)
* feature access wallet button merge [#4021](https://github.com/MyEtherWallet/MyEtherWallet/pull/4021)

### fix

* fix ledger transport status sentry error [#3808](https://github.com/MyEtherWallet/MyEtherWallet/pull/3808)
* fix create wallet with keystore file step 3 image loading issue [#3980](https://github.com/MyEtherWallet/MyEtherWallet/pull/3980)
* fix update team page [#3986](https://github.com/MyEtherWallet/MyEtherWallet/pull/3986)
* Disable swap on CoolWalletS [#3991](https://github.com/MyEtherWallet/MyEtherWallet/pull/3991)
* contact address list invalid prop error [#4008](https://github.com/MyEtherWallet/MyEtherWallet/pull/4008)
* fix total amount on send page [#4010](https://github.com/MyEtherWallet/MyEtherWallet/pull/4010)
* Add check for tx data in eth blocks tracker [#4014](https://github.com/MyEtherWallet/MyEtherWallet/pull/4014)
* Handles transfer out error on USB device for Ledger wallet [#4017](https://github.com/MyEtherWallet/MyEtherWallet/pull/4017)
* Fix buy/sell network error [#4023](https://github.com/MyEtherWallet/MyEtherWallet/pull/4023)
* fix error message when creating another mnemonic wallet [#4024](https://github.com/MyEtherWallet/MyEtherWallet/pull/4024)
* Fix Buy/Sell missing tokens on homepage [#4033](https://github.com/MyEtherWallet/MyEtherWallet/pull/4033)
* fix your undefined refund address [#4035](https://github.com/MyEtherWallet/MyEtherWallet/pull/4035)
* fix swap cannot read undefined 0 [#4039](https://github.com/MyEtherWallet/MyEtherWallet/pull/4039)
* corrected address limit check [#4043](https://github.com/MyEtherWallet/MyEtherWallet/pull/4043)
* Fix mnemonic phrase not loading when Non-Ethereum address saved in address book [#4045](https://github.com/MyEtherWallet/MyEtherWallet/pull/4045)
* fix swap tokens loading issue [#4056](https://github.com/MyEtherWallet/MyEtherWallet/pull/4056)
* fix extra word verification [#4069](https://github.com/MyEtherWallet/MyEtherWallet/pull/4069)
* fix token loading on switching network [#4071](https://github.com/MyEtherWallet/MyEtherWallet/pull/4071)

### Release v6.6.2

### devop

* changed bsc to bnb in swap [#3963](https://github.com/MyEtherWallet/MyEtherWallet/pull/3963)
* add all text to translation files [#3968](https://github.com/MyEtherWallet/MyEtherWallet/pull/3968)
* fixed failing e2e tests [#3993](https://github.com/MyEtherWallet/MyEtherWallet/pull/3993)
* added check for address match [#3998](https://github.com/MyEtherWallet/MyEtherWallet/pull/3998)
* devop update partner page [#4000](https://github.com/MyEtherWallet/MyEtherWallet/pull/4000)
* Added tests for all tools [#4006](https://github.com/MyEtherWallet/MyEtherWallet/pull/4006)

### feat

* feature access wallet button merge [#3933](https://github.com/MyEtherWallet/MyEtherWallet/pull/3933)

### fix

* fix 'add data' field clear [#3900](https://github.com/MyEtherWallet/MyEtherWallet/pull/3900)
* fix tools items title [#3911](https://github.com/MyEtherWallet/MyEtherWallet/pull/3911)
* fix keystore password 8 char minimum [#3956](https://github.com/MyEtherWallet/MyEtherWallet/pull/3956)
* fix offline transaction to address and signature [#3960](https://github.com/MyEtherWallet/MyEtherWallet/pull/3960)
* catch gas required exceeds allowance, it's not your token errors [#3961](https://github.com/MyEtherWallet/MyEtherWallet/pull/3961)
* fix invalid address error [#3962](https://github.com/MyEtherWallet/MyEtherWallet/pull/3962)
* Cannot read properties of undefined (reading 'isActive') [#3966](https://github.com/MyEtherWallet/MyEtherWallet/pull/3966)
* network error on home page features section [#3969](https://github.com/MyEtherWallet/MyEtherWallet/pull/3969)
* selected currency empty when buying [#3970](https://github.com/MyEtherWallet/MyEtherWallet/pull/3970)
* fix metamask logout issue [#3973](https://github.com/MyEtherWallet/MyEtherWallet/pull/3973)
* footer donation translations [#3974](https://github.com/MyEtherWallet/MyEtherWallet/pull/3974)
* addressbook nickname disables confirm button [#3977](https://github.com/MyEtherWallet/MyEtherWallet/pull/3977)
* fix address book validation [#3979](https://github.com/MyEtherWallet/MyEtherWallet/pull/3979)
* fix max button shown on tokens with 0 balance on swap [#3982](https://github.com/MyEtherWallet/MyEtherWallet/pull/3982)
* fix add buy cool wallet [#3983](https://github.com/MyEtherWallet/MyEtherWallet/pull/3983)
* Rate limit exceeded error '429' [#3984](https://github.com/MyEtherWallet/MyEtherWallet/pull/3984)
* create wallet with mnemonic phrase > reset extra word when user clicks create another wallet button [#4001](https://github.com/MyEtherWallet/MyEtherWallet/pull/4001)
* fix offline routing, fix address loading [#4002](https://github.com/MyEtherWallet/MyEtherWallet/pull/4002)

### Release v6.6.1

### ui

* Replace search bar on derivation path [#3930](https://github.com/MyEtherWallet/MyEtherWallet/pull/3930)
* updated select contract text [#3965](https://github.com/MyEtherWallet/MyEtherWallet/pull/3965)

### fix

* fix gas estimate max bug [#3905](https://github.com/MyEtherWallet/MyEtherWallet/pull/3905)
* Show transaction fee in Eth blocks dapp pop up [#3906](https://github.com/MyEtherWallet/MyEtherWallet/pull/3906)
* fix mobile social icons\* fix mobile expending block styles
* fix mobile BTC donation text
  [#3909](https://github.com/MyEtherWallet/MyEtherWallet/pull/3909)
* fix export configurations btn size [#3910](https://github.com/MyEtherWallet/MyEtherWallet/pull/3910)
* update unexpected token value message [#3912](https://github.com/MyEtherWallet/MyEtherWallet/pull/3912)
* sentry fix failed to fetch pool api [#3917](https://github.com/MyEtherWallet/MyEtherWallet/pull/3917)
* eth blocks close button [#3924](https://github.com/MyEtherWallet/MyEtherWallet/pull/3924)
* fix eth block batch minting btn layout [#3929](https://github.com/MyEtherWallet/MyEtherWallet/pull/3929)
* fix mobile wallet footer overlap issue [#3931](https://github.com/MyEtherWallet/MyEtherWallet/pull/3931)
* fix ios input field zooming issue [#3932](https://github.com/MyEtherWallet/MyEtherWallet/pull/3932)
* sentry undefined reading value [#3935](https://github.com/MyEtherWallet/MyEtherWallet/pull/3935)
* Address book ENS missing provider [#3936](https://github.com/MyEtherWallet/MyEtherWallet/pull/3936)
* fix pass numbers as strings or BN objects error [#3941](https://github.com/MyEtherWallet/MyEtherWallet/pull/3941)
* unmerged changes in package-lock [#3942](https://github.com/MyEtherWallet/MyEtherWallet/pull/3942)
* Fix certain token icons not loading in swap [#3945](https://github.com/MyEtherWallet/MyEtherWallet/pull/3945)
* fix "Cannot read properties of undefined (reading 'message')" [#3946](https://github.com/MyEtherWallet/MyEtherWallet/pull/3946)
* sentry type error msg [#3947](https://github.com/MyEtherWallet/MyEtherWallet/pull/3947)
* sentry status code 404 error [#3948](https://github.com/MyEtherWallet/MyEtherWallet/pull/3948)
* sentry gatt operation unknown reasons [#3949](https://github.com/MyEtherWallet/MyEtherWallet/pull/3949)
* Fix Terms of Service page [#3950](https://github.com/MyEtherWallet/MyEtherWallet/pull/3950)
* Fix low gas for eth blocks, checks for quotes, and handles refresh data error [#3953](https://github.com/MyEtherWallet/MyEtherWallet/pull/3953)
* add permission denied error to handler [#3954](https://github.com/MyEtherWallet/MyEtherWallet/pull/3954)
* sentry gatt server disconnected error [#3958](https://github.com/MyEtherWallet/MyEtherWallet/pull/3958)
* sentry device disconnected [#3959](https://github.com/MyEtherWallet/MyEtherWallet/pull/3959)

### sentry

* added checks for undefined [#3957](https://github.com/MyEtherWallet/MyEtherWallet/pull/3957)

### Release v6.6.0

### devop

* Buy / Sell Moonpay and Simplex [#3844](https://github.com/MyEtherWallet/MyEtherWallet/pull/3844)
* added catch for edge case for v-select [#3888](https://github.com/MyEtherWallet/MyEtherWallet/pull/3888)
* update packages [#3903](https://github.com/MyEtherWallet/MyEtherWallet/pull/3903)
* add moonbeam and moonriver [#3927](https://github.com/MyEtherWallet/MyEtherWallet/pull/3927)

### fix

* fixed polygon gas underpaying [#3926](https://github.com/MyEtherWallet/MyEtherWallet/pull/3926)
* fix ledger transport status sentry error [#3808](https://github.com/MyEtherWallet/MyEtherWallet/pull/3808)
* Added check for swap call [#3846](https://github.com/MyEtherWallet/MyEtherWallet/pull/3846)
* fix eth blocks remove tab arrows [#3860](https://github.com/MyEtherWallet/MyEtherWallet/pull/3860)
* fix verify swap windows to show native swap fee currency for MATIC [#3866](https://github.com/MyEtherWallet/MyEtherWallet/pull/3866)
* fix confirmation window layout and paddings [#3868](https://github.com/MyEtherWallet/MyEtherWallet/pull/3868)
* fix sentry errorhandler reading null [#3873](https://github.com/MyEtherWallet/MyEtherWallet/pull/3873)
* fix mew tools menu button, fix mobile landingpage menu [#3880](https://github.com/MyEtherWallet/MyEtherWallet/pull/3880)
* NumberFormat currencyDisplay 'narrowSymbol' [#3885](https://github.com/MyEtherWallet/MyEtherWallet/pull/3885)
* fix sentry undefined to token amount [#3896](https://github.com/MyEtherWallet/MyEtherWallet/pull/3896)
* Correctly display addresses in To Address dropdown [#3899](https://github.com/MyEtherWallet/MyEtherWallet/pull/3899)
* add data defaults to '0x' when cleared [#3900](https://github.com/MyEtherWallet/MyEtherWallet/pull/3900)
* addresses safe number check, trezor popup window error, unknown ledger device error, bluetooth error, and number converter issue for safari [#3907](https://github.com/MyEtherWallet/MyEtherWallet/pull/3907)
* fix paperwallet not opening bug on mobile wallet [#3908](https://github.com/MyEtherWallet/MyEtherWallet/pull/3908)
* Added catch for contract balanceOf call [#3913](https://github.com/MyEtherWallet/MyEtherWallet/pull/3913)
* fix sentry handler nft error [#3916](https://github.com/MyEtherWallet/MyEtherWallet/pull/3916)
* json response has no error or result [#3918](https://github.com/MyEtherWallet/MyEtherWallet/pull/3918)
* Handle AbortError: The user aborted a request [#3921](https://github.com/MyEtherWallet/MyEtherWallet/pull/3921)
* fix ENS select duration text [#3922](https://github.com/MyEtherWallet/MyEtherWallet/pull/3922)
* QR Code and the sign message copy toast consistent [#3925](https://github.com/MyEtherWallet/MyEtherWallet/pull/3925)
* Fix access wallet popup error on mobile [#3943](https://github.com/MyEtherWallet/MyEtherWallet/pull/3943)

### sentry

* fixed bn issue [#3878](https://github.com/MyEtherWallet/MyEtherWallet/pull/3878)

### Release v6.5.6

### ui

* updated trezor logo [#3853](https://github.com/MyEtherWallet/MyEtherWallet/pull/3853)

### devop

* handle eth.subscribe error [#3783](https://github.com/MyEtherWallet/MyEtherWallet/pull/3783)
* fix github release generator [#3870](https://github.com/MyEtherWallet/MyEtherWallet/pull/3870)
* update packages [#3871](https://github.com/MyEtherWallet/MyEtherWallet/pull/3871)
* update sidemenu background color [#3874](https://github.com/MyEtherWallet/MyEtherWallet/pull/3874)
* added check to wei conversion [#3889](https://github.com/MyEtherWallet/MyEtherWallet/pull/3889)

### fix

* fix ledger transport status sentry error [#3808](https://github.com/MyEtherWallet/MyEtherWallet/pull/3808)
* fixed auto-closing dropdowns [#3856](https://github.com/MyEtherWallet/MyEtherWallet/pull/3856)
* Failed to fetch when updating articles list [#3865](https://github.com/MyEtherWallet/MyEtherWallet/pull/3865)
* Internal JSON-RPC sentry error [#3869](https://github.com/MyEtherWallet/MyEtherWallet/pull/3869)
* Cannot read properties of null (reading 'getAddressString') [#3875](https://github.com/MyEtherWallet/MyEtherWallet/pull/3875)
* Sentry The operation could not be completed. Invalid argument. [#3877](https://github.com/MyEtherWallet/MyEtherWallet/pull/3877)
* remove global styles [#3883](https://github.com/MyEtherWallet/MyEtherWallet/pull/3883)

### Release v6.5.5

### devop

* Added currency localization helpers, currency setting, and modified currency display [#3686](https://github.com/MyEtherWallet/MyEtherWallet/pull/3686)
* replace nft api [#3843](https://github.com/MyEtherWallet/MyEtherWallet/pull/3843)

### chore

* remove v5 link [#3851](https://github.com/MyEtherWallet/MyEtherWallet/pull/3851)

### fix

* fix error handler null [#3827](https://github.com/MyEtherWallet/MyEtherWallet/pull/3827)
* fix sentry expected private key 32 length [#3829](https://github.com/MyEtherWallet/MyEtherWallet/pull/3829)
* replace png ethereum icon with svg icon on dashboard tokens table [#3831](https://github.com/MyEtherWallet/MyEtherWallet/pull/3831)
* fixed brave not using coinbase issue [#3833](https://github.com/MyEtherWallet/MyEtherWallet/pull/3833)
* fix sentry returned values not valid on stakewise [#3834](https://github.com/MyEtherWallet/MyEtherWallet/pull/3834)
* fix wallet card fade-in animation glitch on load [#3836](https://github.com/MyEtherWallet/MyEtherWallet/pull/3836)
* fix offline helper copy button [#3840](https://github.com/MyEtherWallet/MyEtherWallet/pull/3840)
* fixed underpriced transactions [#3849](https://github.com/MyEtherWallet/MyEtherWallet/pull/3849)
* fix side menu [#3850](https://github.com/MyEtherWallet/MyEtherWallet/pull/3850)
* fix create wallet keystore file button border [#3855](https://github.com/MyEtherWallet/MyEtherWallet/pull/3855)

### Release v6.5.4-hotfix.1

### fix

* fix offline generation on builds [#3838](https://github.com/MyEtherWallet/MyEtherWallet/pull/3838)

### Release v6.5.4

### devop

* ethblocks update [#3604](https://github.com/MyEtherWallet/MyEtherWallet/pull/3604)
* added offline helper [#3612](https://github.com/MyEtherWallet/MyEtherWallet/pull/3612)
* added informative popup for bluetooth requirement [#3776](https://github.com/MyEtherWallet/MyEtherWallet/pull/3776)
* add new nodes [#3798](https://github.com/MyEtherWallet/MyEtherWallet/pull/3798)
* add new nodes [#3801](https://github.com/MyEtherWallet/MyEtherWallet/pull/3801)
* add unit.js [#3822](https://github.com/MyEtherWallet/MyEtherWallet/pull/3822)

### feat

* feature integrate ledger nano x [#3797](https://github.com/MyEtherWallet/MyEtherWallet/pull/3797)
* offline app [#3484](https://github.com/MyEtherWallet/MyEtherWallet/pull/3484)
* dynamic data for article links [#3777](https://github.com/MyEtherWallet/MyEtherWallet/pull/3777)
* automated the year displayed and dashboard version number links to github release [#3789](https://github.com/MyEtherWallet/MyEtherWallet/pull/3789)
* disabled ENS transfer button if there is not enough balance [#3802](https://github.com/MyEtherWallet/MyEtherWallet/pull/3802)
* created estimateGasList function [#3807](https://github.com/MyEtherWallet/MyEtherWallet/pull/3807)

### fix

* replace ens management header to new dapp header [#3661](https://github.com/MyEtherWallet/MyEtherWallet/pull/3661)
* fix moon pay popup ui [#3748](https://github.com/MyEtherWallet/MyEtherWallet/pull/3748)
* fix hardware wallet custom path [#3770](https://github.com/MyEtherWallet/MyEtherWallet/pull/3770)
* fix erc owner balance token not an object [#3786](https://github.com/MyEtherWallet/MyEtherWallet/pull/3786)
* fix failed to fetch pool api [#3787](https://github.com/MyEtherWallet/MyEtherWallet/pull/3787)
* fix missing currency issue [#3804](https://github.com/MyEtherWallet/MyEtherWallet/pull/3804)
* Merge response data when fetching in Moonpay sell [#3809](https://github.com/MyEtherWallet/MyEtherWallet/pull/3809)
* Check for uploaded file type in the Keystore Generator tool [#3812](https://github.com/MyEtherWallet/MyEtherWallet/pull/3812)
* fix invalid remainder, txn underpriced, txn and exec reverted sentry errors [#3814](https://github.com/MyEtherWallet/MyEtherWallet/pull/3814)
* fix sentry type error json rpc request [#3816](https://github.com/MyEtherWallet/MyEtherWallet/pull/3816)
* Check public key buffer length [#3817](https://github.com/MyEtherWallet/MyEtherWallet/pull/3817)
* Selecting other currency in Sell shouldn't crash browser anymore [#3823](https://github.com/MyEtherWallet/MyEtherWallet/pull/3823)
* Error message in Send Module will sometimes be null [#3824](https://github.com/MyEtherWallet/MyEtherWallet/pull/3824)
* Clears the sell input form when changing currency in Sell [#3825](https://github.com/MyEtherWallet/MyEtherWallet/pull/3825)
* fix ens dapp balance check [#3710](https://github.com/MyEtherWallet/MyEtherWallet/pull/3710) [#3710](https://github.com/MyEtherWallet/MyEtherWallet/pull/3710)
* fix Cannot read properties of undefined [#3713](https://github.com/MyEtherWallet/MyEtherWallet/pull/3713)
* fix BSC undefined swap issue [#3828](https://github.com/MyEtherWallet/MyEtherWallet/pull/3828)

### Release v6.5.3

### devop

* update new moonpay ui [#3764](https://github.com/MyEtherWallet/MyEtherWallet/pull/3764)
* sync develop [#3795](https://github.com/MyEtherWallet/MyEtherWallet/pull/3795)

### Release v6.5.2-hotfix.2

### fix

* fix polygon websocket issue [#3790](https://github.com/MyEtherWallet/MyEtherWallet/pull/3790)

### Release v6.5.2-hotfix.1

### fix

* websocket fix [#3778](https://github.com/MyEtherWallet/MyEtherWallet/pull/3778)
* cleanup for stakewise [#3782](https://github.com/MyEtherWallet/MyEtherWallet/pull/3782)

### Release v6.5.2

### devop

* display error through wallet error handler [#3725](https://github.com/MyEtherWallet/MyEtherWallet/pull/3725)
* Added error messages for mewapi requests [#3740](https://github.com/MyEtherWallet/MyEtherWallet/pull/3740)
* add supported coins to address book [#3749](https://github.com/MyEtherWallet/MyEtherWallet/pull/3749)
* sync develop with main [#3762](https://github.com/MyEtherWallet/MyEtherWallet/pull/3762)
* fixed stepper issue not clearing wallet type [#3773](https://github.com/MyEtherWallet/MyEtherWallet/pull/3773)
* added gatt error to waller error handler [#3774](https://github.com/MyEtherWallet/MyEtherWallet/pull/3774)

### chore

* fix no error when not enough funds to send NFT [#3727](https://github.com/MyEtherWallet/MyEtherWallet/pull/3727)

### feature

* new dapp feature: stakewise [#3721](https://github.com/MyEtherWallet/MyEtherWallet/pull/3721)
* add eth2 keystore generator to tools [#3758](https://github.com/MyEtherWallet/MyEtherWallet/pull/3758)
* added block explorer links to address list [#3769](https://github.com/MyEtherWallet/MyEtherWallet/pull/3769)
* feature add intercom set [#3729](https://github.com/MyEtherWallet/MyEtherWallet/pull/3729)

### fix

* fix no error when not enough funds to send NFT [#3727](https://github.com/MyEtherWallet/MyEtherWallet/pull/3727) [#3727](https://github.com/MyEtherWallet/MyEtherWallet/pull/3727)
* fix sentry invalid attempt to iterate [#3738](https://github.com/MyEtherWallet/MyEtherWallet/pull/3738); [#3738](https://github.com/MyEtherWallet/MyEtherWallet/pull/3738)
* fix sentry undefined contract [#3750](https://github.com/MyEtherWallet/MyEtherWallet/pull/3750)
* check for response data in swap rates [#3751](https://github.com/MyEtherWallet/MyEtherWallet/pull/3751)
* make sure base path is string format when accessing keepkey and ledger [#3752](https://github.com/MyEtherWallet/MyEtherWallet/pull/3752)
* fix metamask no balance error after switching accounts [#3766](https://github.com/MyEtherWallet/MyEtherWallet/pull/3766)
* fix undefined properties of "methods" [#3772](https://github.com/MyEtherWallet/MyEtherWallet/pull/3772)
* added catch for connection error [#3775](https://github.com/MyEtherWallet/MyEtherWallet/pull/3775)

### sentry

* replace currencyDisplay: 'narrowSymbol' to currencyDisplay: 'symbol' [#3761](https://github.com/MyEtherWallet/MyEtherWallet/pull/3761)
* added 'MetaMask Message Signature: User denied message signature' to error list [#3767](https://github.com/MyEtherWallet/MyEtherWallet/pull/3767)

### Release v6.5.1-hotfix.1

### fix

* symbol search from tokens, price for to tokens, counter for moonpay [#3756](https://github.com/MyEtherWallet/MyEtherWallet/pull/3756)

### Release v6.5.1

### devop

* Added check for contract name [#3723](https://github.com/MyEtherWallet/MyEtherWallet/pull/3723)
* Added bn helper to handler send [#3726](https://github.com/MyEtherWallet/MyEtherWallet/pull/3726)
* added check to actualprivatekey for string [#3733](https://github.com/MyEtherWallet/MyEtherWallet/pull/3733)
* release holder [#3744](https://github.com/MyEtherWallet/MyEtherWallet/pull/3744)\\

### chore

* chore sentry unknown path [#3734](https://github.com/MyEtherWallet/MyEtherWallet/pull/3734)

### feat

* add non eth to eth swap [#3524](https://github.com/MyEtherWallet/MyEtherWallet/pull/3524)
* add moon pay interface [#3640](https://github.com/MyEtherWallet/MyEtherWallet/pull/3640)
* add claimable tokens popup [#3716](https://github.com/MyEtherWallet/MyEtherWallet/pull/3716)

### fix

* getting stuck at pending on failed transaction adds estimated fees tooltip
* menu highlight on direct navigation to my-blocks [#3558](https://github.com/MyEtherWallet/MyEtherWallet/pull/3558)
* check for undefined contract address [#3708](https://github.com/MyEtherWallet/MyEtherWallet/pull/3708)
* prevents error pop up if first phrase is skipped in mnemonic phrase login [#3711](https://github.com/MyEtherWallet/MyEtherWallet/pull/3711)
* fix Cannot read properties of undefined [#3713](https://github.com/MyEtherWallet/MyEtherWallet/pull/3713)
* catch error objects for web3 and in general [#3714](https://github.com/MyEtherWallet/MyEtherWallet/pull/3714)
* catch not allowed error from bitbox02 [#3715](https://github.com/MyEtherWallet/MyEtherWallet/pull/3715)
* disable next(access wallet) button if there is no password [#3718](https://github.com/MyEtherWallet/MyEtherWallet/pull/3718)
* update team page [#3722](https://github.com/MyEtherWallet/MyEtherWallet/pull/3722)
* fix sentry type error undefined "name" [#3730](https://github.com/MyEtherWallet/MyEtherWallet/pull/3730)
* fix swap [#3747](https://github.com/MyEtherWallet/MyEtherWallet/pull/3747)

### Release v6.5.0-hotfix.1

### revert

* check basGasFeePerGas allowing non 1559 nodes to be true [#3753](https://github.com/MyEtherWallet/MyEtherWallet/pull/3753)

### Release v6.5.0

### feat

* add moon pay interface [#3640](https://github.com/MyEtherWallet/MyEtherWallet/pull/3640)

### fix

* fix max on moonpay [#3739](https://github.com/MyEtherWallet/MyEtherWallet/pull/3739)

### Release v6.4.8-hotfix.1

### fix

* remove changelly rates for now, make eth -> btc more consistet [#3732](https://github.com/MyEtherWallet/MyEtherWallet/pull/3732)

### Release v6.4.8

### devop

* Added toBNSafe that safely converts numbers to BN [#3696](https://github.com/MyEtherWallet/MyEtherWallet/pull/3696)
* update packages from dependabot [#3700](https://github.com/MyEtherWallet/MyEtherWallet/pull/3700)
* add missing members [#3701](https://github.com/MyEtherWallet/MyEtherWallet/pull/3701)
* fix meta icons, catch swap empty ones [#3717](https://github.com/MyEtherWallet/MyEtherWallet/pull/3717)

### feat

* page not found 404 [#3684](https://github.com/MyEtherWallet/MyEtherWallet/pull/3684)

### fix

* replace all old colors with new colors [#3559](https://github.com/MyEtherWallet/MyEtherWallet/pull/3559)
* fix wallet balance loading animation [#3624](https://github.com/MyEtherWallet/MyEtherWallet/pull/3624)
* fixes: 2929544912, 2780117575, 2688459025, 2735474055, 3042395444, 2505098087, 2504519254 [#3695](https://github.com/MyEtherWallet/MyEtherWallet/pull/3695)
* fetch tokens when network is changed [#3697](https://github.com/MyEtherWallet/MyEtherWallet/pull/3697)
* remove more button when the user has no tokens [#3702](https://github.com/MyEtherWallet/MyEtherWallet/pull/3702)
* fix icons and link in module confirmation, hide notification dropdown if theres no notifications [#3705](https://github.com/MyEtherWallet/MyEtherWallet/pull/3705)
* correctly catch changelly errors [#3706](https://github.com/MyEtherWallet/MyEtherWallet/pull/3706)

### Release v6.4.7

### devop

* add claim ens ui as starting point [#3598](https://github.com/MyEtherWallet/MyEtherWallet/pull/3598)
* add ens claims [#3620](https://github.com/MyEtherWallet/MyEtherWallet/pull/3620)
* update team name [#3672](https://github.com/MyEtherWallet/MyEtherWallet/pull/3672)
* add matomo global error tracking [#3674](https://github.com/MyEtherWallet/MyEtherWallet/pull/3674)
* change prop names for mew components [#3677](https://github.com/MyEtherWallet/MyEtherWallet/pull/3677)
* allow more fields to show on career page [#3688](https://github.com/MyEtherWallet/MyEtherWallet/pull/3688)
* fix order for providers [#3689](https://github.com/MyEtherWallet/MyEtherWallet/pull/3689)
* revert swap changes [#3698](https://github.com/MyEtherWallet/MyEtherWallet/pull/3698)

### fix

* Fix issue with tokens with 0 decimals [#3691](https://github.com/MyEtherWallet/MyEtherWallet/pull/3691)

### Release v6.4.6

### chore

* exclude packages [#3679](https://github.com/MyEtherWallet/MyEtherWallet/pull/3679)

### ui

* Handle text overflow for tokens [#3658](https://github.com/MyEtherWallet/MyEtherWallet/pull/3658)

### devop

* added gas switch tracker [#3659](https://github.com/MyEtherWallet/MyEtherWallet/pull/3659)

### fix

* add state version to address book [#3666](https://github.com/MyEtherWallet/MyEtherWallet/pull/3666)
* fix metamask account change detection on ens and staking so forms and tabs reset when accounts change [#3644](https://github.com/MyEtherWallet/MyEtherWallet/pull/3644)
* hide intercom on bottom of the screen [#3650](https://github.com/MyEtherWallet/MyEtherWallet/pull/3650)
* name resolution fix [#3662](https://github.com/MyEtherWallet/MyEtherWallet/pull/3662)
* handle trezor error popup [#3663](https://github.com/MyEtherWallet/MyEtherWallet/pull/3663)
* fix bsc popup [#3670](https://github.com/MyEtherWallet/MyEtherWallet/pull/3670)

### sentry

* added bignumber and type checks [#3649](https://github.com/MyEtherWallet/MyEtherWallet/pull/3649)
* Added check and default value [#3654](https://github.com/MyEtherWallet/MyEtherWallet/pull/3654)

### Release v6.4.5-hotfix.1

* update dapp integration [#3675](https://github.com/MyEtherWallet/MyEtherWallet/pull/3675)

### Release v6.4.5

### devop

* updated packages [#3629](https://github.com/MyEtherWallet/MyEtherWallet/pull/3629)
* Added check for elements [#3632](https://github.com/MyEtherWallet/MyEtherWallet/pull/3632)
* remove survey [#3642](https://github.com/MyEtherWallet/MyEtherWallet/pull/3642)

### chore

* remove require lodash [#3623](https://github.com/MyEtherWallet/MyEtherWallet/pull/3623)
* fix imports [#3625](https://github.com/MyEtherWallet/MyEtherWallet/pull/3625)
* added comment for tokens [#3628](https://github.com/MyEtherWallet/MyEtherWallet/pull/3628)
* update packages [#3652](https://github.com/MyEtherWallet/MyEtherWallet/pull/3652)

### feat

* add mobile app store redirecting page [#3645](https://github.com/MyEtherWallet/MyEtherWallet/pull/3645)
* allow test transactions [#3617](https://github.com/MyEtherWallet/MyEtherWallet/pull/3617)

### fix

* fix value setting for test mode [#3647](https://github.com/MyEtherWallet/MyEtherWallet/pull/3647)
* fix ledger issue where users can't switch paths [#3626](https://github.com/MyEtherWallet/MyEtherWallet/pull/3626)
* fix minFrom undefined issue when minmax is undefined [#3630](https://github.com/MyEtherWallet/MyEtherWallet/pull/3630)
* fix TypeError: e is null Given value: null on SettingsGasPrice calcTxFee methods [#3637](https://github.com/MyEtherWallet/MyEtherWallet/pull/3637)

### Release v6.4.4

### devop

* disable copy on module address if invalid, update swap button [#3590](https://github.com/MyEtherWallet/MyEtherWallet/pull/3590)
* pull in main to develop [#3603](https://github.com/MyEtherWallet/MyEtherWallet/pull/3603)
* add error for when value is 0 and data is null [#3611](https://github.com/MyEtherWallet/MyEtherWallet/pull/3611)
* update packages and bump version [#3619](https://github.com/MyEtherWallet/MyEtherWallet/pull/3619)

### fix

* fix bitbox02 transaction signing [#3608](https://github.com/MyEtherWallet/MyEtherWallet/pull/3608)
* fix swap rates fetch [#3613](https://github.com/MyEtherWallet/MyEtherWallet/pull/3613)
* fix trade button when on swap [#3615](https://github.com/MyEtherWallet/MyEtherWallet/pull/3615)
* Added Filter to Token List [#3616](https://github.com/MyEtherWallet/MyEtherWallet/pull/3616)
* fix weird loading fee when toToken is ETH [#3622](https://github.com/MyEtherWallet/MyEtherWallet/pull/3622)

### Release v6.4.3-hotfix.1

### fix

* fix dapps tranlsations, add link out to release [#3601](https://github.com/MyEtherWallet/MyEtherWallet/pull/3601)

### feat

* add in log message on app start [#3572](https://github.com/MyEtherWallet/MyEtherWallet/pull/3572)
* add job postings page [#3577](https://github.com/MyEtherWallet/MyEtherWallet/pull/3577)

### Release v6.4.3

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
