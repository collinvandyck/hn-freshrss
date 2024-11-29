console.log("background.js starting...");
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type === 'saveFeed') {
        console.log("background.js got saveFeed message:", message);
        const { freshrssUrl, apiKey, rssUrl, categoryId } = message;
        const apiEndpoint = `${freshrssUrl}/api/greader.php/subscription/edit`;
        try {
            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `GoogleLogin auth=${apiKey}`
                },
                body: new URLSearchParams({
                    'ac': 'subscribe',
                    's': `feed/${rssUrl}`,
                    'T': apiKey,
                    'categories': categoryId?.toString() || '0'
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
