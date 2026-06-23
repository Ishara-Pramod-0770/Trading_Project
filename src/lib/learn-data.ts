export interface Lesson {
  slug: string;
  title: string;
  minutes: number;
  summary: string;
  /** Each entry is one paragraph of teaching content. */
  content: string[];
}

export interface Course {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  /** lucide icon name, resolved on the client. */
  icon?: string;
  lessons: Lesson[];
}

export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const COURSES: Course[] = [
  {
    slug: "trading-foundations",
    title: "Trading Foundations",
    level: "Beginner",
    description:
      "Start here. Understand what crypto trading actually is, how to read the chart, and how the market is built before you ever place an order.",
    icon: "BookOpen",
    lessons: [
      {
        slug: "what-is-crypto-trading",
        title: "What is Crypto Trading",
        minutes: 7,
        summary:
          "The mechanics of buying and selling digital assets, spot vs. derivatives, and why markets move.",
        content: [
          "Crypto trading is the act of buying and selling digital assets such as Bitcoin, Ethereum and thousands of smaller tokens with the goal of profiting from changes in their price. Unlike traditional stock markets that close in the evening and on weekends, crypto markets run 24 hours a day, seven days a week, across exchanges all over the world. This continuous nature means opportunity and risk never sleep, and it rewards traders who build disciplined routines rather than reacting emotionally to every move.",
          "There are two broad ways to trade. Spot trading means you buy the actual asset and own it outright; if you buy one Ethereum on the spot market, that ETH sits in your wallet or exchange account and is yours. Derivatives trading, such as perpetual futures, lets you speculate on price using leverage without owning the underlying coin. Leverage can multiply gains, but it multiplies losses just as fast and can liquidate your position entirely. Beginners should master spot trading first before ever touching leverage.",
          "Prices move because of supply and demand. When more capital wants to buy than to sell at the current price, the price rises until sellers are willing to meet that demand; when sellers dominate, price falls. Underneath every candle on your screen is an order book, a live list of buy orders (bids) and sell orders (asks). A trade only happens when a buyer and seller agree on a price, and the last agreed price is what you see quoted.",
          "Your edge as a trader does not come from predicting the future with certainty, because nobody can. It comes from finding situations where the potential reward outweighs the risk, sizing your positions so a single loss never hurts you badly, and repeating that process consistently. Trading is a game of probabilities and risk control, not fortune telling. The lessons that follow give you the literacy to read the market and the discipline to survive it.",
        ],
      },
      {
        slug: "candlestick-basics",
        title: "Candlestick Basics",
        minutes: 8,
        summary:
          "How to read a Japanese candlestick, what wicks and bodies tell you, and key reversal patterns.",
        content: [
          "A candlestick is a compact way to show four prices for a single period of time: the open, the high, the low and the close. The thick part is called the body and it spans the open and close. If price closed higher than it opened, the candle is bullish (often green); if it closed lower, it is bearish (often red). The thin lines extending above and below the body are called wicks or shadows, and they mark the highest and lowest prices reached during that period.",
          "The relationship between the body and the wicks tells a story about who won the fight between buyers and sellers. A long body with small wicks shows strong, decisive movement in one direction. A small body with long wicks shows indecision and rejection: price tried to move but was pushed back. Reading this balance is the foundation of price action trading, because it reflects real human behaviour playing out in real time.",
          "Several single-candle patterns are worth memorising. A hammer has a small body near the top and a long lower wick, signalling that sellers pushed price down but buyers reclaimed it, often a bottoming signal. A shooting star is its mirror image at the top, with a long upper wick warning of selling pressure. A doji has almost no body at all, open and close nearly equal, and represents pure indecision that frequently precedes a turning point.",
          "Multi-candle patterns add context. A bullish engulfing pattern is a large green candle whose body completely covers the previous red candle, showing a sharp shift in control toward buyers. A bearish engulfing is the opposite. Always read patterns in context: the same candle means far more when it appears at a major support or resistance level than when it appears in the middle of a choppy, directionless range.",
          "A common beginner mistake is trading every candle pattern in isolation. Candlesticks are most powerful when combined with the structure and levels you will learn in later lessons. Think of them as the language the market speaks, sentence by sentence, while structure tells you the overall story of the conversation.",
        ],
      },
      {
        slug: "market-structure",
        title: "Market Structure",
        minutes: 9,
        summary:
          "Highs and lows, trends versus ranges, and how to read the skeleton of any chart.",
        content: [
          "Market structure is the skeleton beneath every chart: the sequence of swing highs and swing lows that defines whether a market is trending or ranging. A swing high is a peak with lower highs on either side, and a swing low is a trough with higher lows on either side. By connecting these points in your mind, you can describe what price is doing in plain language rather than guessing.",
          "An uptrend is defined by a series of higher highs and higher lows. Each pullback bottoms out above the previous low, and each rally pushes above the previous high, showing that buyers are in control. A downtrend is the mirror: lower highs and lower lows, where every bounce fails to reclaim the prior peak. Recognising which of these you are in is the single most important read you can make, because trading with the trend dramatically improves your odds.",
          "When price stops making new highs and lows and instead bounces between a ceiling and a floor, the market is ranging or consolidating. Ranges represent equilibrium, where buyers and sellers are roughly balanced. They eventually resolve into a breakout in one direction, and understanding whether you are in a trend or a range tells you which strategy to deploy: trend-following or range-trading.",
          "The most important structural event is a break of structure, often abbreviated BOS. In an uptrend, a break of structure to the downside happens when price closes below the most recent higher low, signalling that the trend may be weakening or reversing. This shift in the sequence of highs and lows is your earliest objective warning that control is changing hands, long before lagging indicators react.",
          "Practise by opening any chart and marking the swing highs and lows before you do anything else. Once you can instantly classify a market as uptrend, downtrend or range, every other tool you learn becomes sharper, because you are applying it within the correct context instead of in a vacuum.",
        ],
      },
      {
        slug: "risk-management",
        title: "Risk Management",
        minutes: 10,
        summary:
          "Position sizing, stop losses, risk-to-reward, and why protecting capital comes first.",
        content: [
          "Risk management is what separates traders who last from those who blow up their accounts. The harsh truth is that you can be right about direction and still go broke if you size positions carelessly or refuse to cut losers. Before chasing profits, your first job is always to protect your capital, because you cannot trade tomorrow if you have nothing left today.",
          "The cornerstone rule is to risk only a small, fixed percentage of your account on any single trade, commonly one to two percent. If your account is ten thousand dollars and you risk one percent, the most you can lose on a trade is one hundred dollars regardless of how confident you feel. This means a string of losses, which every trader experiences, barely dents your account and leaves you able to recover.",
          "A stop loss is a predefined price at which you exit a losing trade automatically, accepting a small, known loss instead of an unknown, catastrophic one. You should always know where your stop is before you enter, and you place it at a level that, if reached, proves your trade idea wrong, not at an arbitrary distance. Moving a stop further away to avoid being stopped out is one of the fastest ways to turn a small loss into a ruinous one.",
          "Risk-to-reward ratio compares how much you stand to lose against how much you stand to gain. If you risk one hundred dollars to make three hundred, your ratio is one to three. With a favourable ratio you can be wrong more often than you are right and still be profitable overall. Aiming for at least one to two means winning just forty percent of your trades can keep you in the green over time.",
          "Position size is the lever that ties everything together. Once you know your entry, your stop and the percentage you are willing to risk, position size is a calculation, not a feeling: divide the dollar amount you are willing to lose by the distance from entry to stop. Letting the math decide your size removes ego and emotion, the two forces most responsible for destroyed accounts.",
        ],
      },
    ],
  },
  {
    slug: "technical-analysis-essentials",
    title: "Technical Analysis Essentials",
    level: "Intermediate",
    description:
      "Build a repeatable analytical process. Map the levels that matter, read trend strength, and trade breakouts without getting trapped.",
    icon: "TrendingUp",
    lessons: [
      {
        slug: "support-and-resistance",
        title: "Support & Resistance",
        minutes: 9,
        summary:
          "How to find the price levels where the market reacts, and how to trade around them.",
        content: [
          "Support and resistance are the price levels where the market has historically reacted, and they are the most universally watched tool in technical analysis. Support is a level below price where buying interest has been strong enough to halt a decline, acting like a floor. Resistance is a level above price where selling interest has stopped a rally, acting like a ceiling. These levels form because traders remember them and place orders around them, making them partly self-fulfilling.",
          "The most reliable levels are those that have been tested multiple times. Each time price approaches a level and bounces, that level gains significance because more market participants notice it and act on it. A level that has held three times carries far more weight than one touched only once, but be aware that the more often a level is tested, the more likely it eventually breaks, as the orders defending it get consumed.",
          "One of the most useful concepts is the flip, where a broken support becomes new resistance and broken resistance becomes new support. When price decisively breaks above a ceiling and then pulls back, that old ceiling often becomes a floor that launches the next move up. Trading these retests of flipped levels offers some of the cleanest, lowest-risk entries available, because your stop can sit just on the other side of the level.",
          "Levels are zones, not exact lines. Markets are messy, and price will often overshoot or undershoot a level slightly before reacting, so treat support and resistance as bands a little wide rather than precise prices. Draw your levels from the bodies and wicks of significant candles, focus on the levels that are obvious at a glance, and resist the urge to clutter your chart with dozens of minor lines that only create paralysis.",
        ],
      },
      {
        slug: "trend-analysis",
        title: "Trend Analysis",
        minutes: 8,
        summary:
          "Identifying trend direction and strength with structure, moving averages and timeframes.",
        content: [
          "The oldest piece of trading wisdom is that the trend is your friend, and trend analysis is the discipline of identifying which way the market is genuinely moving so you can trade with that force rather than against it. A trend is more than a direction; it has strength and maturity, and learning to gauge both keeps you from buying at the top of an exhausted move or shorting into a powerful rally.",
          "The purest way to read a trend is through structure, the higher highs and higher lows of an uptrend or the lower highs and lower lows of a downtrend that you learned earlier. Moving averages are a helpful complement: a rising moving average with price above it confirms bullish momentum, and the slope of the average gives a quick visual sense of how strong and sustained the trend is.",
          "Trend strength matters as much as direction. A healthy trend shows steady progress with orderly pullbacks that respect prior levels. When pullbacks become deeper and more violent, or when price makes a new high on visibly weaker momentum, the trend may be tiring. Recognising fading strength lets you tighten stops or take profits before the crowd realises the move is over.",
          "Always analyse trend across multiple timeframes. The higher timeframe, such as the daily, sets the dominant direction and context, while a lower timeframe, such as the one hour, is where you fine-tune your entry. When both align, for example a daily uptrend offering a pullback entry on the hourly, your trade has the wind at its back. When they conflict, it is usually wiser to step aside than to fight the larger tide.",
        ],
      },
      {
        slug: "breakouts",
        title: "Breakouts",
        minutes: 8,
        summary:
          "Trading the moment price escapes a range, distinguishing real breakouts from traps.",
        content: [
          "A breakout occurs when price escapes a defined range, support or resistance level and begins a new directional move. Breakouts are exciting because they often mark the start of a powerful trend, but they are also where many traders get hurt, because the market is full of false breakouts designed, intentionally or not, to trap the impatient. Learning to tell the two apart is what makes breakout trading viable.",
          "The most important confirmation is the candle close. Price may briefly spike above resistance and then collapse back inside the range, which is a false breakout or fakeout. A genuine breakout is usually confirmed when a candle closes clearly beyond the level on the timeframe you trade, showing that the move has commitment rather than being a momentary wick. Waiting for the close costs you a little entry price but saves you from countless traps.",
          "Volume is the breakout trader's best ally. A real breakout is typically accompanied by a surge in volume, showing that genuine demand or supply is driving price through the level. A breakout on weak, declining volume should be treated with suspicion, because there is little conviction behind it and it is more likely to fail and reverse.",
          "A powerful and patient technique is the retest entry. Rather than chasing the initial breakout candle, you wait for price to break the level, then return to test it from the other side, confirming the old resistance now acts as support. Entering on that retest gives you a tighter stop and a much better risk-to-reward ratio, and it filters out many fakeouts because false breakouts rarely hold a clean retest.",
        ],
      },
    ],
  },
  {
    slug: "smart-money-concepts",
    title: "Smart Money Concepts",
    level: "Advanced",
    description:
      "See the market through the lens of institutions. Learn how large players engineer liquidity, leave footprints, and where price is truly drawn.",
    icon: "Crosshair",
    lessons: [
      {
        slug: "smart-money-concepts-intro",
        title: "Smart Money Concepts",
        minutes: 10,
        summary:
          "The institutional view of markets: why price hunts liquidity and how to follow the big players.",
        content: [
          "Smart Money Concepts, often abbreviated SMC, is a framework for reading charts through the eyes of large institutional participants, the banks, funds and market makers whose order flow genuinely moves price. The central idea is that retail traders and institutions behave differently, and price action is frequently engineered to take advantage of predictable retail behaviour. Understanding this lets you stop being the liquidity and start positioning alongside those who provide it.",
          "The core insight of SMC is that institutions cannot enter their enormous positions the way a retail trader does. If a fund tried to buy in size at the market, it would push price against itself instantly. Instead, large players need a pool of opposing orders to fill against, which is why price so often moves toward areas where many stop losses and pending orders sit. Markets do not move randomly toward liquidity; they are drawn to it.",
          "This reframes familiar patterns. The false breakout that traps breakout traders, the sharp wick that stops out a crowd before reversing, the deep pullback that shakes out weak hands, all become rational from the institutional perspective: they are mechanisms to gather the orders needed to fill large positions. Where a retail trader sees a frustrating fakeout, an SMC trader sees a liquidity grab that signals where smart money is positioning.",
          "SMC is built from several interlocking tools that the remaining advanced lessons cover in detail: order blocks, where institutional orders originate; liquidity, the fuel that price hunts; and fair value gaps, the imbalances left behind by aggressive moves. None of these works in isolation. The skill lies in combining them with the market structure you already know to build a coherent story of where price has been engineered to go next.",
          "A word of caution: SMC is a powerful lens, not a magic key. Like any framework it produces failed setups, and treating it as infallible leads to overconfidence and oversized positions. The risk management from your foundational lessons matters more here, not less, because advanced concepts tempt traders into believing they have decoded the market. Stay humble, manage risk, and let the edge play out over many trades.",
        ],
      },
      {
        slug: "order-blocks",
        title: "Order Blocks",
        minutes: 9,
        summary:
          "Identifying the institutional candles that precede strong moves and using them as entries.",
        content: [
          "An order block is the last opposing candle before a strong, impulsive move that breaks structure. In a bullish scenario, it is the final down candle before price rallies sharply upward and shifts the market structure; in a bearish scenario, it is the last up candle before a decisive drop. The logic is that institutions accumulated their positions within that candle, and the zone it marks often acts as support or resistance when price returns to it.",
          "Not every candle before a move qualifies as a valid order block. The quality of an order block comes from what follows it: the subsequent move should be impulsive, leaving little doubt about its strength, and ideally it should break a prior swing high or low, confirming a genuine shift in control. An order block that produces only a weak, hesitant move carries little significance and is best ignored.",
          "Traders use order blocks as high-probability entry zones. When price retraces back into a bullish order block, an SMC trader looks to enter long, anticipating that the institutional interest that originated there will defend the level and resume the move. The unfilled portion of the order block is the area of interest, and a stop loss is typically placed just beyond the far edge of the block, giving a defined and often tight risk.",
          "Order blocks gain enormous power when they line up with other concepts. A bullish order block that sits beneath a pool of liquidity, contains a fair value gap, and aligns with a higher-timeframe support level is a confluence worth waiting for. Conversely, an isolated order block with no supporting context is a far weaker proposition. As always, the higher the timeframe the order block forms on, the more significant and reliable it tends to be.",
        ],
      },
      {
        slug: "liquidity",
        title: "Liquidity",
        minutes: 9,
        summary:
          "Where stop losses and orders cluster, why price hunts them, and how to use liquidity sweeps.",
        content: [
          "Liquidity is the fuel of the market: it is the collection of resting orders, especially stop losses, that large players need to fill their positions. Because retail traders place their stops in predictable locations, liquidity tends to pool in obvious areas, and once you learn to see these pools you can anticipate where price is likely to be drawn before it reverses.",
          "The classic liquidity pools sit just above swing highs and just below swing lows. Traders who are long place protective stops below recent lows, and those stops are simply sell orders waiting to be triggered; traders who are short place stops above recent highs, which are buy orders in waiting. Equal highs or equal lows, where price has formed a clean double top or double bottom, are especially rich pools because they concentrate stops at a single obvious level.",
          "A liquidity sweep, also called a stop hunt, is when price spikes through one of these levels, triggers the cluster of stops, and then sharply reverses. To an unaware trader this looks like a breakout that immediately failed and feels deeply unfair. To an SMC trader it is a clear signal: the institutions needed those orders to fill, they have now done so, and price is free to move in the genuinely intended direction.",
          "You can build trades around liquidity rather than becoming its victim. Instead of placing your stop at the obvious level where everyone else does, you anticipate the sweep and look to enter after it, when price has grabbed the liquidity and reversed back through the level. Combining a liquidity sweep with a return into an order block and a break of structure produces some of the highest-conviction setups in the entire SMC framework.",
        ],
      },
      {
        slug: "fair-value-gaps",
        title: "Fair Value Gaps",
        minutes: 8,
        summary:
          "Reading price imbalances left by aggressive moves and trading their likely fill.",
        content: [
          "A fair value gap, often abbreviated FVG, is an imbalance left behind when price moves so aggressively in one direction that it fails to trade efficiently through a range of prices. On the chart it appears as a three-candle pattern where the wick of the first candle and the wick of the third candle do not overlap, leaving a visible gap in the body of the middle candle. This space represents inefficiency, where buying or selling so overwhelmed the other side that orders went unfilled.",
          "Markets have a strong tendency to return and rebalance these inefficiencies, which is why fair value gaps are treated as magnets for price. After an aggressive bullish move leaves a gap below, price will often pull back into that gap to fill the unmet orders before continuing higher. Anticipating this fill gives traders both a target for an existing move and a potential entry zone for the next one.",
          "Fair value gaps function as dynamic zones of support and resistance. A bullish FVG that price returns to can act as a springboard for the next leg up, offering an entry with a stop placed just below the gap. The most respected gaps are those formed by genuinely impulsive moves on higher timeframes, while small gaps on noisy lower timeframes fill so routinely that they offer little tradeable edge.",
          "As with every advanced tool, confluence is everything. A fair value gap that overlaps with an order block, sits beneath a liquidity pool, and aligns with the higher-timeframe trend is a precise, high-probability area of interest. A gap floating in isolation with no surrounding context is far less reliable. Used together with structure, order blocks and liquidity, fair value gaps complete the toolkit for reading the market the way institutions do.",
        ],
      },
    ],
  },
];

/** Flat list of every lesson across all courses, in course order. */
export const ALL_LESSONS: Lesson[] = COURSES.flatMap((course) => course.lessons);

/** Resolve a lesson slug to its lesson and parent course. */
export function getLesson(
  slug: string,
): { course: Course; lesson: Lesson } | undefined {
  for (const course of COURSES) {
    const lesson = course.lessons.find((l) => l.slug === slug);
    if (lesson) return { course, lesson };
  }
  return undefined;
}
