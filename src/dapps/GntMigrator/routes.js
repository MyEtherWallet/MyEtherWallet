const LendMigrator = () => import('./GntMigrator');

export default {
  path: 'dapps/gnt-migrator',
  name: 'GNT Migrator',
  component: LendMigrator,
  props: true
};
