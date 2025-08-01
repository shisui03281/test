// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // 既存のgetAppVersionはそのまま
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // 手動更新チェック用の関数を追加
  checkForUpdates: () => ipcRenderer.send('check-for-updates')
});
