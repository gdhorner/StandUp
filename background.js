// Due to using the alarm now. It may make the most sense to set the initial alarm on popup, add the listener for it here to update the times.
// and completely remove the message sending from popup -> background -> popup?

chrome.runtime.onMessage.addListener(
  function(result, sender, sendResponse) {
    // updateTimes()
    console.log(result.standingMinutes)
    sendResponse(result)
  }
);


chrome.alarms.OnAlarm.addListener((alarm) => {
  // updateTimes()
})

function updateTimes(){
  if(result.standingMinutes > 0){
    result.standingMinutes--;
  } else if(result.standingMinutes === 0 && result.standingHours > 1){
    result.standingMinutes = 60
    result.standingHours--;
  } 
  else{
    // Timer is over.
  }
}

