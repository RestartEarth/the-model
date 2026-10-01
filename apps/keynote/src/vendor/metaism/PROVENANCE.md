# Metaism provenance

Portable pieces copied into this repo. No submodule. No production API calls.

| File | Source | What we took |
|---|---|---|
| `tokens.motion.ts` | `Metaism/frontend/src/design-system/tokens.ts` | `motion.duration` and `motion.easing` only |
| `answerGrounding.ts` | `Metaism/backend/src/services/answerGroundingService.ts` | Pure lexical grounding (used later in Act V Verify) |
| `relationTraverse.ts` | `Metaism/backend/src/services/conceptRelationService.ts` `findPath` | Bounded BFS, depth ≤ 3, cycle guard, typed edges |

Not copied: MUI theme, reading chrome, Oracle, sacred-text palette, GraphQL, Cloud SQL, MCP orchestrator runtime.

If Metaism improves these files, re-copy deliberately and note the date here.
