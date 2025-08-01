// レンダラープロセス用のスクリプト
document.addEventListener('DOMContentLoaded', () => {
  const versionSpan = document.getElementById('app-version');
  
  if (!versionSpan) {
    console.error('バージョン表示要素が見つかりません');
    return;
  }
  
  if (!window.electronAPI) {
    console.error('Electron APIが利用できません');
    versionSpan.textContent = 'API未利用';
    return;
  }
  
  window.electronAPI.getAppVersion()
    .then(version => {
      versionSpan.textContent = version;
      console.log(`バージョン情報を取得しました: ${version}`);
    })
    .catch(error => {
      console.error('バージョン情報の取得に失敗しました:', error);
      versionSpan.textContent = '取得エラー';
    });
}); 