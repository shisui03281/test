const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
// 'electron-updater'からautoUpdaterをインポート
const { autoUpdater } = require('electron-updater');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// アプリケーションのバージョンを取得
const appVersion = app.getVersion();

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // ウィンドウのタイトルにバージョンを表示
  mainWindow.setTitle(`マイアプリ v${appVersion}`);
  
  // コンソールにもバージョンを出力
  console.log(`アプリケーションのバージョン: ${appVersion}`);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // バージョン情報を取得するIPCハンドラを設定
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  createWindow();

  // アプリ起動時に一度だけ、更新がないかチェック
  autoUpdater.checkForUpdatesAndNotify();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 手動更新チェック用のIPCハンドラ
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
