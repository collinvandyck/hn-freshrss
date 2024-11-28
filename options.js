// options.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('options-form');

    browser.storage.local.get('freshrssUrl').then(({ freshrssUrl }) => {
        if (freshrssUrl) {
            document.getElementById('freshrss-url').value = freshrssUrl;
        }
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const urlInput = document.getElementById('freshrss-url');
        let url = urlInput.value.trim();

        url = url.replace(/\/+$/, '');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        console.log("url", url);
        urlInput.value = url;

        try {
            await browser.storage.local.set({ freshrssUrl: url });
            urlInput.style.borderColor = 'green';
        } catch (error) {
            console.error(error);
            urlInput.style.borderColor = 'red';
        }
    };
});
