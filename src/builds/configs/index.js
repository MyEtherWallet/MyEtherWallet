const baseRoutes = require('./base-routes').default;
const getApp = () => {
  // eslint-disable-next-line security/detect-non-literal-require
  return require(`@/builds/web`).app;
};
const getRoutes = () => {
  // eslint-disable-next-line security/detect-non-literal-require
  return require(`@/builds/web`).configRoutes(baseRoutes);
};
const getMode = () => {
  return ROUTER_MODE || 'hash';
};
export { getApp, getMode, getRoutes };
