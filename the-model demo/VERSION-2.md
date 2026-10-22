# Version 2 — separate review build

Open these on the existing development server:

- `http://localhost:8090/the-model-v2.html` — complete 78-beat v2 presentation.
- `http://localhost:8090/compare.html` — v1 and v2 with mapped original scenes,
  proposed narration, and the editorial visual-change notes.
- `http://localhost:8090/the-model.html` — original presentation, unchanged.

The comparison is side by side on a wide window and stacked below 1000px.
Choose a v2 beat to navigate both presentations. When a v2 scene combines
several original beats, the source buttons select each original scene.
The original view retains its own original chrome and typography.

## Independent commands

Run these inside `the-model demo`:

```sh
npm run dev:v2       # separate dev server on 8091
npm run build:v2     # type-check and build into dist-the-model-v2
npm run preview:v2   # serve the v2 build on 8091
npm run sync:v2      # regenerate audience copy / notes from proposed script
```

The existing `dev`, `build`, `preview`, v1 entry, source, and output directory
are preserved. The v2 output includes an independently bundled original
reference entry so comparison also works from a production build. No commit,
deployment, or replacement of v1 is required to review v2.

## Controls

- Click the stage / Right / Space / Enter / Page Down: next beat. Left / Page Up: previous.
- 1–5: movement starts. Home: opening.
- N: speaker notes. H: show/hide review controls. F: fullscreen.
- Direct links accept `?beat=19`. `?embed=1` hides review chrome.

Speaker narration is displayed as text; this build does not generate audio.
Every visual state is a separate manual stop. There is no cinema mode, timed
scene advancement, or waiting period before you can move on. Decorative motion
and a basketball play can animate inside a beat; advancing never waits for
that animation to finish. Mycelium and photosynthesis are restored as their
own nature beats. The final sentence stays on screen.

## Isolation and editorial implementation

`src/the-model-v2/visuals/` is a local snapshot of the original visual module,
including its asset provenance. V2 uses that snapshot for the nature, anatomy,
basketball, and Gage scenes. It does not import v1's stage engine.

`src/the-model-v2/DecisionScene.tsx` implements new SVG scenes for the request
round trip, shipment, enterprise model, bounded operations agent, transaction
requirements, outcome evidence, and executive takeaway. These are illustrative
animations, not connected operational telemetry or an executable agent demo.

The core scene distinctions are explicit: technical health versus gateway
closure; active route versus candidate; evidence versus permission; hypothetical
lost-acknowledgment contingency versus the main timeline; accepted instruction
versus observed execution and outcome. Later decisions remain possible.

`script.json` and `../presentation-script-v2-manual.txt` are generated from
the editorial draft `../presentation-script-proposed-v2.txt` plus the explicit
click cues in `scripts/v2-manual-cues.mjs`, using `scripts/sync-v2.mjs`.
The manual script is the current performance order. The 47 editorial scene
references stay stable internally; the 78 playback stops each have a unique
ID and map back to those scenes. Add or edit click cues in the manual cue file,
then run synchronization and build. Movement links and comparison totals
are derived from the generated order.

## Blended enterprise and aircraft sequence

Scenes 15–26 retain the enterprise decision map and introduce the V1 aircraft silhouette. Scenes 27–29 follow that aircraft through new evidence and a provisional route. Scenes 30–37 reuse V1 topology identities, dependency edges, colors, and glyphs, with fixed positions and beat-specific emphasis. Explicit route authority and receiving flight-system nodes distinguish approval from acceptance. Scenes 38–39 return to the aircraft; execution is shown only after its own click. Scene 40 illuminates the full topology as the payoff.

The current narration and visual direction are generated in `presentation-script-v2-manual.txt`. The earlier editorial draft remains a reference. All 78 stops remain manual; mycelium, photosynthesis, and the three packet beats are retained.

## Presenting with a laptop and external display

1. In macOS System Settings → Displays, use the external display as an extended
   display. Keep the MacBook lid open.
2. Open `http://localhost:8091/the-model-v2.html?view=presenter` in a regular
   browser window (Safari or Chrome). Keep the local server running.
3. Choose **Open audience window**. Allow pop-ups for localhost if prompted.
4. Drag that separate window to the external monitor. Press **F** in that
   window to enter fullscreen; Escape exits fullscreen.
5. Return to the laptop's presenter window and click its notes heading to focus
   it. Check **Audience connected**, then test the clicker's next and previous
   buttons. Both windows should show the same beat.
6. Choose **Start timer** when ready. A− / A+ adjust the notes size. The notes
   scroll independently and return to the top on each beat. The next-click cue
   appears below the current narration.

The audience window never renders notes or review controls. B or period toggles
an audience blackout; navigation still works while blacked out. Press B again
or choose **Resume audience** to reveal the current beat. The timer is elapsed
wall-clock time and never advances the presentation.

Clicker navigation works with the presenter or audience window focused. Avoid
leaving focus in the browser address bar or another app. A refreshed audience
window requests the current beat automatically. If you refresh the presenter
window, choose **Open audience window** again to reconnect it; the current beat
is retained in the URL. A disconnected audience holds its last received frame.

At home, test first/last beats, forward/back, blackout/resume, audience reload,
and a several-minute pause. Test fullscreen on the external display and return
focus to the laptop, using the same browser and receiver/adapter as at the venue.
Keep the Mac connected to power and disable sleep and notifications for the talk.

## Flight ecosystem pullback (beats 70–72)

Immediately after beat 69, the existing flight graph expands into three manual
stops: the full AI traffic ecosystem, networking designed into application
code, and the sensory return through observability. The same companies, aircraft,
shipment, models, and tools remain in place across all three stops. Chips, compute
fabric, serving clusters, WAN/interconnect, route authority, and the flight system
make the infrastructure and accountability explicit. Provider names describe
architectural roles, not actual commercial agreements.

The narrative distinguishes network transport evidence from application meaning
and business outcome evidence. The return path supports situational awareness
and bounded autonomy; the next beat retains human authority and intervention.
Edit scene 41 in `scripts/v2-manual-cues.mjs` to change the narration, then sync.

## Jobs and workloads

Beats 51 and 54 introduce the agent’s bounded job and define its workload as all associated processing and traffic. Beats 57–61 carry that vocabulary through deadlines, retries, shared capacity, and organizational boundaries. Beats 69–72 map the workload onto coordinated nodes, connect compute with traffic, and distinguish workload observability from evidence of the outcome. Beat 75 asks the audience to choose one job and map its workload. Processing rings in the topology overviews distinguish work at nodes from exchanges along paths; they are illustrative, not live telemetry. Applications remain participants, and individual transactions remain distinct operations within a job.
