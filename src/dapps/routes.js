import manageENSRoutes from './ManageENS/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';
import secureTransactionRoutes from './SecureTransaction/routes';
import makerDaiRoutes from './MakerDai/routes';

const routes = {
  secureTransaction: secureTransactionRoutes,
  manageENS: manageENSRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes,
  makerDaiRoutes: makerDaiRoutes
};

export default routes;
