// popup.js
let currentQuery = '';
let debounceTimeout;

console.log("Popup loading...");

document.addEventListener('DOMContentLoaded', async () => {
    const { freshrssUrl } = await browser.storage.local.get('freshrssUrl');
    const saveFeedButton = document.getElementById('save-feed');
    saveFeedButton.disabled = !freshrssUrl || !currentQuery;

    document.getElementById('search').focus();
    console.log("Focused search field");
});

document.getElementById('open-settings').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
});

const performSearch = async (query) => {
    if (!query) {
        document.getElementById('results').innerHTML = '';
        return;
    }

    const searchUrl = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=(story)`;
    console.log("algolia:", searchUrl);
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
        document.getElementById('results').innerHTML = `Search failed: ${response.status}<p/>${response.body}`;
        return;
    }

    document.getElementById('results').innerHTML = data.hits.map(hit => `
    <div class="result">
      <a href="https://news.ycombinator.com/item?id=${hit.objectID}" target="_blank">
        ${hit.title}
      </a>
    </div>
  `).join('');
};

document.getElementById('search').addEventListener('input', async (e) => {
    currentQuery = e.target.value;
    const { freshrssUrl } = await browser.storage.local.get('freshrssUrl');
    const saveFeedButton = document.getElementById('save-feed');
    saveFeedButton.disabled = !freshrssUrl || !currentQuery;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => performSearch(currentQuery), 200);
});

document.getElementById('save-feed').addEventListener('click', async () => {
    console.log("save feed...");
    const { freshrssUrl, apiUser, apiKey, apiFolder } = await browser.storage.local.get([
        'freshrssUrl', 'apiUser', 'apiKey', 'apiFolder'
    ]);
    if (!freshrssUrl || !apiUser || !apiKey) {
        console.error('Missing FreshRSS configuration');
        return;
    }

    {
        let rssUrl = `https://hnrss.org/newest?q=${encodeURIComponent(currentQuery)}&search_attrs=title,url`;
        const title = `HN: ${currentQuery.trim()}`;
        try {
            console.log("popup sending message to background..");
            const result = await browser.runtime.sendMessage({
                type: 'saveFeed',
                freshrssUrl,
                apiUser,
                apiKey,
                rssUrl,
                apiFolder,
                currentQuery,
                title,
            });
            console.log("popup got response from background:", result);

            if (!result.success) throw new Error(result.error);

            const saveFeedButton = document.getElementById('save-feed');
            saveFeedButton.textContent = 'Saved!';
            setTimeout(() => { saveFeedButton.textContent = 'Save Feed'; }, 2000);
        } catch (error) {
            console.error('Failed to save feed:', error);
            document.getElementById('results').innerHTML = `Failed to save feed: ${error.message}`;
        }
    }
    {
        // TODO: add one for &points=N
        let rssUrl = `https://hnrss.org/newest?q=${encodeURIComponent(currentQuery)}&search_attrs=title,url&comments=1`;
        const title = `HN: ${currentQuery.trim()}: Active`;
        try {
            console.log("popup sending message to background..");
            const result = await browser.runtime.sendMessage({
                type: 'saveFeed',
                freshrssUrl,
                apiUser,
                apiKey,
                rssUrl,
                apiFolder,
                currentQuery,
                title,
            });
            console.log("popup got response from background:", result);

            if (!result.success) throw new Error(result.error);

            const saveFeedButton = document.getElementById('save-feed');
            saveFeedButton.textContent = 'Saved!';
            setTimeout(() => { saveFeedButton.textContent = 'Save Feed'; }, 2000);
        } catch (error) {
            console.error('Failed to save feed:', error);
            document.getElementById('results').innerHTML = `Failed to save feed: ${error.message}`;
        }
    }

});

