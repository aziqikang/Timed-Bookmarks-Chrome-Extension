document.addEventListener('DOMContentLoaded', async () => {

    const cuckoo = new Cuckoo();
    const tab = await cuckoo.getActiveTab();

    // Display history.
    await displayPages();

    // add tab
    const addCurrentTabBtn = document.getElementById("addCurrentTab");
    addCurrentTabBtn.onclick = async () => {
        // get message
        const message = document.getElementById("message").value;

        // get timer value
        var firstAlarmTime = document.getElementById("alarm").value;
        var firstAlarmTimeString = String(new Date(firstAlarmTime));
        var timeStamp = Date();
        var timeDifference = Date.parse(firstAlarmTimeString) - Date.parse(timeStamp);


        if (isNaN(timeDifference) || !isFinite(timeDifference)) {
            alert("Please set a valid reminder time!");
        } else if (timeDifference < 0) {
            alert("Please set an upcoming date/time!")
        } else {
            // create timer
            var minutes = Math.ceil((timeDifference/1000)/60);
            chrome.alarms.create(tab.url, {delayInMinutes : minutes});

            await PageService.savePage(tab.title, tab.url, message, firstAlarmTimeString);
            await displayPages();
        }
    };

    // remove tab
    const clearAllButton = document.getElementById("clearAll");
    clearAllButton.onclick = async () => {
        await PageService.clearPages();
        await displayPages();
    };
});

const displayPages = async () => {
    const savedUrls = await PageService.getUrls();
    const bookmarksList = document.getElementById('bookmarksList');
    bookmarksList.innerHTML = '';
    

    savedUrls.forEach(url => {
        PageService.getPage(url).then(page => {
            const pageValues = page[Object.keys(page)[0]];

            const pageListItem = document.createElement('li');
            bookmarksList.appendChild(pageListItem);

            const pageItem = document.createElement('div');
            pageListItem.append(pageItem);
            
            const pageLink = document.createElement('a');
            pageLink.innerHTML = pageValues.title;
            pageLink.href = pageValues.url;
            pageLink.onclick = (event) => {
                event.preventDefault();
                chrome.tabs.create({ url: event.target.href, active: false });
            };
            pageItem.appendChild(pageLink);
            pageItem.append(document.createElement('br'));

            if (pageValues.messsage != '') {
                const pageMessage = document.createElement('p');
                pageMessage.innerHTML = pageValues.message;
                pageItem.append(document.createElement('br'));
                pageItem.append(pageMessage);
            }

            if (pageValues.timer != '') {
                const alarmTime = document.createElement('p');
                alarmTime.innerHTML = pageValues.timer;
                pageItem.append(document.createElement('br'));
                pageItem.append(alarmTime);
            }

            const pageRemoveButton = document.createElement('button');
            pageRemoveButton.innerHTML = "Remove";
            pageRemoveButton.onclick = async () => {
                await PageService.removePage(pageValues.url);
                await displayPages();
            };
            pageItem.append(document.createElement('br'));
            pageItem.append(pageRemoveButton);

        })
    });


    // if applicable, add clear button
    if (savedUrls.length > 1) {
        document.getElementById("clearAll").style.display = "initial";
    } else {
        document.getElementById("clearAll").style.display = "none";
    }
}