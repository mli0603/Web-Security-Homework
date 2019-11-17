function onCaptured(imageUri) {
    console.log(imageUri);
}
  
function onError(error) {
    console.log(`Error: ${error}`);
}
  
browser.browserAction.onClicked.addListener(function() {
    var capturing = browser.tabs.captureVisibleTab();
    capturing.then(onCaptured, onError);
});