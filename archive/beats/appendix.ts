/**
 * ARCHIVE — appendix
 *
 * The in-show appendix: parked beats reachable by a jump key. Replaced by this archive.
 *
 * This file is not compiled and is not imported by anything. It sits outside
 * every tsconfig `include`, so it will not break a typecheck and will not be
 * bundled. It exists to be read and lifted from.
 *
 * The beats below are verbatim from the pre-recast script
 * (`apps/keynote/src/beats/script.ts`), including their original doc comments.
 * They reference the `WorldState` of that generation, which the current show
 * no longer has — see `archive/README.md` for what each group needs before it
 * can run again.
 *
 * 2 beats: appendix-library, appendix-hold
 */

  beat("appendix-library", 6, AAPP, APP_LIBRARY, PRE_FOODWEB, 14000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.16,
  })),

  beat("appendix-hold", 6, AAPP, "", "Hold", 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaCompanion: 4,
    somaEarth: "food",
    ...CAM_FOOD,
  })),
