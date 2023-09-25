
chrome.alarms.onAlarm.addListener(async (alarm) => {
  await updateTimes(alarm.name);
});

async function updateTimes(alarmName) {
  let ttHours, ttMinutes;
  if (alarmName === "stand-up") {
    ttHours = "'currStandingHours'";
    ttMinutes = "'currStandingMinutes'";
  } else if (alarmName === "sit-down") {
    ttHours = "'currSittingHours'";
    ttMinutes = "'currSittingMinutes'";
  }

  let timeArr = [{ ttHours }, { ttMinutes }];
  // generic way of getting this data doesn't seem to be working.
  let { timeHours, timeMinutes } = await chrome.storage.session.get([
    ttHours,
    ttMinutes,
  ]);

  console.log(timeHours);
  if (timeMinutes > 0) {
    timeMinutes--;
  } else if (timeMinutes === 0 && timeHours > 1) {
    timeMinutes = 60;
    timeHours--;
  } else {
    // Clear standing timer. Swap to sitting timer.
    chrome.alarms.clearAll();

    chrome.action.setBadgeText({ text: "SIT" });

    chrome.alarms.create("sit-down", {
      periodInMinutes: 0.1,
    });

    // Somehow reset popup.html to the home view.
  }

  await chrome.storage.session.set({
    [{ ttHours }]: timeHours,
    [{ ttMinutes }]: timeMinutes,
  });
}
