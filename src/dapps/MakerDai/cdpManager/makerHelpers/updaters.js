export async function doUpdate(self) {
  self.proxyAddress = await self.getProxy();
  let afterClose = false;
  const afterOpen = self.$route.name === 'create';
  await self.updateActiveCdp();
  for (const idProp in self.activeCdps) {
    if (self.activeCdps[idProp].needsUpdate) {
      if (self.activeCdps[idProp].closing) {
        afterClose = true;
        delete self.activeCdps[idProp];
        self.cdps = self.cdps.filter(item => item !== idProp);
        self.cdpsWithoutProxy = self.cdpsWithoutProxy.filter(
          item => item !== idProp
        );
      } else if (self.activeCdps[idProp].opening) {
        await self.activeCdps[idProp].updateValues();
      } else {
        self.activeCdps[idProp] = await self.activeCdps[idProp].update();
      }
    }
    if (idProp === self.currentCdpId) {
      await self.currentCdp.update();
      await self.setupCdpManage(self.currentCdpId);
    }
  }

  self.daiBalance = (await self.daiToken.balance()).toBigNumber();
  self.mkrBalance = (await self.mkrToken.balance()).toBigNumber();
  await self.checkAllowances();

  if (!Object.keys(self.activeCdps).includes(self.currentCdpId)) {
    await self.loadCdpDetails();
    await self.setupCdpManage(self.currentCdpId);
  } else {
    await self.setupCdpManage(self.currentCdpId);
  }

  const runAfterUpdate = () => {
    if (self.afterUpdate.length > 0) {
      const fn = self.afterUpdate.pop();
      fn();
      runAfterUpdate();
    }
  };
  runAfterUpdate();
  if (afterClose || afterOpen || self.creatingCdp) {
    if (self.cdps.length > 0 || self.cdpsWithoutProxy.length > 0) {
      self.goToManage();
    } else {
      self.gotoCreate();
    }
  }
  if (self.creatingCdp) {
    self.creatingCdp = false;
    await self.updateActiveCdp();
    Toast.responseHandler('CDP Created', Toast.INFO);
  } else {
    self.valuesUpdated++;
    Toast.responseHandler('CDP Updated', Toast.INFO);
  }
}
