import manageENSRoutes from './ManageENS/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';
import makerDaiRoutes from './MakerDai/routes';
import ambrpayRoutes from './Ambrpay/routes';
import aaveRoutes from './Aave/routes';

const routes = {
  manageENS: manageENSRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes,
  makerDaiRoutes: makerDaiRoutes,
  amberpay: ambrpayRoutes,
  aaveDLP: aaveRoutes
};

export default routes;
