import manageENSRoutes from './ManageENS/routes';
import unstoppableRoutes from './Unstoppable/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';
import makerDaiRoutes from './MakerDai/routes';
import makerSaiRoutes from './MakerSai/routes';
import ambrpayRoutes from './Ambrpay/routes';
import aaveRoutes from './Aave/routes';
// import soDapp from './SOTDapps/routes';

const routes = {
  manageENS: manageENSRoutes,
  unstoppable: unstoppableRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes,
  makerDaiRoutes: makerDaiRoutes,
  aaveDLP: aaveRoutes,
  makerSaiRoutes: makerSaiRoutes,
  amberpay: ambrpayRoutes
  // soDapp: soDapp
};

export default routes;
