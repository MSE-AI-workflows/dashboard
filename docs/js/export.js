// export.js - CSV export functionality

function exportCategories() {
    if (!window.currentFaculty || !window.currentFaculty.categories) {
        alert('No category data available');
        return;
    }

    const { facultyName, categories } = window.currentFaculty;
    
    const headers = ['Category', 'Paper Count', 'Percentage'];
    const rows = categories.categories.map(cat => [
        cat.category.replace(/_/g, ' '),
        cat.count,
        `${cat.percentage.toFixed(1)}%`
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const filename = `${facultyName.replace(/\s+/g, '_')}_categories.csv`;
    downloadCSV(csv, filename);
}

function exportCOI() {
    if (!window.currentFaculty || !window.currentFaculty.coiStats) {
        alert('No COI data available');
        return;
    }

    const { facultyName, coiStats } = window.currentFaculty;
    
    const headers = ['Name', 'Papers', 'Institution', 'Type', 'Years Active'];
    const rows = coiStats.top_collaborators.map(collab => [
        escapeCSV(collab.name),
        collab.collaboration_count,
        escapeCSV(collab.institution),
        collab.node_type,
        collab.years
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const filename = `${facultyName.replace(/\s+/g, '_')}_collaborators.csv`;
    downloadCSV(csv, filename);
}

function escapeCSV(text) {
    if (!text) return '';
    text = String(text);
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}
