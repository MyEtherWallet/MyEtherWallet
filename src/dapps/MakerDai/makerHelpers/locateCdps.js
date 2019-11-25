import { toChecksumAddress } from '@/helpers/addressUtils';
import { getCdpIds } from './chainCalls';
import { GetCdps } from './ABIs';
import addresses from '@/dapps/MakerDai/makerHelpers/addresses';

async function locateCdps(self, _cdpService) {
  self.cdpsWithoutProxy = [];
  const cdpsWithoutProxy = await locateCdpsWithoutProxy(self, _cdpService);
  self.cdps = [];
  // const cdps = await locateCdpsProxy(self, _cdpService);
  const cdpsDirect = await locateCdpsDirectly(self);

  const cdps = await getCdpIds(self.web3, self.proxyAddress); //result.ids.map(item => parseInt(item));

  self.allCdpIds = [...cdpsWithoutProxy, ...cdps, ...cdpsDirect].map(entry =>
    typeof entry !== 'number' ? entry.id : entry
  );

  const cdpIdToTypeMapping = [
    ...cdpsWithoutProxy,
    ...cdps,
    ...cdpsDirect
  ].reduce((acc, cur) => {
    acc[cur.id] = cur.ilk;
    return acc;
  }, {});
  self.cdpsWithType = cdpIdToTypeMapping;
  return {
    withType: cdpIdToTypeMapping,
    withProxy: cdps.map(entry =>
      typeof entry !== 'number' ? entry.id : entry
    ),
    withoutProxy: cdpsWithoutProxy.map(entry =>
      typeof entry !== 'number' ? entry.id : entry
    )
  };
}

async function getMcdCdp() {}

async function locateCdpsWithoutProxy(self, _cdpService) {
  const directCdps = await _cdpService.getCdpIds(self.account.address);
  const directCdpsCheckSum = await _cdpService.getCdpIds(
    toChecksumAddress(self.account.address)
  );
  return directCdps.concat(directCdpsCheckSum);
}

async function locateCdpsProxy(self, _cdpService) {
  self.proxyAddress = await self.getProxy();
  return await _cdpService.getCdpIds(self.proxyAddress);
}

async function locateCdpsDirectly(self) {
  const proxy = await self.getProxy();
  const contract = new self.web3.eth.Contract(GetCdps, addresses.GET_CDPS);
  const results = await contract.methods
    .getCdpsAsc(addresses.CDP_MANAGER, proxy)
    .call();
  return results.ids;
}

export { locateCdps, getMcdCdp, locateCdpsWithoutProxy, locateCdpsProxy };
