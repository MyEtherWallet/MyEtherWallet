const baseRoutes = require('./base-routes').default;
const getApp = () => {
  return require(`@/builds/${BUILD_TYPE}`).app;
};
const getRoutes = () => {
  return require(`@/builds/${BUILD_TYPE}`).configRoutes(baseRoutes);
};
const getMode = () => {
  return process.env.ROUTER_MODE || 'hash';
};
export { getApp, getMode, getRoutes };
