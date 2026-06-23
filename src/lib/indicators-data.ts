// Educational content for the Indicator Learning System.
// NOTE: this is the *content/data* layer. The math implementations live in
// `./indicators.ts` and must not be touched from here.

export interface IndicatorInfo {
  slug: string;
  name: string;
  abbr: string;
  category: "Momentum" | "Trend" | "Volatility" | "Volume";
  summary: string;
  whatItDoes: string;
  howTradersUse: string;
  settings: string;
  buySignal: string;
  sellSignal: string;
  example: string;
}

export const INDICATORS: IndicatorInfo[] = [
  {
    slug: "rsi",
    name: "Relative Strength Index",
    abbr: "RSI",
    category: "Momentum",
    summary:
      "A bounded momentum oscillator that measures the speed and magnitude of recent price changes to gauge whether an asset is overbought or oversold.",
    whatItDoes:
      "RSI compares the average size of up-moves to the average size of down-moves over a lookback window, then normalises the result onto a 0–100 scale. Readings above 70 traditionally signal overbought conditions while readings below 30 signal oversold conditions. Because it is bounded, it lets traders compare momentum extremes consistently across very different assets and timeframes.",
    howTradersUse:
      "Traders watch for RSI to reach extreme zones and then turn back toward the midline as a sign that momentum is exhausting. Many also hunt for divergence, where price prints a new high or low but RSI fails to confirm it, hinting at a coming reversal. In strong trends, the 40–60 band and the 50 centerline are used as dynamic support and resistance for momentum.",
    settings:
      "The classic setting is a 14-period lookback with overbought/oversold thresholds at 70/30. Shorter periods (7–9) react faster but produce more noise and false signals, while longer periods (21+) are smoother and better for position trading. In strong uptrends some traders shift the bands to 80/40 (and 60/20 in downtrends) to avoid premature exits.",
    buySignal:
      "A long bias appears when RSI drops below 30 into oversold territory and then crosses back above it, especially if a bullish divergence formed beforehand. A reclaim of the 50 centerline from below adds confirmation that momentum has flipped positive.",
    sellSignal:
      "A short or exit bias appears when RSI pushes above 70 into overbought territory and then rolls back beneath it. Bearish divergence — price making a higher high while RSI makes a lower high — combined with a loss of the 50 line strengthens the case.",
    example:
      "Imagine BTC rallies hard and RSI(14) spikes to 78 while price tags a new local high, but on the very next push to a marginally higher high RSI only reaches 71. That lower RSI high against a higher price high is classic bearish divergence; when RSI then closes back below 70, a trader might tighten stops or scale out expecting a pullback.",
  },
  {
    slug: "macd",
    name: "Moving Average Convergence Divergence",
    abbr: "MACD",
    category: "Momentum",
    summary:
      "A trend-following momentum indicator built from the relationship between two exponential moving averages, visualised as a line, a signal line and a histogram.",
    whatItDoes:
      "MACD subtracts a slower EMA from a faster EMA to produce the MACD line, then plots a signal line (an EMA of the MACD line) on top of it. The histogram shows the gap between the two, expanding as momentum accelerates and contracting as it fades. Together they reveal both the direction and the strength of a trend in a single panel.",
    howTradersUse:
      "The most common technique is the crossover: when the MACD line crosses above the signal line momentum is turning up, and below it momentum is turning down. The zero line acts as a regime filter — readings above zero indicate a bullish backdrop, below zero a bearish one. Like RSI, MACD is also valued for divergence between its histogram and price.",
    settings:
      "The default configuration is 12, 26, 9: a 12-period fast EMA, 26-period slow EMA, and a 9-period EMA signal line. Faster settings make the indicator more sensitive and better for scalping, while slower settings reduce whipsaws on higher timeframes. The 12/26/9 preset works well on daily charts and is the de facto industry standard.",
    buySignal:
      "A bullish crossover — the MACD line rising through the signal line — is the primary long trigger, and it is strongest when it happens above the zero line or as the line crosses zero from below. A histogram flipping from negative to positive confirms momentum has shifted in favour of buyers.",
    sellSignal:
      "A bearish crossover, where the MACD line falls back below the signal line, signals fading upside momentum, particularly below the zero line. A histogram that shrinks toward zero and then turns negative warns that the prevailing rally is losing steam.",
    example:
      "After a multi-week downtrend, ETH stabilises and the MACD histogram, which had been deeply negative, starts shrinking each day. When the MACD line finally crosses above its signal line and shortly after pushes through the zero line, a swing trader reads this as confirmation that a new uptrend has begun and enters long.",
  },
  {
    slug: "ema",
    name: "Exponential Moving Average",
    abbr: "EMA",
    category: "Trend",
    summary:
      "A weighted moving average that places more emphasis on recent prices, allowing it to react faster to new information than a simple average.",
    whatItDoes:
      "EMA applies an exponentially decaying weight to past prices so the most recent candles influence the line the most. This makes it hug price more closely and turn sooner than an SMA of the same length. The result is a responsive trend line that smooths noise while still respecting fresh momentum.",
    howTradersUse:
      "Traders use EMAs as dynamic support and resistance, expecting price to bounce off a rising EMA in an uptrend or get rejected by a falling one in a downtrend. Combining a fast and a slow EMA produces crossover signals that flag trend changes. The slope of the EMA itself is a quick read on whether the market is trending up, down, or going sideways.",
    settings:
      "Popular lengths include the 9 and 21 EMAs for short-term momentum, the 50 EMA for the intermediate trend, and the 200 EMA for the long-term trend. Shorter EMAs react quickly but whipsaw in choppy markets, while longer EMAs are more stable and act as major support/resistance. Many traders stack several EMAs together to read trend alignment at a glance.",
    buySignal:
      "A long signal occurs when a faster EMA crosses above a slower one (for example the 9 crossing above the 21), or when price pulls back to a rising EMA and bounces. Price reclaiming the 200 EMA from below is a widely watched bullish regime change.",
    sellSignal:
      "A short or exit signal appears when the faster EMA crosses below the slower EMA (a death-cross style event), or when price fails at a falling EMA. Losing the 200 EMA to the downside often marks a shift into a bearish regime.",
    example:
      "On a 4-hour SOL chart the 9 EMA sits above the 21 EMA and both slope upward, so a trader waits for a dip. When price retraces into the 21 EMA, forms a bullish candle and holds, the trader enters long with a stop just below the EMA, riding the trend until the 9 EMA crosses back under the 21.",
  },
  {
    slug: "sma",
    name: "Simple Moving Average",
    abbr: "SMA",
    category: "Trend",
    summary:
      "The arithmetic mean of price over a fixed number of periods, producing a smooth baseline that filters out short-term noise to reveal the underlying trend.",
    whatItDoes:
      "SMA adds up the closing prices over a chosen window and divides by the number of periods, giving every candle equal weight. Because it treats old and new data the same, it is smoother and slower-moving than an EMA. This lag is a feature for traders who want a stable read on the broader trend rather than fast reactions.",
    howTradersUse:
      "SMAs act as objective trend filters and as horizontal-style support and resistance that the whole market watches. The 50 and 200 SMA crossovers — the golden cross and death cross — are headline signals used by both retail and institutions. Price trading above a rising SMA is treated as bullish, and below a falling SMA as bearish.",
    settings:
      "The 50-period and 200-period SMAs are the most widely followed, especially on the daily chart, with the 20 SMA used for shorter-term context. Longer windows give smoother, more reliable trend reads at the cost of more lag. Because so many participants use the same standard lengths, those levels often become self-fulfilling reaction zones.",
    buySignal:
      "The classic bullish trigger is the golden cross, where the 50 SMA crosses above the 200 SMA, signalling a longer-term uptrend. Price closing back above a key SMA after testing it from below also offers a long entry with a clear invalidation level.",
    sellSignal:
      "The bearish counterpart is the death cross, where the 50 SMA crosses below the 200 SMA. A decisive close beneath a major SMA that previously acted as support warns that the trend may be turning down.",
    example:
      "During a recovery, BTC's 50-day SMA grinds higher and finally crosses above the flat 200-day SMA, printing a golden cross that makes headlines. A position trader uses this as confirmation of a regime shift and accumulates on pullbacks to the rising 50 SMA, treating a close below the 200 SMA as their exit.",
  },
  {
    slug: "vwap",
    name: "Volume Weighted Average Price",
    abbr: "VWAP",
    category: "Volume",
    summary:
      "An intraday benchmark that averages price weighted by volume, showing the true average price at which an asset has traded over the session.",
    whatItDoes:
      "VWAP cumulatively sums price multiplied by volume and divides by total volume, so heavily traded prices pull the line toward them. This produces a fair-value reference that institutions use to judge whether their fills are good or poor. It typically resets at the start of each trading session, making it a natural anchor for intraday work.",
    howTradersUse:
      "Traders treat VWAP as the intraday line in the sand: price above it favours bulls and below it favours bears. Mean-reversion traders fade moves that stretch far from VWAP, expecting a snap back, while trend traders use VWAP as a dynamic support or resistance to add to positions. Institutions also use it to execute large orders near the average without moving the market.",
    settings:
      "Standard VWAP is session-anchored and resets daily, but anchored VWAP can be pinned to a significant event such as a swing high, swing low, or news release. Many platforms add standard-deviation bands around VWAP to define stretched zones. It is most meaningful on intraday timeframes where intrasession volume distribution matters.",
    buySignal:
      "A long bias forms when price holds above a rising VWAP, or when it dips back to VWAP and finds support before resuming higher. Reclaiming VWAP from below after an early-session flush is a popular intraday entry.",
    sellSignal:
      "A short or exit bias forms when price stays below a falling VWAP or rallies into VWAP and gets rejected. A clean loss of VWAP after trading above it all session signals that intraday control has shifted to sellers.",
    example:
      "A day trader watching ETH sees price open strong, pull back midday to tag VWAP exactly, and bounce on rising volume. Reading VWAP as defended support, the trader buys the retest with a stop just beneath the line and targets a return to the session highs.",
  },
  {
    slug: "bollinger-bands",
    name: "Bollinger Bands",
    abbr: "BB",
    category: "Volatility",
    summary:
      "A volatility envelope made of a moving-average midline and two bands set a number of standard deviations away, expanding and contracting with market volatility.",
    whatItDoes:
      "Bollinger Bands plot a central SMA with an upper and lower band placed a multiple of standard deviations above and below it. When volatility rises the bands widen, and when it falls they squeeze together. This gives a visual, statistically grounded sense of whether price is relatively high or low and how energetic the market currently is.",
    howTradersUse:
      "In range-bound markets traders fade touches of the outer bands, expecting price to revert toward the midline. A 'squeeze', where the bands narrow tightly, often precedes a powerful breakout, so traders watch for an expansion to signal direction. In trends, price 'walking the band' along the upper or lower edge confirms strength rather than exhaustion.",
    settings:
      "The default is a 20-period SMA with bands set at 2 standard deviations. Widening the multiplier to 2.5 or 3 captures only the most extreme moves, while tightening it produces more frequent band touches. The 20/2 preset balances sensitivity and reliability and is the standard most charting tools ship with.",
    buySignal:
      "A mean-reversion long appears when price pierces the lower band and then closes back inside it, suggesting the sell-off overshot. In a trend, a breakout above the upper band following a tight squeeze can signal the start of a strong upside expansion.",
    sellSignal:
      "A mean-reversion short or exit appears when price tags the upper band and snaps back inside, hinting the rally is overextended. A breakdown below the lower band out of a squeeze warns of an impending downside expansion.",
    example:
      "After days of quiet drift, BTC's Bollinger Bands pinch into an unusually tight squeeze, telling a trader a big move is coming but not its direction. When a high-volume candle bursts up through the upper band and the bands flare open, the trader takes the breakout long, trailing a stop beneath the expanding midline.",
  },
  {
    slug: "atr",
    name: "Average True Range",
    abbr: "ATR",
    category: "Volatility",
    summary:
      "A pure volatility gauge that measures the average range an asset moves per period, without regard to direction, making it ideal for sizing risk.",
    whatItDoes:
      "ATR averages the 'true range' — the greatest of the current high-low, the gap from the prior close to the high, and the gap from the prior close to the low — over a lookback window. The result is a single number expressing how much, on average, price travels each period. It tells you nothing about direction, only about how volatile the market currently is.",
    howTradersUse:
      "Traders rarely trade ATR directly; instead they use it to set stops and position sizes that adapt to volatility. Placing a stop a multiple of ATR away from entry keeps it outside normal noise, while sizing positions inversely to ATR keeps dollar risk constant across calm and wild markets. Rising ATR flags expanding volatility, often around breakouts or news.",
    settings:
      "The standard lookback is 14 periods, matching RSI. Shorter periods make ATR react quickly to fresh volatility spikes, while longer periods give a smoother baseline of typical movement. Common stop multiples range from roughly 1.5x ATR for tight intraday risk to 3x ATR for giving swing trades room to breathe.",
    buySignal:
      "ATR does not produce directional buy signals on its own; instead it confirms and manages entries from other tools. A surge in ATR alongside a bullish breakout suggests the move has real conviction, and the value can be used to set an initial stop a defined multiple below the entry.",
    sellSignal:
      "Likewise ATR gives no standalone sell signal, but a sharp ATR expansion during a breakdown confirms aggressive selling. Traders also use ATR-based trailing stops to lock in gains and exit when price retraces by a chosen multiple of the average range.",
    example:
      "A trader going long SOL at $150 checks the 14-period ATR and sees it reading $6. To keep the stop outside normal noise they place it 2x ATR below entry at $138, and they size the position so that a stop-out risks a fixed percentage of the account — automatically trading smaller when volatility is high.",
  },
];

export function getIndicator(slug: string): IndicatorInfo | undefined {
  return INDICATORS.find((indicator) => indicator.slug === slug);
}
