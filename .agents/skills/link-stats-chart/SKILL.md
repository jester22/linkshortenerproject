---
name: link-stats-chart
description: "Generate a bar chart showing the number of links created per month over the past 12 months. Use this skill whenever the user asks for link creation statistics, monthly link reports, link volume charts, link analytics visualizations, or wants to see how many links were created over time. Also trigger when the user mentions 'link trends', 'link growth', 'monthly links chart', or any request to visualize link data from the database."
---

# Link Stats Chart

Generate a PNG bar chart showing the number of links created per month for the past 12 months, queried directly from the PostgreSQL database.

## How it works

The skill bundles a Python script (`scripts/generate_chart.py`) that:

1. Reads `DATABASE_URL` from the `.env` file in the project root
2. Connects to the PostgreSQL database
3. Queries the `links` table, grouping rows by month for the past 12 months based on the `created_at` column
4. Plots a bar chart with months on the x-axis and link count on the y-axis
5. Exports the chart as a PNG image

## When to use this skill

- The user asks for link creation stats, analytics, or reports
- The user wants a chart or visualization of link data
- The user asks "how many links were created" over a time period
- The user wants to see monthly link volume or growth trends

## Usage

Run the bundled Python script from the project root:

```bash
python <skill-path>/scripts/generate_chart.py
```

The script accepts optional arguments:

- `--output <path>` — Where to save the PNG (default: `./reports/links-per-month.png`)
- `--env <path>` — Path to the `.env` file (default: `./.env`)

### Example

```bash
# Default output to ./reports/links-per-month.png
python .agents/skills/link-stats-chart/scripts/generate_chart.py

# Custom output path
python .agents/skills/link-stats-chart/scripts/generate_chart.py --output ./my-chart.png
```

## Prerequisites

The script needs these Python packages. Install them if not already available:

```bash
pip install psycopg2-binary matplotlib python-dotenv
```

## Database schema reference

The script queries this table:

```sql
CREATE TABLE links (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  url TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

## Output

The chart shows:
- **X-axis**: Each month for the past 12 months (e.g., "Apr 2025", "May 2025", ..., "Mar 2026")
- **Y-axis**: Total number of links created that month
- **Title**: "Links Created Per Month (Past 12 Months)"
- Bars are labeled with their count value on top
- Months with zero links still appear on the axis (they just show a 0-height bar)

The PNG is saved to `./reports/links-per-month.png` by default. The `reports/` directory is created automatically if it doesn't exist.
