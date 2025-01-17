import * as GlobFilters from '@/utils/filters';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: GlobFilters;
  }
}

export { };