

maxDai() {
  if (
    this.ethPrice &&
    this.ethCollateral &&
    this.liquidationRatio &&
    this.debtValue
  ) {
    return maxDai(
      this.ethPrice,
      this.ethCollateral,
      this.liquidationRatio.plus(0.001),
      this.debtValue
    );
  }
  return toBigNumber(0);
}

maxEthDraw() {
  if (this.ethPrice && this.debtValue && this.liquidationRatio) {
    if (this.zeroDebt) {
      return maxEthDraw(
        this.ethCollateral,
        this.liquidationRatio,
        this.debtValue,
        this.ethPrice,
        this.minEth.times(0)
      );
    }
    return maxEthDraw(
      this.ethCollateral,
      this.liquidationRatio,
      this.debtValue,
      this.ethPrice
    );
  }
  return toBigNumber(0);
}

maxPethDraw() {
  if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
    if (this.zeroDebt) {
      return maxPethDraw(
        this.pethCollateral,
        this.liquidationRatio,
        this.debtValue,
        this.pethPrice,
        this.pethMin.times(0)
      );
    }
    return maxPethDraw(
      this.pethCollateral,
      this.liquidationRatio,
      this.debtValue,
      this.pethPrice
    );
  }
  return toBigNumber(0);
}

maxUsdDraw() {
  if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
    return this.toUSD(this.maxEthDraw);
  }
  return toBigNumber(0);
}