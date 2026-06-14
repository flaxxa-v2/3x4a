const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

// The PROXY endpoint - this is what defeats filters
app.get('/api/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('Missing ?url= parameter');
    }
    
    // decode if double-encoded
    try {
        targetUrl = decodeURIComponent(targetUrl);
    } catch(e) {}
    
    // ensure proper protocol
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }
    
    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        
        // forward relevant headers
        res.set('Content-Type', response.headers.get('content-type'));
        res.set('Access-Control-Allow-Origin', '*');
        
        let body = await response.text();
        
        // REWRITE URLs within the HTML to keep everything proxied
        // This is critical - replaces all links to go back through proxy
        body = body.replace(/(href|src)=["'](https?:\/\/[^"']+)["']/gi, (match, attr, url) => {
            return `${attr}="/api/proxy?url=${encodeURIComponent(url)}"`;
        });
        
        // also rewrite relative paths to absolute via proxy
        body = body.replace(/(href|src)=["']\/([^"']+)["']/gi, (match, attr, path) => {
            const baseUrl = new URL(targetUrl);
            const absolute = `${baseUrl.origin}/${path}`;
            return `${attr}="/api/proxy?url=${encodeURIComponent(absolute)}"`;
        });
        
        res.send(body);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send(`Proxy error: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`FLAXXA Proxy running on http://localhost:${PORT}`);
});
