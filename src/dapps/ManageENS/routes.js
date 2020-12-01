const ManageENS = () => import('./ManageENS');
const InitialENSStateContainer = () =>
  import('./containers/InitialENSStateContainer');
const AlreadyOwnedENSContainer = () =>
  import('./containers/AlreadyOwnedENSContainer');
const ManageENSContainer = () => import('./containers/ManageENSContainer');
const FifsBuyContainer = () => import('./containers/FifsBuyContainer');
const ClaimDNSContainer = () => import('./containers/ClaimDNSContainer');
const DNSProcessErrorContainer = () =>
  import('./containers/DNSProcessErrorContainer');
const DNSMissingTXTContainer = () =>
  import('./containers/DNSMissingTXTContainer');
const CreateCommitmentContainer = () =>
  import('./containers/CreateCommitmentContainer');
const PermanentRegistrationContainer = () =>
  import('./containers/PermanentRegistrationContainer');
const RegistrationInProgressContainer = () =>
  import('./containers/RegistrationInProgressContainer');
const EnsMultiManager = () => import('./containers/EnsMultiManager');

export default {
  path: 'dapps/manage-ens',
  component: ManageENS,
  props: true,
  children: [
    {
      path: '',
      name: 'ensInitialState',
      component: InitialENSStateContainer,
      props: true
    },
    {
      path: 'owned',
      name: 'ensNameOwned',
      component: AlreadyOwnedENSContainer,
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
      name: 'fifsReserve',
      component: FifsBuyContainer,
      props: true
    },
    {
      path: 'claim',
      name: 'dnsClaim',
      component: ClaimDNSContainer,
      props: true
    },
    {
      path: 'dns-error',
      name: 'dnsError',
      component: DNSProcessErrorContainer,
      props: true
    },
    {
      path: 'no-txt-setup',
      name: 'dnsNoTxt',
      component: DNSMissingTXTContainer,
      props: true
    },
    {
      path: 'create-commitment',
      name: 'ensCreateCommitment',
      component: CreateCommitmentContainer,
      props: true
    },
    {
      path: 'renew',
      name: 'ensRenewName',
      component: CreateCommitmentContainer,
      props: true
    },
    {
      path: 'permanent-registration',
      name: 'ensPermRegistration',
      component: PermanentRegistrationContainer,
      props: true
    },
    {
      path: 'registration-in-progress',
      name: 'ensPermRegistrationOngoing',
      component: RegistrationInProgressContainer,
      props: true
    },
    {
      path: 'manager',
      name: 'ensMultiManager',
      component: EnsMultiManager,
      props: true
    }
  ]
};
