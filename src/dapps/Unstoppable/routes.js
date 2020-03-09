const Unstoppable = () => import('./Unstoppable');
const InitialUnstoppableStateContainer = () =>
  import('./containers/InitialUnstoppableStateContainer');
const BuyContainer = () => import('./containers/BuyContainer');
const PaymentMethodContainer = () =>
  import('./containers/PaymentMethodContainer');
const StripeContainer = () => import('./containers/StripeContainer');
const CryptoContainer = () => import('./containers/CryptoContainer');
const ClaimPendingContainer = () =>
  import('./containers/ClaimPendingContainer');
const CompletedContainer = () => import('./containers/CompletedContainer');

export default {
  path: 'dapps/unstoppable',
  component: Unstoppable,
  props: true,
  children: [
    {
      path: '',
      name: 'Unstoppable initial state',
      component: InitialUnstoppableStateContainer,
      props: true
    },
    { path: 'buy', name: 'Buy domain', component: BuyContainer, props: true },
    {
      path: 'buy/payment-method',
      name: 'Select payment method',
      component: PaymentMethodContainer,
      props: true
    },
    {
      path: 'buy/stripe',
      name: 'Pay with Stripe',
      component: StripeContainer,
      props: true
    },
    {
      path: 'buy/payment-method/crypto',
      name: 'Pay with Crypto',
      component: CryptoContainer,
      props: true
    },
    {
      path: 'claim-pending',
      name: 'Claim Pending',
      component: ClaimPendingContainer,
      props: true
    },
    {
      path: 'completed',
      name: 'Order Completed',
      component: CompletedContainer,
      props: true
    }
  ]
};
