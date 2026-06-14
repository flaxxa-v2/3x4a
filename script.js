const PROXY_API = '/api/proxy?url=';

const GAMES = [
    { name: '🏀 BasketBros', target: 'https://basketbros.io/embed/' },
    { name: '🏈 Retro Bowl', target: 'https://retrobowl.me/game/' },
    { name: '🎮 Slope', target: 'https://slope-game.github.io/' },
    { name: '🧩 2048', target: 'https://play2048.co/' },
    { name: '⚡ Shell Shockers', target: 'https://shellshock.io/' },
    { name: '🕹️ Pacman', target: 'https://pacman.holenet.gr/' }
];

const APPS = [
    { name: '🎬 YouTube', target: 'https://www.youtube.com/embed/videoseries?list=RDMM' },
    { name: '🐦 X (Twitter)', target: 'https://xcancel.com/' },
    { name: '📸 Instagram', target: 'https://www.instagram.com/p/C2JXU-1oQWd/embed/captioned' },
    { name: '🎵 Spotify', target: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M' },
    { name: '📹 TikTok', target: 'https://www.tiktok.com/embed/v2/7123456789012345678' },
    { name: '📘 Facebook', target: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook' }
];

let activeTab = 'games';
let currentIframeUrl = 'about:blank';

const mainFrame = document.getElementById('mainFrame');
const activeTitleSpan = document.getElementById('activeTitle');
const sidebarDiv = document.getElementById('sidebarContent');

function getProxiedUrl(targetUrl) {
    return PROXY_API + encodeURIComponent(targetUrl);
}

function loadContent(targetUrl, title) {
    const proxied = getProxiedUrl(targetUrl);
    currentIframeUrl = proxied;
    mainFrame.src = proxied;
    activeTitleSpan.innerText = title || 'Loading...';
    
    // remove browser bar if present
    const bar = document.getElementById('browserControlBar');
    if (bar) bar.remove();
}

function renderSidebar() {
    if (activeTab === 'games') {
        sidebarDiv.innerHTML = `<div class="category-title">🎮 UNBLOCKED GAMES</div><div class="icon-grid" id="gamesGrid"></div>`;
        const grid = document.getElementById('gamesGrid');
        GAMES.forEach(game => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `<span>${game.name}</span>`;
            card.onclick = () => loadContent(game.target, game.name);
            grid.appendChild(card);
        });
    } 
    else if (activeTab === 'apps') {
        sidebarDiv.innerHTML = `<div class="category-title">📱 UNBLOCKED APPS</div><div class="icon-grid" id="appsGrid"></div>`;
        const grid = document.getElementById('appsGrid');
        APPS.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `<span>${app.name}</span>`;
            card.onclick = () => loadContent(app.target, app.name);
            grid.appendChild(card);
        });
    }
    else if (activeTab === 'browser') {
        sidebarDiv.innerHTML = `
            <div class="category-title">🌐 PROXY BROWSER</div>
            <div style="margin-bottom: 12px; font-size:0.8rem;">🔒 All traffic routes through proxy - no filters can see destination</div>
            <div style="display: flex; gap: 8px; flex-wrap:wrap;">
                <button class="app-card" id="browserGoogle">Google</button>
                <button class="app-card" id="browserYT">YouTube</button>
                <button class="app-card" id="browserReddit">Reddit</button>
            </div>
        `;
        
        // inject browser bar into iframe header area
        if (!document.getElementById('browserControlBar')) {
            const bar = document.createElement('div');
            bar.id = 'browserControlBar';
            bar.className = 'browser-bar';
            bar.innerHTML = `
                <input type="text" id="browserUrlInput" class="browser-url" placeholder="Search or enter URL..." value="https://www.google.com">
                <button id="browserGoBtn" class="browser-go">Go 🔍</button>
            `;
            document.querySelector('.iframe-header').after(bar);
            
            document.getElementById('browserGoBtn').addEventListener('click', () => {
                let query = document.getElementById('browserUrlInput').value.trim();
                if (query.includes('.') && !query.includes(' ')) {
                    let url = query.startsWith('http') ? query : 'https://' + query;
                    loadContent(url, 'Browser');
                } else {
                    loadContent(`https://www.google.com/search?q=${encodeURIComponent(query)}`, 'Search');
                }
            });
        }
        
        document.getElementById('browserGoogle')?.addEventListener('click', () => loadContent('https://www.google.com', 'Google'));
        document.getElementById('browserYT')?.addEventListener('click', () => loadContent('https://www.youtube.com', 'YouTube'));
        document.getElementById('browserReddit')?.addEventListener('click', () => loadContent('https://www.reddit.com', 'Reddit'));
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        renderSidebar();
    });
});

// UI Controls
document.getElementById('resetIframeBtn').addEventListener('click', () => {
    const panel = document.getElementById('iframePanel');
    panel.style.width = '';
    panel.style.height = '';
});

document.getElementById('fullViewBtn').addEventListener('click', () => {
    const panel = document.getElementById('iframePanel');
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.width = '100vw';
    panel.style.height = '100vh';
    panel.style.zIndex = '1000';
    panel.style.borderRadius = '0';
    const exit = document.createElement('button');
    exit.innerText = 'Exit Full';
    exit.style.position = 'fixed';
    exit.style.bottom = '20px';
    exit.style.right = '20px';
    exit.style.zIndex = '1001';
    exit.style.background = 'red';
    exit.style.padding = '8px 16px';
    exit.style.borderRadius = '30px';
    exit.onclick = () => { panel.style.position = ''; panel.style.width = ''; panel.style.height = ''; panel.style.borderRadius = '28px'; exit.remove(); };
    document.body.appendChild(exit);
});

document.getElementById('closeIframeBtn').addEventListener('click', () => {
    mainFrame.src = 'about:blank';
    activeTitleSpan.innerText = 'Idle';
});

// Initial load
renderSidebar();
loadContent('https://basketbros.io/embed/', 'BasketBros');
