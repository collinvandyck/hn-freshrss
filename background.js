console.log("background.js starting...");
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type === 'saveFeed') {
        console.log("background.js got saveFeed message:", message);
        const { freshrssUrl, apiUser, apiKey, rssUrl, apiFolder, title } = message;
        const apiEndpoint = `${freshrssUrl}/api/greader.php/reader/api/0/subscription/edit`;
        try {
            if (apiFolder === undefined) {
                a = '';
            } else {
                a = `user/collin/label/${apiFolder}`
            }
            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `GoogleLogin auth=${apiUser}/${apiKey}`
                },
                body: new URLSearchParams({
                    's': `feed/${rssUrl}`,
                    't': title,
                    'ac': 'subscribe',
                    'a': a,
                })
            };
            console.log("background.js sending request:", request);
            const response = await fetch(apiEndpoint, request);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});
console.log("background.js added listener");
