chrome.alarms.onAlarm.addListener(async (alarm) => {
  await updateTimes()
})

async function updateTimes(){  
  let { currStandingHours, currStandingMinutes } =
    await chrome.storage.session.get([
      "currStandingHours",
      "currStandingMinutes",
    ]);
  if(currStandingMinutes > 0){
    currStandingMinutes--;
  } else if(currStandingMinutes === 0 && currStandingHours > 1){
    currStandingMinutes = 60
    currStandingHours--;
  } 
  else{
    chrome.alarms.clearAll();
    // Somehow reset popup.html to the home view.
  }

  await chrome.storage.session.set(
    { currStandingHours: currStandingHours, currStandingMinutes: currStandingMinutes },
  )
}