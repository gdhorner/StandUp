// Set preferences and current times.
const saveOptions = () => {
  const prefStandingMinutes = document.getElementById(
    "pref-standing-minutes"
  ).value;
  const prefSittingMinutes = document.getElementById(
    "pref-sitting-minutes"
  ).value;

  chrome.storage.sync.set(
    {
      prefStandingMinutes: prefStandingMinutes,
      prefSittingMinutes: prefSittingMinutes,
      loadTimer: true,
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    }
  );

  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
};

// Restores times using the preferences stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { prefStandingMinutes: "", prefSittingMinutes: "" },
    (items) => {
      document.getElementById("pref-standing-minutes").value =
        items.prefStandingMinutes;
      document.getElementById("pref-sitting-minutes").value =
        items.prefSittingMinutes;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
