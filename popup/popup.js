async function getUserOptions() {
  await chrome.storage.sync
  .get(["standingHour", "standingMinute", "sittingHour", "sittingMinute"])
  .then((result) => {
    if (
      result.standingHour !== "" &&
      result.standingMinute !== "" &&
      result.sittingHour !== "" &&
      result.sittingMinute
    ) {
      return false;
    } else {
      return true;
    }
  });
}

const loadTimer = getUserOptions()
.then((val) => {
  console.log(val)
})

document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
