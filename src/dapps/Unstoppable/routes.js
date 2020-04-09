const Unstoppable = () => import('./Unstoppable');
const InitialUnstoppableStateContainer = () =>
  import('./containers/InitialUnstoppableStateContainer');
const StripeContainer = () => import('./containers/StripeContainer');
const CryptoContainer = () => import('./containers/CryptoContainer');
const ConfirmContainer = () => import('./containers/ConfirmContainer');
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
    {
      path: 'buy/payment-method/stripe',
      name: 'Pay with Stripe',
      component: StripeContainer,
      props: true
    },
    {
      path: 'buy/payment-method',
      name: 'Pay with Crypto',
      component: CryptoContainer,
      props: true
    },
    {
      path: 'buy/confirm',
      name: 'Confirm payment',
      component: ConfirmContainer,
      props: true
    },
    {
      path: 'claim-pending',
      name: 'Claim pending',
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
