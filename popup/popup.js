
async function displayTimerNotActive() {
  const { loadTimer } = await chrome.storage.sync.get(["loadTimer"]);

  if (loadTimer) {
    await setCurrentTimes();
    document.getElementById("pre-standing-blob").style.display = "block";
  } else if (!loadTimer) {
    document.getElementById("newUser").innerHTML = "hidden";
  }
}

function displayTimerActive() {
  document.getElementById("standing-blob").style.display = "block";
}

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

function startTimer() {
  chrome.action.setBadgeText({ text: "ON" });

  chrome.alarms.create("stand-up", {
    periodInMinutes: 0.1,
  });

  document.getElementById("pre-standing-blob").style.display = "none";
  document.getElementById("standing-blob").style.display = "block";
  //window.close();
}

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

async function setCurrentTimes() {
  const { prefStandingMinutes } = await chrome.storage.sync.get([
    "prefStandingMinutes",
  ]);

  let standingHours, standingMinutes;
  standingHours = standingMinutes = 0;

  if (prefStandingMinutes > 60)
    standingHours = Math.floor(prefStandingMinutes / 60);

  standingMinutes = prefStandingMinutes % 60;

  
  document.getElementById(
    "pref-standing-time"
  ).textContent = `${standingHours} hours and ${standingMinutes} minutes.`;
  document.getElementById(
    "standing-time"
  ).textContent = `${standingHours} hours and ${standingMinutes} minutes.`;

  await chrome.storage.session.set({
    currStandingHours: standingHours,
    currStandingMinutes: standingMinutes,
  });
}
