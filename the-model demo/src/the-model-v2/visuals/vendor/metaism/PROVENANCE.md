# Metaism provenance

Portable pieces copied into this repo. No submodule. No production API calls.

| File | Source | What we took |
|---|---|---|
| `tokens.motion.ts` | `Metaism/frontend/src/design-system/tokens.ts` | `motion.duration` and `motion.easing` only |
| `relationTraverse.ts` | `Metaism/backend/src/services/conceptRelationService.ts` `findPath` | Bounded BFS, depth ≤ 3, cycle guard, typed edges |

Removed: `answerGrounding.ts`. It backed the old incident-replay verification
beat, which the show no longer has.

Not copied: MUI theme, reading chrome, Oracle, sacred-text palette, GraphQL, Cloud SQL, MCP orchestrator runtime.

If Metaism improves these files, re-copy deliberately and note the date here.
