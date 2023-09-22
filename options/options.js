// Set preferences and current times.
const saveOptions = () => {
    const prefStandingMinute = document.getElementById('pref-standing-minute').value;
    const prefSittingMinute = document.getElementById('pref-sitting-minute').value;
  
    chrome.storage.sync.set(
      {  prefStandingMinute: prefStandingMinute, prefSittingMinute: prefSittingMinute,
         loadTimer: True },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores times using the preferences stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { prefStandingMinute: '', prefSittingMinute: ''},
      (items) => {
        document.getElementById('pref-standing-minute').value = items.prefStandingMinute;
        document.getElementById('pref-sitting-minute').value = items.prefSittingMinute;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions)
