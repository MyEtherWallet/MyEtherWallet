import GenerateInfo from './components/GenerateInfo';
import GenerateTx from './components/GenerateTx';
import SendTx from './components/SendTx';

export default {
  children: [
    {
      path: '',
      name: 'Send Offline',
      component: GenerateInfo,
      props: true
    },
    {
      path: 'generate-info',
      name: 'Offline Generate Information',
      component: GenerateInfo,
      props: true
    },
    {
      path: 'generate-tx',
      name: 'Offline Generate Transaction',
      component: GenerateTx,
      props: true
    },
    {
      path: 'send-tx',
      name: 'Offline Send Transaction',
      component: SendTx,
      props: true
    }
  ]
};
