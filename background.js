let isStanding;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "Start") {
    isStanding = true;
    setTimer(isStanding);
    sendResponse("Started.");
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if(alarm.name === 'stand-up'){
    isStanding = true;
  } else if(alarm.name === 'sit-down'){
    isStanding = false;
  }
  await updateTimes(isStanding)
});

async function updateTimes(isStanding) {
  let type;
  if (isStanding) {
    type = "Standing"
  } else if (!isStanding) {
    type = "Sitting"
  }
  let tHours = "curr" + type + "Hours"
  let tMinutes = "curr" + type + "Minutes"

  let [timeHours, timeMinutes] = Object.values(await chrome.storage.session.get([tHours, tMinutes]));

  if (timeMinutes > 0) {
    timeMinutes--;
  } else if (timeMinutes === 0 && timeHours > 1) {
    timeMinutes = 60;
    timeHours--;
  } 

  await chrome.storage.session.set({
    [tHours]: timeHours,
    [tMinutes]: timeMinutes,
  });

  if(timeHours === 0 && timeMinutes === 0){
    isStanding = !isStanding
    console.log(isStanding)
    setTimer(isStanding)
    // Somehow reset popup.html to sitting view when done standing.
    // Also when done sitting, reset everything and continue again.
  }

  testStuff();
}

function setTimer(isStanding) {
  if (isStanding) {
    chrome.alarms.clearAll();

    chrome.alarms.create("stand-up", {
      periodInMinutes: 0.1,
    });

    chrome.action.setBadgeText({ text: "STND" });
  } else if (!isStanding) {
    chrome.alarms.clearAll();

    chrome.action.setBadgeText({ text: "SIT" });

    chrome.alarms.create("sit-down", {
      periodInMinutes: 0.1,
    });
  }
}


async function testStuff() {
  let alarm = await chrome.alarms.getAll();
  console.log(alarm);

  let storage = await chrome.storage.session.get();
  console.log(storage);
}