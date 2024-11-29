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
        const apiFolder = parseInt(document.getElementById('api-folder').value) || 0;

        try {
            await browser.storage.local.set({
                freshrssUrl: url,
                apiUser,
                apiKey,
                apiFolder,
            });
            form.style.borderColor = 'green';
        } catch (error) {
            console.error(error);
            form.style.borderColor = 'red';
        }
    };
});
