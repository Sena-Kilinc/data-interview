"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryRevenueRow } from "./api/subscription-revenue-breakdown/route";

const COUNTRY_COLORS: Record<string, string> = {
  US: "#38bdf8",
  NL: "#818cf8",
  TR: "#34d399",
};

function formatUSD(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default function HomePage() {
  const [rows, setRows] = useState<CountryRevenueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription-revenue-breakdown")
      .then((r) => r.json())
      .then((data: { rows: CountryRevenueRow[] }) => {
        setRows(data.rows);
        setLoading(false);
      });
  }, []);

  const maxAvg = useMemo(
    () => Math.max(...rows.map((r) => r.avg_revenue_per_user), 1),
    [rows]
  );

  return (
    <main>
      <h1>Papcorns Revenue Dashboard</h1>
      <p className="subtitle">
        Task 7 · Average revenue per paying subscriber by country
      </p>

      {/* ── Chart 1: Avg revenue per paying user ── */}
      <section className="chart-card" style={{ marginBottom: "1.5rem" }}>
        <h2 className="chart-title">Avg Revenue per Paying User (USD)</h2>

        {loading ? (
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading…</p>
        ) : (
          <div className="simple-chart">
            {rows.map((row) => {
              const color = COUNTRY_COLORS[row.country] ?? "#38bdf8";
              const pct = (row.avg_revenue_per_user / maxAvg) * 100;
              return (
                <div className="bar-row" key={row.country}>
                  <span className="bar-label" style={{ fontWeight: 600 }}>
                    {row.country}
                  </span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="bar-value" style={{ color }}>
                    {formatUSD(row.avg_revenue_per_user)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Stats table ── */}
      {!loading && (
        <section className="chart-card">
          <h2 className="chart-title">Summary</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.88rem",
              color: "var(--text)",
            }}
          >
            <thead>
              <tr style={{ color: "var(--muted)", textAlign: "left" }}>
                <th style={{ padding: "0.4rem 0.75rem" }}>Country</th>
                <th style={{ padding: "0.4rem 0.75rem", textAlign: "right" }}>
                  Paying Users
                </th>
                <th style={{ padding: "0.4rem 0.75rem", textAlign: "right" }}>
                  Avg LTV
                </th>
                <th style={{ padding: "0.4rem 0.75rem", textAlign: "right" }}>
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.country}
                  style={{
                    background:
                      i % 2 === 0
                        ? "rgba(255,255,255,0.03)"
                        : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "0.45rem 0.75rem",
                      fontWeight: 600,
                      color: COUNTRY_COLORS[row.country] ?? "var(--text)",
                    }}
                  >
                    {row.country}
                  </td>
                  <td
                    style={{
                      padding: "0.45rem 0.75rem",
                      textAlign: "right",
                    }}
                  >
                    {row.paying_users}
                  </td>
                  <td
                    style={{
                      padding: "0.45rem 0.75rem",
                      textAlign: "right",
                    }}
                  >
                    {formatUSD(row.avg_revenue_per_user)}
                  </td>
                  <td
                    style={{
                      padding: "0.45rem 0.75rem",
                      textAlign: "right",
                    }}
                  >
                    {formatUSD(row.total_revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              color: "var(--muted)",
            }}
          >
            LTV = total subscription revenue per subscriber (subscription_started
            + subscription_renewed events).
          </p>
        </section>
      )}
    </main>
  );
}
