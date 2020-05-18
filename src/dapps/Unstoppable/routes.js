const Unstoppable = () => import('./Unstoppable');
const InitialUnstoppableStateContainer = () =>
  import('./containers/InitialUnstoppableStateContainer');
const StripeContainer = () => import('./containers/StripeContainer');
const CryptoContainer = () => import('./containers/CryptoContainer');
const ConfirmContainer = () => import('./containers/ConfirmContainer');
const ClaimPendingContainer = () =>
  import('./containers/ClaimPendingContainer');
const CompletedContainer = () => import('./containers/CompletedContainer');
const ManageUnstoppable = () => import('./containers/ManageUnstoppable');
const InitialManageUnstoppableStateContainer = () =>
  import('./containers/InitialManageUnstoppableStateContainer');
const ManageCryptoContainer = () =>
  import('./containers/ManageCryptoContainer');
export default {
  path: 'dapps/unstoppable',
  component: Unstoppable,
  props: true,
  children: [
    {
      path: '',
      name: 'unstoppableInitialState',
      component: InitialUnstoppableStateContainer,
      props: true
    },
    {
      path: 'buy/payment-method/stripe',
      name: 'payWithStripe',
      component: StripeContainer,
      props: true
    },
    {
      path: 'buy/payment-method',
      name: 'payWithCrypto',
      component: CryptoContainer,
      props: true
    },
    {
      path: 'buy/confirm',
      name: 'confirmPayment',
      component: ConfirmContainer,
      props: true
    },
    {
      path: 'claim-pending',
      name: 'claimPending',
      component: ClaimPendingContainer,
      props: true
    },
    {
      path: 'completed',
      name: 'orderComplete',
      component: CompletedContainer,
      props: true
    },
    {
      path: 'manage',
      props: true,
      component: ManageUnstoppable,
      children: [
        {
          path: '',
          name: 'manageInitialState',
          component: InitialManageUnstoppableStateContainer,
          props: true
        },
        {
          path: 'crypto',
          name: 'manageCrypto',
          component: ManageCryptoContainer,
          props: true
        }
      ]
    }
  ]
};
