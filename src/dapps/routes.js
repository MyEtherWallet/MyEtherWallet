import manageENSRoutes from './ManageENS/routes';
import unstoppableRoutes from './Unstoppable/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import scheduleTransactionRoutes from './ScheduleTransaction/routes';
import makerDaiRoutes from './MakerDai/routes';
import ambrpayRoutes from './Ambrpay/routes';
import aaveRoutes from './Aave/routes';
import lendMigratorRoutes from './LendMigrator/routes';
import gntMigratorRoutes from './GntMigrator/routes';

const routes = {
  manageENS: manageENSRoutes,
  unstoppable: unstoppableRoutes,
  buySubDomain: buySubDomainRoutes,
  scheduleTransaction: scheduleTransactionRoutes,
  makerDaiRoutes: makerDaiRoutes,
  aaveDLP: aaveRoutes,
  amberpay: ambrpayRoutes,
  lendMigrator: lendMigratorRoutes,
  gntMigratorRoutes: gntMigratorRoutes
};

export default routes;
