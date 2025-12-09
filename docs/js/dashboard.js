// dashboard.js - Main dashboard logic

async function loadDashboard(facultyId, facultyName) {
    try {
        // Fetch all data
        const [profile, publications, categories, coiStats] = await Promise.all([
            fetch(`../data/${facultyId}/profile.json`).then(r => r.json()).catch(() => null),
            fetch(`../data/${facultyId}/publications.json`).then(r => r.json()).catch(() => []),
            fetch(`../data/${facultyId}/categories.json`).then(r => r.json()).catch(() => null),
            fetch(`../data/${facultyId}/coi_stats.json`).then(r => r.json()).catch(() => null)
        ]);

        // Store globally for exports
        window.currentFaculty = { facultyId, facultyName, categories, coiStats };

        // Render sections
        renderMetrics(profile);
        renderPublications(publications);
        if (categories) renderCategories(categories);
        if (coiStats) renderCOI(coiStats);

    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.body.innerHTML = '<div class="container"><div class="card"><h2>Error loading dashboard data</h2></div></div>';
    }
}

function renderMetrics(profile) {
    if (!profile) return;
    const stats = profile.stats;
    const html = `
        <div class="metric-card">
            <div class="metric-value">${stats.total_publications}</div>
            <div class="metric-label">Publications</div>
            <div class="metric-detail">${stats.recent_publications} recent</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${stats.total_collaborators}</div>
            <div class="metric-label">Collaborators</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${stats.total_categories}</div>
            <div class="metric-label">Research Areas</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${stats.external_percentage}%</div>
            <div class="metric-label">External Collab</div>
        </div>
    `;
    document.getElementById('metrics').innerHTML = html;
}

function renderPublications(publications) {
    if (!publications || publications.length === 0) {
        document.getElementById('publications-list').innerHTML = '<p>No publications found.</p>';
        return;
    }

    const html = publications.slice(0, 20).map(pub => `
        <div class="publication-item">
            <div class="pub-year">${pub.year}</div>
            <div class="pub-details">
                <h4>${pub.title}</h4>
                <p class="journal">${pub.journal}</p>
                <p class="authors">${pub.authors.slice(0, 5).join(', ')}${pub.authors.length > 5 ? ', et al.' : ''}</p>
                <a href="https://doi.org/${pub.doi}" target="_blank">View Paper →</a>
            </div>
        </div>
    `).join('');
    
    document.getElementById('publications-list').innerHTML = html;
}

function renderCategories(categories) {
    const container = document.getElementById('categories-charts');
    if (!container) return;

    // Create pie chart
    createCategoryPieChart(categories, 'category-pie');
    
    // Create bar chart if trend data available
    if (categories.trend && categories.trend.length > 0) {
        createCategoryBarChart(categories, 'category-bar');
    }
}

function renderCOI(coiStats) {
    const statsContainer = document.getElementById('coi-stats');
    const chartsContainer = document.getElementById('coi-charts');
    
    if (!statsContainer || !chartsContainer) return;

    const overview = coiStats.overview;
    
    // Render stats
    statsContainer.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item">
                <div class="stat-label">Total Collaborators</div>
                <div class="stat-value">${overview.total_collaborators}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Internal (NCSU)</div>
                <div class="stat-value">${overview.internal_count} (${overview.internal_percentage.toFixed(1)}%)</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">External</div>
                <div class="stat-value">${overview.external_count} (${overview.external_percentage.toFixed(1)}%)</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Network Density</div>
                <div class="stat-value">${overview.network_density.toFixed(3)}</div>
            </div>
        </div>
        <h3 style="margin-top:20px;">Top Institutions</h3>
        <div style="margin-top:10px;">
            ${coiStats.top_institutions.slice(0, 5).map(inst => `
                <div style="padding:8px; border-bottom:1px solid #ddd;">
                    <strong>${inst.institution}</strong>: ${inst.collaborator_count} collaborators, ${inst.paper_count} papers
                </div>
            `).join('')}
        </div>
    `;

    // Create charts
    createCollaboratorBarChart(coiStats, 'coi-collab-chart');
    createInternalExternalPie(coiStats, 'coi-pie-chart');
}
