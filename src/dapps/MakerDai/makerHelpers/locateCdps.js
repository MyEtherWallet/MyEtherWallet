import { toChecksumAddress } from '@/helpers/addressUtils';
import { getCdpIds } from './chainCalls';

async function locateCdps(self) {
  self.cdpsWithoutProxy = [];
  self.cdps = [];
  let cdps = [];
  if (self.proxyAddress) {
    cdps = await getCdpIds(self.web3, self.proxyAddress);
  }

  self.allCdpIds = [...cdps].map(entry =>
    typeof entry !== 'number' ? entry.id : entry
  );

  const cdpIdToTypeMapping = [...cdps].reduce((acc, cur) => {
    acc[cur.id] = cur.ilk;
    return acc;
  }, {});
  self.cdpsWithType = cdpIdToTypeMapping;
  return {
    withType: cdpIdToTypeMapping,
    withProxy: cdps.map(entry =>
      typeof entry !== 'number' ? entry.id : entry
    ),
    withoutProxy: []
  };
}

async function locateOldCdps(self, _cdpService) {
  self.cdpsWithoutProxy = [];
  const cdpsWithoutProxy = await locateCdpsWithoutProxy(self, _cdpService);
  self.cdps = [];
  let cdps = [];
  if (self.proxyAddress) {
    cdps = await locateCdpsProxy(self, _cdpService);
  }

  self.allCdpIds = [...cdpsWithoutProxy, ...cdps].map(entry =>
    typeof entry !== 'number' ? entry.id : entry
  );

  const cdpIdToTypeMapping = [...cdpsWithoutProxy, ...cdps].reduce(
    (acc, cur) => {
      acc[cur.id] = cur.ilk;
      return acc;
    },
    {}
  );
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

export { locateCdps, locateOldCdps, locateCdpsWithoutProxy, locateCdpsProxy };
