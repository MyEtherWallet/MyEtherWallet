import registerDomainRoutes from './RegisterDomain/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import secureTransactionRoutes from './SecureTransaction/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';

const routes = {
  secureTransaction: secureTransactionRoutes,
  registerDomain: registerDomainRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes
};

export default routes;
