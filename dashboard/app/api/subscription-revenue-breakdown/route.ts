import Database from "better-sqlite3";
import path from "path";
import { NextResponse } from "next/server";

export type CountryRevenueRow = {
  country: string;
  paying_users: number;
  avg_revenue_per_user: number;
  total_revenue: number;
};

export async function GET() {
  const db = new Database(path.join(process.cwd(), "..", "papcorns.sqlite"), {
    readonly: true,
  });

  try {
    /*
     * Average revenue per paying user by country.
     *
     * A "paying user" is any subscriber who has at least one
     * subscription_started or subscription_renewed event.
     * Per-user LTV = SUM(amount_usd) across those events.
     * avg_revenue_per_user = AVG of per-user LTV, grouped by country.
     */
    const rows = db
      .prepare(
        `
        WITH user_revenue AS (
          SELECT
            u.country,
            e.user_id,
            SUM(e.amount_usd) AS lifetime_value
          FROM user_events e
          JOIN users u ON u.id = e.user_id
          WHERE e.event_name IN ('subscription_started', 'subscription_renewed')
          GROUP BY u.country, e.user_id
        )
        SELECT
          country,
          COUNT(*)                                  AS paying_users,
          ROUND(AVG(lifetime_value), 2)             AS avg_revenue_per_user,
          ROUND(SUM(lifetime_value), 2)             AS total_revenue
        FROM user_revenue
        GROUP BY country
        ORDER BY avg_revenue_per_user DESC
        `
      )
      .all() as CountryRevenueRow[];

    return NextResponse.json({ rows });
  } finally {
    db.close();
  }
}
