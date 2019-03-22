import manageENSRoutes from './ManageENS/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import secureTransactionRoutes from './SecureTransaction/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';

const routes = {
  secureTransaction: secureTransactionRoutes,
  manageENS: manageENSRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes
};

export default routes;
