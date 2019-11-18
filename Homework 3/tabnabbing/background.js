var img_array = [];
var tab_array = [];
var curr_tab, curr_index;
var compare_flag = false;

// 10s period
// var myVar = setInterval(myTimer, 10000);
// tab change
// chrome.tabs.onActivated.addListener(callback=onTabChange)


function onCaptured(imageUri) {
    console.log("image captured");
    // console.log(imageUri);

    if (!compare_flag || img_array[curr_index]== null){
        // only record when curr_index not set (indicating this is a new page) or no previous recording (need more time for screenshot)
        img_array[curr_index] = imageUri;
        console.log("recorded screenshot",curr_index);
    }
    else{
        prev_img = img_array[curr_index]
        // update last screenshot
        img_array[curr_index] = imageUri;
        // reset compare_flag to prevent same tab timer comparing
        compare_flag = false;
        console.log("to compare screenshot",curr_index)
        
        // compare
        // TODO: split the image into different regions
        // TODO: compare only when tab changes
        resembleControl = resemble(prev_img)
                        .compareTo(imageUri)
                        .onComplete(onComplete);
    }
}

// change icon to alert
function alertIcon() {
    chrome.browserAction.setIcon({path: 
        { 
        "16": "images/red-16.png",
        "32": "images/red.png"
        } 
    });
}

// change icon to ok
function okIcon() {
    chrome.browserAction.setIcon({path:
        {
        "16": "images/green-16.png",
        "32": "images/green.png"
        }
    });
}

// complete comparing
function onComplete(data) {
    diffImage_url = data.getImageDataUrl();
    console.log("diff image");
    // console.log(diffImage_url);
    console.log(data.misMatchPercentage);

    // TODO: check if there is different content
    if (data.misMatchPercentage > 1.0){
        // show alert
        alertIcon()
        // TODO: send area to be highlighted to content script
        // console.log("send message")
        // chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"});
        // query for current tab id
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    }
    else{
        okIcon()
    }
    
}


// periodic screenshot
function myTimer() {
    chrome.tabs.captureVisibleTab(callback=onCaptured);
}

// tab change
function onTabChange(activeInfo){
    curr_tab = activeInfo.tabId;

    if (!tab_array.includes(curr_tab)){
        // record a unseen tab
        tab_array.push(curr_tab);
        img_array.push(null);
        curr_index = tab_array.indexOf(curr_tab)
        compare_flag = false;

        // record an screenshot
        chrome.tabs.captureVisibleTab(callback=onCaptured);
    }
    else{
        // tab previously visited
        curr_index = tab_array.indexOf(curr_tab);
        compare_flag = true;
        // check if there is difference
        chrome.tabs.captureVisibleTab(callback=onCaptured);        
    }
}