import ScheduleTransaction from './ScheduleTransaction';
import ScheduledSuccess from './components/ScheduledSuccess';
import ScheduleView from './containers/ScheduleView';

export default {
  path: 'dapps/schedule-transaction',
  name: 'Schedule Transaction',
  component: ScheduleTransaction,
  props: true,
  children: [
    {
      path: '',
      name: 'Schedule View',
      component: ScheduleView,
      props: true
    },
    {
      path: 'scheduled',
      name: 'Scheduled success',
      component: ScheduledSuccess,
      props: true
    }
  ]
};
