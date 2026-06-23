const { contextBridge, shell } = require('electron');

console.log('⚡ Muthuwadige Hardware ERP Preload initialized.');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => {
    try {
      return shell.openExternal(url);
    } catch (e) {
      console.warn('Failed to open external URL via shell, falling back to window.open', e);
      return null;
    }
  }
});
