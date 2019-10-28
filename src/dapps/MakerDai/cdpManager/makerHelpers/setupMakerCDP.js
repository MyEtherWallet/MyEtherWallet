import { locateCdps } from '@/dapps/MakerDai/cdpManager/makerHelpers/index';

export async function setupCdpManage(self, cdpId) {
  if (!self.allCdpIds.includes(cdpId) && self.allCdpIds.length > 0) {
    cdpId = self.allCdpIds[0];
  }
  if (self.allCdpIds.length === 0) {
    self.activeValues = self.systemValues;
  } else {
    self.currentCdpId = cdpId;
    self.activeValues = await getValuesForManage.bind(self)(cdpId);
  }
}

export async function getValuesForManage(cdpId) {
  console.log(this.activeCdps); // todo remove dev item
  const currentCdp = this.activeCdps[cdpId];
  this.currentCdp = currentCdp;
  const toPeth = this.toPeth;
  const systemValues = this.systemValues;
  return {
    ...systemValues,
    cdpId: cdpId,
    maxPethDraw: currentCdp.maxPethDraw,
    maxEthDraw: currentCdp.maxEthDraw,
    maxUsdDraw: currentCdp.maxUsdDraw,
    ethCollateral: currentCdp.ethCollateral,
    pethCollateral: currentCdp.pethCollateral,
    usdCollateral: currentCdp.usdCollateral,
    debtValue: currentCdp.debtValue,
    maxDai: currentCdp.maxDai,
    collateralRatio: currentCdp.collatRatio,
    liquidationPrice: currentCdp.liquidationPrice,
    minEth: currentCdp.minEth,
    isSafe: false,
    governanceFeeOwed: currentCdp.governanceFeeOwed,
    ethCollateralNum: currentCdp.ethCollateralNum,
    toPeth: toPeth,
    proxyAllowances: this.proxyAllowances,
    zeroDebt: currentCdp.zeroDebt
  };
}

export async function updateActiveCdp(self) {
  const currentCdpIds = Object.keys(self.activeCdps);
  await locateCdps(self, self._cdpService);

  const newCdps = self.cdps.filter(
    item => !Object.keys(self.activeCdps).includes(item.toString())
  );

  const newCdpsWithoutProxy = self.cdpsWithoutProxy.filter(
    item => !Object.keys(self.activeCdps).includes(item.toString())
  );

  const removedCdps = currentCdpIds.filter(
    item =>
      !(
        self.cdps.includes(item.toString()) ||
        self.cdpsWithoutProxy.includes(item.toString())
      )
  );

  if (removedCdps.length > 0) {
    removedCdps.forEach(item => delete self.activeCdps[item]);
  }

  if (newCdps.length > 0) {
    for (let i = 0; i < newCdps.length; i++) {
      this.activeCdps[newCdps[i]] = await self.buildCdpObject(newCdps[i]);
    }
  }

  if (newCdpsWithoutProxy.length > 0) {
    for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
      this.activeCdps[newCdpsWithoutProxy[i]] = await self.buildCdpObject(
        newCdpsWithoutProxy[i],
        {
          noProxy: true
        }
      );
    }
  }

  // if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
  //   this.gotoCreate();
  // }
}