/**
 * ARCHIVE — period 1984
 *
 * Sun-era hardware beside the Gage portrait: workstations, Ethernet, the earliest internet. The recast goes forward from Gage, not back (§12).
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
 * 2 beats: period-sun, period-net
 */

  beat("period-sun", 0, A0, GAGE_QUOTE, LOTP_OPEN, 16000, world({
    shot: "period",
    era: 0,
    graphOpacity: 0,
    somaGage: true,
    periodTech: 1,
    showQuote: true,
    zoom: 1.15,
    focusX: 380,
    focusY: 520,
  })),

  beat("period-net", 0, A0, PRE_SCAFFOLD, "LAN", 14000, world({
    shot: "period",
    era: 0,
    graphOpacity: 0,
    somaGage: true,
    periodTech: 2,
    zoom: 0.95,
    focusX: 280,
    focusY: 420,
  })),
