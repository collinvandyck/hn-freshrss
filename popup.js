// popup.js
let currentQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    const { freshrssUrl } = await browser.storage.local.get('freshrssUrl');
    const saveFeedButton = document.getElementById('save-feed');
    saveFeedButton.disabled = !freshrssUrl || !currentQuery;
});

document.getElementById('open-settings').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
});

document.getElementById('search').addEventListener('input', async (e) => {
    currentQuery = e.target.value;
    const { freshrssUrl } = await browser.storage.local.get('freshrssUrl');
    const saveFeedButton = document.getElementById('save-feed');
    saveFeedButton.disabled = !freshrssUrl || !currentQuery;

    if (!currentQuery) {
        document.getElementById('results').innerHTML = '';
        return;
    }

    const searchUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(currentQuery)}&tags=(story)&sortBy=created_at_i:desc`;
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
});

document.getElementById('save-feed').addEventListener('click', async () => {
    const { freshrssUrl } = await browser.storage.local.get('freshrssUrl');
    const rssUrl = `https://hnrss.org/newest?q=${encodeURIComponent(currentQuery)}`;
    const subscribeUrl = `${freshrssUrl}/i/?c=feed&a=add&url_rss=${encodeURIComponent(rssUrl)}`;
    browser.tabs.create({ url: subscribeUrl });
});

