/**
 * ARCHIVE — loop chapter
 *
 * Observe, understand, decide, act, verify as their own chapter. The shot already ran the loop.
 *
 * Recovered from the running ONUG script on 19 October 2026, as beat()
 * snapshots. Not compiled. Not imported. See archive/README.md.
 * These beats use the current WorldState, so a lift back into
 * beats/script.ts works if the copy constants and cameras they name still exist.
 *
 * 7 beats: loop, loop-observe, loop-understand, loop-decide, loop-act, loop-verify, loop-runs
 */

beat(
    "loop",
    7,
    M7,
    L_REVEAL,
    L_OBSERVE,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      ...FULL,
    })
  )

beat(
    "loop-observe",
    7,
    M7,
    L_OBSERVE,
    L_UNDERSTAND,
    16000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entSignals: true,
      station: "observe",
      ...FULL,
    })
  )

beat(
    "loop-understand",
    7,
    M7,
    L_UNDERSTAND,
    L_DECIDE,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entRelations: true,
      station: "understand",
      ...FULL,
    })
  )

beat(
    "loop-decide",
    7,
    M7,
    L_DECIDE,
    L_ACT,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      station: "decide",
      ...FULL,
    })
  )

beat(
    "loop-act",
    7,
    M7,
    L_ACT,
    L_VERIFY,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entDisrupt: "reroute",
      station: "act",
      ...FULL,
    })
  )

beat(
    "loop-verify",
    7,
    M7,
    L_VERIFY,
    L_RUN,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entSignals: true,
      station: "verify",
      verified: true,
      ...FULL,
    })
  )

beat(
    "loop-runs",
    7,
    M7,
    L_RUN,
    Z_ENTERPRISE,
    24000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      loopTour: true,
      verified: true,
      ...FULL,
    })
  )
