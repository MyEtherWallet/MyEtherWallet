import registerDomainRoutes from './RegisterDomain/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import secureTransactionRoutes from './SecureTransaction/routes';
import ens from './Ens/routes';

const routes = {
  secureTransaction: secureTransactionRoutes,
  registerDomain: registerDomainRoutes,
  ens: ens,
  buySubDomain: buySubDomainRoutes
};

export default routes;
