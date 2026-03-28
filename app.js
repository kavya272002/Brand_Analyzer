// ===== Brand & Industry Analyzer — Fully Dynamic AI-First App =====
(function() {
  'use strict';

  // ─── DOM Elements ───
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const autocompleteList = document.getElementById('autocomplete');
  const hero = document.getElementById('hero');
  const dashboard = document.getElementById('dashboard');
  const dashboardTitle = document.getElementById('dashboardTitle');
  const backBtn = document.getElementById('backBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeModal = document.getElementById('closeModal');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKey = document.getElementById('saveApiKey');
  const clearApiKey = document.getElementById('clearApiKey');
  const toggleKeyVisibility = document.getElementById('toggleKeyVisibility');
  const apiKeyStatus = document.getElementById('apiKeyStatus');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');
  const sourceLabel = document.getElementById('sourceLabel');
  const categoryGrid = document.getElementById('categoryGrid');
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');
  const refreshBtn = document.getElementById('refreshBtn');
  const exportBtn = document.getElementById('exportBtn');
  const compareBtn = document.getElementById('compareBtn');
  const compareBar = document.getElementById('compareBar');
  const compareInput = document.getElementById('compareInput');
  const compareGoBtn = document.getElementById('compareGoBtn');
  const shareBtn = document.getElementById('shareBtn');
  const compareCancelBtn = document.getElementById('compareCancelBtn');
  const comparePanel = document.getElementById('comparePanel');
  const comparePanelTitle = document.getElementById('comparePanelTitle');
  const compareContent = document.getElementById('compareContent');
  const closeCompare = document.getElementById('closeCompare');
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const welcomeApiKey = document.getElementById('welcomeApiKey');
  const welcomeConnectBtn = document.getElementById('welcomeConnectBtn');
  const welcomeStatus = document.getElementById('welcomeStatus');

  const API_KEY_STORAGE = 'brandAnalyzer_geminiApiKey';
  const CACHE_STORAGE = 'brandAnalyzer_cache';
  const HISTORY_STORAGE = 'brandAnalyzer_history';

  let currentQuery = '';
  let currentData = null;

  // ─── Cache Helpers ───
  function getCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_STORAGE) || '{}'); } catch { return {}; }
  }
  function setCache(key, data) {
    const cache = getCache();
    cache[key.toLowerCase().trim()] = { data, timestamp: Date.now() };
    // Keep cache under 50 entries
    const keys = Object.keys(cache);
    if (keys.length > 50) {
      const sorted = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
      for (let i = 0; i < keys.length - 50; i++) delete cache[sorted[i]];
    }
    localStorage.setItem(CACHE_STORAGE, JSON.stringify(cache));
  }
  function getCached(key) {
    const cache = getCache();
    const entry = cache[key.toLowerCase().trim()];
    if (entry) return entry.data;
    return null;
  }

  // ─── History Helpers ───
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE) || '[]'); } catch { return []; }
  }
  function addToHistory(name) {
    let history = getHistory();
    history = history.filter(h => h.toLowerCase() !== name.toLowerCase());
    history.unshift(name);
    if (history.length > 12) history = history.slice(0, 12);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(history));
    renderHistory();
  }
  function removeFromHistory(name) {
    let history = getHistory().filter(h => h !== name);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(history));
    renderHistory();
  }
  function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
      historySection.style.display = 'none';
      return;
    }
    historySection.style.display = 'block';
    historyList.innerHTML = history.map(h => `
      <button class="history-pill" data-query="${escapeHtml(h)}">
        <span>⚡ ${escapeHtml(h)}</span>
        <span class="pill-close" data-remove="${escapeHtml(h)}">✕</span>
      </button>
    `).join('');

    historyList.querySelectorAll('.history-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        if (e.target.classList.contains('pill-close')) {
          removeFromHistory(e.target.dataset.remove);
          return;
        }
        searchInput.value = pill.dataset.query;
        performSearch(pill.dataset.query);
      });
    });
  }

  // ─── Category Explorer ───
  function renderCategories(cat) {
    const items = CATEGORIES[cat] || [];
    categoryGrid.innerHTML = items.map(item => `
      <button class="cat-item" data-query="${escapeHtml(item.query)}">
        <span class="cat-item-icon">${item.icon}</span>
        <span class="cat-item-name">${escapeHtml(item.name)}</span>
      </button>
    `).join('');

    categoryGrid.querySelectorAll('.cat-item').forEach(btn => {
      btn.addEventListener('click', () => {
        searchInput.value = btn.dataset.query;
        performSearch(btn.dataset.query);
      });
    });
  }

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCategories(tab.dataset.cat);
    });
  });

  // Dashboard section tabs
  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const section = tab.dataset.section;
      document.querySelectorAll('.dash-section').forEach(el => {
        if (section === 'all') {
          el.classList.remove('section-hidden');
        } else {
          el.classList.toggle('section-hidden', el.dataset.section !== section);
        }
      });
      // Also show/hide analysis rows
      document.querySelectorAll('.analysis-row').forEach(row => {
        if (section === 'all') {
          row.style.display = '';
        } else {
          const children = row.querySelectorAll('.dash-section');
          const anyVisible = Array.from(children).some(c => !c.classList.contains('section-hidden'));
          row.style.display = anyVisible ? '' : 'none';
        }
      });
    });
  });

  // ─── Settings Modal ───
  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) {
      apiKeyInput.value = saved;
      apiKeyStatus.textContent = '✅ API key is saved and active';
      apiKeyStatus.className = 'api-key-status success';
    } else {
      apiKeyInput.value = '';
      apiKeyStatus.textContent = '';
    }
  });

  closeModal.addEventListener('click', () => settingsModal.style.display = 'none');
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
  });

  saveApiKey.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      apiKeyStatus.textContent = '❌ Please enter an API key';
      apiKeyStatus.className = 'api-key-status error';
      return;
    }
    // Always save the key first
    localStorage.setItem(API_KEY_STORAGE, key);
    settingsBtn.textContent = '✅ AI Connected';

    apiKeyStatus.textContent = '⏳ Verifying key...';
    apiKeyStatus.className = 'api-key-status loading';
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with just the word ok' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });
      if (res.ok) {
        apiKeyStatus.textContent = '✅ Key verified and saved! You can now analyze anything.';
        apiKeyStatus.className = 'api-key-status success';
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${res.status}`;
        if (res.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.includes('limit: 0')) {
          apiKeyStatus.innerHTML = `⚠️ Key saved but free quota is exhausted (Limit: 0). <br><small style="opacity:0.7">Google AI Studio requires a linked billing account (even for free tier) to unlock quotas. <a href="https://console.cloud.google.com/billing" target="_blank" style="color:var(--accent-blue)">Check Billing here.</a></small>`;
        } else {
          apiKeyStatus.innerHTML = `⚠️ Key saved but verification got error: <br><small style="opacity:0.7">${escapeHtml(errMsg)}</small><br><small>Try searching anyway — it might still work!</small>`;
        }
        apiKeyStatus.className = 'api-key-status error';
      }
    } catch (err) {
      // Network/CORS error (common when opening from file://)
      apiKeyStatus.innerHTML = `✅ Key saved! <br><small style="opacity:0.7">⚠️ Could not verify (${escapeHtml(err.message || 'network error')}) — this is normal when opening from a local file. Try searching a brand to test it!</small>`;
      apiKeyStatus.className = 'api-key-status success';
    }
  });

  clearApiKey.addEventListener('click', () => {
    localStorage.removeItem(API_KEY_STORAGE);
    apiKeyInput.value = '';
    apiKeyStatus.textContent = 'Key removed';
    apiKeyStatus.className = 'api-key-status';
    settingsBtn.textContent = '⚙️ Set AI API Key (Free)';
  });

  toggleKeyVisibility.addEventListener('click', () => {
    apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
  });

  if (localStorage.getItem(API_KEY_STORAGE)) {
    settingsBtn.textContent = '✅ AI Connected';
  }

  // ─── Onboarding ───
  function checkOnboarding() {
    const key = localStorage.getItem(API_KEY_STORAGE);
    if (!key) {
      welcomeOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else {
      welcomeOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  welcomeConnectBtn.addEventListener('click', async () => {
    const key = welcomeApiKey.value.trim();
    if (!key) {
      welcomeStatus.textContent = '❌ Please enter a key';
      welcomeStatus.className = 'welcome-status error';
      return;
    }
    welcomeStatus.textContent = '⏳ Verifying...';
    welcomeStatus.className = 'welcome-status loading';
    
    try {
      const isOk = await verifyKey(key);
      if (isOk) {
        localStorage.setItem(API_KEY_STORAGE, key);
        settingsBtn.textContent = '✅ AI Connected';
        welcomeStatus.textContent = '🚀 Connected! Getting things ready...';
        welcomeStatus.className = 'welcome-status success';
        
        setTimeout(() => {
          welcomeOverlay.classList.add('fade-out');
          setTimeout(() => {
            welcomeOverlay.style.display = 'none';
            document.body.style.overflow = '';
          }, 500);
        }, 1000);
      } else {
        welcomeStatus.innerHTML = `❌ Verification failed. <br><small>Check your key or connectivity.</small>`;
        welcomeStatus.className = 'welcome-status error';
      }
    } catch (e) {
      // Fallback for local files
      localStorage.setItem(API_KEY_STORAGE, key);
      welcomeOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  async function verifyKey(key) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ok' }] }],
          generationConfig: { maxOutputTokens: 5 }
        })
      });
      return res.ok;
    } catch { return false; }
  }

  // ─── Search Events ───
  searchBtn.addEventListener('click', () => performSearch(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch(searchInput.value);
    if (e.key === 'ArrowDown') navigateAutocomplete(1);
    if (e.key === 'ArrowUp') navigateAutocomplete(-1);
  });
  searchInput.addEventListener('input', () => showAutocomplete(searchInput.value));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) hideAutocomplete();
  });

  backBtn.addEventListener('click', () => {
    dashboard.style.display = 'none';
    hero.style.display = 'flex';
    searchInput.value = '';
    comparePanel.style.display = 'none';
    compareBar.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Dashboard Action Buttons ───
  refreshBtn.addEventListener('click', () => {
    if (!currentQuery) return;
    const apiKey = localStorage.getItem(API_KEY_STORAGE);
    if (!apiKey) {
      settingsBtn.click();
      return;
    }
    fetchFromGemini(currentQuery, apiKey, true);
  });

  exportBtn.addEventListener('click', () => {
    window.print();
  });

  compareBtn.addEventListener('click', () => {
    compareBar.style.display = compareBar.style.display === 'none' ? 'block' : 'none';
    compareInput.focus();
  });

  compareGoBtn.addEventListener('click', () => {
    const q = compareInput.value.trim();
    if (!q) return;
    performCompare(q);
  });

  compareInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = compareInput.value.trim();
      if (q) performCompare(q);
    }
  });

  compareCancelBtn.addEventListener('click', () => {
    compareBar.style.display = 'none';
    comparePanel.style.display = 'none';
  });

  closeCompare.addEventListener('click', () => {
    comparePanel.style.display = 'none';
    compareBar.style.display = 'none';
  });
  
  // Share Button
  shareBtn.addEventListener('click', () => {
    const text = `Check out this strategic analysis of "${currentQuery}" powered by Gemini AI!`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Brand AI Analyzer',
        text: text,
        url: url
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '✅ Link Copied';
        setTimeout(() => { shareBtn.innerHTML = originalText; }, 2000);
      });
    }
  });

  let activeAcIndex = -1;

  // ─── Autocomplete (searches built-in + cache + categories) ───
  function getAllSearchable() {
    const items = [];
    // Built-in
    for (const key in BRAND_DATA) {
      items.push({ name: BRAND_DATA[key].name, type: BRAND_DATA[key].type, query: key, source: 'builtin' });
    }
    // Cached
    const cache = getCache();
    for (const key in cache) {
      if (!items.find(i => i.query === key)) {
        items.push({ name: cache[key].data.name || key, type: cache[key].data.type || 'brand', query: key, source: 'cached' });
      }
    }
    // Categories
    for (const cat of Object.values(CATEGORIES)) {
      for (const item of cat) {
        if (!items.find(i => i.name.toLowerCase() === item.name.toLowerCase())) {
          items.push({ name: item.name, type: 'suggestion', query: item.query, source: 'category' });
        }
      }
    }
    return items;
  }

  function showAutocomplete(query) {
    const q = query.toLowerCase().trim();
    activeAcIndex = -1;
    if (!q) { hideAutocomplete(); return; }

    const all = getAllSearchable();
    const matches = all
      .map(item => {
        let score = 0;
        const name = item.name.toLowerCase();
        const queryLower = item.query.toLowerCase();
        if (name === q || queryLower === q) score = 100;
        else if (name.startsWith(q) || queryLower.startsWith(q)) score = 80;
        else if (name.includes(q) || queryLower.includes(q)) score = 50;
        return { ...item, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (matches.length === 0) { hideAutocomplete(); return; }

    autocompleteList.innerHTML = matches.map((m, i) => `
      <div class="autocomplete-item" data-query="${escapeHtml(m.query)}" data-index="${i}">
        <span class="ac-type ${m.source === 'cached' ? 'cached' : m.type}">${m.source === 'cached' ? '⚡ cached' : m.type}</span>
        <span>${highlightMatch(m.name, query)}</span>
      </div>
    `).join('');
    autocompleteList.classList.add('show');
    autocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        searchInput.value = item.dataset.query;
        performSearch(item.dataset.query);
        hideAutocomplete();
      });
    });
  }

  function hideAutocomplete() {
    autocompleteList.classList.remove('show');
    activeAcIndex = -1;
  }

  function navigateAutocomplete(dir) {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;
    items.forEach(i => i.classList.remove('active'));
    activeAcIndex += dir;
    if (activeAcIndex < 0) activeAcIndex = items.length - 1;
    if (activeAcIndex >= items.length) activeAcIndex = 0;
    items[activeAcIndex].classList.add('active');
    searchInput.value = items[activeAcIndex].dataset.query;
  }

  function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) + '<strong style="color:var(--accent-blue)">' +
      text.substring(idx, idx + query.length) + '</strong>' + text.substring(idx + query.length);
  }

  // ─── Main Search ───
  async function performSearch(query) {
    hideAutocomplete();
    const q = query.trim();
    if (!q) return;
    currentQuery = q;

    // 1. Check built-in
    const builtin = findMatch(q);
    if (builtin) {
      currentData = builtin;
      addToHistory(builtin.name);
      renderDashboard(builtin, 'builtin');
      return;
    }

    // 2. Check cache
    const cached = getCached(q);
    if (cached) {
      currentData = cached;
      addToHistory(cached.name || q);
      renderDashboard(cached, 'cached');
      return;
    }

    // 3. AI
    const apiKey = localStorage.getItem(API_KEY_STORAGE);
    if (!apiKey) {
      showNoApiKeyMessage(q);
      return;
    }

    await fetchFromGemini(q, apiKey, false);
  }

  function findMatch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return null;
    if (BRAND_DATA[q]) return BRAND_DATA[q];
    for (const key in BRAND_DATA) {
      const entry = BRAND_DATA[key];
      if (entry.name.toLowerCase() === q) return entry;
      if (entry.name.toLowerCase().includes(q)) return entry;
      if (entry.keywords && entry.keywords.some(kw => kw.includes(q))) return entry;
    }
    return null;
  }

  // ─── Gemini AI ───
  async function fetchFromGemini(query, apiKey, forceRefresh) {
    showLoading(query);
    try {
      const prompt = buildPrompt(query);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8000,
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API Error: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response from AI');

      const parsed = JSON.parse(text);
      hideLoading();

      // Cache the result
      setCache(query, parsed);
      currentData = parsed;
      addToHistory(parsed.name || query);
      renderDashboard(parsed, forceRefresh ? 'ai-refreshed' : 'ai');

    } catch (err) {
      hideLoading();
      showError(query, err.message);
    }
  }

  // Compare flow
  async function performCompare(query) {
    const q = query.trim();
    if (!q) return;

    // Check built-in
    const builtin = findMatch(q);
    if (builtin) {
      renderComparePanel(builtin, 'builtin');
      return;
    }

    // Check cache
    const cached = getCached(q);
    if (cached) {
      renderComparePanel(cached, 'cached');
      return;
    }

    // AI
    const apiKey = localStorage.getItem(API_KEY_STORAGE);
    if (!apiKey) {
      alert('Please set your Gemini API key first to compare with AI.');
      return;
    }

    showLoading(q);
    try {
      const prompt = buildPrompt(q);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8000, responseMimeType: "application/json" }
          })
        }
      );
      if (!response.ok) throw new Error('API Error');
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response');
      const parsed = JSON.parse(text);
      hideLoading();
      setCache(q, parsed);
      renderComparePanel(parsed, 'ai');
    } catch (err) {
      hideLoading();
      alert('Could not analyze: ' + err.message);
    }
  }

  function buildPrompt(query) {
    return `You are a strategic business analyst. Provide a comprehensive strategic analysis for: "${query}"

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "name": "Full official name of the brand/industry",
  "type": "brand or industry",
  "overview": "A 3-4 sentence overview paragraph about this brand/industry, including its market position, key facts, and significance. Focus on India market context where relevant.",
  "metrics": [
    {"label": "Metric Name 1", "value": "Value", "color": "blue"},
    {"label": "Metric Name 2", "value": "Value", "color": "green"},
    {"label": "Metric Name 3", "value": "Value", "color": "purple"},
    {"label": "Metric Name 4", "value": "Value", "color": "cyan"}
  ],
  "pestel": {
    "political": ["Point 1", "Point 2", "Point 3"],
    "economic": ["Point 1", "Point 2", "Point 3"],
    "social": ["Point 1", "Point 2", "Point 3"],
    "technological": ["Point 1", "Point 2", "Point 3"],
    "environmental": ["Point 1", "Point 2", "Point 3"],
    "legal": ["Point 1", "Point 2", "Point 3"]
  },
  "portersFiveForces": [
    {"name": "Threat of New Entrants", "rating": "High or Medium or Low", "desc": "Explanation"},
    {"name": "Bargaining Power of Suppliers", "rating": "High or Medium or Low", "desc": "Explanation"},
    {"name": "Bargaining Power of Buyers", "rating": "High or Medium or Low", "desc": "Explanation"},
    {"name": "Threat of Substitutes", "rating": "High or Medium or Low", "desc": "Explanation"},
    {"name": "Competitive Rivalry", "rating": "High or Medium or Low", "desc": "Explanation"}
  ],
  "swot": {
    "strengths": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "weaknesses": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "opportunities": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "threats": ["Point 1", "Point 2", "Point 3", "Point 4"]
  },
  "gaps": [
    {"title": "Gap Title 1", "desc": "Description of the gap and market opportunity"},
    {"title": "Gap Title 2", "desc": "Description"},
    {"title": "Gap Title 3", "desc": "Description"},
    {"title": "Gap Title 4", "desc": "Description"}
  ],
  "recommendations": [
    {"title": "Recommendation 1", "desc": "Actionable recommendation with specific details"},
    {"title": "Recommendation 2", "desc": "Description"},
    {"title": "Recommendation 3", "desc": "Description"},
    {"title": "Recommendation 4", "desc": "Description"},
    {"title": "Recommendation 5", "desc": "Description"}
  ],
  "ansoff": {
    "marketPenetration": {"strategy": "Strategic Title", "description": "Actionable detail"},
    "marketDevelopment": {"strategy": "Strategic Title", "description": "Actionable detail"},
    "productDevelopment": {"strategy": "Strategic Title", "description": "Actionable detail"},
    "diversification": {"strategy": "Strategic Title", "description": "Actionable detail"}
  },
  "valueChain": [
    {"icon": "emoji", "title": "Step 1", "desc": "Description"},
    {"icon": "emoji", "title": "Step 2", "desc": "Description"},
    {"icon": "emoji", "title": "Step 3", "desc": "Description"},
    {"icon": "emoji", "title": "Step 4", "desc": "Description"},
    {"icon": "emoji", "title": "Step 5", "desc": "Description"},
    {"icon": "emoji", "title": "Step 6", "desc": "Description"}
  ]
}

Important rules:
- metrics color must be one of: blue, green, purple, cyan, orange
- portersFiveForces rating must be exactly "High", "Medium", or "Low"
- Each PESTEL factor should have exactly 3 insightful bullet points
- Each SWOT quadrant should have exactly 4 points
- ansoff strategies should be short (3-5 words) and descriptions should be 1-2 impactful sentences
- Include India-specific context where applicable for an Indian MBA student audience
- Be specific with data points, percentages, and company names
- valueChain icon should be a single relevant emoji`;
  }

  // ─── Loading ───
  function showLoading(query) {
    loadingText.textContent = `Generating analysis for "${query}"...`;
    // Reset step animations
    document.querySelectorAll('.loading-step').forEach(s => {
      s.style.animation = 'none';
      s.offsetHeight;
      s.style.animation = '';
    });
    loadingOverlay.style.display = 'flex';
  }

  function hideLoading() {
    loadingOverlay.style.display = 'none';
  }

  // ─── Messages ───
  function showNoApiKeyMessage(query) {
    hero.style.display = 'none';
    dashboard.style.display = 'block';
    dashboardTitle.textContent = `"${escapeHtml(query)}" — AI Required`;

    hideAllCards();
    const overviewCard = document.getElementById('overviewCard');
    overviewCard.style.display = 'block';
    overviewCard.classList.remove('section-hidden');
    overviewCard.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">🤖</div>
        <h3>"${escapeHtml(query)}" needs AI analysis</h3>
        <p>Set up your <strong>free</strong> Gemini API key to analyze any brand or industry:</p>
        <ol class="setup-steps" style="text-align:left;max-width:400px;margin:1rem auto;">
          <li>Go to <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--accent-blue)">Google AI Studio</a></li>
          <li>Click <strong>"Create API Key"</strong> (free, no credit card)</li>
          <li>Come back and click the <strong>"⚙️ Set AI API Key"</strong> button</li>
          <li>Search again!</li>
        </ol>
        <button onclick="document.getElementById('settingsBtn').click()" style="padding:10px 24px;border:none;border-radius:100px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;font-weight:700;cursor:pointer;font-size:0.95rem;margin-top:0.5rem;">⚙️ Set Up AI Now</button>
      </div>`;
    sourceLabel.textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showError(query, message) {
    hero.style.display = 'none';
    dashboard.style.display = 'block';
    dashboardTitle.textContent = 'Error';

    hideAllCards();
    const overviewCard = document.getElementById('overviewCard');
    overviewCard.style.display = 'block';
    overviewCard.classList.remove('section-hidden');
    overviewCard.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">⚠️</div>
        <h3>Could not analyze "${escapeHtml(query)}"</h3>
        <p style="color:var(--accent-red);font-weight:600;">${escapeHtml(message)}</p>
        <p>Try checking your API key or try a different search term.</p>
        <button onclick="document.getElementById('settingsBtn').click()" style="padding:10px 24px;border:none;border-radius:100px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;font-weight:700;cursor:pointer;font-size:0.95rem;margin-top:1rem;">⚙️ Check API Key</button>
      </div>`;
    sourceLabel.textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function hideAllCards() {
    ['overviewCard','pestelCard','porterCard','swotCard','gapsCard','recsCard','ansoffCard','valueChainCard'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Render Dashboard ───
  function renderDashboard(data, source) {
    hero.style.display = 'none';
    dashboard.style.display = 'block';
    dashboardTitle.textContent = data.name;

    // Source label
    const sourceMap = {
      'ai': { text: '🤖 AI-Generated Analysis (Gemini)', cls: 'ai' },
      'ai-refreshed': { text: '🤖 Freshly Regenerated with AI', cls: 'ai' },
      'builtin': { text: '📚 Built-in Knowledge Base', cls: 'builtin' },
      'cached': { text: '⚡ Loaded from Cache (Instant)', cls: 'cached' }
    };
    const src = sourceMap[source] || sourceMap.ai;
    sourceLabel.textContent = src.text;
    sourceLabel.className = 'source-label ' + src.cls;

    // Reset tabs to "All"
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.dash-tab[data-section="all"]').classList.add('active');

    // Show all cards and reset
    ['overviewCard','pestelCard','porterCard','swotCard','gapsCard','recsCard','ansoffCard','valueChainCard'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = '';
        el.classList.remove('section-hidden');
        el.innerHTML = '';
      }
    });

    // Show analysis rows
    document.querySelectorAll('.analysis-row').forEach(r => r.style.display = '');

    renderOverview(data);
    renderPestel(data);
    renderPorter(data);
    renderSwot(data);
    renderGaps(data);
    renderRecommendations(data);
    renderAnsoff(data);
    renderValueChain(data);

    // Re-trigger animations
    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Render Compare Panel ───
  function renderComparePanel(data, source) {
    comparePanelTitle.textContent = `⚖️ vs ${data.name}`;
    comparePanel.style.display = 'block';

    compareContent.innerHTML = `
      ${renderOverviewHTML(data)}
      <div class="analysis-row">
        ${renderPestelHTML(data)}
        ${renderPorterHTML(data)}
      </div>
      ${renderSwotHTML(data)}
      <div class="analysis-row">
        ${renderGapsHTML(data)}
        ${renderRecsHTML(data)}
      </div>
      ${renderAnsoffHTML(data)}
      ${renderValueChainHTML(data)}
    `;

    comparePanel.scrollIntoView({ behavior: 'smooth' });
  }

  // ─── Section Renderers (DOM-based) ───
  function renderOverview(data) {
    document.getElementById('overviewCard').innerHTML = renderOverviewHTML(data);
  }
  function renderPestel(data) {
    document.getElementById('pestelCard').innerHTML = renderPestelInner(data);
  }
  function renderPorter(data) {
    document.getElementById('porterCard').innerHTML = renderPorterInner(data);
  }
  function renderSwot(data) {
    document.getElementById('swotCard').innerHTML = renderSwotInner(data);
  }
  function renderGaps(data) {
    document.getElementById('gapsCard').innerHTML = renderGapsInner(data);
  }
  function renderRecommendations(data) {
    document.getElementById('recsCard').innerHTML = renderRecsInner(data);
  }
  function renderValueChain(data) {
    document.getElementById('valueChainCard').innerHTML = renderValueChainInner(data);
  }
  function renderAnsoff(data) {
    const el = document.getElementById('ansoffCard');
    if (el) el.innerHTML = renderAnsoffInner(data);
  }

  // ─── HTML Generators (for both main and compare) ───
  function renderOverviewHTML(data) {
    return `
      <div class="card overview-card">
        <div class="card-header"><span class="card-icon">📋</span> Overview</div>
        <p class="overview-text">${data.overview || ''}</p>
        <div class="metrics-grid">
          ${(data.metrics || []).map(m => `
            <div class="metric-item">
              <div class="metric-value ${m.color || 'blue'}">${m.value || ''}</div>
              <div class="metric-label">${m.label || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function renderPestelInner(data) {
    const factors = ['political','economic','social','technological','environmental','legal'];
    const labels = { political:'🏛️ Political', economic:'💰 Economic', social:'👥 Social',
                     technological:'⚙️ Technological', environmental:'🌱 Environmental', legal:'⚖️ Legal' };
    const pestel = data.pestel || {};
    return `
      <div class="card-header"><span class="card-icon">🌍</span> PESTEL Analysis</div>
      <div class="pestel-grid">
        ${factors.map(f => `
          <div class="pestel-item ${f}">
            <h4>${labels[f]}</h4>
            <ul>${(pestel[f] || []).map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>`;
  }

  function renderPestelHTML(data) {
    return `<div class="card pestel-card">${renderPestelInner(data)}</div>`;
  }

  function renderPorterInner(data) {
    const forces = data.portersFiveForces || [];
    return `
      <div class="card-header"><span class="card-icon">⚡</span> Porter's Five Forces</div>
      <div class="porter-list">
        ${forces.map(f => {
          const rc = (f.rating || 'medium').toLowerCase();
          return `
            <div class="porter-item">
              <div style="flex:1">
                <div class="porter-force-header">
                  <span class="porter-force-name">${f.name || ''}</span>
                  <span class="porter-rating ${rc}">${f.rating || ''}</span>
                </div>
                <div class="porter-desc">${f.desc || ''}</div>
              </div>
              <div class="porter-bar-container">
                <div class="porter-bar-track"><div class="porter-bar-fill ${rc}"></div></div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderPorterHTML(data) {
    return `<div class="card porter-card">${renderPorterInner(data)}</div>`;
  }

  function renderSwotInner(data) {
    const swot = data.swot || {};
    return `
      <div class="card-header"><span class="card-icon">🎯</span> SWOT Analysis</div>
      <div class="swot-grid">
        <div class="swot-quadrant swot-strengths"><h4>💪 Strengths</h4><ul>${(swot.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="swot-quadrant swot-weaknesses"><h4>⚠️ Weaknesses</h4><ul>${(swot.weaknesses || []).map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="swot-quadrant swot-opportunities"><h4>🚀 Opportunities</h4><ul>${(swot.opportunities || []).map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="swot-quadrant swot-threats"><h4>🔥 Threats</h4><ul>${(swot.threats || []).map(s => `<li>${s}</li>`).join('')}</ul></div>
      </div>`;
  }

  function renderSwotHTML(data) {
    return `<div class="card swot-card">${renderSwotInner(data)}</div>`;
  }

  function renderGapsInner(data) {
    return `
      <div class="card-header"><span class="card-icon">🔎</span> Industry Gaps</div>
      <div class="gaps-list">
        ${(data.gaps || []).map(g => `
          <div class="gap-item"><h5>${g.title || ''}</h5><p>${g.desc || ''}</p></div>
        `).join('')}
      </div>`;
  }

  function renderGapsHTML(data) {
    return `<div class="card gaps-card">${renderGapsInner(data)}</div>`;
  }

  function renderRecsInner(data) {
    return `
      <div class="card-header"><span class="card-icon">💡</span> Strategic Recommendations</div>
      <div class="recs-list">
        ${(data.recommendations || []).map(r => `
          <div class="rec-item"><h5>${r.title || ''}</h5><p>${r.desc || ''}</p></div>
        `).join('')}
      </div>`;
  }

  function renderRecsHTML(data) {
    return `<div class="card recs-card">${renderRecsInner(data)}</div>`;
  }

  function renderValueChainInner(data) {
    return `
      <div class="card-header"><span class="card-icon">🔗</span> Value Chain Analysis</div>
      <div class="value-chain-content">
        ${(data.valueChain || []).map(step => `
          <div class="vc-step">
            <div class="vc-icon">${step.icon || '📌'}</div>
            <h5>${step.title || ''}</h5>
            <p>${step.desc || ''}</p>
          </div>
        `).join('')}
      </div>`;
  }

  function renderValueChainHTML(data) {
    return `<div class="card value-chain-card">${renderValueChainInner(data)}</div>`;
  }

  function renderAnsoffInner(data) {
    const ansoff = data.ansoff || {};
    return `
      <div class="card-header"><span class="card-icon">🗺️</span> Ansoff Strategic Matrix</div>
      <div class="ansoff-grid">
        <div class="ansoff-item ansoff-penetration">
          <h4>Market Penetration</h4>
          <h3>${ansoff.marketPenetration?.strategy || 'N/A'}</h3>
          <p>${ansoff.marketPenetration?.description || ''}</p>
        </div>
        <div class="ansoff-item ansoff-prod-dev">
          <h4>Product Development</h4>
          <h3>${ansoff.productDevelopment?.strategy || 'N/A'}</h3>
          <p>${ansoff.productDevelopment?.description || ''}</p>
        </div>
        <div class="ansoff-item ansoff-mkt-dev">
          <h4>Market Development</h4>
          <h3>${ansoff.marketDevelopment?.strategy || 'N/A'}</h3>
          <p>${ansoff.marketDevelopment?.description || ''}</p>
        </div>
        <div class="ansoff-item ansoff-diversification">
          <h4>Diversification</h4>
          <h3>${ansoff.diversification?.strategy || 'N/A'}</h3>
          <p>${ansoff.diversification?.description || ''}</p>
        </div>
      </div>`;
  }

  function renderAnsoffHTML(data) {
    return `<div class="card ansoff-card">${renderAnsoffInner(data)}</div>`;
  }

  checkOnboarding();
  renderCategories('industries');
  renderHistory();

})();
