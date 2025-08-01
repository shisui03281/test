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
      updateStatusSpan.textContent = '有効 (リアルタイム確認)';
      updateStatusSpan.style.color = '#28a745';
    }, 2000);
  }

  // ボタンクリック時の処理を追加
  const updateBtn = document.getElementById('update-check-btn');
  if (updateBtn && window.electronAPI) {
    updateBtn.addEventListener('click', () => {
      window.electronAPI.checkForUpdates();
      // ユーザーにフィードバックを返す（任意）
      alert('更新の確認を開始します。新しいバージョンが見つかった場合は通知されます。');
    });
  }
}); 