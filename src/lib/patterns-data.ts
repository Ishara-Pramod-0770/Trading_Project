export interface PatternInfo {
  slug: string;
  name: string;
  category: "Reversal" | "Continuation" | "Triangle" | "Harmonic";
  bias: "Bullish" | "Bearish" | "Both";
  reliability: "High" | "Medium" | "Low";
  summary: string;
  description: string;
  formation: string;
  entryIdea: string;
  stopLoss: string;
  target: string;
  mistakes: string[];
  asciiChart: string;
}

export const PATTERN_CATEGORIES = [
  "Reversal",
  "Continuation",
  "Triangle",
  "Harmonic",
] as const;

export type PatternCategory = (typeof PATTERN_CATEGORIES)[number];

export const PATTERNS: PatternInfo[] = [
  // ──────────────────────────── REVERSAL ────────────────────────────
  {
    slug: "head-and-shoulders",
    name: "Head and Shoulders",
    category: "Reversal",
    bias: "Bearish",
    reliability: "High",
    summary:
      "A three-peak topping pattern where the middle peak is highest, signalling an exhausted uptrend about to reverse lower.",
    description:
      "The Head and Shoulders is one of the most reliable bearish reversal structures in technical analysis. It forms after a sustained uptrend and consists of a left shoulder, a higher central head, and a right shoulder of roughly equal height to the left. The pattern confirms that buyers can no longer push price to new highs, transferring control to sellers once the neckline breaks.",
    formation:
      "Price rallies to make the left shoulder, pulls back, then surges to a higher high forming the head before retreating again. A final, weaker rally creates the right shoulder that fails near the level of the left shoulder. Connecting the two intervening swing lows produces the neckline, the key trigger level. Declining volume into the head and right shoulder strengthens the signal.",
    entryIdea:
      "Enter short on a decisive close below the neckline, ideally accompanied by a volume expansion. More conservative traders wait for a pullback (throwback) that retests the broken neckline from below and then enter as price rejects it.",
    stopLoss:
      "Place the stop just above the right shoulder, or above the head for a wider, more forgiving placement. A close back above the neckline after the break invalidates the setup and is a clean exit.",
    target:
      "Measure the vertical distance from the top of the head to the neckline, then project that distance downward from the neckline break point. Partial profits can be taken at prior support levels along the way.",
    mistakes: [
      "Shorting before the neckline actually breaks, anticipating a pattern that never confirms.",
      "Ignoring volume — a valid break usually shows expanding volume, while a low-volume break often fails.",
      "Demanding perfectly symmetrical shoulders; real patterns are messy and slight asymmetry is normal.",
      "Setting the stop too tight just above the right shoulder and getting shaken out on the retest.",
    ],
    asciiChart: `        ___
       /   \\   <- Head
  _   /     \\   _
 / \\ /       \\ / \\  <- Shoulders
/   v         v   \\
~~~~~~~~~~~~~~~~~~~~~ <- Neckline
                  \\
                   \\  break
                    v`,
  },
  {
    slug: "inverse-head-and-shoulders",
    name: "Inverse Head and Shoulders",
    category: "Reversal",
    bias: "Bullish",
    reliability: "High",
    summary:
      "A mirror of the Head and Shoulders that marks the end of a downtrend and the start of a bullish reversal.",
    description:
      "The Inverse Head and Shoulders is a high-probability bullish reversal pattern appearing at the bottom of a downtrend. It features three troughs: a left shoulder, a deeper central head, and a right shoulder at a similar depth to the left. A break above the neckline signals that sellers are exhausted and buyers have taken control.",
    formation:
      "Price falls to the left shoulder low, bounces, drops to a lower low forming the head, then rallies again. A final dip carves the right shoulder, which holds above the head. The neckline connects the two reaction highs between the troughs. Rising volume on the move out of the head and through the neckline confirms strength.",
    entryIdea:
      "Go long on a confirmed close above the neckline with strong volume. Alternatively, wait for a pullback to the neckline-turned-support and buy the bounce for a tighter risk-defined entry.",
    stopLoss:
      "Position the stop below the right shoulder for an aggressive entry, or below the head for added room. A close back under the neckline negates the pattern.",
    target:
      "Take the distance from the bottom of the head to the neckline and project it upward from the breakout point. Scaling out at overhead resistance zones helps lock in gains.",
    mistakes: [
      "Buying the head low hoping the pattern completes before the neckline is reclaimed.",
      "Overlooking weak volume on the breakout, which frequently precedes a failed move.",
      "Confusing a simple double bottom with this three-trough structure and mismeasuring the target.",
      "Chasing price far above the neckline after the breakout has already extended.",
    ],
    asciiChart: `\\   ^         ^   /
 \\ / \\       / \\ /  <- Shoulders
~~v~~~\\~~~~~/~~~v~~~ <- Neckline
       \\     /
        \\   /
         \\_/   <- Head`,
  },
  {
    slug: "double-top",
    name: "Double Top",
    category: "Reversal",
    bias: "Bearish",
    reliability: "Medium",
    summary:
      "Two failed attempts to break a resistance level form an 'M' shape, warning of a bearish reversal.",
    description:
      "The Double Top is a bearish reversal pattern that develops when price tests a resistance area twice and fails to break through, creating two roughly equal peaks separated by a moderate trough. The pattern reflects waning buying pressure and is confirmed when price breaks below the swing low between the two peaks.",
    formation:
      "After an uptrend, price reaches a high, retreats to an intermediate low, then rallies back toward the prior high but stalls at the same resistance. The second peak often shows lower volume or bearish divergence. The line drawn across the intervening low is the confirmation (neckline) level.",
    entryIdea:
      "Enter short when price closes below the central trough (neckline). A retest of the broken neckline that fails to reclaim it offers a lower-risk secondary entry.",
    stopLoss:
      "Place the stop above the second peak, or above the higher of the two peaks for extra cushion against a false break.",
    target:
      "Measure the height from the peaks down to the neckline and project that distance below the breakdown point to set the minimum objective.",
    mistakes: [
      "Calling a double top after only the second peak forms, before the neckline breaks.",
      "Treating any two highs as a double top even when they are too far apart in time or price.",
      "Missing momentum divergence on the second peak, the strongest confirmation clue.",
      "Forgetting that strong trends often power straight through the resistance, voiding the pattern.",
    ],
    asciiChart: `   __        __
  /  \\      /  \\   <- Two peaks
 /    \\    /    \\
/      \\  /      \\
        \\/  <- trough
~~~~~~~~~~~~~~~~~~~ <- Neckline
                \\
                 v  breakdown`,
  },
  {
    slug: "double-bottom",
    name: "Double Bottom",
    category: "Reversal",
    bias: "Bullish",
    reliability: "Medium",
    summary:
      "Two failed attempts to break a support level form a 'W' shape, signalling a bullish reversal.",
    description:
      "The Double Bottom is a bullish reversal pattern that emerges when price tests a support area twice without breaking lower, producing two roughly equal troughs separated by a moderate peak. It indicates sellers are losing momentum and is confirmed once price breaks above the high between the two lows.",
    formation:
      "Following a downtrend, price drops to a low, bounces to an interim high, then declines back to the same support and holds. The second bottom frequently arrives on lighter volume or with bullish divergence. The horizontal line at the middle peak is the confirmation (neckline) level.",
    entryIdea:
      "Go long when price closes above the central peak (neckline). A pullback to the reclaimed neckline that holds as support provides a tighter follow-up entry.",
    stopLoss:
      "Set the stop below the second bottom, or below the lower of the two bottoms for additional protection.",
    target:
      "Measure the distance from the bottoms up to the neckline and project it above the breakout point for the minimum price objective.",
    mistakes: [
      "Buying the second bottom before the neckline is broken and confirmed.",
      "Ignoring the broader trend — a weak bounce in a strong downtrend often fails.",
      "Overlooking volume, which should expand on the breakout above the neckline.",
      "Placing the stop too close to the second low and being stopped on normal noise.",
    ],
    asciiChart: `\\      /\\      /
 \\    /  \\    /
  \\  /    \\  /
~~~\\/~~~~~~\\/~~~~~ <- Neckline
   peak between
   two equal lows ->  breakout ^`,
  },

  // ────────────────────────── CONTINUATION ──────────────────────────
  {
    slug: "bull-flag",
    name: "Bull Flag",
    category: "Continuation",
    bias: "Bullish",
    reliability: "High",
    summary:
      "A sharp rally followed by a tight, downward-sloping consolidation that typically resolves higher.",
    description:
      "A Bull Flag is a continuation pattern that forms after a strong, near-vertical advance known as the flagpole. The subsequent consolidation drifts gently lower or sideways in a narrow channel, representing healthy profit-taking before the trend resumes. It is among the most dependable continuation setups in trending markets.",
    formation:
      "Price surges sharply upward to create the flagpole, then enters an orderly pullback bounded by two parallel, slightly down-sloping trendlines. Volume contracts during the flag and then expands on the breakout. The consolidation should be relatively brief; the longer it drags, the weaker the signal.",
    entryIdea:
      "Buy on a breakout above the upper flag trendline with a surge in volume. Aggressive traders may enter near the lower trendline anticipating the bounce within the channel.",
    stopLoss:
      "Place the stop just below the lower flag boundary, or below the most recent swing low inside the flag.",
    target:
      "Project the height of the flagpole upward from the breakout point. This 'measured move' provides a realistic minimum objective.",
    mistakes: [
      "Mistaking a deep, sloppy retrace (more than ~50% of the pole) for a tight flag.",
      "Entering before the breakout and getting trapped in extended sideways chop.",
      "Ignoring the volume signature — declining volume in the flag and a spike on breakout.",
      "Trading a flag with no real flagpole, where there was no prior impulsive move.",
    ],
    asciiChart: `              ___
             |   \\  <- flag
            ^|    \\___
           / |
          /  <- flagpole
         /
        /
~~~~~~~/~~~~~~~~~~~~~~`,
  },
  {
    slug: "bear-flag",
    name: "Bear Flag",
    category: "Continuation",
    bias: "Bearish",
    reliability: "High",
    summary:
      "A sharp decline followed by a tight, upward-sloping consolidation that typically resolves lower.",
    description:
      "A Bear Flag is the bearish mirror of the Bull Flag and a reliable continuation pattern in downtrends. It begins with a steep sell-off (the flagpole) followed by a modest, upward-drifting consolidation as short-term buyers attempt to bounce. The trend usually resumes downward once the flag breaks.",
    formation:
      "Price drops sharply to form the flagpole, then consolidates in a narrow channel that slopes slightly upward against the trend. Volume fades during the flag and expands on the downside break. A counter-trend rally that is too strong or prolonged weakens the pattern.",
    entryIdea:
      "Enter short on a breakdown below the lower flag trendline with rising volume. More aggressive traders short near the upper trendline expecting rejection inside the channel.",
    stopLoss:
      "Place the stop just above the upper flag boundary, or above the most recent swing high within the flag.",
    target:
      "Project the length of the flagpole downward from the breakdown point to estimate the measured move objective.",
    mistakes: [
      "Confusing a genuine reversal with a flag when the counter-rally retraces too much.",
      "Shorting prematurely before the lower trendline actually breaks.",
      "Disregarding the volume pattern that should contract in the flag and expand on the break.",
      "Holding through a strong bounce that has already invalidated the structure.",
    ],
    asciiChart: `~~~~~~~\\~~~~~~~~~~~~~~
        \\
         \\  <- flagpole
          \\
           \\___
           |   \\  <- flag (rising)
           |    \\
                 v  breakdown`,
  },
  {
    slug: "pennant",
    name: "Pennant",
    category: "Continuation",
    bias: "Both",
    reliability: "Medium",
    summary:
      "A small symmetrical triangle that follows a strong move and resolves in the direction of the prior trend.",
    description:
      "A Pennant is a short-term continuation pattern that resembles a tiny symmetrical triangle forming right after a powerful price move (the flagpole). Converging trendlines reflect a brief balance between buyers and sellers before the dominant trend reasserts itself. Pennants are typically resolved quickly.",
    formation:
      "A sharp impulsive move creates the flagpole, then price coils between two converging trendlines, making lower highs and higher lows. Volume diminishes markedly during the coil and surges on the breakout. The pennant should be compact and short-lived to remain valid.",
    entryIdea:
      "Enter in the direction of the prior trend on a breakout from the converging trendlines, confirmed by a volume expansion.",
    stopLoss:
      "Place the stop on the opposite side of the pennant from the breakout, just beyond the apex or the nearest swing extreme.",
    target:
      "Apply the measured move by projecting the flagpole height from the breakout point in the direction of the trend.",
    mistakes: [
      "Letting the pennant grow too large or last too long, which dilutes the signal.",
      "Trading the breakout without confirming volume, increasing the risk of a fakeout.",
      "Anticipating direction instead of waiting for the trendline break to confirm.",
      "Forgetting there must be a strong flagpole; a pennant without one is just chop.",
    ],
    asciiChart: `        |\\
        | \\___
        |  __/  <- pennant
       ^| /
       /
      /  <- flagpole
     /
~~~~/~~~~~~~~~~~~~~~~`,
  },
  {
    slug: "rectangle",
    name: "Rectangle",
    category: "Continuation",
    bias: "Both",
    reliability: "Medium",
    summary:
      "A horizontal trading range between parallel support and resistance that usually continues the prior trend.",
    description:
      "A Rectangle is a consolidation pattern where price oscillates between roughly horizontal support and resistance lines, forming a clear range. It represents a pause where supply and demand are temporarily balanced. While most often a continuation pattern, the eventual breakout direction must be confirmed before committing.",
    formation:
      "Price bounces repeatedly between a flat resistance ceiling and a flat support floor, touching each boundary at least twice. Volume often contracts during the range and expands on the breakout. The longer and tighter the range, the more significant the eventual move.",
    entryIdea:
      "Trade the breakout: go long above resistance or short below support, ideally on increased volume. Range traders may instead buy support and sell resistance within the box until a break occurs.",
    stopLoss:
      "For a breakout trade, place the stop just back inside the opposite side of the range. For range trades, set stops just beyond the boundary being traded.",
    target:
      "Measure the height of the rectangle and project it from the breakout point in the breakout direction for the minimum objective.",
    mistakes: [
      "Assuming continuation and ignoring that rectangles can break either way.",
      "Getting chopped up by trading every minor touch inside a noisy range.",
      "Reacting to intrabar wicks instead of waiting for a confirmed closing break.",
      "Neglecting volume confirmation, which often distinguishes real breaks from fakeouts.",
    ],
    asciiChart: `~~~~~~~~~~~~~~~~~~~~~ <- resistance
 /\\    /\\    /\\
/  \\  /  \\  /  \\
    \\/    \\/    \\
~~~~~~~~~~~~~~~~~~~~~ <- support
                  \\
                   v  or ^ breakout`,
  },

  // ──────────────────────────── TRIANGLE ────────────────────────────
  {
    slug: "ascending-triangle",
    name: "Ascending Triangle",
    category: "Triangle",
    bias: "Bullish",
    reliability: "High",
    summary:
      "A flat resistance ceiling with rising support beneath it, typically breaking out to the upside.",
    description:
      "The Ascending Triangle is a bullish pattern defined by a horizontal resistance line and an upward-sloping support line. The rising lows show buyers stepping in at progressively higher prices while resistance holds firm, building pressure that usually resolves with an upside breakout.",
    formation:
      "Price tests a flat resistance level multiple times while each pullback bottoms at a higher low, creating an ascending support trendline. The two lines converge toward an apex. Volume tends to decline as the triangle matures and then surges on the breakout.",
    entryIdea:
      "Enter long on a decisive close above the horizontal resistance, confirmed by expanding volume. A retest of the broken resistance as new support offers a secondary, lower-risk entry.",
    stopLoss:
      "Place the stop below the most recent higher low or beneath the rising support trendline.",
    target:
      "Measure the height of the triangle at its widest (left) part and project it upward from the breakout point.",
    mistakes: [
      "Assuming a guaranteed upside break; ascending triangles can still fail downward.",
      "Entering before the resistance level is convincingly broken on a closing basis.",
      "Drawing the support trendline through wicks inconsistently, distorting the structure.",
      "Ignoring the volume dry-up and subsequent breakout surge that validate the move.",
    ],
    asciiChart: `~~~~~~~~~~~~~~~~~~~~ <- flat resistance
 /\\    /\\   /\\   /
/  \\  /  \\ /  \\ /  <- rising lows
    \\/    v    v
   /  (support rises)
  /
 /  breakout ^`,
  },
  {
    slug: "descending-triangle",
    name: "Descending Triangle",
    category: "Triangle",
    bias: "Bearish",
    reliability: "High",
    summary:
      "A flat support floor with falling resistance above it, typically breaking down to the downside.",
    description:
      "The Descending Triangle is a bearish pattern formed by a horizontal support line and a downward-sloping resistance line. The lower highs show sellers becoming more aggressive while support holds, building pressure that usually resolves with a downside breakdown.",
    formation:
      "Price repeatedly tests a flat support level while each rally peaks at a lower high, creating a descending resistance trendline. The lines converge toward an apex. Volume generally contracts as the pattern develops and expands on the breakdown.",
    entryIdea:
      "Enter short on a decisive close below the horizontal support, confirmed by rising volume. A retest of the broken support as new resistance provides a lower-risk follow-up entry.",
    stopLoss:
      "Place the stop above the most recent lower high or above the descending resistance trendline.",
    target:
      "Measure the height of the triangle at its widest (left) part and project it downward from the breakdown point.",
    mistakes: [
      "Assuming a certain downside break; descending triangles sometimes resolve upward.",
      "Shorting before support is convincingly broken on a closing basis.",
      "Mismeasuring the target by using the narrow apex height instead of the widest part.",
      "Disregarding the volume contraction and breakdown surge that confirm the pattern.",
    ],
    asciiChart: `\\
 \\    /\\    (lower highs)
  \\  /  \\  /\\
   \\/    \\/  \\
~~~~~~~~~~~~~~~~~~~ <- flat support
                 \\
                  v  breakdown`,
  },
  {
    slug: "symmetrical-triangle",
    name: "Symmetrical Triangle",
    category: "Triangle",
    bias: "Both",
    reliability: "Medium",
    summary:
      "Converging lower highs and higher lows form a coil that breaks in either direction.",
    description:
      "The Symmetrical Triangle is a neutral coil formed by a descending resistance line and an ascending support line of similar slope. It reflects indecision and tightening volatility as buyers and sellers reach equilibrium. The breakout direction is not predetermined, so confirmation is essential before trading it.",
    formation:
      "Price makes a series of lower highs and higher lows that converge toward an apex, squeezing into an increasingly narrow range. Volume typically diminishes as the apex approaches and then expands sharply on the breakout, signalling which side has won.",
    entryIdea:
      "Wait for a confirmed close beyond either trendline and trade in that direction with volume confirmation. Breakouts tend to be more reliable when they occur before price reaches the apex.",
    stopLoss:
      "Place the stop just on the opposite side of the triangle from the breakout, near the broken trendline or last swing extreme.",
    target:
      "Project the height of the triangle at its widest part from the breakout point in the direction of the break.",
    mistakes: [
      "Guessing the breakout direction instead of letting price confirm it.",
      "Trading a break that happens right at the apex, where signals are weakest.",
      "Falling for false breaks that quickly reverse back inside the triangle.",
      "Overlooking the volume expansion that should accompany a genuine breakout.",
    ],
    asciiChart: `\\
 \\      /\\
  \\    /  \\   /
   \\  /    \\ /
    \\/      v
    /\\      ^
   /  \\    / \\
  /    \\  /   -> breakout ?`,
  },

  // ──────────────────────────── HARMONIC ────────────────────────────
  {
    slug: "gartley",
    name: "Gartley",
    category: "Harmonic",
    bias: "Both",
    reliability: "Medium",
    summary:
      "A five-point harmonic pattern using Fibonacci ratios to pinpoint a high-probability reversal zone.",
    description:
      "The Gartley is a classic harmonic pattern that uses precise Fibonacci relationships across five points (X, A, B, C, D) to locate a potential reversal. The defining feature is a B-point retracement of 61.8% of the XA leg and a D-point completion at 78.6% of XA, creating a reversal zone with tightly defined risk.",
    formation:
      "From the XA impulse leg, B retraces 61.8% of XA; BC retraces 38.2%–88.6% of AB; CD extends 127%–161.8% of BC; and D completes at the 78.6% retracement of XA. When the legs align with these ratios, point D marks the Potential Reversal Zone (PRZ) where price is expected to turn.",
    entryIdea:
      "Enter at point D in the direction opposite the CD leg once price shows a reversal reaction in the PRZ. Confirmation candles or momentum signals at D improve the odds.",
    stopLoss:
      "Place the stop just beyond point X, since a move past X invalidates the harmonic structure entirely.",
    target:
      "Use Fibonacci retracements of the AD leg — common targets are 38.2% and 61.8% of AD, with point C as a further objective.",
    mistakes: [
      "Forcing the pattern when the Fibonacci ratios are only loosely met.",
      "Entering at D without any reversal confirmation in the PRZ.",
      "Mislabelling the X, A, B, C, D pivots, which corrupts every ratio.",
      "Ignoring the higher-timeframe trend, which can overpower the reversal.",
    ],
    asciiChart: `X\\          C
  \\        /\\
   \\      /  \\
    \\    /    \\
     \\  /      \\ D  <- PRZ
      \\/        \\
      A          \\
       \\   B
        \\ /\\
         v`,
  },
  {
    slug: "butterfly",
    name: "Butterfly",
    category: "Harmonic",
    bias: "Both",
    reliability: "Medium",
    summary:
      "An extended harmonic pattern where point D projects beyond X, capturing trend exhaustion reversals.",
    description:
      "The Butterfly is a harmonic reversal pattern distinguished by a point D that extends beyond the starting point X, making it an extension rather than a retracement pattern. Its signature is a B-point at the 78.6% retracement of XA and a D-point at the 127%–161.8% extension of XA, often catching reversals at price extremes.",
    formation:
      "B retraces 78.6% of the XA leg; BC retraces 38.2%–88.6% of AB; CD extends 161.8%–261.8% of BC; and D completes at the 127%–161.8% extension of XA. Because D lies beyond X, the pattern targets exhaustion moves that overshoot prior highs or lows.",
    entryIdea:
      "Enter at point D against the direction of the CD leg once a reversal reaction appears in the extended PRZ. Wait for confirmation, since price often spikes hard into D.",
    stopLoss:
      "Place the stop beyond the D-point extension (e.g., past the 161.8%–200% level), as a continued move there invalidates the pattern.",
    target:
      "Apply Fibonacci retracements of the AD leg, commonly targeting 38.2% and 61.8%, with points A and C as additional objectives.",
    mistakes: [
      "Treating the Butterfly like a retracement pattern and expecting D inside XA.",
      "Entering into the spike at D without waiting for a reversal signal.",
      "Using stops too tight for a pattern prone to sharp overshoots at the extreme.",
      "Skipping ratio validation, which separates a true Butterfly from random swings.",
    ],
    asciiChart: `   A
   /\\        C
  /  \\      /\\
 /    \\    /  \\
X      \\  /    \\
        \\/      \\
        B        \\
                  \\ D  <- beyond X
                   v   (extension PRZ)`,
  },
  {
    slug: "bat",
    name: "Bat",
    category: "Harmonic",
    bias: "Both",
    reliability: "Medium",
    summary:
      "A harmonic pattern completing at the 88.6% retracement of XA, offering tight risk near the origin.",
    description:
      "The Bat is a harmonic reversal pattern known for its deep, precise D-point completion at the 88.6% retracement of the XA leg. Because D sits so close to X, the Bat allows for a tight stop and an attractive reward-to-risk ratio. A shallow B-point retracement is the key distinguishing feature.",
    formation:
      "B retraces less than 61.8% (typically 38.2%–50%) of the XA leg; BC retraces 38.2%–88.6% of AB; CD extends 161.8%–261.8% of BC; and D completes precisely at the 88.6% retracement of XA. This deep yet contained D defines the Potential Reversal Zone.",
    entryIdea:
      "Enter at point D opposite the CD leg once price reacts within the 88.6% PRZ. Confirmation via candlestick or momentum signals reduces the chance of a deep failure.",
    stopLoss:
      "Place the stop just beyond point X; since D is already near X, the risk is small and a break of X invalidates the pattern.",
    target:
      "Use Fibonacci retracements of the AD leg (38.2% and 61.8% are common), with point C and point A as extended targets.",
    mistakes: [
      "Confusing the Bat with the Gartley by allowing too deep a B-point retracement.",
      "Entering before price tags the precise 88.6% completion of XA.",
      "Skipping confirmation at D and getting caught in a structure failure past X.",
      "Sloppy pivot labelling that throws off the strict B and D ratios.",
    ],
    asciiChart: `X\\              C
  \\            /\\
   \\          /  \\
    \\        /    \\
     \\  B   /      \\ D  <- 88.6% XA
      \\/\\  /        \\
      A  \\/          v
          (shallow B)`,
  },
  {
    slug: "crab",
    name: "Crab",
    category: "Harmonic",
    bias: "Both",
    reliability: "Low",
    summary:
      "The most extended harmonic pattern, with D reaching the 161.8% extension of XA for extreme reversals.",
    description:
      "The Crab is the most extreme of the common harmonic patterns, defined by a deep D-point at the 161.8% extension of the XA leg. This far extension captures sharp reversals at price exhaustion, but the wide projection also makes it harder to time precisely, giving it lower reliability than tighter patterns.",
    formation:
      "B retraces 38.2%–61.8% of the XA leg; BC retraces 38.2%–88.6% of AB; CD extends a steep 261.8%–361.8% of BC; and D completes at the 161.8% extension of XA. The extreme CD leg is the Crab's defining and most demanding characteristic.",
    entryIdea:
      "Enter at point D against the CD direction only after a clear reversal reaction appears in the far PRZ. Given the violent move into D, strict confirmation is critical.",
    stopLoss:
      "Place the stop beyond the 161.8% extension (e.g., near the 200% level); a continued move invalidates the structure and warrants exit.",
    target:
      "Take Fibonacci retracements of the AD leg, commonly 38.2% and 61.8%, scaling out as price retraces toward C and A.",
    mistakes: [
      "Anticipating the reversal too early before price reaches the deep 161.8% D-point.",
      "Underestimating the volatility of the steep CD leg and sizing positions too large.",
      "Trading the Crab without confirmation, given its lower base reliability.",
      "Misidentifying it as a Butterfly by ignoring the more extreme extension ratios.",
    ],
    asciiChart: `   A
   /\\          C
  /  \\        /\\
 /    \\      /  \\
X      \\    /    \\
        \\  /      \\
        B \\/       \\
                    \\
                     \\ D  <- 161.8% XA
                      v  (deep extension)`,
  },
];

export function getPattern(slug: string): PatternInfo | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}
