// open bookmarks database
let db;
function startDatabase() {
    const request = indexedDB.open("BoomarksDatabase");
    request.onerror = (event) => {
        console.error("Web App IndexedDB request denied: " + event);
    };

    request.onsuccess = () => {
        console.log("Database successfully created!");
    };

    // create object store
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore("tabs", { keypath: "url", autoIncrement: true });
        objectStore.createIndex("name", "name", { unique: false });

        objectStore.transaction.oncomplete = (event) => {
            const customerObjectStore = db.transaction("tabs", "readwrite").objectStore("tabs");
        };
    };  
}

// generic error handler for all errors targeted at this database's requests!
db.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
};


// add tab to database
const addBookmark = (tab) => {
    // open a transaction
    const transaction = db.transaction(["tabs"], "readwrite");
    transaction.oncomplete = (event) => {
        console.log("Transaction Complete!");
    }; 
    transaction.onerror = (event) => {
        console.error("Database Transaction Error!");
    };

    // add object to object store
    const objectStore = transaction.objectStore("tabs");

    // make a request to add tab
    const request = objectStore.add(tab);
    request.onsuccess = (event) => {
        console.log("Bookmark succesfully added!");
    };
    request.onerror = (event) => {
        console.log("Error adding bookmark: " + event);
    };
};


// return whether tab exists by url
const hasBookmark = (url) => {
    var cursorRequest = db.openCursor(url);
    cursorRequest.onsuccess = (event) => {
    var cursor = event.result;
        if (cursor) {
            return true;
        } else {
            return false;
        };
    } ;
};


// delete tab from database
const deleteBookmark = (url) => {
    const transaction = db.transaction("tabs", "readwrite");
    const tabObjectStore = transaction.objectStore("tabs");

    // Make a request to delete the data
    const request = tabObjectStore.delete(url);

    request.onsuccess = (event) => {
        console.log("Bookmark deleted successfully!");
    };

    request.onerror = (event) => {
        console.error("Bookmark deletion failed: " + event)
    };
};


// update tab data
const updateBookmark = (url, tab) => {
    const userObjectStore = transaction.objectStore("tabs");

    // Make a request to get the data
    const getRequest = userObjectStore.get(url);

    // Handle a success event; get and update the old tab data
    getRequest.onsuccess = (event) => {
        const updatedTab = event.target.result;
        updatedTab.name = tab.name;
        const putRequest = userObjectStore.put(updatedTab);

        putRequest.onsuccess = (event) => {
            console.log("Tab successfully updated!");
        };
        putRequest.onerror = (event) => {
            console.error("Tab update failed: " + event);
        };
    };

    getRequest.onerror = function (event) {
        console.error("Tab update failed: tab get request failed: " + event);
    };
}
