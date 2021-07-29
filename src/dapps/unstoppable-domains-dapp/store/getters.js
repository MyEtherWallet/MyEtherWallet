const domain = function (state) {
  return state.currentDomain;
};
const domainName = function (state) {
  return state.currentDomain.name;
};
const domainPrice = function (state) {
  return state.currentDomain.price;
};
const email = function (state) {
  return state.email;
};
const order = function (state) {
  return state.order;
};
const baseUrl = function (state) {
  return state.udBaseUrl;
};
const resellerId = function (state) {
  return state.resellerId;
};
const myDomains = function (state) {
  return state.myDomains;
};
const managedDomain = function (state) {
  return state.manageRecordDomain;
};
const resolution = function (state) {
  return state.resolution;
};
const activeOverlay = function (state) {
  return state.activeOverlay;
};

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
