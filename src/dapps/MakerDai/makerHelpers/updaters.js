
export async function doUpdate(self, Toast) {
  self.proxyAddress = await self.getProxy();
  let afterClose = false;
  const afterOpen = self.$route.name === 'create';
  await self.updateActiveCdp();
  for (const idProp in self.activeCdps) {
    console.log('idProp', idProp); // todo remove dev item
    console.log('self.activeCdps[idProp] 1', self.activeCdps[idProp]); // todo remove dev item
    console.log('Object.keys(self.activeCdps)', Object.keys(self.activeCdps)); // todo remove dev item
    if (self.activeCdps[idProp].needsUpdate) {
      console.log('self.activeCdps[idProp] 2', self.activeCdps[idProp]); // todo remove dev item

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

  await self.checkBalances();
  await self.checkAllowances();

  if (!Object.keys(self.activeCdps).includes(self.currentCdpId)) {
    await self.loadCdpDetails();
    await self.setupCdpManageFunc(self.currentCdpId);
  } else {
    await self.setupCdpManageFunc(self.currentCdpId);
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
