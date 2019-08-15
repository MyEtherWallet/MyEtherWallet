### Release v5.1.1-hotfix.1

### Bug
- Fix issues related to address switching [#1355](https://github.com/MyEtherWallet/MyEtherWallet/pull/1355)
- Fix missing buttons in maker dapp, and some general housekeeping [#1352](https://github.com/MyEtherWallet/MyEtherWallet/pull/1352)

### Devop

- Fix Buy Eth to Buy ETH [#1361] (https://github.com/MyEtherWallet/MyEtherWallet/pull/1361)
- Remove Safesend Dapp [#1346](https://github.com/MyEtherWallet/MyEtherWallet/pull/1346)
- Add hover effect to Dashboard -> Swap buttons [#1353](https://github.com/MyEtherWallet/MyEtherWallet/pull/1353)
- Add Changelly to Dashboard -> Swap description [#1356](https://github.com/MyEtherWallet/MyEtherWallet/pull/1356)

### Release v5.1.1


### Feature

- Add Buy Eth Button to nav bar, standardize dapp header layout [#1330](https://github.com/MyEtherWallet/MyEtherWallet/pull/1330)

### Devop

- Update packages [#1344](https://github.com/MyEtherWallet/MyEtherWallet/pull/1344)
- Update UI frontpage FAQs block [#1332](https://github.com/MyEtherWallet/MyEtherWallet/pull/1332)
- Add xss custom config [#1326](https://github.com/MyEtherWallet/MyEtherWallet/pull/1326)

### Bug

- Fix scroll up button position [#1331](https://github.com/MyEtherWallet/MyEtherWallet/pull/1331)
- Fix text translations [#1329](https://github.com/MyEtherWallet/MyEtherWallet/pull/1329)
- Fix Mobile UI Scan to Download mobile [#1333](https://github.com/MyEtherWallet/MyEtherWallet/pull/1333)
- By Mnemonic Phrase layout bug fix [#1347](https://github.com/MyEtherWallet/MyEtherWallet/pull/1347)

### Release v5.1.0

### Feature

- Add Dashboard and NFT Manager [#1269](https://github.com/MyEtherWallet/MyEtherWallet/pull/1269)

### Release v5.0.16-hotfix.1

### Devop

- Fix toast xss issue [#1306](https://github.com/MyEtherWallet/MyEtherWallet/pull/1306)
- Set gasPrice of TXs to Global value [#1305](https://github.com/MyEtherWallet/MyEtherWallet/pull/1305)
- Update team info and pictures [#1304](https://github.com/MyEtherWallet/MyEtherWallet/pull/1304)

### Release v5.0.16

### Feature

- Lightstreams network support [#1257](https://github.com/MyEtherWallet/MyEtherWallet/pull/1257)

### Devop

- Add new team members into the team page [#1302](https://github.com/MyEtherWallet/MyEtherWallet/pull/1302)
- Add proxy notice to moveCDP modal, improve swap widget [#1251](https://github.com/MyEtherWallet/MyEtherWallet/pull/1251)

### Bug

- Fix #1249 and #1205 [#1250](https://github.com/MyEtherWallet/MyEtherWallet/pull/1250)
- Display "Advanced" section on "Send Transaction" page if data or gas limit fields are prefilled by url query params [#1260](https://github.com/MyEtherWallet/MyEtherWallet/pull/1260)
- Fix custom network addition and notifications when you send gazillion ETH [#1293](https://github.com/MyEtherWallet/MyEtherWallet/pull/1293)
- Logout warning modal redirect to current page instead of home page [#1297](https://github.com/MyEtherWallet/MyEtherWallet/pull/1297)
- Custom networks not showing on send offline helper [#1285](https://github.com/MyEtherWallet/MyEtherWallet/pull/1285)
- Fix webworker error when origin is null [#1273](https://github.com/MyEtherWallet/MyEtherWallet/pull/1273)

### Devop

- Add MEWTopia link [#1275](https://github.com/MyEtherWallet/MyEtherWallet/pull/1275)
- Sentry Fixes [#1295](https://github.com/MyEtherWallet/MyEtherWallet/pull/1295)

### Release v5.0.15

### Bug

- Fix withdraw ETH with infinite collateralization [#1244](https://github.com/MyEtherWallet/MyEtherWallet/pull/1244)
- Fix the BitBox hardware wallet communication error introduced with Chrome 73 [#1209](https://github.com/MyEtherWallet/MyEtherWallet/pull/1209)
- Fix error message display for the BitBox hardware wallet [#1209](https://github.com/MyEtherWallet/MyEtherWallet/pull/1209)

### Release v5.0.14-hotfix.2

### Bug

- Fix Typo [#1198](https://github.com/MyEtherWallet/MyEtherWallet/pull/1198)
- Fix Secalot throwing exception [#1194](https://github.com/MyEtherWallet/MyEtherWallet/pull/1194)

### Devop

- Cleanup greenkeeper branches [#1203](https://github.com/MyEtherWallet/MyEtherWallet/pull/1203)
- Add subdomains [#1186](https://github.com/MyEtherWallet/MyEtherWallet/pull/1186)

### Release v5.0.14-hotfix.1

### Bug

- Fix send tx for custom chains [#1184](https://github.com/MyEtherWallet/MyEtherWallet/pull/1184)

### Release v5.0.14

### Feature

- Maker Integration [#740](https://github.com/MyEtherWallet/MyEtherWallet/pull/740)
- Pocket Network Integration [#1226](https://github.com/MyEtherWallet/MyEtherWallet/pull/1262)

### Bug

- Fix getAddressString null issue, update ethereumjs-tx [#1163](https://github.com/MyEtherWallet/MyEtherWallet/pull/1163)
- Add better errors on send, disable register on ens when no balance [#1173](https://github.com/MyEtherWallet/MyEtherWallet/pull/1173)
- Fix Private Key network error on access [#1166](https://github.com/MyEtherWallet/MyEtherWallet/pull/1166)

### Release v5.0.13

### Devop

- AWS sync with --exact-timestamps flag [#1117](https://github.com/MyEtherWallet/MyEtherWallet/pull/1117)
- Support 32bits chainID [#959](https://github.com/MyEtherWallet/MyEtherWallet/pull/959)

### Bug

- Broken link in getting started [#1154](https://github.com/MyEtherWallet/MyEtherWallet/pull/1154)
- Fix broken custom derivation paths & Remove -1 as an allowed gas limit value [#1133](https://github.com/MyEtherWallet/MyEtherWallet/pull/1133)
- Various fixes for Metamask, Trezor, interact with contract, and deploy contract [#1125](https://github.com/MyEtherWallet/MyEtherWallet/pull/1125)
- Fix front page spaceman animation [#1147](https://github.com/MyEtherWallet/MyEtherWallet/pull/1147)
- Update UI for Verify Message page [#1146](https://github.com/MyEtherWallet/MyEtherWallet/pull/1146)
- Fix UI for Hardware modal [#1140](https://github.com/MyEtherWallet/MyEtherWallet/pull/1140)
- Ui fix for password modal [#1135](https://github.com/MyEtherWallet/MyEtherWallet/pull/1135)
- UI update for mobile network, balance [#1134](https://github.com/MyEtherWallet/MyEtherWallet/pull/1134)
- UI update for Send Offline Helper, Convert Units, Buy a Hardware wallet [#1129](https://github.com/MyEtherWallet/MyEtherWallet/pull/1129)
- Term and conditions, Privacy policy UI fix [#1128](https://github.com/MyEtherWallet/MyEtherWallet/pull/1128)

### Release v5.0.12-hotfix.2

### Bug

- Fix ENS migrate owner check [#1103](https://github.com/MyEtherWallet/MyEtherWallet/pull/1103)
- Fixes refresh page on mnemonic wallet submit [#1108](https://github.com/MyEtherWallet/MyEtherWallet/pull/1108)

### Release v5.0.12-hotfix.1

### Bug

- Use u2f in windows for ledger [#1100](https://github.com/MyEtherWallet/MyEtherWallet/pull/1100)

### Devop

- Possible random error fix, and sync master to develop [#1101](https://github.com/MyEtherWallet/MyEtherWallet/pull/1101)

### Release v5.0.12

### Feature

- Have Simplex KYC form open in new tab [#1031](https://github.com/MyEtherWallet/MyEtherWallet/pull/1031)
- Ledger webusb option [#1081](https://github.com/MyEtherWallet/MyEtherWallet/pull/1081)

### Bug

- Use native browser checking for online status. [#1032](https://github.com/MyEtherWallet/MyEtherWallet/pull/1032)
- UI fix for mnemonic phrase key verification modal [#1029](https://github.com/MyEtherWallet/MyEtherWallet/pull/1029)
- set up a fallback if GAS_LIMIT check fails [#1076](https://github.com/MyEtherWallet/MyEtherWallet/pull/1076)
- Fix owner check for permanent registrar names [#1054](https://github.com/MyEtherWallet/MyEtherWallet/pull/1054)
- Web3 wallet promievent fix [#1063](https://github.com/MyEtherWallet/MyEtherWallet/pull/1063)
- Catch ledger error [#1091](https://github.com/MyEtherWallet/MyEtherWallet/pull/1091)

### Devop

- Ledger custom paths [#1037](https://github.com/MyEtherWallet/MyEtherWallet/pull/1037)
- Update Richie's profile [#1036](https://github.com/MyEtherWallet/MyEtherWallet/pull/1036)
- Change PWA name to MEW [#1030](https://github.com/MyEtherWallet/MyEtherWallet/pull/1030)
- Address validation on swap [#1090](https://github.com/MyEtherWallet/MyEtherWallet/pull/1090)

### Release v5.0.11-ens.1

- Permanent registry [#965](https://github.com/MyEtherWallet/MyEtherWallet/pull/965)

### Release v5.0.11

### Devop

- Update Access My Wallet modal UI [#1033](https://github.com/MyEtherWallet/MyEtherWallet/pull/1033)
- Access by Software UI change [#1021](https://github.com/MyEtherWallet/MyEtherWallet/pull/1021)
- Fix multiple sentry issues [#1015](https://github.com/MyEtherWallet/MyEtherWallet/pull/1015)
- Update hardware icons [#994](https://github.com/MyEtherWallet/MyEtherWallet/pull/994)
- Add trezor eth path to ledger [#1020](https://github.com/MyEtherWallet/MyEtherWallet/pull/1020)
- Add presale eth and old mew eth wallet support [#985](https://github.com/MyEtherWallet/MyEtherWallet/pull/985)
- Check private key format [#1014](https://github.com/MyEtherWallet/MyEtherWallet/pull/1014)
- Update usage of Kyber supplied gas limits and serverless provider [#969](https://github.com/MyEtherWallet/MyEtherWallet/pull/969)
- Fix hardware access icons not displaying [#1025](https://github.com/MyEtherWallet/MyEtherWallet/pull/1025)
- Fix none assignment issue on Send Offline Container [#982](https://github.com/MyEtherWallet/MyEtherWallet/pull/982)

### Bug

- Reimplement support for web3 wallets [#976](https://github.com/MyEtherWallet/MyEtherWallet/pull/976)
- Strip whitespace in address inputs [#1016](https://github.com/MyEtherWallet/MyEtherWallet/pull/1016)
- Fix token load issue when searching token list [#1001](https://github.com/MyEtherWallet/MyEtherWallet/pull/1001)

### Feature

- Add warning signs to Create wallet page and update mnemonic input [#1041](https://github.com/MyEtherWallet/MyEtherWallet/pull/1041)
- DEXON network support [#977](https://github.com/MyEtherWallet/MyEtherWallet/pull/977)
- Metadium network support [#928](https://github.com/MyEtherWallet/MyEtherWallet/pull/928)
- Solidum network support [#957](https://github.com/MyEtherWallet/MyEtherWallet/pull/957)
- Support local nodes [#973](https://github.com/MyEtherWallet/MyEtherWallet/pull/973)

### Release v5.0.10

### Bug

- Better Ledger app support flow [#910](https://github.com/MyEtherWallet/MyEtherWallet/pull/910)
- Fixes send offline token value and deploy contract errors [#920](https://github.com/MyEtherWallet/MyEtherWallet/pull/920)
- Update TOMO explorrer links [#918](https://github.com/MyEtherWallet/MyEtherWallet/pull/918)

### Devop

- only clone the most recent commit [#937](https://github.com/MyEtherWallet/MyEtherWallet/pull/937)
- Fix send offline helper, update webchain [#932](https://github.com/MyEtherWallet/MyEtherWallet/pull/932)
- MEWCX build fix [#935](https://github.com/MyEtherWallet/MyEtherWallet/pull/935)
- Update Metamask Integration with listeners [#938](https://github.com/MyEtherWallet/MyEtherWallet/pull/938)
- Sentry migration [#922](https://github.com/MyEtherWallet/MyEtherWallet/pull/922)
- remove utf8 convertion for hex strings [#941](https://github.com/MyEtherWallet/MyEtherWallet/pull/941)

### Feature

- Scan each mewbuild with virustotal [#934](https://github.com/MyEtherWallet/MyEtherWallet/pull/934)
- Can debug via [VSCODE](https://github.com/Microsoft/vscode-recipes/tree/master/vuejs-cli) [#960](https://github.com/MyEtherWallet/MyEtherWallet/pull/960)
- Update hardware modal options [#923](https://github.com/MyEtherWallet/MyEtherWallet/pull/923)

### Release v5.0.9

### Devop

- Add gas amount to send tx page [#925](https://github.com/MyEtherWallet/MyEtherWallet/pull/925)
- Better data catch for url params [#909](https://github.com/MyEtherWallet/MyEtherWallet/pull/909)
- Update hardwares [#906](https://github.com/MyEtherWallet/MyEtherWallet/pull/906)
- Add monospace font[#898](https://github.com/MyEtherWallet/MyEtherWallet/pull/898)
- Add Gage on team page [#853](https://github.com/MyEtherWallet/MyEtherWallet/pull/853)
- Fixes Bitbox error and Hardware wallet error handling [#893](https://github.com/MyEtherWallet/MyEtherWallet/pull/893)
- Use Kyber supplied gas limits [#892](https://github.com/MyEtherWallet/MyEtherWallet/pull/892)

### Feature

- Update verify message [#854](https://github.com/MyEtherWallet/MyEtherWallet/pull/854)
- Add hardware page [#862](https://github.com/MyEtherWallet/MyEtherWallet/pull/862)
- Reimplement query params for send offline and regular send [#803](https://github.com/MyEtherWallet/MyEtherWallet/pull/803)
- Show token transfer data in notification body [#840](https://github.com/MyEtherWallet/MyEtherWallet/pull/840)
- Add curency symbol to config [#809](https://github.com/MyEtherWallet/MyEtherWallet/pull/809)
- Add Browser options for Metamask on Safari [#867](https://github.com/MyEtherWallet/MyEtherWallet/pull/867)
- Add TX history menu[#865](https://github.com/MyEtherWallet/MyEtherWallet/pull/865)

### Bug

- Fix side menu bugs, logout warning modal bug[#896](https://github.com/MyEtherWallet/MyEtherWallet/pull/896)
- Add network icon background[#897](https://github.com/MyEtherWallet/MyEtherWallet/pull/897)
- Fix custom token validation [#852](https://github.com/MyEtherWallet/MyEtherWallet/pull/852)
- Change mobile side menu button title from "Change" to "Menu" [#887](https://github.com/MyEtherWallet/MyEtherWallet/pull/887)
- Fix notification to show max 5 notification popups[#873](https://github.com/MyEtherWallet/MyEtherWallet/pull/873)
- Display final re-calculated values on swap confirmation[#841](https://github.com/MyEtherWallet/MyEtherWallet/pull/841)
- Fix batch send success modal[#843](https://github.com/MyEtherWallet/MyEtherWallet/pull/843)
- Fix hardware wallet scroll bug[#890](https://github.com/MyEtherWallet/MyEtherWallet/pull/890)
- Allow zero as nonce for offline transaction [#860](https://github.com/MyEtherWallet/MyEtherWallet/pull/860)
- Resolve spinner on interact contract [#861](https://github.com/MyEtherWallet/MyEtherWallet/pull/841)
- Fix incorrect signing of messages starts with 0x [#899](https://github.com/MyEtherWallet/MyEtherWallet/pull/899)

### Hotfix v5.0.8-hotfix.1

- Display final re-calculated values on swap confirmation[#841](https://github.com/MyEtherWallet/MyEtherWallet/pull/841)
- Fix batch send success modal[#843](https://github.com/MyEtherWallet/MyEtherWallet/pull/843)

### Release v5.0.8

### Bug

- Better Ipad Catch [#814](https://github.com/MyEtherWallet/MyEtherWallet/pull/814)
- Fix success modal not linking to unlock wallet page [#825](https://github.com/MyEtherWallet/MyEtherWallet/pull/825)
- Currency in notifications shown correctly [#824](https://github.com/MyEtherWallet/MyEtherWallet/pull/824)
- Fix Token details not sending to mewconnect [#839](https://github.com/MyEtherWallet/MyEtherWallet/pull/839)

### Feature

- Implement DNS for ENS [#792](https://github.com/MyEtherWallet/MyEtherWallet/pull/792)
- Add ethereum classic path as presented in mew v3 [#812](https://github.com/MyEtherWallet/MyEtherWallet/pull/812)
- Shows the recipient and the contract address [#822](https://github.com/MyEtherWallet/MyEtherWallet/pull/822)
- Add ledger support for ThunderCore [#827](https://github.com/MyEtherWallet/MyEtherWallet/pull/827)

### Devop

- Add zh_TW (Traditional Chinese) translation [#820](https://github.com/MyEtherWallet/MyEtherWallet/pull/820)

### Release v5.0.7

### Feature

- Add Finney Modal [#782](https://github.com/MyEtherWallet/MyEtherWallet/pull/782)
- Sentry Fixes [#777](https://github.com/MyEtherWallet/MyEtherWallet/pull/777)
- Add Thundercore node [#780](https://github.com/MyEtherWallet/MyEtherWallet/pull/780)

### Release v5.0.6

### Feature

- DApp: Schedule transaction using Ethereum Alarm Clock [#545](https://github.com/MyEtherWallet/MyEtherWallet/pull/545)

### Bug

- Fix block 0 on mobile [#767](https://github.com/MyEtherWallet/MyEtherWallet/pull/767)
- Update infura endpoint [#763](https://github.com/MyEtherWallet/MyEtherWallet/pull/763)
- Chrome 72 compatibility for Secalot [#766](https://github.com/MyEtherWallet/MyEtherWallet/pull/766)

### Hotfix v5.0.5-hotfix.1

### Bug

- Fix network addresses with discussed concat, fixes settings dollar amount, Token manual load fix, Ipad modal catch, Mozilla value error, update packages, fix verify feedback, and signed msg copy, await token fetch [#752](https://github.com/MyEtherWallet/MyEtherWallet/pull/752)

### Release v5.0.5

### Bug

- Update success modal for transaction and swap [#666](https://github.com/MyEtherWallet/MyEtherWallet/pull/666)
- Fix Interface -> Address block UI & Print sheet UI [#733](https://github.com/MyEtherWallet/MyEtherWallet/pull/733)

### Devop

- Update notification dot animation [#700](https://github.com/MyEtherWallet/MyEtherWallet/pull/700)
- Update README instructions, fix #731 and #727 [#732](https://github.com/MyEtherWallet/MyEtherWallet/pull/732)

### Release v5.0.4

### Feature

- Add animation to FAQs [#691](https://github.com/MyEtherWallet/MyEtherWallet/pull/691)

### Devop

- Reverse the tx order for metamask batch txs [#723](https://github.com/MyEtherWallet/MyEtherWallet/pull/723)
- Add minimum buffer to Kyber Swaps, improve changelly fixed rate check, show swap reference number in notifications [#711](https://github.com/MyEtherWallet/MyEtherWallet/pull/711)
- Update keepkey, add popovers on disabled options [#709](https://github.com/MyEtherWallet/MyEtherWallet/pull/709)
- Add noscript page [#710](https://github.com/MyEtherWallet/MyEtherWallet/pull/710)
- Fix list fetching issue on travis and couple of sentry issues [#692](https://github.com/MyEtherWallet/MyEtherWallet/pull/692)
- Redo wallet errors, include translations [#685](https://github.com/MyEtherWallet/MyEtherWallet/pull/685)
- Identical build for production and gh-pages-history [#712](https://github.com/MyEtherWallet/MyEtherWallet/pull/712)
- Optimized batch transaction processing and ws block subscription [#704](https://github.com/MyEtherWallet/MyEtherWallet/pull/704)

### Bug

- Fix Mnemonic Phrase print page UI [#721](https://github.com/MyEtherWallet/MyEtherWallet/pull/721)
- Fix Send TX confirmation modal [#694](https://github.com/MyEtherWallet/MyEtherWallet/pull/694)
- Fix offline Worker issue [#690](https://github.com/MyEtherWallet/MyEtherWallet/pull/690)
- Fix information block UI [#693](https://github.com/MyEtherWallet/MyEtherWallet/pull/693)
- Fix header UI bug [#701](https://github.com/MyEtherWallet/MyEtherWallet/pull/701)
- Update Inteface side menu button UI [#698](https://github.com/MyEtherWallet/MyEtherWallet/pull/698)

### Feature

- Sort by network support, add row gap [#720](https://github.com/MyEtherWallet/MyEtherWallet/pull/720)
- Print ENS bid details [#699](https://github.com/MyEtherWallet/MyEtherWallet/pull/699)
- Add Prefilled form for contact support [#697](https://github.com/MyEtherWallet/MyEtherWallet/pull/697)

### Release v5.0.3

### Bug

- Fix NaN issue on settings modal [#682](https://github.com/MyEtherWallet/MyEtherWallet/pull/682)
- Multiple Sentry fixes, custom paths, Safari worker fix [#680](https://github.com/MyEtherWallet/MyEtherWallet/pull/680)

### Devop

- Add disabled access wallet buttons [#665](https://github.com/MyEtherWallet/MyEtherWallet/pull/665)
- Update Send offline helper UI [#663](https://github.com/MyEtherWallet/MyEtherWallet/pull/663)
- Include Service worker error [#660](https://github.com/MyEtherWallet/MyEtherWallet/pull/660)
- Update Front-Page UI [#677](https://github.com/MyEtherWallet/MyEtherWallet/pull/677)
- Update notification dot [#679](https://github.com/MyEtherWallet/MyEtherWallet/pull/679)
- Add Missing nodes from v3 [#672](https://github.com/MyEtherWallet/MyEtherWallet/pull/672)
- Update hdkey 1.1.1 & imagemin-webpack-plugin 2.4.2 [#668](https://github.com/MyEtherWallet/MyEtherWallet/pull/668)

### Feature

- Add nonce and gas to offline [#661](https://github.com/MyEtherWallet/MyEtherWallet/pull/661)
- Detect when user not in interface and prompt [#684](https://github.com/MyEtherWallet/MyEtherWallet/pull/684)
- Add Exit to Fiat via Bity [#669](https://github.com/MyEtherWallet/MyEtherWallet/pull/669)

### Release v5.0.2

### Bug

- Fix Popover UI bugs [#676](https://github.com/MyEtherWallet/MyEtherWallet/pull/676)
- Fix mobile settings [#651](https://github.com/MyEtherWallet/MyEtherWallet/pull/651)
- Mandatory password input for Get a New Wallet -> Mnemonic Phrase [#649](https://github.com/MyEtherWallet/MyEtherWallet/pull/649)
- fix data copy error on FF, and MEWconnect disconnect modal [#648](https://github.com/MyEtherWallet/MyEtherWallet/pull/648)
- Fix Access my wallet modals [#647](https://github.com/MyEtherWallet/MyEtherWallet/pull/647)
- Reset tokens when adding custom token, fetch balance on load [#646](https://github.com/MyEtherWallet/MyEtherWallet/pull/646)
- Fix Ui Access by Software modal [#645](https://github.com/MyEtherWallet/MyEtherWallet/pull/645)
- Various bug fixes and package updates [#637](https://github.com/MyEtherWallet/MyEtherWallet/pull/637)
- Reduce side paddings of footer links to make them fit to mobile width [#636](https://github.com/MyEtherWallet/MyEtherWallet/pull/636)
- Fix welcome modal UI [#632](https://github.com/MyEtherWallet/MyEtherWallet/pull/632)
- Reenable mewconnect on Safari and Opera [#631](https://github.com/MyEtherWallet/MyEtherWallet/pull/631)
- Fix NetworkAddress layout responsiveness [#629](https://github.com/MyEtherWallet/MyEtherWallet/pull/629)

### Feature

- Add reusable global toasts. Add examples [#617](https://github.com/MyEtherWallet/MyEtherWallet/pull/617)

### Devop

- Make toasts stay longer, update packages [#658](https://github.com/MyEtherWallet/MyEtherWallet/pull/658)

### Release v5.0.1

### Devop

- Fix foreach issue in settings [#619](https://github.com/MyEtherWallet/MyEtherWallet/pull/619)
- Disable HWs if not supported [#618](https://github.com/MyEtherWallet/MyEtherWallet/pull/618)

### Bug

- Reenable Metamask when web3 is not found [#622](https://github.com/MyEtherWallet/MyEtherWallet/pull/622)
- Fix Mew connect modal content [#616](https://github.com/MyEtherWallet/MyEtherWallet/pull/616)
- Fix Getting started page [#615](https://github.com/MyEtherWallet/MyEtherWallet/pull/615)
- Fix various user found errors [#611](https://github.com/MyEtherWallet/MyEtherWallet/pull/611)
- Fix mnemonic phrase radio button [#611](https://github.com/MyEtherWallet/MyEtherWallet/pull/611)

### Release v5.0.0

### Feature

- Implement SafeSend Dapp [#299](https://github.com/MyEtherWallet/MyEtherWallet/pull/299)
- Implement SafeSend Tweaks [#597](https://github.com/MyEtherWallet/MyEtherWallet/pull/597)

### Devop

- Add disconnected modal [#635](https://github.com/MyEtherWallet/MyEtherWallet/pull/635)
- Add medium link [#598](https://github.com/MyEtherWallet/MyEtherWallet/pull/598)

### Release v5.0.0-rc.1

### Feature

- Update internal partner currency list [#596](https://github.com/MyEtherWallet/MyEtherWallet/pull/596)
- Disable tabs and buttons based on app status [#591](https://github.com/MyEtherWallet/MyEtherWallet/pull/591)
- Added ENS test name registration to ROP, RIN and Goerli [#589](https://github.com/MyEtherWallet/MyEtherWallet/pull/589)

### Bug

- Sentry bug fixes [#589](https://github.com/MyEtherWallet/MyEtherWallet/pull/589)
- store addresses validation differently, better handling of kyber api no response [#588](https://github.com/MyEtherWallet/MyEtherWallet/pull/588)
- Handle failure to fetch errors [#590](https://github.com/MyEtherWallet/MyEtherWallet/pull/590)

### Hotfix

- partner rate correction [#595](https://github.com/MyEtherWallet/MyEtherWallet/pull/595)

### Release v5.0.0-rc.0

### Devop

- simplex swap revision [#580](https://github.com/MyEtherWallet/MyEtherWallet/pull/580)
- Swap fix, sentry version addition, deploy contract deteministic updates, JSON parsing [#575](https://github.com/MyEtherWallet/MyEtherWallet/pull/575)
- Refactor custom token, import v3 token [#583](https://github.com/MyEtherWallet/MyEtherWallet/pull/583)
- Add keepkey affiliate link, link out to mewconnect, vintage mew header, fix getting started [#581](https://github.com/MyEtherWallet/MyEtherWallet/pull/581)

### Bug

- Supply gasPrice to estimateGas for token transfers [#554](https://github.com/MyEtherWallet/MyEtherWallet/pull/554)
- Fix provider selector UI [#579](https://github.com/MyEtherWallet/MyEtherWallet/pull/579)
- Fix Getting started layout bugs for mobile and desktop [#569](https://github.com/MyEtherWallet/MyEtherWallet/pull/569)
- Fix mobile menu [#564](https://github.com/MyEtherWallet/MyEtherWallet/pull/564)

### Devop

- Supply gasPrice to estimateGas for token transfers [#554](https://github.com/MyEtherWallet/MyEtherWallet/pull/554)

### Release v5.0.0-beta.4

### Feature

- Add welcome to mew modal [#571](https://github.com/MyEtherWallet/MyEtherWallet/pull/571)
- Add [Görli](https://github.com/goerli/testnet) testnet [#552](https://github.com/MyEtherWallet/MyEtherWallet/pull/552)
- Make use of address darklist from ethereum-list [#521](https://github.com/MyEtherWallet/MyEtherWallet/pull/521)

### Devop

- Catch byte32\[] and use constant types [#561](https://github.com/MyEtherWallet/MyEtherWallet/pull/561)
- Setup Sentry [#573](https://github.com/MyEtherWallet/MyEtherWallet/pull/573)
- Upgrade keepkey and use bip32ToAddressNList [#543](https://github.com/MyEtherWallet/MyEtherWallet/pull/543)
- Fixes from meeting [#538](https://github.com/MyEtherWallet/MyEtherWallet/pull/538)
- Add display of swap partners [#537](https://github.com/MyEtherWallet/MyEtherWallet/pull/537)
- Refactor interact w contract [#536](https://github.com/MyEtherWallet/MyEtherWallet/pull/536)
- Set server side headers on webpack dev server [#534](https://github.com/MyEtherWallet/MyEtherWallet/pull/534)
- Hide switch on web3 wallet, update logout text, add package exception for webpack [#529](https://github.com/MyEtherWallet/MyEtherWallet/pull/529)
- Improve notification handling of tx errors [#524](https://github.com/MyEtherWallet/MyEtherWallet/pull/524)
- Enable custom HD paths (fixes #509) [#550](https://github.com/MyEtherWallet/MyEtherWallet/pull/550)

### Release v5.0.0-beta.3

### Hotfix

- Fix "New wallet", "Access" buttons on header [#549](https://github.com/MyEtherWallet/MyEtherWallet/pull/549)
- Fix Token Transfer [#498](https://github.com/MyEtherWallet/MyEtherWallet/pull/498)
- Fix KeepKey network modal issue [#510](https://github.com/MyEtherWallet/MyEtherWallet/pull/510)

### Bug

- Fix deploy contract params and validation issue [#502](https://github.com/MyEtherWallet/MyEtherWallet/pull/502)

### Feature

- Add Crypto to Fiat swap option [#325](https://github.com/MyEtherWallet/MyEtherWallet/pull/325)

### Devop

- Add Send Offline Helper page [#535](https://github.com/MyEtherWallet/MyEtherWallet/pull/535)
- Update UI design for Send Offline [#522](https://github.com/MyEtherWallet/MyEtherWallet/pull/522)
- Update Logo for Kyber Network [#518](https://github.com/MyEtherWallet/MyEtherWallet/pull/518)
- Send Transaction container refactor [#499](https://github.com/MyEtherWallet/MyEtherWallet/pull/499)
- Fix weird interaction in side menu [#494](https://github.com/MyEtherWallet/MyEtherWallet/pull/494)
- Upload history build to gh-pages-history [#504](https://github.com/MyEtherWallet/MyEtherWallet/pull/504)

### Bug

- Fix Access My Wallet buttons position [#566](https://github.com/MyEtherWallet/MyEtherWallet/pull/566)
- Fix #513 [#516](https://github.com/MyEtherWallet/MyEtherWallet/pull/516)
- Fix deploy contract params and validation issue [#502](https://github.com/MyEtherWallet/MyEtherWallet/pull/502)

### Feature

- Componentize wallet options, change all wallet address instance to coinbase [#511](https://github.com/MyEtherWallet/MyEtherWallet/pull/511)

### Release v5.0.0-beta.2

### Hotfix

- Logout buttons [#484](https://github.com/MyEtherWallet/MyEtherWallet/pull/484)

### Bug

- Fix interact contract disabled [#469](https://github.com/MyEtherWallet/MyEtherWallet/pull/469)
- Dapps back issue [#472](https://github.com/MyEtherWallet/MyEtherWallet/pull/472)
- Make routes with child set first child active #437 [#473](https://github.com/MyEtherWallet/MyEtherWallet/pull/473)
- Fix UI Interface -> Message [#475](https://github.com/MyEtherWallet/MyEtherWallet/pull/475)
- Fix UI Interface -> Contract [#474](https://github.com/MyEtherWallet/MyEtherWallet/pull/474)
- Fix UI Interface -> Dapps [#462](https://github.com/MyEtherWallet/MyEtherWallet/pull/462)
- Fix #438 - Error message for empty to address in swap [#458](https://github.com/MyEtherWallet/MyEtherWallet/pull/458)
- Fix slide on mobile, fix network default, json -> keystore instance [#410](https://github.com/MyEtherWallet/MyEtherWallet/pull/410)
- Fix UI Interface -> Swap [#457](https://github.com/MyEtherWallet/MyEtherWallet/pull/457)
- Fix UI Interface -> Send Offline [#444](https://github.com/MyEtherWallet/MyEtherWallet/pull/444)
- Fix slide on mobile, fix network default, json -> keystore instance [#410](https://github.com/MyEtherWallet/MyEtherWallet/pull/410)

### Feature

- Add KeepKey [#350](https://github.com/MyEtherWallet/MyEtherWallet/pull/350)
- Add MEW Websocket node [#483](https://github.com/MyEtherWallet/MyEtherWallet/pull/483)

### Devop

- Swap Revision [#458](https://github.com/MyEtherWallet/MyEtherWallet/pull/458)
- Address checksum validation based on the network (RSK) [#461](https://github.com/MyEtherWallet/MyEtherWallet/pull/461)

### Release v5.0.0-beta.1

### Devop

- Add node_modules cache to TravisCI for faster builds, and remove Brotli compression from offline [#435](https://github.com/MyEtherWallet/MyEtherWallet/pull/435)
- Prep release and multiple fixes: #412, #409, #408, #413, #414, #433, #419, #415, #425, #427, #430, and #410 [#407](https://github.com/MyEtherWallet/MyEtherWallet/pull/407)

### Release v5.0.0-beta.0

### Bug

- Fix New wallet, Access buttons [#326](https://github.com/MyEtherWallet/MyEtherWallet/pull/326)
- Fix front interface bugs [#344](https://github.com/MyEtherWallet/MyEtherWallet/pull/344)
- Hide header on getting start [#341](https://github.com/MyEtherWallet/MyEtherWallet/pull/341)
- Fix small bugs [#383](https://github.com/MyEtherWallet/MyEtherWallet/pull/383)
- Only show security button on specific pages [#334](https://github.com/MyEtherWallet/MyEtherWallet/pull/334)
- Fix/replace apple qr code [#323](https://github.com/MyEtherWallet/MyEtherWallet/pull/323)
- Fix ENS resolver/error placement [#324](https://github.com/MyEtherWallet/MyEtherWallet/pull/324)
- Fix header settings modal styles [#287](https://github.com/MyEtherWallet/MyEtherWallet/pull/287)
- Fix fixed buttons, scroll-up, security [#282](https://github.com/MyEtherWallet/MyEtherWallet/pull/282)
- Fix Github issues [#276](https://github.com/MyEtherWallet/MyEtherWallet/pull/276)
- Fix network modal issues pt 2 [#279](https://github.com/MyEtherWallet/MyEtherWallet/pull/279)
- Fix network modal [#255](https://github.com/MyEtherWallet/MyEtherWallet/pull/255)
- Fall back for token fetch [#262](https://github.com/MyEtherWallet/MyEtherWallet/pull/262)
- Fix footer links [#235](https://github.com/MyEtherWallet/MyEtherWallet/pull/235)
- Fix multiple issues: #195, #198, #199, #202, #203, #207, #209, #213, #210, #191, #224, #201, #225, #220, and #208 [#215](https://github.com/MyEtherWallet/MyEtherWallet/pull/215)
- Fix network and address modal dropdown issue [#234](https://github.com/MyEtherWallet/MyEtherWallet/pull/234)
- Fix missing text issue on getting started modal [#173](https://github.com/MyEtherWallet/MyEtherWallet/pull/173)
- Reimplement logout with the new logout modal [#177](https://github.com/MyEtherWallet/MyEtherWallet/pull/177)
- Close modal when adding a custom token [#175](https://github.com/MyEtherWallet/MyEtherWallet/pull/175)
- Fix balance modal, and show equivalent values [#176](https://github.com/MyEtherWallet/MyEtherWallet/pull/176)
- Fix for issue where amount can add too many decimal places [#166](https://github.com/MyEtherWallet/MyEtherWallet/pull/166)

### Feature

- Remove print in creating a json wallet, create mnemonic paper, enhance paper wallet, fix #371 [#387](https://github.com/MyEtherWallet/MyEtherWallet/pull/387)
- Update Getting Started page contents [#386](https://github.com/MyEtherWallet/MyEtherWallet/pull/386)
- Add detailed Notifications [#231](https://github.com/MyEtherWallet/MyEtherWallet/pull/231)
- Manual refresh for balance and token [#342](https://github.com/MyEtherWallet/MyEtherWallet/pull/342)
- implement settings config [#298](https://github.com/MyEtherWallet/MyEtherWallet/pull/298)
- Path saver + send offline tx refactor [#159](https://github.com/MyEtherWallet/MyEtherWallet/pull/159)
- implement nonce cache [#149](https://github.com/MyEtherWallet/MyEtherWallet/pull/149)
- Redo Metamask with the breaking changes [#145](https://github.com/MyEtherWallet/MyEtherWallet/pull/145)
- Mnemonic Phrase auto populate [#140](https://github.com/MyEtherWallet/MyEtherWallet/pull/140)
- Implement Buying Subdomains dapps. [#122](https://github.com/MyEtherWallet/MyEtherWallet/pull/122)
- Add support for Ledger live paths. [#216](https://github.com/MyEtherWallet/MyEtherWallet/pull/216)
- Implement Swap [#127](https://github.com/MyEtherWallet/MyEtherWallet/pull/127)

### Devop

- Refactors, validations, and fixes: #311, #362, #389, #359, #366, #369, #368, #367, #370, #361, #344, #341, #375, #377, #364, #347, #346, #380, #394, #388, #391, #392, #382, #393, #399, #398, #376, #356, #401, and #374 [#345](https://github.com/MyEtherWallet/MyEtherWallet/pull/345)
- Resize team container [#337](https://github.com/MyEtherWallet/MyEtherWallet/pull/337)
- Change pricebar animation [#338](https://github.com/MyEtherWallet/MyEtherWallet/pull/338)
- Left align pricebar contents [#336](https://github.com/MyEtherWallet/MyEtherWallet/pull/336)
- Adjust header size [#335](https://github.com/MyEtherWallet/MyEtherWallet/pull/335)
- Show rates based on from amount, Add switch order of selected currencies [#372](https://github.com/MyEtherWallet/MyEtherWallet/pull/372)
- Enable metamask compatibility with mew.sendBatchTransaction fixes #351 [#352](https://github.com/MyEtherWallet/MyEtherWallet/pull/352)
- Fix #316, #317, #318, #319, #320, #321 [#322](https://github.com/MyEtherWallet/MyEtherWallet/pull/322)
- Add RSK network [#291](https://github.com/MyEtherWallet/MyEtherWallet/pull/291)
- Replace temporary notice to check if hardware wallet is attached to a final version [#309](https://github.com/MyEtherWallet/MyEtherWallet/pull/309)
- Cleanup unused files [#308](https://github.com/MyEtherWallet/MyEtherWallet/pull/308)
- Remove ETC epool [#307](https://github.com/MyEtherWallet/MyEtherWallet/pull/307)
- Revise and update docs [#301](https://github.com/MyEtherWallet/MyEtherWallet/pull/301)
- Greenkeeper chores [#302](https://github.com/MyEtherWallet/MyEtherWallet/pull/302)
- Add all derivation paths to HD wallets [#297](https://github.com/MyEtherWallet/MyEtherWallet/pull/297)
- Prevent excessive polling of eth_getTransactionReceipt [#266](https://github.com/MyEtherWallet/MyEtherWallet/pull/266)
- Check and verify npm package versions [#233](https://github.com/MyEtherWallet/MyEtherWallet/pull/233)
- Setup automated travis builds and release [#280](https://github.com/MyEtherWallet/MyEtherWallet/pull/280)
- Safe external links and meta descriptions [#261](https://github.com/MyEtherWallet/MyEtherWallet/pull/261)
- Update FAQ content, refactor how FAQ is implemented [#245](https://github.com/MyEtherWallet/MyEtherWallet/pull/245)
- Fixes #237, #238, #236, #260, #253, #283, #284, #286 [#274](https://github.com/MyEtherWallet/MyEtherWallet/pull/274)
- Lazy loading components for faster loading [#181](https://github.com/MyEtherWallet/MyEtherWallet/pull/181)
- ChainID calculation refactoring and BitBox v5 support [#206](https://github.com/MyEtherWallet/MyEtherWallet/pull/206)
- Generate deterministic builds [#217](https://github.com/MyEtherWallet/MyEtherWallet/pull/217)
- Use token package [#183](https://github.com/MyEtherWallet/MyEtherWallet/pull/183)
- Update nonce properly on send and fetch, parse response properly [#185](https://github.com/MyEtherWallet/MyEtherWallet/pull/185)
- Replace heroku urls [#178](https://github.com/MyEtherWallet/MyEtherWallet/pull/178)
- Crowdin translations [#75](https://github.com/MyEtherWallet/MyEtherWallet/pull/75)
- refinalize copy based on new version [#165](https://github.com/MyEtherWallet/MyEtherWallet/pull/165)
- fix invalid chain id error [#164](https://github.com/MyEtherWallet/MyEtherWallet/pull/164)
- Devop/fix router mode [#162](https://github.com/MyEtherWallet/MyEtherWallet/pull/162)
- Move text to translations [#157](https://github.com/MyEtherWallet/MyEtherWallet/pull/157)
- Update packages [#151](https://github.com/MyEtherWallet/MyEtherWallet/pull/151)
- Refactor state [#148](https://github.com/MyEtherWallet/MyEtherWallet/pull/148)
- Refactor web3 provider [#141](https://github.com/MyEtherWallet/MyEtherWallet/pull/141)
- Refactor Wallet interface [#129](https://github.com/MyEtherWallet/MyEtherWallet/pull/129)
- Normalise ens-resolver, use resolved address in send container [#126](https://github.com/MyEtherWallet/MyEtherWallet/pull/126)

### Hotfix

- Some fixes for the ENS Registrar, and validate and normalise ens domains [#120](https://github.com/MyEtherWallet/MyEtherWallet/pull/120)

### Release v5.0.0.alpha.4

### Devop

- Use new contract getter [#119](https://github.com/MyEtherWallet/MyEtherWallet/pull/119)
- Fix access wallet link, pop success when user clicks download [#115](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/115)
- Add more nodes [#90](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/90)

### Feature

- Metamask Integration [#96](https://github.com/MyEtherWallet/MyEtherWallet/pull/96)
- Finish unit conversion [#114](https://github.com/MyEtherWallet/MyEtherWallet/pull/114)
- Finish ENS registrar dapp [#81](https://github.com/MyEtherWallet/MyEtherWallet/pull/81)

### Release v5.0.0.alpha.3

### Feature

- Landing page mobile design [#97](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/97)
- Adds some more inputs for custom network [#86](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/86)
- Add light border to flags [#85](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/85)
- Decompress images on build [#77](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/77)
- Integrate secalot [#76](ttps://github.com/MyEtherWallet/MyEtherWallet/pull/76)
- Additional hardware wallets [#57](https://github.com/MyEtherWallet/MyEtherWallet/pull/57)
- Implement ENS resolver directive, move directives to its own folder [#56](https://github.com/MyEtherWallet/MyEtherWallet/pull/56)
- Intercept and override signTransaction and signMessage to force confirm modal display and approval [#51](https://github.com/MyEtherWallet/MyEtherWallet/pull/51)
- Integrate Ledger hardware wallet [#48](https://github.com/MyEtherWallet/MyEtherWallet/pull/48)
- Feature/verify message [#52](https://github.com/MyEtherWallet/MyEtherWallet/pull/52)
- override web3 methods [#47](https://github.com/MyEtherWallet/MyEtherWallet/pull/47)
- Let users deploy and/or interact with contracts [#45](https://github.com/MyEtherWallet/MyEtherWallet/pull/45)

### UI/UX

- Add Swap confirmation modal [#78](https://github.com/MyEtherWallet/MyEtherWallet/pull/78)
- Add FAQs page [#58](https://github.com/MyEtherWallet/MyEtherWallet/pull/58)
- Add Create Wallet warning page [#46](https://github.com/MyEtherWallet/MyEtherWallet/pull/46)

### Devop

- Add stale integration config [#70](https://github.com/MyEtherWallet/MyEtherWallet/pull/70)
- Refactor network modal and sidemenu [#64](https://github.com/MyEtherWallet/MyEtherWallet/pull/64)
- Cleanup linting error [#54](https://github.com/MyEtherWallet/MyEtherWallet/pull/54)
- Merge all open PRS [#53](https://github.com/MyEtherWallet/MyEtherWallet/pull/53)
- Add Network logo and change dot colors [#49](https://github.com/MyEtherWallet/MyEtherWallet/pull/49)
- Fetch tokens and contract abi [#41](https://github.com/MyEtherWallet/MyEtherWallet/pull/41)

### Release v5.0.0.alpha.2

### Feature

- additional pages [#28](https://github.com/MyEtherWallet/MyEtherWallet/pull/28)
- Adding custom tokens and Adding custom networks [#27](https://github.com/MyEtherWallet/MyEtherWallet/pull/27)

### Devop

- Update footer to match design [#29](https://github.com/MyEtherWallet/MyEtherWallet/pull/29)
- Miscellaneous cleanup and changes. [#22](https://github.com/MyEtherWallet/MyEtherWallet/pull/22)

### Release v5.0.0.alpha.1

### Devop

- Miscellaneous cleanup and changes. [#14](https://github.com/MyEtherWallet/MyEtherWallet/pull/14)
