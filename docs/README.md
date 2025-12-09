# NCSU MSE Faculty Dashboards

Interactive research dashboards for faculty members in the Materials Science & Engineering department.

## 🎯 Features

- **Individual Faculty Dashboards** with:
  - Recent publications (last 5 years)
  - Research category breakdown with interactive charts
  - Conflict of Interest (COI) analysis with network visualizations
  - Export functionality (CSV downloads)
  
- **Interactive Visualizations**:
  - Category distribution pie charts
  - Publication trends over time
  - Collaboration network graphs
  - Top collaborators analysis

## 📁 Project Structure

```
dashboard/
├── docs/                          # GitHub Pages root
│   ├── index.html                 # Faculty list homepage
│   ├── faculty/                   # Individual dashboards (26 pages)
│   ├── css/dashboard.css          # Styling
│   ├── js/                        # JavaScript functionality
│   │   ├── dashboard.js           # Main logic
│   │   ├── charts.js              # Plotly visualizations
│   │   └── export.js              # CSV exports
│   ├── data/                      # JSON data (generated)
│   └── coi_networks/              # COI HTML visualizations
│
├── export_dashboard_data.py      # Generate JSON from database
├── build_dashboard.py             # Generate HTML pages
├── generate_coi_maps.py           # Generate COI networks
└── production_classification_final.ipynb  # Classification notebook
```

## 🚀 Local Development

### 1. Generate Data

```bash
# Run classification notebook (if needed)
jupyter notebook production_classification_final.ipynb

# Export JSON data from database
python export_dashboard_data.py

# Generate COI maps
python generate_coi_maps.py
```

### 2. Build Dashboard

```bash
# Generate HTML pages
python build_dashboard.py
```

### 3. Test Locally

```bash
# Start local server
cd docs
python3 -m http.server 8000

# Open http://localhost:8000 in browser
```

## 📤 GitHub Pages Deployment

### Option 1: Push to GitHub

```bash
git add docs/
git commit -m "Update dashboard"
git push origin main
```

Then enable GitHub Pages:
1. Go to repository **Settings** → **Pages**
2. Set **Source** to `main` branch, `/docs` folder
3. Click **Save**
4. Access at: `https://username.github.io/repository-name/`

### Option 2: GitHub Actions (Automated)

Create `.github/workflows/update-dashboard.yml`:

```yaml
name: Update Dashboard

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:  # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Generate data
        env:
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_NAME: ${{ secrets.DB_NAME }}
        run: |
          python export_dashboard_data.py
          python build_dashboard.py
      
      - name: Commit and push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add docs/data/ docs/faculty/
          git commit -m "Update dashboard data" || exit 0
          git push
```

## 🔄 Updating Data

When database or classification changes:

```bash
# 1. Re-export data
python export_dashboard_data.py

# 2. Rebuild pages (if needed)
python build_dashboard.py

# 3. Commit changes
git add docs/data/
git commit -m "Update dashboard data"
git push
```

## 🗂️ Data Sources

1. **MySQL Database** (`mse_db_test_ncsu`):
   - Publications table
   - Author details
   - Faculty information

2. **Classification CSV** (`production_classification_final.csv`):
   - Generated from Jupyter notebook
   - AI-classified research categories
   - 771 publications across 8 categories

3. **COI Maps** (`coi_maps/`):
   - NetworkX collaboration graphs
   - Plotly interactive visualizations
   - 25 faculty networks

## 📊 Dashboard Sections

### Homepage
- Grid of all 26 faculty members
- Publication and collaborator counts
- Click to view individual dashboard

### Individual Faculty Page
1. **Overview Metrics**: Publications, collaborators, categories, external %
2. **Recent Publications**: Last 5 years with DOI links
3. **Research Categories**: 
   - Pie chart (distribution)
   - Bar chart (trend over time)
   - Export CSV button
4. **COI Analysis**:
   - Network statistics
   - Top institutions
   - Interactive network visualization
   - Top collaborators bar chart
   - Internal vs external pie chart
   - Export CSV button

## 🛠️ Technologies

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Visualizations**: Plotly.js
- **Backend**: Python (data generation)
- **Database**: MySQL
- **Hosting**: GitHub Pages (static)

## 📝 Notes

- Data is **static** (no live database connection)
- Update frequency: Manual or via GitHub Actions
- All data in JSON format for fast loading
- No server-side processing required
- Works offline once loaded

## 🔒 Privacy

- Only includes faculty with OpenAlex IDs
- All data sourced from public publications
- No sensitive information exposed
- Collaboration data from author_details table

## 📞 Support

For issues or questions, contact the repository maintainer.

---

**Last Updated**: December 7, 2025
