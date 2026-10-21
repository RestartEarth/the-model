/**
 * ARCHIVE — route catalogue
 *
 * The zoomed failure tour that the aircraft chapter replaced: fan-out, stall,
 * crowd, trace, and the dispatch close-up. AiNetwork still knows these story
 * modes. No beat in the show passes them.
 *
 * Lifted from the ONUG script on 19 October 2026, before those beats were
 * deleted. Not compiled. Not imported. See archive/README.md.
 *
 * The copy constants and the held logistics picture lived beside the beats:
 *
 * const AI_FILE =
 *   "People got this shipment this far, and an agent now files the route, because a disrupted jet stream is harder than a closed hub, and that one decision becomes many transactions that all have to return inside the decision window."
 * const AI_FANOUT = "The forecast is a fan-out, so the route finishes at the slowest model."
 * const AI_STREAM = "If the forecast session breaks, the agent is routing on yesterday's jet stream."
 * const AI_STALL = "Nothing is down. The route is late, so the shipment misses the cutoff on a track the forecast no longer supports."
 * const AI_RETRY = "The agent asks again and files a second plan, moving the shipment onto a second aircraft."
 * const AI_CROWD = "Every other flight asks at once. The shared turbulence service is where this shipment loses the window, while the links still look fine."
 * const AI_TRACE = "The operation blames the routing model. The trace stops at the weather provider, and the retry takes that same feed."
 * const AI_FRESH = "The route is filed only when a fresh turbulence field has returned inside the decision window."
 * const AI_COMPLETE = "A partial field does not clear the flight. The tool runs only on a complete answer."
 * const AI_ONCE = "Asking again files the same plan once."
 * const AI_ISOLATE = "This shipment has its own path to the forecast, so the fleet's questions do not bury it."
 * const AI_MEASURE = "The carrier measures up to the weather boundary and keeps a second product: delay, a different altitude, a different route."
 * const AI_ENROUTE = "En route, aircraft sensors and ride reports come back, and the next sector can change."
 * const AI_FABRIC = "The agent may commit only on evidence that is still live, only once, inside the cutoff, with the critical call isolated from the herd, and with the path measured out to the system it does not own."
 *
 * const ROUTE_HELD = world({
 *   ent: 7,
 *   entPackage: true,
 *   entModel: true,
 *   entDisrupt: "reroute",
 *   entRelations: true,
 *   ...FULL,
 * })
 *
 * 14 beats: ai-file, ai-fanout, ai-stream, ai-stall, ai-retry, ai-crowd, ai-trace, ai-fresh, ai-complete, ai-once, ai-isolate, ai-measure, ai-enroute, ai-fabric
 */

// Same shipment. People filed the reroute above. The agent files this one
  // because the jet stream, the sensitive load, and the moving forecast are
  // harder than the closed hub. AiNetwork draws these beats. Movement 6
  // starts at auto-open, after the fabric line.

  beat(
    "ai-file",
    5,
    M5,
    AI_FILE,
    AI_FANOUT,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-fanout",
    5,
    M5,
    AI_FANOUT,
    AI_STREAM,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-stream",
    5,
    M5,
    AI_STREAM,
    AI_STALL,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-stall",
    5,
    M5,
    AI_STALL,
    AI_RETRY,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-retry",
    5,
    M5,
    AI_RETRY,
    AI_CROWD,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-crowd",
    5,
    M5,
    AI_CROWD,
    AI_TRACE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-trace",
    5,
    M5,
    AI_TRACE,
    AI_FRESH,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-fresh",
    5,
    M5,
    AI_FRESH,
    AI_COMPLETE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-complete",
    5,
    M5,
    AI_COMPLETE,
    AI_ONCE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-once",
    5,
    M5,
    AI_ONCE,
    AI_ISOLATE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-isolate",
    5,
    M5,
    AI_ISOLATE,
    AI_MEASURE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-measure",
    5,
    M5,
    AI_MEASURE,
    AI_ENROUTE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-enroute",
    5,
    M5,
    AI_ENROUTE,
    AI_FABRIC,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-fabric",
    5,
    M5,
    AI_FABRIC,
    A_OPEN,
    22000,
    ROUTE_HELD
  ),
