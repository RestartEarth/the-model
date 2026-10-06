# THE MODEL

A 29:33 performed keynote. One argument, told once:

> Networks connect specialised parts. The relationships create capabilities no
> part has. At enough density the result is intelligence. Humans work this way,
> teams work this way, and so does an enterprise. Put reasoning inside that and
> autonomy becomes possible — but only if the system understands the
> relationships across the whole thing. **The network becomes part of the
> intelligence.**

The stage is cinema. The only overlay is the audience copy — no speaker notes,
no inspect rail, no dashboards.

## Where the code is

The live codebase is **`the-model demo/src/the-model/`**. It is a self-contained
module designed to be dropped into a larger React host app, and this repo
carries a thin harness around it so it can be run and built on its own.

```
the-model demo/
  the-model.html            standalone entry
  vite.the-model.config.ts  build config (@ → ./src, port 8090)
  scripts/runtime.mjs       static runtime report
  src/
    the-model/              ← the module. Everything below is the show.
      beats/script.ts       the run order: 79 beats, 7 movements
      content/copy.ts       every word the audience reads
      stage/                engine, WorldState, input
      graph/                soma anatomy, court, logistics enterprise, contracts
      world/                renderers: Fabric, Soma, Court, GraphView, loop
      design/tokens.ts      colour, type, motion
      stage.css             the show's own styles
    pages/the-model-page.tsx   host page (chrome, nav, copy treatments)
    components/, lib/          local stand-ins for host-owned files
```

Everything under `src/components/`, `src/lib/` and `src/index.css` is a
deliberately minimal stand-in for files that belong to the host app and are not
in this repo. Dropping the module back into that app means deleting them.

`apps/keynote/` is the **previous generation** of this show, kept intact as the
source of truth for everything the recast removed — its script, `WorldState`,
datasets and renderers all still work together. It is not built, not run, and
not maintained; its script still tells the old story.

`archive/` holds the removed beats on their own, extracted verbatim from that
tree and grouped by why they were cut, with a manifest of all 105 pre-recast
beats and notes on what each group needs before it could run again. Nothing in
`archive/` is compiled, imported, or bundled.

Read `the-model demo/` for anything current.

## Run

Live build: https://restartearth.github.io/the-model/

```bash
cd "the-model demo"
npm install
npm run dev          # http://localhost:8090/the-model.html
```

| Command | What |
|---|---|
| `npm run dev` | Dev server on 8090 |
| `npm run build` | Typecheck, then build to `dist-the-model/` |
| `npm run type-check` | `tsc --noEmit` |
| `npm run runtime` | Runtime report; `-- --beats` for the clock, `-- --segments` for the PowerPoint chapters |

## Driving the show

Default mode is **conductor** — you advance every beat, and the clocks on the
beats are ignored. `C` switches to **cinema**, which auto-advances.

| Key | |
|---|---|
| Space · `→` · `]` · click | next beat |
| `←` · `[` | previous beat |
| `C` | conductor ⇄ cinema |
| `P` | pause cinema |
| `Home` · `R` · `Esc` | restart |
| `1`–`7` | jump to a movement |

## PowerPoint

The performed deck is not a second show. Cinema remains the full rehearsal.
PowerPoint is the conductor: one slide per chapter, the clip starts when the
slide opens, and the slide does not advance on its own. Each clip ends on a
finished frame. The time you spend talking over that frame is not in the file.

Open a chapter with `?segment=` — for example
`http://localhost:8090/the-model.html?segment=04-shot`. Cinema plays that
range and stops on the hold. The host title bar stays off, so a capture is
full-bleed. When the hold frame has settled, the stage sets
`data-segment-phase="hold"`. That is the cut. The picture stays up.

`Home` restarts the chapter. `1`–`7` do nothing while a chapter is open.
Clicking does not skip ahead.

The chapters live in `the-model demo/src/the-model/beats/segments.ts`. They
have to cover every beat in order except `end`, which fades to black and
stays in the cinema rehearsal only. `npm run runtime -- --segments` prints
the map. The rule for any new beat: entry, then motion, then a hold frame
worth talking over.

## The show

| | Movement | Beats | Clock |
|---|---|---|---|
| 1 | An architecture that repeats | 8 | 2:16 |
| 2 | Networks make intelligence | 17 | 5:21 |
| 3 | Intelligence networks with intelligence | 9 | 2:45 |
| 4 | 1984 | 9 | 2:44 |
| 5 | The enterprise | 14 | 5:09 |
| 6 | What autonomy requires | 16 | 6:26 |
| 7 | The autonomous enterprise | 14 | 4:52 |
| | | **87** | **29:33** |

Every beat runs. There is no appendix act — beats the recast removed live in
`archive/`, outside the build, rather than sitting unused inside the show.

**1 · An architecture that repeats.** Cold open on the cosmic web, already
turning. Then the water cycle, mycelium under a forest, photosynthesis, a food
web. Four unrelated systems, each one a network. No argument yet — the room is
just being shown the same shape until the word has weight.

**2 · Networks make intelligence.** One body, disclosed layer by layer: bone,
blood, organs, lymph, nerves, brain. The camera goes inside the cortex and the
edges carry unequal weight — *intelligence is not in the parts, it is in the
relationships between them.* Then the same body does something. A floor and a
hoop appear around the figure it has been watching for four minutes, and it
takes a shot: perception in, a motor chain firing in order, correction still
running after the ball has left the hand.

**3 · Intelligence networks with intelligence.** Five of that body on a court.
Relationships first, then live signalling, then the figures dim and the edges
brighten: *the team is not five players, it is what happens between them.*

**4 · 1984.** People, language, markets, and then one we built on purpose. John
Gage's sentence lands bare before the photograph reveals whose it is. Life of
the Packet survives as a fifty-second wordless callback — proof we really did
build computing this way — and not as a lesson in packet switching.

**5 · The enterprise.** Movement 3's team stretched across a planet: a generic,
unbranded logistics operator moving physical things. Aircraft, vehicles, hubs,
robots, people, systems. *This is not an org chart, it is an organism.* One
package, Tokyo to Boston, with a promise attached to it. Then weather closes a
major hub — nothing breaks, everything is affected — and the question becomes
what depends on what changed. The dispatcher has a hub that still looks fine
and a promise already at risk. The aircraft call does not return, so she waits.
When the path answers, the promise holds.

**6 · What autonomy requires.** The only argumentative movement. Perception
(not a dashboard somebody opens). A model of the relationships, carrying
meaning: what is committed, what is allowed, what has room left. Federation,
because no single system holds all of it. Then reasoning, which becomes network
traffic the moment it needs to leave the model. The ability to act. The same
storm, now with no one in the chair: it knows how storms get rerouted, the hub
still looks fine, and the call that would say which aircraft can take the
freight dies on the way in. It acts on the gateway anyway. When that path
answers, every package moves. Verification from the system rather than from
its own expectation. *Autonomy does not remove humans. It moves humans up the
stack.*

**7 · The autonomous enterprise.** Observe → Understand → Decide → Act → Verify,
running continuously on the whole network — the same loop the body ran to make
one shot. A pullback across six scales. *The model is not the thing that thinks;
the model is what it thinks about.* Gage's sentence returns, meaning something
operational. Close on **THE NETWORK BECOMES PART OF THE INTELLIGENCE.**

### What the show deliberately does not do

- No fictional incident, no outage, no blame, no replay.
- No protocol pedagogy. MCP, A2A, RAG and telemetry appear as small edge labels
  on the fabric and are never explained from the stage.
- No claim that tokens are packets, that neurons are routers, or that a protocol
  is a nervous system. The analogies are structural and are stated as such.
- No humans-as-fallback. People are on screen from the moment the enterprise is,
  and they are still there at the end.

## Visual grammar

- Near-black navy field `#191D26`, faint starfield, 1600×900 fixed viewBox.
- The graph is the hero; chrome is sparse. One sentence on screen at a time.
- Small rounded-rect nodes, thin edges — the computer lives in the edges.
- Colour as meaning: `#3ECF8E` healthy, `#5BA8FF` focus and dependency,
  `#E8A04A` disrupted. The weather beat is amber, not red: nothing failed.
- The organic world has its own grammar — warm gold nerves, organic ellipses,
  bezier afferents — on the same navy field. The basketball court is drawn
  inside that grammar, as a `<g>` in the body's own SVG, so the camera pulls
  back rather than cutting.
- `prefers-reduced-motion` yields static frames, not stopped clocks.
- Inter, self-hosted. No product logos.

The show's intentional pauses — the neural reveal, team emergence, the
enterprise organism, THE MODEL's second meaning, the closing line — use the
full-bleed centred `.audience-statement` treatment instead of the corner panel.
Everything else is the corner panel. Gage gets the quote treatment.

## Credits

John Gage photographed by Joi Ito, 5 October 2008 (CC BY 2.0, Wikimedia
Commons). Life of the Packet after Robert M. Kettles, 2022. Motion tokens and
bounded relation traversal copied from Metaism — see
`src/the-model/vendor/metaism/PROVENANCE.md`.
