// Set preferences and current times.
const saveOptions = () => {
  const prefStandingMinutes = document.getElementById(
    "pref-standing-minutes"
  ).value;
  const prefSittingMinutes = document.getElementById(
    "pref-sitting-minutes"
  ).value;

  let valid = preferencesValidation(prefStandingMinutes, prefSittingMinutes);
  if (!valid[0] && !valid[1]) {
    document.getElementById("pref-standing-minutes").style.border = "solid";
    document.getElementById("pref-sitting-minutes").style.border = "solid";
    document.getElementById("pref-standing-minutes").style.borderColor = "red";
    document.getElementById("pref-sitting-minutes").style.borderColor = "red";
    return;
  } else if (!valid[0]) {
    document.getElementById("pref-standing-minutes").style.border = "solid";
    document.getElementById("pref-standing-minutes").style.borderColor = "red";
    document.getElementById("pref-sitting-minutes").style.border = "none";
    return;
  } else if (!valid[1]) {
    document.getElementById("pref-sitting-minutes").style.border = "solid";
    document.getElementById("pref-sitting-minutes").style.borderColor = "red";
    document.getElementById("pref-standing-minutes").style.border = "none";
    return;
  }

  document.getElementById("pref-standing-minutes").style.border = "none";
  document.getElementById("pref-sitting-minutes").style.border = "none";

  chrome.storage.sync.set(
    {
      prefStandingMinutes: prefStandingMinutes,
      prefSittingMinutes: prefSittingMinutes,
      loadTimer: true,
    },
    () => {
      // Update status to let user know options were saved.
      console.log("Preferences saved.");
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 1000);
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

function preferencesValidation(prefStandingMinutes, prefSittingMinutes) {
  let standingTextContent, sittingTextContent;
  standingTextContent = sittingTextContent = "";
  if (prefStandingMinutes < 1) {
    standingTextContent = "Must be greater than 0";
  } else if (prefStandingMinutes > 90) {
    standingTextContent =
      "Ambitious, but lets keep it under 90 minutes at a time. (:";
  }

  if (prefSittingMinutes < 1) {
    sittingTextContent = "Must be greater than 0";
  } else if (prefSittingMinutes > 90) {
    sittingTextContent =
      "Ambitious, but lets keep it under 90 minutes at a time. (:";
  }

  document.getElementById("standing-validation").textContent =
    standingTextContent;
  document.getElementById("sitting-validation").textContent =
    sittingTextContent;

  let [standingValidation, sittingValidation] = [true, true];
  if (standingTextContent !== "") {
    standingValidation = false;
  }

  if (sittingTextContent !== "") {
    sittingValidation = false;
  }

  return [standingValidation, sittingValidation];
}
