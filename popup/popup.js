async function getOptions() {
  let {
    prefStandingHour,
    prefStandingMinute,
    prefSittingHour,
    prefSittingMinute,
  } = await chrome.storage.sync.get([
    "prefStandingHour",
    "prefStandingMinute",
    "prefSittingHour",
    "prefSittingMinute",
  ]);

  let loadTimer;
  if (
    prefStandingHour !== "" &&
    prefStandingMinute !== "" &&
    prefSittingHour !== "" &&
    prefSittingMinute !== ""
  ) {
    loadTimer = true;
  } else {
    loadTimer = false;
  }

  if (loadTimer) {
    // Set timer values on the popup page.
    document.getElementById(
      "standingTime"
    ).textContent = `${prefStandingHour} hours and ${prefStandingMinute} minutes.`;
    document.getElementById(
      "sittingTime"
    ).textContent = `${prefSittingHour} hours and ${prefSittingMinute} minutes to kick your feet up and relax.`;
  } else if (!loadTimer) {
    document.getElementById("newUser").innerHTML = "hidden";
  }
}
getOptions();

document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

document.querySelector("#stand-up").addEventListener("click", function () {
  chrome.action.setBadgeText({ text: "ON" });
  chrome.alarms.create({ periodInMinutes: 1 });
  window.close();
});
