/*
export async function doUpdate(self, Toast) {
  self.proxyAddress = await self.getProxy();
  let afterClose = false;
  const afterOpen = self.$route.name === 'create';
  await self.updateActiveCdp();
  await self.checkBalances();
  await self.checkAllowances();
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
        // console.log('regular value changed update'); // todo remove dev item
        self.activeCdps[idProp] = await self.activeCdps[idProp].update();
        self.activeCdps[idProp].updateSystemVariables({

        })
      }
    }
    if (idProp === self.currentCdpId) {
      await self.currentCdp.update();
      await self.setupCdpManage(self.currentCdpId);
    }
  }


  if (
    Object.keys(self.activeCdps).includes(self.currentCdpId.toString()) ||
    Object.keys(self.activeCdps).includes(self.currentCdpId)
  ) {
    await self.setupCdpManageFunc(self.currentCdpId);
  } else {
    // console.log('creating'); // todo remove dev item
    await self.loadCdpDetails(); //todo: see if disableing this breaks anything (likely would happen with creation)
    // todo: thie line above is where things were getting erased (new instances are being created)
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
*/
