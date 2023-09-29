// Determine the initial loaded html based on timer presence.
chrome.alarms.getAll(async (alarms) => {
  if (alarms.length === 0) {
    await displayInactiveTimer();
  } else {
    await displayActiveTimer(alarms[0].name);
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
  document.getElementById("sitting-blob").style.display = "none";
  //window.close();
});

document.querySelector("#end-session").addEventListener("click", async function () {
  await endSession();
});

async function endSession() {
  console.log("hello")
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.session.clear();
  chrome.alarms.clearAll();
  
  await setTimes();
  document.getElementById("pre-standing-blob").style.display = "block";
  document.getElementById("active-timer").style.display = "none";
}

chrome.storage.onChanged.addListener(async (storage) => {
  let storageKeys = Object.keys(storage);
  let storageValues = Object.values(storage);
  
  if (storageKeys.length > 2) {
    return;
  }

  let tHours, tMinutes, timeHours, timeMinutes, action;
  timeHours = timeMinutes = 0;

  let isStanding;
  if (storageKeys[0].includes("Standing") && storageValues[0] !== 0) {
    isStanding = true;
  } else if(storageKeys[0].includes("Standing" && storageValues[0] === 0)){
    isStanding = false;
  } else if(storageKeys[0].includes("Sitting" && storageValues[0] === 0)){
    isStanding = true;
  } else if(storageKeys[0].includes("Sitting" && storageValues[0] !== 0)){
    isStanding = false;
  } else if (storageKeys[0].includes("pref")) {
    await endSession();
    return;
  } 

  if(isStanding){
    tHours = "currStandingHours";
    tMinutes = "currStandingMinutes";
    action = "standing-time";
  } else if(!isStanding){
    tHours = "currSittingHours";
    tMinutes = "currSittingMinutes";
    action = "sitting-time";
  }

  [timeHours, timeMinutes] = Object.values(
    await chrome.storage.session.get([tHours, tMinutes])
  );
  console.log(`${tHours}: ${timeHours}`);
  console.log(`${tMinutes}: ${timeMinutes}`);

  let textContent = getTextContent(timeHours, timeMinutes)
  document.getElementById(
    action
  ).textContent = textContent;
});

const handleResetTimes = async (isStanding, sendResponse) => {
  await resetTimes(isStanding);
  sendResponse("IsStanding: " + isStanding);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request[0] === "Reset") {
    // Swap displays
    handleResetTimes(request[1], sendResponse);
  }
});

//#region: Functions

// Used to display html related there not being an ongoing timer.
async function displayInactiveTimer() {
  const { loadTimer } = await chrome.storage.sync.get(["loadTimer"]);

  if (loadTimer) {
    // Existing preferences
    await setTimes();
    document.getElementById("pre-standing-blob").style.display = "block";
  } else if (!loadTimer) {
    // Nonexisting preferences
    document.getElementById("new-user").innerHTML = "hidden";
  }
}

// Used to set both initial and current that are displayed.
async function setTimes() {
  const { prefStandingMinutes, prefSittingMinutes } =
    await chrome.storage.sync.get([
      "prefStandingMinutes",
      "prefSittingMinutes",
    ]);

  let [standingHours, standingMinutes] = calcHours(prefStandingMinutes);
  let [sittingHours, sittingMinutes] = calcHours(prefSittingMinutes);

  let standingTextContent = getTextContent(standingHours, standingMinutes)
  let sittingTextContent = getTextContent(sittingHours, sittingMinutes)

  document.getElementById(
    "pref-standing-time"
  ).textContent = standingTextContent;

  document.getElementById(
    "pref-sitting-time"
  ).textContent = sittingTextContent;

  document.getElementById(
    "standing-time"
  ).textContent = standingTextContent;

  document.getElementById(
    "sitting-time"
  ).textContent = sittingTextContent;

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

  const [prefMinutes] = Object.values(
    await chrome.storage.sync.get(["pref" + actionType + "Minutes"])
  );

  let [newHours, newMinutes] = calcHours(prefMinutes);
  console.log(newHours);
  console.log(newMinutes);
  let newHoursType = "curr" + actionType + "Hours";
  let newMinutesType = "curr" + actionType + "Minutes";

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

async function displayActiveTimer(alarmName) {
  let isStanding;
  if (alarmName === "stand-up") {
    isStanding = true;
  } else if (alarmName === "sit-down") {
    isStanding = false;
  }

  if (isStanding) {
    tHours = "currStandingHours";
    tMinutes = "currStandingMinutes";
  } else if (!isStanding) {
    tHours = "currSittingHours";
    tMinutes = "currSittingMinutes";
  }

  let [timeHours, timeMinutes] = Object.values(
    await chrome.storage.session.get([tHours, tMinutes])
  );

  document.getElementById("active-timer").style.display = "block";
  document.getElementById("pre-standing-blob").style.display = "none";

  let textContent = getTextContent(timeHours, timeMinutes)
  if (isStanding) {
    document.getElementById("standing-blob").style.display = "block";
    document.getElementById("sitting-blob").style.display = "none";
    document.getElementById(
      "standing-time"
    ).textContent = textContent;
  } else if (!isStanding) {
    document.getElementById("sitting-blob").style.display = "block";
    document.getElementById("standing-blob").style.display = "none";
    document.getElementById(
      "sitting-time"
    ).textContent = textContent;
  }
}

function getTextContent(timeHours, timeMinutes){
  let textContent;
  if(timeHours === 1 && timeMinutes === 1){
    textContent = `${timeHours} hour and ${timeMinutes} minute.`
  } else if(timeHours === 1){
    textContent = `${timeHours} hour and ${timeMinutes} minutes.`
  } else if(timeMinutes === 1){
    textContent = `${timeHours} hours and ${timeMinutes} minute.`
  } else{
    textContent = `${timeHours} hours and ${timeMinutes} minutes.`
  }

  return textContent;
}

//#endregion
async function testStuff() {
  let alarm = await chrome.alarms.getAll();
  console.log(alarm);

  let storage = await chrome.storage.session.get();
  console.log(storage);
}
