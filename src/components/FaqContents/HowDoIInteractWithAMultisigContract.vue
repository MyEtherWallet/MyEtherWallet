<template>
  <div>
    <h5 id="getting-started">Getting Started</h5>
    <ol>
      <li>
        <p>Go to the <a href="https://www.myetherwallet.com/#contracts">Contract tab on MyEtherWallet.com</a>.</p>
      </li>
      <li>
        <p>There should be a Mist Multisig Contract ABI in the dropdown. If not, you can manually use the ABI at the bottom of this page.</p>
      </li>
    </ol>
    <h5 id="do-the-stuff">Do the Stuff</h5>
    <ol>
      <li>First, enter YOUR Contract Address in the <code>Contract Address</code> field at the top.</li>
      <li>Second, you want to <strong>EXECUTE</strong>.
        <ol>
          <li>Select <code>execute</code>from the dropdown.</li>
          <li>Enter the address you want to send to in the <code>_to</code>field.</li>
          <li>Enter the amount you want to send in the <code>_value</code>field.</li>
          <li>Leave the <code>data</code> field empty.</li>
          <li><em>It is recommended that you test with a small amount first!</em></li>
          <li>Unlock the owners address and click <code>WRITE</code> button.</li>
          <li>A pop up will appear. Leave <code>Amount to Send</code> as <code>0</code>.</li>
          <li>Click the <code>Generate Transaction</code> button &amp; confirm &amp; send.</li>
        </ol>
      </li>
      <li>Click the Transaction ID that outputs with the success message. Copy this ID.</li>
      <li>If it's a multisig with TWO owners, you will need to refresh that page and choose <strong>CONFIRM</strong> this time.
        <ol>
          <li>In step 3, you opened the TX ID from the <code>EXECUTE</code>call. You should have a page like this open: <a href="https://etherscan.io/tx/0x0c643a1ae66637217f24791df05071c7849941a1231cf9fa2a0daf145da833e3">https://etherscan.io/tx/0x0c643a1ae66637217f24791df05071c7849941a1231cf9fa2a0daf145da833e3</a></li>
          <li>Click the <code>Event Logs</code>tab.</li>
          <li>On the above link (<a href="https://etherscan.io/tx/0x47e4cc8748e296d9b5d85ebd9bd705177bb1940517b084a2efcca11feeb2391d#eventlog">https://etherscan.io/tx/0x47e4cc87...#eventlog</a> - not YOUR link), the <code>_h</code> field would be <code>9228aeaf3ed560274899483646ea4ce9b322bccffac60cac2d035d08752617f4</code></li>
          <li>Look at the above link and see where it says <code>9228a....</code>. Look at your link and see what YOUR <code>_h</code> is. Copy it.</li>
          <li>Go back to MyEtherWallet where you have the CONFIRM open and paste that hash into the <code>_h</code> field.</li>
          <li>Click the <code>"WRITE"</code> button again and unlock the second owner's account.</li>
          <li>Generate &amp; send the transaction.</li>
        </ol>
      </li>
      <li>Make sure everything went as intended.</li>
      <li>IF your multisig is a 3 of 5 multisig, you will repeat the confirm process for each owner until it reaches the necessary approvals. Luckily, the <code>_h</code>value is the same for each of them.</li>
      <li>See another approval for my previous example here: <a href="https://etherscan.io/tx/0x47e4cc8748e296d9b5d85ebd9bd705177bb1940517b084a2efcca11feeb2391d#eventlog">https://etherscan.io/tx/0x47e4cc8748e296d9b5d85ebd9bd705177bb1940517b084a2efcca11feeb2391d#eventlog</a></li>
      <li>You can then repeat this process whenever you want to send ETH.</li>
    </ol>
    <h5 id="mist-ethereum-wallet-s-multisig-contract-abi">Mist / Ethereum Wallet's Multisig Contract ABI</h5>
    <p><code>[{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"removeOwner","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"isOwner","outputs":[{"name":","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"m_numOwners","outputs":[{"name":","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"m_lastDay","outputs":[{"name":","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"resetSpentToday","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"m_spentToday","outputs":[{"name":","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"addOwner","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"m_required","outputs":[{"name":","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_h","type":"bytes32"}],"name":"confirm","outputs":[{"name":","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_newLimit","type":"uint256"}],"name":"setDailyLimit","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"execute","outputs":[{"name":"_r","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"_operation","type":"bytes32"}],"name":"revoke","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_newRequired","type":"uint256"}],"name":"changeRequirement","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_operation","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"hasConfirmed","outputs":[{"name":","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"}],"name":"changeOwner","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"m_dailyLimit","outputs":[{"name":","type":"uint256"}],"type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"},{"name":"_daylimit","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"operation","type":"bytes32"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"operation","type":"bytes32"}],"name":"Revoke","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldOwner","type":"address"}],"name":"OwnerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newRequirement","type":"uint256"}],"name":"RequirementChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"data","type":"bytes"}],"name":"SingleTransact","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"operation","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"data","type":"bytes"}],"name":"MultiTransact","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"operation","type":"bytes32"},{"indexed":false,"name":"initiator","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"data","type":"bytes"}],"name":"ConfirmationNeeded","type":"event"}]</code></p>
    <h5 id="you-can-also-copy-the-above-from-here-">You can also copy the above from here:</h5>
    <p><a href="https://www.reddit.com/r/ethereum/comments/5nev1a/help_needed_how_to_find_multisig_contract_wallet/">https://www.reddit.com/r/ethereum/comments/5nev1a/help_needed_how_to_find_multisig_contract_wallet/</a>*</p>

  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'FaqContents.scss';
</style>
