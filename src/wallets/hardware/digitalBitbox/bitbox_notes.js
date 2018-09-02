/* eslint-disable */
let uiFuncs = {}
uiFuncs.signTxDigitalBitbox(eTx, rawTx, txData, callback);
uiFuncs.signTxDigitalBitbox = function(eTx, rawTx, txData, callback) {
  var localCallback = function(result, error) {
    if (typeof error != "undefined") {
      error = error.errorCode ? u2f.getErrorByCode(error.errorCode) : error;
      if (callback !== undefined) callback({
        isError: true,
        error: error
      });
      return;
    }
    uiFuncs.notifier.info("The transaction was signed but not sent. Click the blue 'Send Transaction' button to continue.");
    rawTx.v = ethFuncs.sanitizeHex(result['v']);
    rawTx.r = ethFuncs.sanitizeHex(result['r']);
    rawTx.s = ethFuncs.sanitizeHex(result['s']);
    var eTx_ = new ethUtil.Tx(rawTx);
    rawTx.rawTx = JSON.stringify(rawTx);
    rawTx.signedTx = ethFuncs.sanitizeHex(eTx_.serialize().toString('hex'));
    rawTx.isError = false;
    if (callback !== undefined) callback(rawTx);
  }
  uiFuncs.notifier.info("Touch the LED for 3 seconds to sign the transaction. Or tap the LED to cancel.");
  var app = new DigitalBitboxEth(txData.hwTransport, '');
  app.signTransaction(txData.path, eTx, localCallback);
}

let $scope = {}
$scope.setHDAddressesHWWallet = function(start, limit, ledger) {
  $scope.HDWallet.wallets = [];
  for (var i = start; i < start + limit; i++) {
    var derivedKey = $scope.HDWallet.hdk.derive("m/" + i);

      $scope.HDWallet.wallets.push(new Wallet(undefined, derivedKey.publicKey, $scope.HDWallet.dPath + "/" + i, $scope.walletType, $scope.digitalBitbox));
    $scope.HDWallet.wallets[$scope.HDWallet.wallets.length - 1].type = "addressOnly";
    $scope.HDWallet.wallets[$scope.HDWallet.wallets.length - 1].setBalance(false);
  }
  $scope.HDWallet.id = 0;
  $scope.HDWallet.numWallets = start + limit;
}

$scope.digitalBitboxCallback = function(result, error) {
  $scope.HDWallet.digitalBitboxSecret = '';
  if (typeof result != "undefined") {
    $scope.HWWalletCreate(result['publicKey'], result['chainCode'], "digitalBitbox", $scope.HDWallet.dPath);
  } else
    $scope.notifier.danger(error);
}

$scope.scanDigitalBitbox = function() {
  $scope.digitalBitbox = new DigitalBitboxUsb();
  var app = new DigitalBitboxEth($scope.digitalBitbox, $scope.HDWallet.digitalBitboxSecret);
  var path = $scope.HDWallet.dPath;
  app.getAddress(path, $scope.digitalBitboxCallback);
};
