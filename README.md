# Papcorns - Data Scientist Technical Assessment

**Candidate:** Sena Kılınç
**Role:** Jr. Data Scientist
**Date:** 24 May 2026

---

## Repository Structure

```
├── dashboard/                  # Bonus Task 7 - Next.js revenue dashboard
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
├── submission.ipynb            # Core analysis - Tasks 1-6 & Task 8
└── README.md
```

---

## Setup

### Python - Tasks 1-6 & Task 8

```bash
pip install -r requirements.txt
jupyter notebook submission.ipynb
```

> Requires Python 3.8+.

### Dashboard - Task 7 (Bonus)

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
| 7 | Next.js dashboard - avg revenue per paying user by country | ✅ |
| 8 | Predicted LTV for user #1001 (Bruce Wayne) | ✅ |

All core tasks (1-6) are solved using SQL queries via `pandas.read_sql_query`. Python is used for orchestration, visualisation, and the final median calculation in Task 5 (SQLite has no built-in `MEDIAN`).

---

## Key Analytical Decisions

### Task 4 - Conversion rate
A temporal ordering check is run before calculating conversion rates to confirm no user has a `subscription_started` date earlier than their `trial_started` date. A chi-square test (χ²=0.393, p=0.822) confirms the ~2.5 pp spread across channels is not statistically significant - conversion is driven by product experience rather than acquisition source.

### Task 5 - Median subscription duration
Duration is measured from `subscription_started` to `subscription_cancelled`. Active subscribers (no cancellation yet) are treated as right-censored at the analysis date, yielding a **conservative lower bound**. Median is chosen over mean because subscription durations are right-skewed.

### Task 8 - Predicted LTV (Bruce Wayne, user #1001)
Two independent methods are used:
- **Cohort median** - median realised LTV of the 43 US/Instagram subscribers ($29.97, 3 payments)
- **Expected-value model** - Σ survival(k) × price using an empirical payment-level retention curve ($25.79, ~2.6 expected payments)

Both estimates are validated with 10,000-iteration bootstrap confidence intervals. The estimates sit within each other's CIs (median CI: [$19.98, $29.97]; EV CI: [$22.30, $29.27]), confirming the result is robust despite the small cohort. Month 3 is identified as the critical churn point (survival drops from ~56% to ~16%), suggesting a targeted retention intervention at that stage could meaningfully increase pLTV.

---

## Notes

- **Analysis date** is derived dynamically from `MAX(created_at)` in the events table (2025-07-12) rather than hardcoded.
- **Active subscribers** (no cancellation event) are treated as censored at the analysis date - a conservative lower bound for duration and LTV estimates.
- **Price points** inferred from data: ~$9.99/month (US), ~$8.99/month (NL), ~$4.99/month (TR).
- All findings, methodology, assumptions, and visualisations are documented inline in `submission.ipynb`.