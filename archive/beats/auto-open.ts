/**
 * ARCHIVE — autonomy cold open
 *
 * The cold open on the enterprise regional map after ai-fabric. Removed
 * because the fabric line already answered the question. The line may be
 * spoken over ai-fabric, but it is not an on-screen beat.
 *
 * Not compiled. Not imported. See archive/README.md.
 * This beat uses the current WorldState. A lift back into beats/script.ts
 * works if the cameras it names still exist. The sentence lived in
 * content/copy.ts as A_OPEN and was moved here with the beat.
 *
 * 1 beat: auto-open
 */

const A_OPEN =
  "Suppose you want that to happen without anyone staying up for it. What does that actually require?"

beat(
  "auto-open",
  6,
  M6,
  A_OPEN,
  A_PERCEIVE,
  22000,
  world({
    ent: 7,
    entModel: true,
    ...FULL,
  })
)
