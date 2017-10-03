import { remote } from 'electron';

const Store = remote.require('electron-store');

export default new Store();
