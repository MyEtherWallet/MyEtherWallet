import manageENSRoutes from './ManageENS/routes';
import unstoppableRoutes from './Unstoppable/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';
import makerDaiRoutes from './MakerDai/routes';
import ambrpayRoutes from './Ambrpay/routes';
import aaveRoutes from './Aave/routes';

const routes = {
  manageENS: manageENSRoutes,
  unstoppable: unstoppableRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes,
  makerDaiRoutes: makerDaiRoutes,
  aaveDLP: aaveRoutes,
  amberpay: ambrpayRoutes
};

export default routes;
