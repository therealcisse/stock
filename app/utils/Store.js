import { remote } from 'electron';

const Store = remote
  ? remote.require('electron-store')
  : require('electron-store');

export default new Store();
