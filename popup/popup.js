async function getOptions() {
  let {
    prefStandingMinute,
    prefSittingMinute,
  } = await chrome.storage.sync.get([
    "prefStandingMinute",
    "prefSittingMinute",
  ]);

  let loadTimer;
  if (
    prefStandingMinute !== "" &&
    prefSittingMinute !== ""
  ) {
    loadTimer = true;
  } else {
    loadTimer = false;
  }

  let standingHours;
  if(prefStandingMinute > 60)
    standingHours = Math.floor(prefStandingMinute / 60)

  let standingMinutes = prefStandingMinute % 60

  const response = await chrome.runtime.sendMessage({standingHours, standingMinutes, loadTimer})
  chrome.alarms.create('stand-up', {
    periodInMinutes: 1
  })

  /*if (loadTimer) {
    document.getElementById("pre-standing-blob").style.display = "block"
    // Set timer values on the popup page.
    document.getElementById(
      "standingTime"
    ).textContent = `${prefStandingHour} hours and ${prefStandingMinute} minutes.`;
    document.getElementById(
      "sittingTime"
    ).textContent = `${prefSittingHour} hours and ${prefSittingMinute} minutes to kick your feet up and relax.`;
  } else if (!loadTimer) {
    document.getElementById("newUser").innerHTML = "hidden";
  }*/
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
