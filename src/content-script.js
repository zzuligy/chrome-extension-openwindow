
window.addEventListener("message", function(event) {
  console.log(event)
  // We only accept messages from ourselves
  if (event.data) {
    console.log("Content script received: " + event.data.text);
    chrome.runtime.sendMessage({url:event.data}, function(response) {
      console.log(response);
    });
  }
}, false);