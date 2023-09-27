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

document.querySelector("#stand-up").addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage("Start");
  // do something with response here, not outside the function
  console.log(response);

  document.getElementById("active-timer").style.display = "block";
  document.getElementById("pre-standing-blob").style.display = "none";
  document.getElementById("standing-blob").style.display = "block";
  //window.close();
});

document.querySelector("#end-session").addEventListener("click", function () {
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.session.clear();
  chrome.alarms.clearAll();

  setTimes();
  document.getElementById("pre-standing-blob").style.display = "block";
  document.getElementById("active-timer").style.display = "none";
});

chrome.storage.onChanged.addListener(async (storage) => {
  let tHours, tMinutes, timeHours, timeMinutes;
  timeHours = timeMinutes = 0;

  let storageObj = Object.keys(storage);
  if (storageObj.length === 1) {
    tMinutes = storageObj[0];
    timeMinutes = Object.values(await chrome.storage.session.get([tMinutes]));
  } else if (storageObj.length === 2) {
    tHours = storageObj[0];
    tMinutes = storageObj[1];
    [timeHours, timeMinutes] = Object.values(
      await chrome.storage.session.get([tHours, tMinutes])
    );
  } else {
    return;
  }

  let action;
  if (tMinutes.includes("Standing")) {
    action = "standing-time";
  } else {
    action = "sitting-time";
  }

  document.getElementById(
    action
  ).textContent = `${timeHours} hours and ${timeMinutes} minutes.`;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request[0] === "Reset") {
    // Swap displays
    let isStanding = request[1];
    resetTimes(isStanding);
    sendResponse("isStanding: " + isStanding);
  }
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

// Used to set both initial and current that are displayed.
async function setTimes() {
  const { prefStandingMinutes, prefSittingMinutes } =
    await chrome.storage.sync.get([
      "prefStandingMinutes",
      "prefSittingMinutes",
    ]);

  let [standingHours, standingMinutes] = calcHours(prefStandingMinutes)
  let [sittingHours, sittingMinutes] = calcHours(prefSittingMinutes)

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
    currSittingMinutes: sittingMinutes,
  });
  console.log("Initial times set.");
}

async function resetTimes(isStanding) {
  let actionType;
  if (isStanding) {
    document.getElementById("standing-blob").style.display = "block";
    document.getElementById("sitting-blob").style.display = "none";
    actionType = "Standing";
  } else if (!isStanding) {
    document.getElementById("sitting-blob").style.display = "block";
    document.getElementById("standing-blob").style.display = "none";
    actionType = "Sitting";
  }

  const [prefMinutes] = Object.values(await chrome.storage.sync.get(["pref" + actionType + "Minutes"]));

  let [newHours, newMinutes] = calcHours(prefMinutes);
  let newHoursType = "curr" + actionType + "Hours"
  let newMinutesType = "curr" + actionType + "Minutes"

  await chrome.storage.session.set({
    [newHoursType]: newHours,
    [newMinutesType]: newMinutes,
  });
}

function calcHours(prefMinutes) {
  let prefHours = 0;
  if (prefMinutes > 60) prefHours = Math.floor(prefMinutes / 60);

  prefMinutes = prefMinutes % 60;
  return [prefHours, prefMinutes];
}

//#endregion
async function testStuff() {
  let alarm = await chrome.alarms.getAll();
  console.log(alarm);

  let storage = await chrome.storage.session.get();
  console.log(storage);
}
