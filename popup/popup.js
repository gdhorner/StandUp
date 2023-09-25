// Determine the initial loaded html based on timer presence.
chrome.alarms.getAll((alarms) => {
  if (alarms.length === 0) {
    displayTimerNotActive();
  } else {
    displayTimerActive();
  }
});

document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

document.querySelector("#stand-up").addEventListener("click", () => {
  startTimer();
});

document.querySelector("#end-session").addEventListener("click", function () {
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.session.clear();
  chrome.alarms.clearAll();

  document.getElementById("pre-standing-blob").style.display = "block";
  document.getElementById("standing-blob").style.display = "none";
});

chrome.storage.onChanged.addListener(async () => {
  const { currStandingHours, currStandingMinutes } =
    await chrome.storage.session.get([
      "currStandingHours",
      "currStandingMinutes",
    ]);
  document.getElementById(
    "standing-time"
  ).textContent = `${currStandingHours} hours and ${currStandingMinutes} minutes.`;
});


//#region: Functions

// Used to display html related there not being an ongoing timer.
async function displayTimerNotActive() {
  const { loadTimer } = await chrome.storage.sync.get(["loadTimer"]);

  if (loadTimer) {
    // Existing preferences
    await setTimes();
    document.getElementById("pre-standing-blob").style.display = "block";
  } else if (!loadTimer) {
    // Nonexisting preferences
    document.getElementById("newUser").innerHTML = "hidden";
  }
}

// Used to display html related to there being an ongoing timer.
function displayTimerActive() {
  document.getElementById("standing-blob").style.display = "block";
}

// Used to start the timer and update the display accordingly.
function startTimer() {
  chrome.action.setBadgeText({ text: "STND" });

  chrome.alarms.create("stand-up", {
    periodInMinutes: 0.1,
  });

  testStuff();

  document.getElementById("pre-standing-blob").style.display = "none";
  document.getElementById("standing-blob").style.display = "block";
  //window.close();
}

// Used to set both initial and current that are displayed.
async function setTimes() {
  const { prefStandingMinutes, prefSittingMinutes } = await chrome.storage.sync.get([
    "prefStandingMinutes", "prefSittingMinutes",
  ]);

  let standingHours, standingMinutes, sittingHours, sittingMinutes;
  standingHours = standingMinutes = sittingHours = sittingMinutes = 0;

  if (prefStandingMinutes > 60)
    standingHours = Math.floor(prefStandingMinutes / 60);

  standingMinutes = prefStandingMinutes % 60;

  if (prefSittingMinutes > 60)
    sittingHours = Math.floor(prefSittingMinutes / 60);

  sittingMinutes = prefSittingMinutes % 60;
  
  document.getElementById(
    "pref-standing-time"
  ).textContent = `${standingHours} hours and ${standingMinutes} minutes.`;

  document.getElementById(
    "pref-sitting-time"
  ).textContent = `${sittingHours} hours and ${sittingMinutes} minutes.`;

  document.getElementById(
    "standing-time"
  ).textContent = `${standingHours} hours and ${standingMinutes} minutes.`;

  document.getElementById(
    "sitting-time"
  ).textContent = `${sittingHours} hours and ${sittingMinutes} minutes.`;

  await chrome.storage.session.set({
    currStandingHours: standingHours,
    currStandingMinutes: standingMinutes,
    currSittingHours: sittingHours,
    currSittingMinutes: sittingMinutes
  });
}

//#endregion

async function testStuff() {
  let alarm = await chrome.alarms.getAll();
  console.log(alarm);

  let storage = await chrome.storage.session.get();
  console.log(storage);
}
