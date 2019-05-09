const ManageENS = () => import('./ManageENS');
const EnsBidContainer = () => import('./containers/EnsBidContainer');
const InitialENSStateContainer = () =>
  import('./containers/InitialENSStateContainer');
const NameForbiddenENSContainer = () =>
  import('./containers/NameForbiddenENSContainer');
const AlreadyOwnedENSContainer = () =>
  import('./containers/AlreadyOwnedENSContainer');
const FinalizeContainer = () => import('./containers/FinalizeContainer');
const ManageENSContainer = () => import('./containers/ManageENSContainer');
const FifsBuyContainer = () => import('./containers/FifsBuyContainer');
const ClaimDNSContainer = () => import('./containers/ClaimDNSContainer');
const DNSProcessErrorContainer = () =>
  import('./containers/DNSProcessErrorContainer');
const DNSMissingTXTContainer = () =>
  import('./containers/DNSMissingTXTContainer');
const TransferRegistrarsContainer = () =>
  import('./containers/TransferRegistrarsContainer');
const CreateCommitmentContainer = () =>
  import('./containers/CreateCommitmentContainer');
const PermanentRegistrationContainer = () =>
  import('./containers/PermanentRegistrationContainer');
const RegistrationInProgressContainer = () =>
  import('./containers/RegistrationInProgressContainer');

export default {
  path: 'dapps/manage-ens',
  component: ManageENS,
  props: true,
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      name: 'ENS initial state',
      component: InitialENSStateContainer,
      props: true
    },
    {
      path: 'auction',
      name: 'Bid on ENS and start auction',
      component: EnsBidContainer,
      props: true
    },
    {
      path: 'bid',
      name: 'Bid on ENS',
      component: EnsBidContainer,
      props: true
    },
    {
      path: 'owned',
      name: 'ENS owned',
      component: AlreadyOwnedENSContainer,
      props: true
    },
    {
      path: 'reveal',
      name: 'Reveal ENS bid',
      component: EnsBidContainer,
      props: true
    },
    {
      path: 'forbidden',
      name: 'ENS forbidden',
      component: NameForbiddenENSContainer,
      props: true
    },
    {
      path: 'finalize',
      name: 'ENS finalize',
      component: FinalizeContainer,
      props: true
    },
    {
      path: 'manage',
      name: 'Manage ENS',
      component: ManageENSContainer,
      props: true
    },
    {
      path: 'fifs',
      name: 'Reserve on FIFS',
      component: FifsBuyContainer,
      props: true
    },
    {
      path: 'claim',
      name: 'Claim DNS',
      component: ClaimDNSContainer,
      props: true
    },
    {
      path: 'dns-error',
      name: 'DNS Process error',
      component: DNSProcessErrorContainer,
      props: true
    },
    {
      path: 'no-txt-setup',
      name: 'No TXT setup for DNS',
      component: DNSMissingTXTContainer,
      props: true
    },
    {
      path: 'transfer-registrar',
      name: 'Transfer ENS Registrar',
      component: TransferRegistrarsContainer,
      props: true
    },
    {
      path: 'create-commitment',
      name: 'Create Commitment',
      component: CreateCommitmentContainer,
      props: true
    },
    {
      path: 'permanent-registration',
      name: 'Register ENS By Duration',
      component: PermanentRegistrationContainer,
      props: true
    },
    {
      path: 'registration-in-progress',
      name: 'ENS Registration in progress',
      component: RegistrationInProgressContainer,
      props: true
    }
  ]
};
