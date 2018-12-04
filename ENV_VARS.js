const ROUTER_MODE = process.env.ROUTER_MODE || 'hash';
const ROOT_URL = process.env.ROUTER_MODE == 'hash' ? '#' : '';
module.exports = {
  ROUTER_MODE: JSON.stringify(ROUTER_MODE),
  ROOT_URL: JSON.stringify(ROOT_URL),
  BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE || 'web')
};
