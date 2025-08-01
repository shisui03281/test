document.addEventListener('DOMContentLoaded', () => {
  const versionSpan = document.getElementById('app-version');
  window.electronAPI.getAppVersion().then(version => {
    versionSpan.textContent = version;
  });

  const updateBtn = document.getElementById('update-check-btn');
  updateBtn.addEventListener('click', () => {
    window.electronAPI.checkForUpdates();
  });

  // ステータス表示エリアを更新する処理を追加
  const updateStatus = document.getElementById('update-status');
  window.electronAPI.onUpdateStatus((status) => {
    updateStatus.textContent = status;
  });
}); 