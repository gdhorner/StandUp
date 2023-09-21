chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setBadgeText({text: ''})
  chrome.notifications.create({
    type: "basic",
    title: "Time to sit",
    message: "Time to sit",
    buttons: [{ title: "Keep sitting" }],
    priority: 0,
  });
});

// Update this to be based on when the overall timer reaches 0.
chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(["standingMinutes"]);
  chrome.alarms.create({ delayInMinutes: 1 });
});

async function updateCurrentTimes(){
  let {
    currStandingHour,
    currStandingMinute,
    currSittingHour,
    currSittingMinute,
  } = await chrome.storage.sync.get([
    "currStandingHour",
    "currStandingMinute",
    "currSittingHour",
    "currSittingMinute",
  ]);

  if(currStandingMinute !== 1){
    currStandingMinute--;
  } else if(currStandingMinute === 0 && currStandingHour !== 0){
    currStandingMinute = 60
    currStandingHour--;
  } 
  else if(currStandingHour !== 0){
  }
  
// TODO: Update this to be set based on the new values above.
  chrome.storage.sync.set(
    { currStandingHour: prefStandingHour, currStandingMinute: prefStandingMinute, currSittingHour: prefSittingHour, currSittingMinute: prefSittingMinute },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
)}

setInterval(updateCurrentTimes, 60000)