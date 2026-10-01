/**
 * ARCHIVE — closings
 *
 * Alternative endings the recast did not take.
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
 * 3 beats: soma-space, understand-itself, final
 */

  beat("soma-space", -1, APRE_SEE, PRE_SPACE, PRE_PULLBACK, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 9,
    somaEarth: "mycelium",
    somaRhyme: true,
    ...CAM_SPACE,
    showSignature: true,
  })),

  beat("understand-itself", 5, A5, SIG_UNDERSTAND, SIG_CLOSE, 40000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.24,
    showSignature: true,
    verified: true,
  })),

  beat("final", 5, A5, SIG_CLOSE, SIG_ONUG, 40000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.2,
    showSignature: true,
    verified: true,
  })),
