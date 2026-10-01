/**
 * ARCHIVE — body energy
 *
 * The chakra/energy-centre beat. Cut on credibility grounds (§35), not for time.
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
 * 1 beat: soma-chakras
 */

  beat("soma-chakras", -1, APRE, PRE_CHAKRAS, PRE_STRUCTURE, 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 2,
    ...EARTH_WORLD,
    ...CAM_ENERGY,
  })),
