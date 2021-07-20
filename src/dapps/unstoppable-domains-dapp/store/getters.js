const domain = state => state.currentDomain;
const domainName = state => state.currentDomain.name;
const domainPrice = state => state.currentDomain.price;
const email = state => state.email;
const order = state => state.order;
const baseUrl = state => state.udBaseUrl;
const resellerId = state => state.resellerId;
const myDomains = state => state.myDomains;
const managedDomain = state => state.manageRecordDomain;
const resolution = state => state.resolution;
const activeOverlay = state => state.activeOverlay;

export default {
  domain,
  domainName,
  domainPrice,
  email,
  order,
  baseUrl,
  resellerId,
  myDomains,
  managedDomain,
  resolution,
  activeOverlay
};
