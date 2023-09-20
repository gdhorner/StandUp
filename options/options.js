// Saves options to chrome.storage
const saveOptions = () => {
    const standingHour = document.getElementById('standing-hour').value;
    const standingMinute = document.getElementById('standing-minute').value;
    const sittingHour = document.getElementById('sitting-hour').value;
    const sittingMinute = document.getElementById('sitting-minute').value;
  
    chrome.storage.sync.set(
      { standingHour: standingHour, standingMinute: standingMinute, sittingHour: sittingHour, sittingMinute: sittingMinute },
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
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { standingHour: '', standingMinute: '', sittingHour: '', sittingMinute: ''},
      (items) => {
        document.getElementById('standing-hour').value = items.standingHour;
        document.getElementById('standing-minute').value = items.standingMinute;
        document.getElementById('sitting-hour').value = items.sittingHour;
        document.getElementById('sitting-minute').value = items.sittingMinute;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
