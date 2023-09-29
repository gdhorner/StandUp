chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "Start") {
    // Initial start sent from the "Stand Up" button.
    let isStanding = true;
    setTimer(isStanding);
    sendResponse("Started.");
  }
});

// Reoccurring alarm listener which will continue to update the times in the session storage.
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "stand-up") {
    isStanding = true;
  } else if (alarm.name === "sit-down") {
    isStanding = false;
  }
  await updateTimes(isStanding);
});

// Updates the times in the session storage dynamically whether sitting or standing.
// Once the times reach 0, reset the current times to the preferred times and start the other timer.
async function updateTimes(isStanding) {
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

  if (timeMinutes > 0) {
    timeMinutes--;
  } else if (timeMinutes === 0 && timeHours >= 1) {
    timeMinutes = 59;
    timeHours--;
  }

  await chrome.storage.session.set({
    [tHours]: timeHours,
    [tMinutes]: timeMinutes,
  });

  if (timeHours === 0 && timeMinutes === 0) {
    isStanding = !isStanding;
    setTimer(isStanding);
    await chrome.runtime.sendMessage(["Reset", isStanding]);

    if(isStanding){
      chrome.notifications.create('', {
        title: 'Time to Stand Up!',
        message: 'Embrace it!',
        iconUrl: '/images/standup.png',
        type: 'basic'
      })
    } else if(!isStanding){
      chrome.notifications.create('', {
        title: 'Time to Sit Down!',
        message: 'Enjoy it!',
        iconUrl: '/images/sitdown.png',
        type: 'basic'
      })
    }
  }
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
