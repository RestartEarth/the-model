/**
 * ARCHIVE — nature extras
 *
 * Nature beats the ONUG cut did not keep: the relations line, the atmosphere, mycelium, and photosynthesis. Water and the food web stay in the show.
 *
 * Recovered from the running ONUG script on 19 October 2026, as beat()
 * snapshots. Not compiled. Not imported. See archive/README.md.
 * These beats use the current WorldState, so a lift back into
 * beats/script.ts works if the copy constants and cameras they name still exist.
 *
 * 4 beats: cosmos-relations, atmosphere, mycelium, photosynthesis
 */

beat(
    "cosmos-relations",
    1,
    M1,
    N_INDRA,
    N_ATMOS,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 1,
      somaIndra: true,
      somaRhyme: true,
      ...CAM_COSMOS,
    })
  )

beat(
    "atmosphere",
    1,
    M1,
    N_ATMOS,
    N_WATER,
    14000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 1,
      somaAtmosphere: true,
      somaAtmosphereFocus: true,
      somaRhyme: true,
      ...CAM_ATMOS,
    })
  )

beat(
    "mycelium",
    1,
    M1,
    N_MYCELIUM,
    N_PHOTOSYNTHESIS,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaAtmosphere: true,
      somaRhyme: true,
      ...EARTH,
      ...CAM_SOIL,
    })
  )

beat(
    "photosynthesis",
    1,
    M1,
    N_PHOTOSYNTHESIS,
    N_FOODWEB,
    17000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 3,
      somaEarth: "photosynthesis",
      somaAtmosphere: true,
      somaRhyme: true,
      ...CAM_CANOPY,
    })
  )
