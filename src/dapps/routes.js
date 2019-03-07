import registerDomainRoutes from './RegisterDomain/routes';
import buySubDomainRoutes from './BuySubdomain/routes';
import secureTransactionRoutes from './SecureTransaction/routes';

const routes = {
  secureTransaction: secureTransactionRoutes,
  registerDomain: registerDomainRoutes,
  buySubDomain: buySubDomainRoutes
};

export default routes;
