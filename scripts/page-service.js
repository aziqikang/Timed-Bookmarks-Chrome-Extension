/** @private */
const PAGES_KEY = 'pages';

/** Shared logic */
class PageService {

    // returns array of all keys/urls
    static getUrls = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.get([PAGES_KEY], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                const researches = result.pages ?? [];
                resolve(researches);
            });
        });

        return promise;
    }

    static getPage = (url) => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.get([url], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(result);
            });
        });

        return promise;
    }

    static savePage = async (title, url, message, alarmTime) => {

        const pages = await this.getUrls();
        const updatedPages = [...pages, url];

        const key = url;
        const value = {
            url: url,
            title: title,
            message: message,
            timer: alarmTime
        }

        // check that the url has not already been saved
        if (pages.includes(key)) {
            return;
        }

        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.set({ [key] : value }, () => {          
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(value);
            });
        }).then(toPromise((resolve, reject) => {
            chrome.storage.local.set({ [PAGES_KEY]: updatedPages }, () => {          
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(updatedPages);
            });
        }));

        return promise;
    }

    static removePage = async (url) => {
        const pages = await this.getUrls();
        const pageIndex = pages.indexOf(url);    // index of given page
        pages.splice(pageIndex, 1);

        console.log(pages);

        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.remove([url], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                resolve();
            });
        }).then(toPromise((resolve, reject) => {
            chrome.storage.local.set({[PAGES_KEY] : pages}, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                resolve();
            });
        }));

        return promise;
    }

    static clearPages = async () => {
        const pages = await this.getUrls();

        const promise = toPromise((resolve, reject) => {
            pages.forEach(url => {
                chrome.storage.local.remove([url], () => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);
    
                    resolve();
                });
            });
        }).then(toPromise((resolve, reject) => {
            chrome.storage.local.remove([PAGES_KEY], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                resolve();
            });
        }));

        return promise;
    }
}

/**
 * Promisify a callback.
 * @param {Function} callback 
 * @returns {Promise}
 */
const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}