const hasValidDecimals = function (amountStr, numDecimals) {
  const decimals = amountStr.split('.')[1];
  if (!decimals) return true;
  return decimals.length <= numDecimals;
};

export default hasValidDecimals;
