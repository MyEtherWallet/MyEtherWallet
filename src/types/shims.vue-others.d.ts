import * as filters from '@/utils/filters';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: filters;
  }
}