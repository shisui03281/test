// レンダラープロセス用のスクリプト
document.addEventListener('DOMContentLoaded', () => {
  // バージョン情報を表示
  const versionSpan = document.getElementById('app-version');
  if (versionSpan) {
    // ElectronのcontextBridgeを通じてバージョン情報を取得
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(version => {
        versionSpan.textContent = version;
      });
    } else {
      // フォールバック: 直接表示
      versionSpan.textContent = '1.0.0';
    }
  }
}); 