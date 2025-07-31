// レンダラープロセス用のスクリプト
document.addEventListener('DOMContentLoaded', () => {
  const versionSpan = document.getElementById('app-version');
  if (versionSpan && window.electronAPI) {
    window.electronAPI.getAppVersion().then(version => {
      versionSpan.textContent = version;
    }).catch(error => {
      console.error('バージョン情報の取得に失敗しました:', error);
      versionSpan.textContent = '取得エラー';
    });
  }
}); 