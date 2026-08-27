# Dividend Distribution Calendar - Data Methodology

## Source priority

| Rank | Source | Used for | Authority |
|------|--------|----------|-----------|
| 1 | Issuer fund page (YieldMax, NEOS, JPMorgan, ProShares) | Last ex-date, pay-date, per-share amount, distribution rate, expense ratio | Primary |
| 2 | 19a-1 distribution notice (issuer) | Estimated ROC percentage for the latest distribution | Primary for tax mix |
| 3 | StockAnalysis / Dividend.com distribution history | Cross-check on amount and dates | Secondary |
| 4 | Press releases, SEC N-CSR | Year-end tax character | Primary for finalized classifications only |

Aggregator quotes (Yahoo Finance, etc.) are not used as primary sources.

## How each field is computed

| Field | Formula / source |
|-------|------------------|
| `lastExDate` | The most recent ex-date published on the issuer's distribution page. |
| `lastRecordDate` | The issuer's record date for the same distribution (typically ex-date + 1 business day). |
| `lastPayDate` | The date the issuer credited cash to shareholders of record. |
| `lastAmountUsd` | The per-share amount (USD) of the most recent distribution, as published by the issuer. |
| `distributionRatePct` | `lastAmountUsd * annualizationFactor / currentPrice * 100`, where `annualizationFactor` is 52 (weekly) or 12 (monthly). Current price = close on the day the figure is recorded in `accessedDate`. |
| `secYield30DayPct` | The standardized SEC 30-day yield from the issuer's most recent fact sheet. Reported only when the issuer publishes it. |
| `expenseRatioPct` | The annualized expense ratio from the issuer's prospectus / fact sheet. |
| `rocPct` | The estimated ROC percentage disclosed in the issuer's most recent 19a-1 notice. This is an estimate; the figure is finalized on the Form 1099-DIV. |
| `articleSlug` | The slug of the most relevant article page on this site (`/articles/{slug}/`). |
| `officialSourceUrl` | Direct link to the issuer's own distribution page (preferred) or 19a-1 notice. |
| `crossCheckUrl` | StockAnalysis distribution history for the same ticker. |
| `accessedDate` | The UTC date this record was last verified against the sources above. |

## Limits

- Distribution amounts and dates advance on the issuer's cadence (weekly or monthly); the rate moves with NAV.
- ROC is reported as published in the 19a-1; it is preliminary until the year-end Form 1099-DIV.
- BITO's headline "yield" reflects realized Bitcoin-futures gains; treat as background, not recurring income.
- ULTI/MSTY's high headline rate reflects return of capital, which mechanically erodes NAV.
- A "distribution rate" is not a forecast or a guarantee.

## Refresh cadence

This page is not auto-refreshed. A researcher re-verifies every figure before each update, and the table's `accessedDate` field records when. The top-of-page "Last refreshed" date on the calendar page mirrors the latest `refreshedAt` in `src/data/etf-distribution-schedule.json`.

## Verifying or reporting an error

Open the row, click the "official source" link, and compare. To report a discrepancy, use the contact form in the page footer and include the ticker, the field in question, the figure on this site, and the figure on the official source.
