// Set preferences and current times.
const saveOptions = () => {
    const prefStandingHour = document.getElementById('pref-standing-hour').value;
    const prefStandingMinute = document.getElementById('pref-standing-minute').value;
    const prefSittingHour = document.getElementById('pref-sitting-hour').value;
    const prefSittingMinute = document.getElementById('pref-sitting-minute').value;
  
    chrome.storage.sync.set(
      { prefStandingHour: prefStandingHour, prefStandingMinute: prefStandingMinute, prefSittingHour: prefSittingHour, prefSittingMinute: prefSittingMinute,
        currStandingHour: prefStandingHour, currStandingMinute: prefStandingMinute, currSittingHour: prefSittingHour, currSittingMinute: prefSittingMinute },
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
      { prefStandingHour: '', prefStandingMinute: '', prefSittingHour: '', prefSittingMinute: ''},
      (items) => {
        document.getElementById('pref-standing-hour').value = items.prefStandingHour;
        document.getElementById('pref-standing-minute').value = items.prefStandingMinute;
        document.getElementById('pref-sitting-hour').value = items.prefSittingHour;
        document.getElementById('pref-sitting-minute').value = items.prefSittingMinute;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
