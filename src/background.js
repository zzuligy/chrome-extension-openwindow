function getDisplayInfo (callback) {
  chrome.system.display.getInfo(function (displayInfos) {
    callback(displayInfos)
  })
}

function getTopLeftWindow (callback) {
  function getDirectionEndDisplay (displayInfos) {
    let displayBounds = displayInfos.map((display, i) => Object.assign({idx: i}, display.bounds))

    function getLimitBound (displayBounds, directioon) {
      displayBounds.sort(function (displayPrev, displayNext) {
        return displayPrev[directioon] > displayNext[directioon]
      })
      let leftestDisplays = []
      let leftFirstDisplay = displayBounds[0]
      displayBounds.forEach((display) => {
        let isEqualLeftFirstDisplay = leftFirstDisplay[directioon] === display[directioon]
        isEqualLeftFirstDisplay && leftestDisplays.push(display)
      })
      return leftestDisplays
    }

    let leftestDisplays = getLimitBound(displayBounds, 'left')
    let topestDisplays = getLimitBound(displayBounds, 'top')
    let topLeftBound = topestDisplays[0]
    delete topLeftBound.idx
    return topLeftBound
  }

  getDisplayInfo(function (displayInfos) {
    let topLeftbounds = getDirectionEndDisplay(displayInfos)
    callback(topLeftbounds)
  })
}

/*
 * content-script
 * ask to open window
 * **/
function openTopLeftWindow (cfg, callback) {
  getTopLeftWindow(function(bounds){
    chrome.windows.create(Object.assign(bounds, cfg), callback)
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  openTopLeftWindow({url:request.url}, sendResponse)
})