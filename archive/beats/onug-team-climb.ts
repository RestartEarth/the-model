/**
 * ARCHIVE — team climb
 *
 * The climb from the celebration up to Gage. The inbound, the branch, the tip, and the make are back in the show.
 *
 * Recovered from the running ONUG script on 19 October 2026, as beat()
 * snapshots. Not compiled. Not imported. See archive/README.md.
 * These beats use the current WorldState, so a lift back into
 * beats/script.ts works if the copy constants and cameras they name still exist.
 *
 * 2 beats: team-scale, gage-setup
 */

beat(
    "team-scale",
    3,
    M3,
    T_SCALE,
    H_PULLBACK,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 3,
      ...CAM_TEAM,
    })
  )

beat(
    "gage-setup",
    4,
    M4,
    H_GAGE,
    GAGE_QUOTE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 10,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaPullback: true,
      somaMind: true,
      ...CAM_WORLD,
    })
  )
