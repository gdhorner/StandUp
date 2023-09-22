async function displaySection() {
  const loadTimer = await chrome.storage.sync.get(["loadTimer"]);

  if (loadTimer) {
    document.getElementById("pre-standing-blob").style.display = "block";
  } else if (!loadTimer) {
    document.getElementById("newUser").innerHTML = "hidden";
  }
}

/*chrome.alarms.getAll((alarms) => {
  if (alarms.length === 0) {
    displaySection();
  }
});*/
displaySection();

document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});


document
  .querySelector("#stand-up")
  .addEventListener("click", async () => {
    const {prefStandingMinute, prefSittingMinute} = await chrome.storage.sync.get(["prefStandingMinute", "prefSittingMinute"]);
    startTimer(prefStandingMinute, prefSittingMinute)
  });


async function startTimer(prefStandingMinute, prefSittingMinute) {
  chrome.action.setBadgeText({ text: "ON" });

  let standingHours;
  if (prefStandingMinute > 60)
    standingHours = Math.floor(prefStandingMinute / 60);

  let standingMinutes = prefStandingMinute % 60;

  await chrome.runtime.sendMessage({
    standingHours,
    standingMinutes,
  });

  chrome.alarms.create("stand-up", {
    periodInMinutes: 0.1,
  });
  //window.close();
}

document.querySelector("#end-session").addEventListener("click", function () {
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.session.clear();
  chrome.alarms.clearAll();
});

chrome.storage.onChanged.addListener(async () => {
    const {currStandingHours, currStandingMinutes} = await chrome.storage.session.get(['currStandingHours', 'currStandingMinutes'])
    console.log(currStandingHours)
    document.getElementById(
      "standingTime"
    ).textContent = `${currStandingHours} hours and ${currStandingMinutes} minutes.`;
})