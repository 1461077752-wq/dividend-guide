import fs from 'node:fs/promises';

const symbols = [
  ['JNJ', 'Johnson & Johnson', 'Healthcare', 'aristocrat', 45, '62 yrs'],
  ['PG', 'Procter & Gamble', 'Consumer Staples', 'aristocrat', 60, '68 yrs'],
  ['KO', 'Coca-Cola', 'Consumer Staples', 'aristocrat', 72, '62 yrs'],
  ['PEP', 'PepsiCo', 'Consumer Staples', 'aristocrat', 64, '52 yrs'],
  ['LOW', "Lowe's", 'Consumer Discretionary', 'aristocrat', 35, '60 yrs'],
  ['ABBV', 'AbbVie', 'Healthcare', 'aristocrat', 48, '52 yrs'],
  ['CAT', 'Caterpillar', 'Industrials', 'aristocrat', 28, '31 yrs'],
  ['O', 'Realty Income', 'Real Estate (REIT)', 'high-yield', 76, 'Monthly'],
  ['VZ', 'Verizon', 'Telecom', 'high-yield', 58, 'Quarterly'],
  ['MO', 'Altria', 'Consumer Staples', 'high-yield', 78, 'Quarterly'],
  ['ENB', 'Enbridge', 'Energy (Midstream)', 'high-yield', 65, 'Quarterly'],
  ['EPD', 'Enterprise Products', 'Energy (Midstream)', 'high-yield', 63, 'Quarterly'],
  ['MSFT', 'Microsoft', 'Technology', 'growth', 25, '10.2%'],
  ['AAPL', 'Apple', 'Technology', 'growth', 15, '5.8%'],
  ['V', 'Visa', 'Financials', 'growth', 21, '15.4%'],
  ['MA', 'Mastercard', 'Financials', 'growth', 18, '16.2%'],
  ['COST', 'Costco', 'Consumer Staples', 'growth', 26, '12.1%'],
  ['UNH', 'UnitedHealth', 'Healthcare', 'growth', 30, '15.8%'],
];

async function fetchQuote(symbol) {
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?range=5y&interval=1d&events=div%2Csplits`;
  const response = await fetch(url, { headers: { 'User-Agent': 'DividendGuide/1.0' } });
  if (!response.ok) throw new Error(`${symbol}: HTTP ${response.status}`);
  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  if (!result?.meta?.regularMarketPrice) throw new Error(`${symbol}: missing quote`);

  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - 365 * 24 * 60 * 60;
  const dividends = Object.entries(result.events?.dividends ?? {})
    .filter(([, event]) => event.date >= cutoff)
    .reduce((sum, [, event]) => sum + Number(event.amount || 0), 0);

  return {
    symbol,
    price: Number(result.meta.regularMarketPrice),
    annualDividend: Number(dividends.toFixed(4)),
    marketTime: new Date((result.meta.regularMarketTime || now) * 1000).toISOString(),
    currency: result.meta.currency || 'USD',
  };
}

const records = [];
for (const [symbol, company, sector, category, payoutRatio, secondary] of symbols) {
  try {
    const quote = await fetchQuote(symbol);
    records.push({ ...quote, company, sector, category, payoutRatio, secondary });
    console.log(`${symbol}: $${quote.price.toFixed(2)} | ${quote.annualDividend.toFixed(2)} annual dividend`);
  } catch (error) {
    console.warn(`Skipping ${symbol}: ${error.message}`);
  }
}

if (records.length < symbols.length * 0.8) {
  throw new Error(`Only refreshed ${records.length}/${symbols.length} symbols; refusing to overwrite market data.`);
}

const output = {
  source: 'Yahoo Finance chart API',
  refreshedAt: new Date().toISOString(),
  records,
};
await fs.mkdir('src/data', { recursive: true });
await fs.writeFile('src/data/market-data.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${records.length} records to src/data/market-data.json`);
