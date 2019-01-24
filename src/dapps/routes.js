import registerDomainRoutes from './RegisterDomain/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';

const routes = {
  registerDomain: registerDomainRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes
};

export default routes;
