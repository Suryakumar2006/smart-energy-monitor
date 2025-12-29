// State
const state = {
    currentView: 'dashboard',
    energyData: {
        currentLoad: 1.2, // kW
        dailyUsage: 14.5, // kWh
        cost: 4.50, // USD
        gridStatus: 'Stable'
    },
    alerts: [
        { id: 1, type: 'warning', message: 'High usage detected in HVAC system.', time: '10 min ago' },
        { id: 2, type: 'info', message: 'Weekly report ready.', time: '2 hours ago' }
    ],
    chatHistory: [
        { role: 'ai', content: 'Hello! I am your Energy Assistant. Ask me how to optimize your consumption.' }
    ]
};

// DOM Elements
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const navItems = document.querySelectorAll('.nav-item, .rag-btn');

// Router
function init() {
    setupNavigation();
    renderView('dashboard');
}

function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            // Add to clicked if it's a nav item
            if (item.classList.contains('nav-item')) {
                item.classList.add('active');
            }

            const view = item.dataset.view;
            state.currentView = view;
            renderView(view);
        });
    });
}

function renderView(view) {
    // Fade out effect
    contentArea.style.opacity = '0';

    setTimeout(() => {
        contentArea.innerHTML = '';
        contentArea.style.opacity = '1';

        switch (view) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'analyze':
                renderAnalyze();
                break;
            case 'optimize':
                renderOptimize();
                break;
            case 'alerts':
                renderAlerts();
                break;
            case 'reports':
                renderReports();
                break;
            case 'rag':
                renderRAG();
                break;
            default:
                renderDashboard();
        }
    }, 200);
}

// --- Views ---

function renderDashboard() {
    pageTitle.innerText = 'Monitor & Visualize';

    const html = `
        <div class="grid-cols-3 fade-in">
            <div class="card stat-card">
                <div class="stat-header">
                    <span>Current Load</span>
                    <span class="material-symbols-rounded">bolt</span>
                </div>
                <div class="stat-value">${state.energyData.currentLoad} kW</div>
                <div class="stat-trend trend-down">
                    <span class="material-symbols-rounded">trending_down</span>
                    <span>12% vs last hour</span>
                </div>
            </div>
            <div class="card stat-card">
                <div class="stat-header">
                    <span>Daily Usage</span>
                    <span class="material-symbols-rounded">calendar_today</span>
                </div>
                <div class="stat-value">${state.energyData.dailyUsage} kWh</div>
                <div class="stat-trend trend-up">
                    <span class="material-symbols-rounded">trending_up</span>
                    <span>5% vs yesterday</span>
                </div>
            </div>
             <div class="card stat-card">
                <div class="stat-header">
                    <span>Est. Cost</span>
                    <span class="material-symbols-rounded">payments</span>
                </div>
                <div class="stat-value">$${state.energyData.cost.toFixed(2)}</div>
                <div class="stat-trend text-muted">
                    <span>Today</span>
                </div>
            </div>
        </div>

        <div class="card fade-in" style="margin-top: 1.5rem; height: 400px;">
            <h3>Real-time Consumption</h3>
            <canvas id="mainChart"></canvas>
        </div>
    `;

    contentArea.innerHTML = html;
    initChart();
}


function renderAnalyze() {
    pageTitle.innerText = 'Analysis';
    contentArea.innerHTML = `
        <div class="card fade-in">
            <h3>Usage Breakdown</h3>
            <p style="color: var(--text-secondary); margin-top: 1rem;">Detailed breakdown of energy consumption by device.</p>
            <div style="margin-top: 2rem; display: flex; gap: 2rem;">
                <!-- Mock Pie Chart Container -->
                <div style="width: 300px; height: 300px; position: relative;">
                    <canvas id="analysisChart"></canvas>
                </div>
                <div style="flex: 1;">
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
                        <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                            <span>HVAC</span>
                            <span style="font-weight: bold;">45%</span>
                        </li>
                         <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                            <span>Lighting</span>
                            <span style="font-weight: bold;">20%</span>
                        </li>
                         <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                            <span>Appliances</span>
                            <span style="font-weight: bold;">25%</span>
                        </li>
                         <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                            <span>EV Charging</span>
                            <span style="font-weight: bold;">10%</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Simple Pie Chart
    const ctx = document.getElementById('analysisChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['HVAC', 'Lighting', 'Appliances', 'EV'],
            datasets: [{
                data: [45, 20, 25, 10],
                backgroundColor: ['#45a29e', '#66fcf1', '#c5c6c7', '#1f2833'],
                borderColor: '#0b0c10',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderOptimize() {
    pageTitle.innerText = 'Optimization';
    contentArea.innerHTML = `
        <div class="grid-cols-2 fade-in">
             <div class="card">
                <div style="display: flex; gap: 1rem; align-items: start;">
                    <span class="material-symbols-rounded" style="color: var(--accent-success); font-size: 2rem;">check_circle</span>
                    <div>
                        <h3>Shift Load</h3>
                        <p style="color: var(--text-secondary); margin-top: 0.5rem;">Running the dishwasher at <strong>2:00 AM</strong> could save <strong>$15/month</strong>.</p>
                        <button class="rag-btn" style="margin-top: 1rem; width: auto;">Schedule Now</button>
                    </div>
                </div>
            </div>
             <div class="card">
                <div style="display: flex; gap: 1rem; align-items: start;">
                    <span class="material-symbols-rounded" style="color: var(--accent-warn); font-size: 2rem;">thermostat</span>
                    <div>
                        <h3>Thermostat Adjustment</h3>
                        <p style="color: var(--text-secondary); margin-top: 0.5rem;">Adjusting temp by 1°C can reduce HVAC load by 5%.</p>
                        <button class="rag-btn" style="margin-top: 1rem; width: auto;">Apply Fix</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAlerts() {
    pageTitle.innerText = 'Notifications & Alerts';
    const alertsHtml = state.alerts.map(alert => `
        <div class="card fade-in" style="margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid ${alert.type === 'warning' ? 'var(--accent-warn)' : 'var(--accent-primary)'}">
            <span class="material-symbols-rounded" style="color: ${alert.type === 'warning' ? 'var(--accent-warn)' : 'var(--accent-primary)'}">
                ${alert.type === 'warning' ? 'warning' : 'info'}
            </span>
            <div style="flex: 1;">
                <h4>${alert.type.toUpperCase()}</h4>
                <p style="color: var(--text-secondary);">${alert.message}</p>
            </div>
            <span style="color: var(--text-muted); font-size: 0.8rem;">${alert.time}</span>
        </div>
    `).join('');

    contentArea.innerHTML = `<div>${alertsHtml}</div>`;
}

function renderReports() {
    pageTitle.innerText = 'Reports';
    contentArea.innerHTML = `
        <div class="card fade-in">
            <h3>Generate Report</h3>
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <select style="background: var(--bg-primary); color: white; padding: 0.8rem; border: 1px solid var(--border-light); border-radius: 8px;">
                    <option>Weekly Summary</option>
                    <option>Monthly Analysis</option>
                    <option>Cost Projection</option>
                </select>
                <button class="rag-btn" style="width: auto;">Download PDF</button>
            </div>
            
            <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Recent Reports</h4>
            <div style="border-top: 1px solid var(--border-light);">
                <div style="display: flex; justify-content: space-between; padding: 1rem 0; color: var(--text-secondary);">
                    <span>Weekly_Report_Nov_20.pdf</span>
                    <span class="material-symbols-rounded" style="cursor: pointer;">download</span>
                </div>
                 <div style="display: flex; justify-content: space-between; padding: 1rem 0; color: var(--text-secondary);">
                    <span>Monthly_Oct_2025.pdf</span>
                    <span class="material-symbols-rounded" style="cursor: pointer;">download</span>
                </div>
            </div>
        </div>
    `;
}

function renderRAG() {
    pageTitle.innerText = 'Smart Energy Assistant (RAG)';
    const historyHtml = state.chatHistory.map(msg => `
        <div style="display: flex; justify-content: ${msg.role === 'user' ? 'flex-end' : 'flex-start'}; margin-bottom: 1rem;">
            <div style="
                max-width: 70%; 
                padding: 1rem; 
                border-radius: 12px; 
                background: ${msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)'}; 
                color: ${msg.role === 'user' ? '#000' : 'var(--text-primary)'};
            ">
                ${msg.content}
            </div>
        </div>
    `).join('');

    contentArea.innerHTML = `
        <div class="card fade-in" style="height: calc(100vh - 180px); display: flex; flex-direction: column;">
            <div id="chat-box" style="flex: 1; overflow-y: auto; padding-right: 1rem;">
                ${historyHtml}
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                <input type="text" id="rag-input" placeholder="Ask about your energy usage..." style="
                    flex: 1; 
                    background: var(--bg-primary); 
                    border: 1px solid var(--border-light); 
                    padding: 1rem; 
                    border-radius: 8px; 
                    color: white;
                ">
                <button id="rag-send" class="rag-btn" style="width: auto;">
                    <span class="material-symbols-rounded">send</span>
                </button>
            </div>
        </div>
    `;

    document.getElementById('rag-send').addEventListener('click', handleRagSubmit);
    document.getElementById('rag-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRagSubmit();
    });
}


// --- API Configuration ---
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// --- Client-Side Knowledge Base (for RAG) ---
const knowledgeBase = [
    { id: 'dev_logs', content: 'HVAC usage peaked at 45% of total load yesterday. Peak hours were 2 PM - 5 PM.' },
    { id: 'tariff', content: 'Current energy tariff is $0.25/kWh during peak hours (2 PM - 6 PM) and $0.10/kWh off-peak.' },
    { id: 'anomalies', content: 'Detected ghost power draw of 150W continuously from the entertainment center (TV/Consoles) when idle.' },
    { id: 'general_tips', content: 'Reducing thermostat by 1 degree Celsius can save up to 5% on heating costs.' },
    { id: 'bill_est', content: 'Current projected monthly bill is $145.20. Last month was $152.50.' },
    { id: 'device_eff', content: 'The refrigerator compressor is cycling ON every 15 minutes, which indicates a potential seal leak.' }
];

function handleRagSubmit() {
    const input = document.getElementById('rag-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);
    runRealRagPipeline(text);
}

function addMessage(role, content, id = null) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    if (id) div.id = id;

    div.style.display = 'flex';
    div.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start';
    div.style.marginBottom = '1rem';

    const bubble = document.createElement('div');
    bubble.style.maxWidth = '70%';
    bubble.style.padding = '1rem';
    bubble.style.borderRadius = '12px';
    bubble.style.background = role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)';
    bubble.style.color = role === 'user' ? '#000' : 'var(--text-primary)';
    bubble.style.border = role === 'ai' ? '1px solid var(--border-light)' : 'none';

    // Allow HTML content for AI
    bubble.innerHTML = content;

    div.appendChild(bubble);
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;

    // Save to state
    if (!id) { // Don't save temporary loading states
        state.chatHistory.push({ role, content });
    }

    return div;
}

function updateMessage(id, content) {
    const msgDiv = document.getElementById(id);
    if (msgDiv) {
        const bubble = msgDiv.querySelector('div');
        bubble.innerHTML = content;
        const box = document.getElementById('chat-box');
        box.scrollTop = box.scrollHeight;
    }
}

async function runRealRagPipeline(query) {
    const msgId = 'ai-response-' + Date.now();
    addMessage('ai', `<div style="display:flex; align-items:center; gap:0.5rem; color:var(--text-muted);">
        <span class="material-symbols-rounded" style="animation:spin 2s linear infinite">sync</span>
        <span>Initializing RAG pipeline...</span>
    </div>`, msgId);

    try {
        // Step 1: Analysis (Visual)
        await delay(600);
        updateMessage(msgId, `<div style="color:var(--text-secondary);">
            <div style="margin-bottom:0.5rem;"><strong>Step 1: Intent Analysis</strong></div>
            <div style="font-size:0.9rem; color:var(--text-muted);">Analyzing query for keywords...</div>
        </div>`);

        // Step 2: Real Client-Side Retrieval
        await delay(800);
        const retrievedDocs = performRetrieval(query);
        const contextString = retrievedDocs.map(d => `- ${d.content}`).join('\n');

        updateMessage(msgId, `<div style="color:var(--text-secondary);">
            <div style="margin-bottom:0.5rem;"><strong>Step 2: Retrieval</strong></div>
            <ul style="font-size:0.85rem; color:var(--text-muted); padding-left:1.2rem; margin-bottom:0.5rem;">
                ${retrievedDocs.map(d => `<li>Accessed Knowledge: <em>${d.id}</em></li>`).join('')}
            </ul>
            <div style="font-size:0.9rem;">Generating response...</div>
        </div>`);

        // Step 3: LLM Generation
        const responseText = await callLLM(query, contextString);

        // Final UI Update
        const finalHtml = formatAiResponse(responseText, retrievedDocs.length);
        updateMessage(msgId, finalHtml);
        state.chatHistory.push({ role: 'ai', content: finalHtml });

    } catch (error) {
        console.error(error);
        updateMessage(msgId, `<span style="color:var(--accent-danger);">Error: Failed to connect to AI service. Check console or network.</span>`);
    }
}

function performRetrieval(query) {
    const q = query.toLowerCase();
    // Simple keyword matching
    const results = knowledgeBase.filter(doc => {
        const words = doc.content.toLowerCase().split(' ');
        return words.some(w => q.includes(w) && w.length > 3); // match significant words
    });

    // Always include at least one relevant doc if none match directly (fallback for demo)
    if (results.length === 0) return [knowledgeBase[0], knowledgeBase[1]];
    return results.slice(0, 3); // Top 3
}

async function callLLM(query, context) {
    const systemPrompt = `
        You are an advanced Smart Energy Assistant. Use the provided Context to answer the user's question.
        
        Context:
        ${context}
        
        If the context doesn't have the answer, use general energy-saving knowledge.
        Keep answers concise, helpful, and professional. Use HTML formatting (<b>, <ul>, <li>) for readability.
    `;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': 'http://localhost:8000',
            'X-Title': 'Smart Energy Monitor',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'google/gemini-2.0-flash-exp:free', // Using a fast, free model via OpenRouter
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ]
        })
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.choices[0].message.content;
}

function formatAiResponse(text, sourceCount) {
    // Convert newlines to breaks if raw text
    let formatted = text.replace(/\n/g, '<br>');
    return `
        <div>${formatted}</div>
        <div style="margin-top:0.8rem; padding-top:0.5rem; border-top:1px solid var(--border-light); font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between;">
            <span>Generated by AI</span>
            <span>Context Sources: ${sourceCount}</span>
        </div>
    `;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Chart Helper
function initChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');

    // Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 252, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(102, 252, 241, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Energy Consumption (kW)',
                data: [0.8, 0.6, 1.2, 2.5, 3.8, 2.1],
                borderColor: '#66fcf1',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#c5c6c7' }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#8d939c' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8d939c' }
                }
            }
        }
    });
}

// Start
init();
