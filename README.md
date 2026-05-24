# Papcorns — Data Scientist Technical Assessment

**Candidate:** Sena Kılınç
**Role:** Jr. Data Scientist
**Date:** 24 May 2026

---

## Repository Structure

```
├── dashboard/                  # Bonus Task 7 — Next.js revenue dashboard
│   ├── app/
│   │   ├── api/subscription-revenue-breakdown/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── getting_started.ipynb       # Starter notebook (provided)
├── papcorns.sqlite             # Dataset
├── requirements.txt
├── submission.ipynb            # Core analysis — Tasks 1–6 & Task 8
└── README.md
```

---

## Setup

### Python — Tasks 1–6 & Task 8

```bash
pip install -r requirements.txt
jupyter notebook submission.ipynb
```

> Requires Python 3.8+.

### Dashboard — Task 7 (Bonus)

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app expects `papcorns.sqlite` at the repository root, one level above `dashboard/`.

---

## What's Completed

| Task | Description | Status |
|------|-------------|--------|
| 1 | Total subscription revenue by country | ✅ |
| 2 | Total trials from Instagram users | ✅ |
| 3 | Acquisition channel categorisation | ✅ |
| 4 | Trial-to-subscription conversion rate (overall + by source) | ✅ |
| 5 | Median subscription duration by country | ✅ |
| 6 | Average LTV by country | ✅ |
| 7 | Next.js dashboard — avg revenue per paying user by country | ✅ |
| 8 | Predicted LTV for user #1001 (Bruce Wayne) | ✅ |

All core tasks (1–6) are solved using SQL queries via `pandas.read_sql_query`. Python is used for orchestration, visualisation, and the final median calculation in Task 5 (SQLite has no built-in `MEDIAN`).

---

## Notes

- **Analysis date** is derived dynamically from `MAX(created_at)` in the events table (2025-07-12) rather than hardcoded.
- **Active subscribers** (no cancellation event) are treated as censored at the analysis date — a conservative lower bound for duration and LTV estimates.
- All findings, methodology, assumptions, and visualisations are documented inline in `submission.ipynb`.