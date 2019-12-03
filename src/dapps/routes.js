import manageENSRoutes from './ManageENS/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';
import makerDaiRoutes from './MakerDai/routes';
import makerSaiRoutes from './MakerSai/routes';
import ambrpayRoutes from './Ambrpay/routes';

const routes = {
  manageENS: manageENSRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes,
  makerDaiRoutes: makerDaiRoutes,
  makerSaiRoutes: makerSaiRoutes,
  amberpay: ambrpayRoutes
};

export default routes;
