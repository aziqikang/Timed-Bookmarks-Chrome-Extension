document.addEventListener('DOMContentLoaded', async () => {

    const cuckoo = new Cuckoo();
    const tab = await cuckoo.getActiveTab();

    // Display history.
    await displayPages();

    // add tab
    const addCurrentTabBtn = document.getElementById("addCurrentTab");
    addCurrentTabBtn.onclick = async () => {
        await PageService.savePage(tab.title, tab.url);
        await displayPages();
    };

    // remove tab
    const clearAllButton = document.getElementById("clearAll");
    clearAllButton.onclick = async () => {
        await PageService.clearPages(tab.title, tab.url);
        await displayPages();
    };
});

const displayPages = async () => {
    const savedTabs = await PageService.getPages();
    const bookmarksList = document.getElementById('bookmarksList');
    bookmarksList.innerHTML = '';
    
    savedTabs.forEach(page => {
        const pageListItem = document.createElement('li');
        bookmarksList.appendChild(pageListItem);

        const pageItem = document.createElement('div');
        pageListItem.append(pageItem);
        
        const pageLink = document.createElement('a');
        pageLink.title = page.title;
        pageLink.innerHTML = page.title;
        pageLink.href = page.url;
        pageLink.onclick = (event) => {
            event.preventDefault();
            chrome.tabs.create({ url: event.target.href, active: false });
        };
        pageItem.appendChild(pageLink);

        const pageRemoveButton = document.createElement('button');
        pageRemoveButton.innerHTML = "remove";
        pageRemoveButton.onclick = async () => {
            await PageService.removePage(page.title, page.url);
            await displayPages();
        };
        pageItem.append(document.createElement('br'));
        pageItem.append(pageRemoveButton); 
    });
}