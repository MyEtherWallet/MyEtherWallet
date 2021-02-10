import state from '@/store/global/state';

export default class Settings() {
  constructor() {
    this.exportSettings = state;
  }
}
