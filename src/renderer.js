// レンダラープロセス用のスクリプト
document.addEventListener('DOMContentLoaded', () => {
  const versionSpan = document.getElementById('app-version');
  const updateStatusSpan = document.getElementById('update-status');
  
  if (!versionSpan) {
    console.error('バージョン表示要素が見つかりません');
    return;
  }
  
  if (!window.electronAPI) {
    console.error('Electron APIが利用できません');
    versionSpan.textContent = 'API未利用';
    if (updateStatusSpan) {
      updateStatusSpan.textContent = 'API未利用';
    }
    return;
  }
  
  // バージョン情報を取得
  window.electronAPI.getAppVersion()
    .then(version => {
      versionSpan.textContent = version;
      console.log(`バージョン情報を取得しました: ${version}`);
    })
    .catch(error => {
      console.error('バージョン情報の取得に失敗しました:', error);
      versionSpan.textContent = '取得エラー';
    });
  
  // 自動更新の状態を表示
  if (updateStatusSpan) {
    // 自動更新の状態を確認（実際の実装ではIPC通信を使用）
    setTimeout(() => {
      updateStatusSpan.textContent = '有効 (1時間ごとに確認)';
      updateStatusSpan.style.color = '#28a745';
    }, 2000);
  }
}); 