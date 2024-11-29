document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('options-form');

    browser.storage.local.get(['freshrssUrl', 'apiUser', 'apiKey', 'apiFolder'])
        .then(({ freshrssUrl, apiUser, apiKey, apiFolder }) => {
            if (freshrssUrl) document.getElementById('freshrss-url').value = freshrssUrl;
            if (apiUser) document.getElementById('api-user').value = apiUser;
            if (apiKey) document.getElementById('api-key').value = apiKey;
            if (apiFolder) document.getElementById('api-folder').value = folder;
        });

    form.onsubmit = async (e) => {
        e.preventDefault();
        let url = document.getElementById('freshrss-url').value.trim();
        url = url.replace(/\/+$/, '');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const apiUser = document.getElementById('api-user').value.trim();
        const apiKey = document.getElementById('api-key').value.trim();
        const apiFolder = document.getElementById('api-folder').value.trim();

        try {
            const payload = {
                freshrssUrl: url,
                apiUser,
                apiKey,
                apiFolder,
            };
            console.log("Storing:", payload);
            await browser.storage.local.set(payload);
            form.style.borderColor = 'green';
        } catch (error) {
            console.error(error);
            form.style.borderColor = 'red';
        }
    };
});
