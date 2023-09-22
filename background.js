// Due to using the alarm now. It may make the most sense to set the initial alarm on popup, add the listener for it here to update the times.
// and completely remove the message sending from popup -> background -> popup?

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
    // Timer is over.
  }
  console.log(times.standingHours)
  chrome.storage.session.set(
    { currStandingHours: times.standingHours, currStandingMinutes: times.standingMinutes },
  )
}