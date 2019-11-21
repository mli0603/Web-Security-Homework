var img_array = [];
var tab_array = [];
var attacked_array = [];
var curr_index, cap_tab;
var compare_flag = false;
NUM_ELEMENT = 3;

// 10s period
var myVar = setInterval(myTimer, 5000);
// tab change
chrome.tabs.onActivated.addListener(callback=onTabChange)


function onCaptured(imageUri) {
    console.log("image captured");
    // console.log(imageUri);

    if (!compare_flag || img_array[curr_index]== null || attacked_array[curr_index]){
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
        compare(prev_img, imageUri);
    }
}

function compare(prev_img, curr_img){
    var prev_jimp, curr_jimp; 
    // read
    Jimp.read(prev_img).then(image=> {
        console.log('success read prev image');
        prev_jimp = image;
        Jimp.read(curr_img).then(image=> {
            console.log('success read curr image');
            curr_jimp = image;
            // compare
            crop_compare(prev_jimp, curr_jimp);
        })
        .catch(err => {
            // Handle an exception.
            console.log('cannot load curr image');
        });
    })
    .catch(err => {
        // Handle an exception.
        console.log('cannot load previous image');
    });
}

function crop_compare(prev_jimp, curr_jimp){
    // add div tag
    width = prev_jimp.getWidth();
    height = prev_jimp.getHeight();
    width_region = Math.round(width/NUM_ELEMENT);
    height_region = Math.round(height/NUM_ELEMENT);
    diff_mask = Array(NUM_ELEMENT*NUM_ELEMENT).fill(0);

    console.log('compare')
    for (r = 0; r < NUM_ELEMENT; r++) {
        for (c=0; c < NUM_ELEMENT; c++){
            // console.log(r,c)
            prev_region = prev_jimp.clone().crop(r*width_region,c*height_region,(r+1)*width_region,(c+1)*height_region);
            curr_region = curr_jimp.clone().crop(r*width_region,c*height_region,(r+1)*width_region,(c+1)*height_region);
            
            diff= Jimp.diff(prev_region, curr_region, 0.1);
            // console.log(diff.percent)
            if (diff.percent > 0.05){
                // console.log(diff.percent);
                diff_mask[r*NUM_ELEMENT+c] = 0.5;
            }
        }
    }

    // send message
    console.log('send')
    chrome.tabs.sendMessage(cap_tab, {mask: diff_mask});

    // change icon
    flag = diff_mask.some(function (e) {
        return e > 0
    })
    if (flag){
        alertIcon()
        attacked_array[curr_index] = true;
    }
    else{
        okIcon()
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


// periodic screenshot
function myTimer() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        cap_tab = tabs[0].id;
    });
    chrome.tabs.captureVisibleTab(callback=onCaptured);
}

// tab change
function onTabChange(activeInfo){
    var curr_tab = activeInfo.tabId;
    cap_tab = curr_tab;

    if (!tab_array.includes(curr_tab)){
        // record a unseen tab
        tab_array.push(curr_tab);
        img_array.push(null);
        attacked_array.push(false);
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

    if (attacked_array[curr_index]){
        alertIcon()
    }
    else[
        okIcon()
    ]
}