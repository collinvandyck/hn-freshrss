let currentQuery = '';

document.getElementById('search').addEventListener('input', async (e) => {
    currentQuery = e.target.value;
    const saveButton = document.getElementById('save-feed');
    saveButton.disabled = !currentQuery;

    if (!currentQuery) {
        document.getElementById('results').innerHTML = '';
        return;
    }

    const response = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(currentQuery)}&tags=(story)`
    );
    const data = await response.json();

    document.getElementById('results').innerHTML = data.hits.map(hit => `
    <div class="result">
      <a href="https://news.ycombinator.com/item?id=${hit.objectID}" target="_blank">
        ${hit.title}
      </a>
    </div>
  `).join('');
});

document.getElementById('save-feed').addEventListener('click', () => {
    const freshrssUrl = document.getElementById('freshrss-url').value;
    const rssUrl = `https://hnrss.org/newest?q=${encodeURIComponent(currentQuery)}`;
    const subscribeUrl = `${freshrssUrl}/i/?c=feed&a=add&url_rss=${encodeURIComponent(rssUrl)}`;
    browser.tabs.create({ url: subscribeUrl });
});
