/**
 * ARCHIVE — storm replay
 *
 * The agent replaying the closed hub. People already kept that promise. The aircraft chapter is the agent's problem.
 *
 * Recovered from the running ONUG script on 19 October 2026, as beat()
 * snapshots. Not compiled. Not imported. See archive/README.md.
 * These beats use the current WorldState, so a lift back into
 * beats/script.ts works if the copy constants and cameras they name still exist.
 *
 * 3 beats: auto-storm-path, auto-storm-act, auto-storm-live
 */

beat(
    "auto-storm-path",
    6,
    M6,
    A_STORM_PATH,
    A_STORM_ACT,
    16000,
    world({
      ent: 9,
      entPackage: true,
      entAutonomy: true,
      entDisrupt: "onset",
      dispatch: 3,
      ...CAM_STORM,
    })
  )

beat(
    "auto-storm-act",
    6,
    M6,
    A_STORM_ACT,
    A_STORM_LIVE,
    16000,
    world({
      ent: 9,
      entPackage: true,
      entAutonomy: true,
      entDisrupt: "onset",
      dispatch: 4,
      ...CAM_STORM,
    })
  )

beat(
    "auto-storm-live",
    6,
    M6,
    A_STORM_LIVE,
    A_VERIFY,
    18000,
    world({
      ent: 9,
      entPackage: true,
      entAutonomy: true,
      entDisrupt: "reroute",
      dispatch: 5,
      ...CAM_STORM,
    })
  )
