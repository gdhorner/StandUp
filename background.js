let times;
chrome.runtime.onMessage.addListener((result, sender, sendResponse) => {
    times = result;
  }
);


chrome.alarms.onAlarm.addListener((alarm) => {
  updateTimes(times)
})

function updateTimes(times){  
  if(times.standingMinutes > 0){
    times.standingMinutes--;
  } else if(times.standingMinutes === 0 && times.standingHours > 1){
    times.standingMinutes = 60
    times.standingHours--;
  } 
  else{
    chrome.alarms.clearAll();
    // Somehow reset popup.html to the home view.
  }

  chrome.storage.session.set(
    { currStandingHours: times.standingHours, currStandingMinutes: times.standingMinutes },
  )
}