document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('options-form');

    browser.storage.local.get(['freshrssUrl', 'apiUser', 'apiKey', 'categoryId'])
        .then(({ freshrssUrl, apiUser, apiKey, categoryId }) => {
            if (freshrssUrl) document.getElementById('freshrss-url').value = freshrssUrl;
            if (apiUser) document.getElementById('api-user').value = apiUser;
            if (apiKey) document.getElementById('api-key').value = apiKey;
            if (categoryId) document.getElementById('category-id').value = categoryId;
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
        const categoryId = parseInt(document.getElementById('category-id').value) || 0;

        try {
            await browser.storage.local.set({
                freshrssUrl: url,
                apiUser,
                apiKey,
                categoryId
            });
            form.style.borderColor = 'green';
        } catch (error) {
            console.error(error);
            form.style.borderColor = 'red';
        }
    };
});
