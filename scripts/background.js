
chrome.alarms.onAlarm.addListener( (alarm) => {
    const url = alarm.name;
    console.log("timer went off!    " + url);

    // chrome.storage.local.get(url, function(values) {

    //     chrome.notifications.create({
    //         type: "basic",
    //         title: values.title,
    //         message: values.message
    //     });
    // });
});