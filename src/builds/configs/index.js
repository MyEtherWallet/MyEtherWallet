import * as WEB_APP from '@/builds/web';
import * as MEWCX_APP from '@/builds/chrome-extension';

import baseRoutes from './base-routes';

let App = null;
const buildType = process.env.BUILD_TYPE;
switch (buildType) {
  case 'WEB' || 'web':
    App = WEB_APP;
    break;
  case 'MEWCX' || 'MEWCX':
    App = MEWCX_APP;
    break;
  default:
    App = WEB_APP;
}
const routerConfig = {
  mode: process.env.ROUTER_MODE || 'hash',
  routes: App.configRoutes(baseRoutes),
  app: App.app
};
export { routerConfig };
