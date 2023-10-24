chrome.commands.onCommand.addListener(async (command) => {
    switch (command) {
        case 'saveTab':
            await saveCurrentTab();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

/**
 * Sends message to the content script with the currently active tab title.
 */
const saveCurrentTab = async () => {
    const cuckoo = new Cuckoo();
    const tab = await cuckoo.getActiveTab();

    chrome.tabs.sendMessage(tab.id, {
        tabTitle: tab.title
    });

    await PageService.savePage(tab.title, tab.url);
}

/**
 * Sends message to the content script with the currently active tab title.
 */
const removeCurrentTab = async () => {
    const cuckoo = new Cuckoo();
    const tab = await cuckoo.getActiveTab();

    chrome.tabs.sendMessage(tab.id, {
        tabTitle: tab.title
    });

    await PageService.removePage(tab.title, tab.url);
}