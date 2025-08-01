const { app, BrowserWindow, ipcMain, dialog } = require('electron'); // dialog を追加
const path = require('node:path');
// 'electron-updater'からautoUpdaterをインポート
const { autoUpdater } = require('electron-updater');

// electron-updaterのログ設定
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// アプリケーションのバージョンを取得
const appVersion = app.getVersion();

let mainWindow; // mainWindowをグローバルスコープで定義

// 画面に更新ステータスを送信する関数
function sendStatusToWindow(text) {
  if (mainWindow) {
    mainWindow.webContents.send('update-status', text);
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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

  // --- autoUpdaterのイベントリスナーをここに追加 ---
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('更新を確認しています...');
  });
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow(`新しいバージョン ${info.version} が見つかりました。ダウンロードを開始します。`);
  });
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('現在、利用可能な新しいバージョンはありません。');
  });
  autoUpdater.on('error', (err) => {
    sendStatusToWindow(`エラーが発生しました: ${err.message}`);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = `ダウンロード速度: ${Math.round(progressObj.bytesPerSecond / 1024)} KB/s`;
    log_message = log_message + ` - ダウンロード済み ${Math.round(progressObj.percent)}%`;
    sendStatusToWindow(log_message);
  });
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('アップデートのダウンロードが完了しました。再起動してインストールします。');
    // ダイアログを表示してユーザーに再起動を促す
    dialog.showMessageBox({
      type: 'info',
      title: 'アップデートの準備完了',
      message: '新しいバージョンをインストールする準備ができました。アプリケーションを再起動しますか？',
      buttons: ['再起動', '後で']
    }).then(buttonIndex => {
      if (buttonIndex.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
  // --- ここまで ---

  // 起動時に更新をチェック
  autoUpdater.checkForUpdatesAndNotify();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 手動更新チェック用のIPCハンドラも更新をチェックするように変更
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates(); // .checkForUpdatesAndNotify()から変更
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
