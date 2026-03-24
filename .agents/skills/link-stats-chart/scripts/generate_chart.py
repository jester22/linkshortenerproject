"""
Generate a bar chart showing links created per month for the past 12 months.

Reads DATABASE_URL from .env, queries the PostgreSQL `links` table,
and exports a PNG bar chart to ./reports/links-per-month.png (by default).
"""

import argparse
import os
import sys
from datetime import datetime, timezone

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for PNG export
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import psycopg2
from dotenv import load_dotenv


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a bar chart of links created per month (past 12 months)."
    )
    parser.add_argument(
        "--output",
        default="./reports/links-per-month.png",
        help="Output path for the PNG file (default: ./reports/links-per-month.png)",
    )
    parser.add_argument(
        "--env",
        default="./.env",
        help="Path to the .env file containing DATABASE_URL (default: ./.env)",
    )
    return parser.parse_args()


def get_monthly_counts(database_url: str) -> list[tuple[str, int]]:
    """Query the database for link counts grouped by month over the past 12 months.

    Returns a list of (month_label, count) tuples ordered chronologically,
    with every month in the range represented (zero-filled).
    """
    query = """
        WITH months AS (
            SELECT generate_series(
                date_trunc('month', NOW() - INTERVAL '11 months'),
                date_trunc('month', NOW()),
                '1 month'::interval
            ) AS month
        )
        SELECT
            TO_CHAR(m.month, 'Mon YYYY') AS month_label,
            COUNT(l.id)::int AS link_count
        FROM months m
        LEFT JOIN links l
            ON date_trunc('month', l.created_at) = m.month
        GROUP BY m.month, month_label
        ORDER BY m.month;
    """

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
    finally:
        conn.close()

    return [(row[0], row[1]) for row in rows]


def create_chart(monthly_data: list[tuple[str, int]], output_path: str) -> None:
    """Create a bar chart from monthly link counts and save as PNG."""
    months = [row[0] for row in monthly_data]
    counts = [row[1] for row in monthly_data]

    fig, ax = plt.subplots(figsize=(12, 6))

    bars = ax.bar(months, counts, color="#4F46E5", edgecolor="white", width=0.6)

    # Add count labels on top of each bar
    for bar, count in zip(bars, counts):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + max(counts) * 0.02,
            str(count),
            ha="center",
            va="bottom",
            fontsize=10,
            fontweight="bold",
            color="#1F2937",
        )

    ax.set_title("Links Created Per Month (Past 12 Months)", fontsize=16, fontweight="bold", pad=15)
    ax.set_xlabel("Month", fontsize=12, labelpad=10)
    ax.set_ylabel("Links Created", fontsize=12, labelpad=10)

    # Y-axis should use whole numbers only
    ax.yaxis.set_major_locator(ticker.MaxNLocator(integer=True))

    # Rotate x-axis labels for readability
    plt.xticks(rotation=45, ha="right", fontsize=10)
    plt.yticks(fontsize=10)

    # Clean up the chart
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", alpha=0.3, linestyle="--")

    plt.tight_layout()

    # Ensure output directory exists
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    fig.savefig(output_path, dpi=150, bbox_inches="tight")
    plt.close(fig)

    print(f"Chart saved to: {output_path}")


def main() -> None:
    args = parse_args()

    # Load environment variables
    load_dotenv(args.env)
    database_url = os.environ.get("DATABASE_URL")

    if not database_url:
        print("Error: DATABASE_URL not found. Check your .env file.", file=sys.stderr)
        sys.exit(1)

    print("Querying database for link creation data...")
    monthly_data = get_monthly_counts(database_url)

    print("Generating chart...")
    create_chart(monthly_data, args.output)

    print("Done!")


if __name__ == "__main__":
    main()
