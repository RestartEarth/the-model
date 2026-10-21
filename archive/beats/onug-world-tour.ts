/**
 * ARCHIVE — world tour
 *
 * The living-loop captions. Language, people, markets, satellites, and the
 * internet are back in the show, after the senses and before the shot.
 * The shot already runs the loop, so these two captions stay out.
 *
 * Recovered from the running ONUG script on 19 October 2026, as beat()
 * snapshots. Not compiled. Not imported. See archive/README.md.
 * These beats use the current WorldState, so a lift back into
 * beats/script.ts works if the copy constants and cameras they name still exist.
 *
 * 2 beats: body-loop, body-intelligence
 */

beat(
    "body-loop",
    2,
    M2,
    B_LOOP,
    B_INTELLIGENCE,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaLoop: true,
      ...EARTH,
      ...CAM_LOOP,
    })
  )

beat(
    "body-intelligence",
    2,
    M2,
    B_INTELLIGENCE,
    H_LANGUAGE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaLoop: true,
      ...EARTH,
      ...CAM_LOOP,
    })
  )
