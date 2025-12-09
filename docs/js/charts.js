// charts.js - Plotly visualization functions

function formatCategoryName(category) {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function createCategoryPieChart(data, elementId) {
    const container = document.getElementById('categories-charts');
    const div = document.createElement('div');
    div.id = elementId;
    div.style.width = '100%';
    div.style.minWidth = '500px';
    container.appendChild(div);

    const labels = data.categories.map(c => formatCategoryName(c.category));
    const values = data.categories.map(c => c.count);

    const plotData = [{
        type: 'pie',
        labels: labels,
        values: values,
        textposition: 'auto',
        textinfo: 'label+percent',
        textfont: {
            size: 11
        },
        hovertemplate: '<b>%{label}</b><br>Papers: %{value}<br>%{percent}<extra></extra>',
        marker: {
            colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'],
            line: {
                color: 'white',
                width: 2
            }
        },
        domain: {
            x: [0.05, 0.95],
            y: [0.05, 0.95]
        },
        pull: [0, 0, 0, 0, 0, 0, 0, 0]
    }];

    const layout = {
        title: {
            text: 'Research Category Distribution',
            font: { size: 16 },
            x: 0.5,
            xanchor: 'center'
        },
        height: 500,
        autosize: true,
        showlegend: false,
        margin: { l: 100, r: 100, t: 80, b: 80 },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white'
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(elementId, plotData, layout, config);
}

function createCategoryBarChart(data, elementId) {
    const container = document.getElementById('categories-charts');
    const div = document.createElement('div');
    div.id = elementId;
    div.style.width = '100%';
    div.style.minWidth = '500px';
    container.appendChild(div);

    const years = data.trend.map(t => t.year);
    const categories = Object.keys(data.trend[0]).filter(k => k !== 'year');

    const traces = categories.map(category => ({
        name: formatCategoryName(category),
        x: years,
        y: data.trend.map(t => t[category] || 0),
        type: 'bar'
    }));

    const layout = {
        title: {
            text: 'Publications by Category Over Time',
            font: { size: 16 },
            x: 0.5,
            xanchor: 'center'
        },
        barmode: 'stack',
        xaxis: { 
            title: 'Year',
            type: 'category'
        },
        yaxis: { 
            title: 'Number of Publications',
            gridcolor: '#eee'
        },
        height: 450,
        autosize: true,
        showlegend: true,
        legend: {
            orientation: 'v',
            x: 1.02,
            y: 0.5,
            xanchor: 'left',
            font: { size: 11 }
        },
        margin: { l: 60, r: 130, t: 60, b: 60 }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(elementId, traces, layout, config);
}

function createCollaboratorBarChart(data, elementId) {
    const container = document.getElementById('coi-charts');
    const div = document.createElement('div');
    div.id = elementId;
    div.style.width = '100%';
    div.style.minWidth = '500px';
    container.appendChild(div);

    const top10 = data.top_collaborators.slice(0, 10);

    // Truncate long names for display
    const truncateName = (name) => {
        return name.length > 20 ? name.substring(0, 17) + '...' : name;
    };

    const trace = {
        type: 'bar',
        x: top10.map(c => c.collaboration_count),
        y: top10.map(c => truncateName(c.name)),
        orientation: 'h',
        marker: {
            color: top10.map(c => c.institution.includes('North Carolina State') ? '#CC0000' : '#4444FF')
        },
        hovertemplate: '<b>%{customdata}</b><br>Papers: %{x}<extra></extra>',
        customdata: top10.map(c => c.name)
    };

    const layout = {
        title: {
            text: 'Top 10 Collaborators',
            font: { size: 16 },
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: { 
            title: 'Number of Papers',
            gridcolor: '#eee'
        },
        yaxis: { 
            autorange: 'reversed',
            tickfont: { size: 10 }
        },
        height: 450,
        autosize: true,
        margin: { l: 150, r: 40, t: 60, b: 60 }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(elementId, [trace], layout, config);
}

function createInternalExternalPie(data, elementId) {
    const container = document.getElementById('coi-charts');
    const div = document.createElement('div');
    div.id = elementId;
    div.style.width = '100%';
    div.style.minWidth = '500px';
    container.appendChild(div);

    const overview = data.overview;

    const plotData = [{
        type: 'pie',
        labels: ['NCSU (Internal)', 'External'],
        values: [overview.internal_count, overview.external_count],
        textposition: 'inside',
        insidetextorientation: 'radial',
        textinfo: 'label+percent',
        textfont: {
            size: 14,
            color: 'white'
        },
        marker: {
            colors: ['#CC0000', '#4444FF'],
            line: {
                color: 'white',
                width: 2
            }
        },
        hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>%{percent}<extra></extra>',
        pull: [0, 0]
    }];

    const layout = {
        title: {
            text: 'Internal vs External Collaborators',
            font: { size: 16 },
            x: 0.5,
            xanchor: 'center'
        },
        height: 500,
        autosize: true,
        showlegend: false,
        margin: { l: 100, r: 100, t: 80, b: 80 },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white'
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(elementId, plotData, layout, config);
}
