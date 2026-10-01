# Archive

Beats the recast removed from THE MODEL, kept so they can be lifted back if
they turn out to be useful.

Nothing here is compiled, imported, or bundled. `archive/` sits outside every
tsconfig `include` in the repo, so these files cannot break a typecheck or a
build. They are source to read and copy from, not code that runs.

There is no in-show appendix anymore. The old script parked unused beats in an
appendix act reachable by a jump key, which meant dead beats stayed inside the
presentation and counted against it. That is what this directory replaces.

## What is here

| File | Beats | What it was |
|---|---|---|
| `beats/meridian-incident.ts` | 19 | The fictional outage — a GPU blamed, a path stalled, checkout degraded, and the replay that explained it |
| `beats/era-scaffold.ts` | 15 | The LAN → internet → cloud → SDN → SAN → bus → GPU build of enterprise networking |
| `beats/packet-pedagogy.ts` | 12 | Life of the Packet beats 4–14: circuit switching, the wire, header rewrite, TTL, TCP, MPLS, VPN, QoS, SD-WAN |
| `beats/transaction-fanout.ts` | 8 + 6 | One prompt opening into a runtime dependency graph. **Partial reconstruction** — see below |
| `beats/token-analogy.ts` | 7 | Tokens taught as packets, layer by layer |
| `beats/protocol-pedagogy.ts` | 7 | MCP, A2A, the inference gateway, trace correlation, taught from the stage |
| `beats/closings.ts` | 3 | Alternative endings the recast did not take |
| `beats/loop-stations.ts` | 3 | The two loop stations that merged: Model into Understand, Reason into Decide |
| `beats/period-1984.ts` | 2 | Sun-era workstations and Ethernet beside the Gage portrait |
| `beats/appendix.ts` | 2 | The in-show appendix itself |
| `beats/body-energy.ts` | 1 | The chakra beat — cut on credibility grounds, not for time |

`MANIFEST.md` lists all 105 pre-recast beats and what became of each.

## The complete previous generation

`apps/keynote/` is the whole pre-recast application, still on disk: its script,
its `WorldState`, and every dataset and renderer the beats above depend on. The
files in `archive/beats/` are extracted from it verbatim, so if you need more
context than a beat block gives you, read the original there. It is not built
or maintained, and its README-era story is the old one.

## Restoring a beat

A beat is a full `WorldState` snapshot, so lifting one back means supplying
whatever that snapshot named. Four things to check, in order:

1. **State.** The current `WorldState` (`stage/types.ts`) dropped the fields
   these beats set. The incident group needs `jobBroken`, `blast`, `blastKind`,
   `checkoutDown`, `inspectionHop`, `edgeMetrics`, `selectedId`, `graphDark`,
   `agentIntent`, `floatingFacts`, `factsSnap`, `knowledgeEdges`,
   `spineHighlight`, `crossOutShortcut`, `commitments`. The protocol group
   needs `protocolEdges`, `workflowPhase`, `inferencePath`, `payload`. The
   period group needs `periodTech` and a `"period"` member on `Shot`. The
   packet group needs `PacketLife` widened past 4 and `packetKind`.
2. **Datasets.** Deleted with the beats: `graph/meridian.ts`, `graph/txn.ts`,
   `graph/workflow.ts`, `graph/payload.ts`, `graph/period.ts`,
   `graph/traverse.ts`, `agent/actor.ts`, `agent/grounding.ts`,
   `agent/incident.ts`. All present under `apps/keynote/src/`.
3. **Renderers.** Deleted: `world/Sessions.tsx`, `world/ProtocolEdges.tsx`,
   `world/PayloadGlyphs.tsx`, `world/AgentTraveler.tsx`, and the incident
   branches of `world/GraphView.tsx`. The first four are intact under
   `apps/keynote/src/world/`; `GraphView` was rewritten, so its incident
   rendering has to come from the old copy of that file.
4. **Copy.** The `line` and `nextHint` arguments reference constants from the
   old `content/copy.ts`, which was rewritten. The old one is at
   `apps/keynote/src/content/copy.ts`.

Also check the runtime budget. The show is 27:40 against a 30-minute ceiling,
so there is about two minutes of room; `npm run runtime` in `the-model demo`
will tell you where a restored beat puts you.

## The one real gap

`beats/transaction-fanout.ts` is the exception to everything above. Those beats
were written for an intermediate 86-beat script that lived in the demo tree and
was overwritten before the repository had any commits, so there is no git
object and no on-disk copy to recover them from. What survives is a flag dump
taken while auditing that script: ids, acts, durations and world flags are
accurate; doc comments, copy wiring, and anything past the dump's truncation
are gone, and are marked as such rather than guessed. The dataset they drove
(`graph/txn.ts`) is also gone and would need rebuilding — most plausibly on the
pattern of `graph/enterprise.ts`, which is what replaced it.

The repository still has no commits. Committing is the cheapest way to make
sure this is the last entry in this section.
