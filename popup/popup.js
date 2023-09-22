// Current problem is not being able to get storage values below outside of this function. So they can be reused in multiple different functions below.

async function displayTimerNotActive() {
  const {loadTimer, prefStandingMinute, prefSittingMinute } = await chrome.storage.sync.get(["loadTimer", "prefStandingMinute", "prefSittingMinute"]);
  console.log(prefStandingMinute)
  if (loadTimer) {
    document.getElementById("pre-standing-blob").style.display = "block";
    document.getElementById("pref-standing-time").textContent = `${prefStandingMinute} hours and ${currStandingMinutes} minutes.`;

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

document.querySelector("#stand-up").addEventListener("click", async () => {
  const { prefStandingMinute, prefSittingMinute } =
    await chrome.storage.sync.get(["prefStandingMinute", "prefSittingMinute"]);
  startTimer(prefStandingMinute, prefSittingMinute);
});

async function startTimer(prefStandingMinute, prefSittingMinute) {
  chrome.action.setBadgeText({ text: "ON" });

  await chrome.runtime.sendMessage({
    standingHours,
    standingMinutes,
  });

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
  console.log(currStandingHours);
  document.getElementById(
    "standing-time"
  ).textContent = `${currStandingHours} hours and ${currStandingMinutes} minutes.`;
});
