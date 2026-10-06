/**
 * Every word the audience reads.
 *
 * Kept in one file so the whole script can be read as prose — the beat list
 * in beats/script.ts is the staging, this is the writing. Lines are short on
 * purpose: one sentence on screen, the rest spoken. A line rendered with
 * `showTitle` gets the full-bleed centred treatment and should be shorter and
 * flatter than a panel line, because the room will read it in silence.
 */

// ── The quote, and its return ─────────────────────────────────────────

export const GAGE_QUOTE = "The network is the computer."
export const GAGE_ATTR = "John Gage, 1984"
export const GAGE_RETURN_KICKER = "Forty years later"
export const GAGE_RETURN_ATTR = "Now an operating requirement"
export const GAGE_PHOTO_CREDIT =
  "John Gage, photographed by Joi Ito, 5 October 2008. CC BY 2.0."

export const TITLE = "THE MODEL"

// ── Movement labels ───────────────────────────────────────────────────

export const M1 = "One · An architecture that repeats"
export const M2 = "Two · Networks make intelligence"
export const M3 = "Three · Intelligence networks with intelligence"
export const M4 = "Four · 1984"
export const M5 = "Five · The enterprise"
export const M6 = "Six · What autonomy requires"
export const M7 = "Seven · The autonomous enterprise"


// ── Movement 1 · An architecture that repeats ─────────────────────────

export const N_COSMOS =
  "The largest structure anyone has ever mapped is a network."
export const N_INDRA =
  "Matter did not settle into a pile. It settled into relationships."
export const N_WATER =
  "Water runs a circuit — ocean, air, mountain, river, ocean — and the planet stays habitable because it does."
export const N_MYCELIUM =
  "Under a forest floor, fungal threads link trees that cannot move. Sugar goes one way, minerals the other."
export const N_PHOTOSYNTHESIS =
  "Light, air and soil are three unrelated systems. Connected, they make food."
export const N_FOODWEB =
  "A food web is nothing but a map of who depends on whom."
export const N_REPEATS =
  "Different parts. Different scales. The same architecture, over and over."

// ── Movement 2 · Networks make intelligence ───────────────────────────

export const B_PRESENCE = "You are one of them."
export const B_STRUCTURE =
  "Bone and muscle: a mechanical network. Nothing moves alone."
export const B_CIRCULATION =
  "Blood: a distribution network running to every cell you have."
export const B_VISCERA =
  "Organs are specialists. None of them is useful on its own."
export const B_LYMPH =
  "Lymph and hormones: a slower network, carrying state rather than supplies."
export const B_NERVES =
  "Nerves: a signalling network, fast enough to change what happens next."
export const B_BRAIN = "And at the top, the densest network in the body."

/** §42 pause — the neural reveal. Centred, read in silence. */
export const B_NEURAL =
  "Intelligence is not in the parts. It is in the relationships between them."

export const B_SENSES = "A network that cannot perceive cannot act."
export const B_LOOP =
  "Perceive. Model. Predict. Act. Sense the result — and go again."
export const B_INTELLIGENCE =
  "That loop, running without pause, is most of what we mean by being alive to the world."

export const C_REVEAL = "Watch one person do one ordinary thing."
export const C_PERCEIVE =
  "Before anything moves, the body builds a model of the situation: the basket, the defender, the floor, its own balance."
export const C_MOTOR =
  "Then a few hundred muscles agree on a sequence, in order, in about half a second."
export const C_LOOP =
  "And it is still correcting after the ball has left the hand. One body. One loop."

// ── Movement 3 · Intelligence networks with intelligence ──────────────

export const T_REVEAL = "Now put five of them on a court."
export const T_LINKS =
  "Each one specialises. Each one depends on the other four."
export const T_SIGNALS =
  "They pass more than the ball. A call, a glance, a screen — the state of the play, continuously."
export const T_MODEL =
  "No one calls every move. Each player carries a model of the same game, and acts on it."

/** Pause on the inbound — inside one skull before the pass. */
export const T_MIND =
  "Hold the inbound. The clock, the score, Brunson, the help, the rim, his own balance. All of it is already in."
export const T_MIND_MODEL =
  "And the model was written before this inbound. If Brunson shoots, he crashes. If Brunson passes, he shoots."
export const T_MIND_DECIDE =
  "Senses, model, and the body that has to move — one moment. This time Brunson shoots, and the crash is already the act."

/** §42 pause — team emergence. */
export const T_EMERGE =
  "The team is not five players. It is what happens between them."

export const T_SCALE =
  "Five is a team. A family, a community, a crew — the same architecture, at the scale of people."

// ── Movement 4 · 1984 ─────────────────────────────────────────────────

export const H_PEOPLE =
  "People have always done this. Families, crews, institutions."
export const H_LANGUAGE =
  "Language is the protocol. It is how one mind puts a model into another."
export const H_ECONOMY =
  "Families, communities, teams — networks people form with each other. A market is that network, one level up, deciding what gets made with no one in charge of it."
export const H_INTERNET = "And then we built one on purpose."
export const H_PULLBACK =
  "The same shape, at every scale we can see — and one of them we made ourselves."

export const H_GAGE =
  "In 1984 someone said out loud what the architecture had been saying all along."

export const P_OPEN =
  "We built it the way everything else here is built: small pieces, each finding their own way."
export const P_PATH = "Nobody plans the route. The route is chosen in flight."
export const P_LAYERS =
  "A thought goes down through the layers and leaves as a pulse on a wire."
export const P_CREDIT = "After Robert M. Kettles — Life of the Packet, 2022."

// ── Movement 5 · The enterprise ───────────────────────────────────────

export const E_OPEN =
  "Take the team and stretch it across a planet. This company moves physical things."
export const E_AIR = "Aircraft, moving between continents on a schedule."
export const E_GROUND = "Vehicles, moving between the schedule and the door."
export const E_HUBS =
  "Sorting hubs, warehouses, robots, scanners. The places where things change hands."
export const E_OPS =
  "And people: dispatchers, planners, the ones who answer the phone."
export const E_IT =
  "Underneath all of it, the systems that are supposed to know where everything is."

/** §42 pause — the enterprise as organism. */
export const E_ORGANISM = "This is not an org chart. It is an organism."

export const E_PACKAGE =
  "One package. Tokyo to Boston. It has an identity, an origin, a destination, a priority — and a promise attached to it."
export const E_COMMITMENT =
  "Every part of this network exists to keep that promise, a few million times a day."
export const E_DISRUPT =
  "Then weather closes a major hub. Nothing is broken. Everything is affected."
export const E_DEPEND =
  "The useful question is not what changed. It is what depends on what changed."
export const E_REROUTE =
  "A different route, a different aircraft, a different sort window — and the promise still holds."

// ── Movement 6 · What autonomy requires ───────────────────────────────

export const A_OPEN =
  "Suppose you want that to happen without anyone staying up for it. What does that actually require?"
export const A_PERCEIVE =
  "It has to perceive. Not a dashboard somebody opens — perception, the way the body has perception."
export const A_MODEL =
  "It has to hold a model of the relationships. Not a list of assets. What affects what."
export const A_SEMANTICS =
  "The model has to carry meaning: what is committed, what is allowed, what has room left."
export const A_FEDERATE =
  "No single system holds all of it. Air knows aircraft. The hub knows the belt. The model is federated by necessity."
export const A_FEDERATE_HOLD =
  "It answers by asking the parts that actually know, at the moment it needs them."
export const A_AI = "Now put something in it that can reason."
export const A_TRAFFIC =
  "Machine reasoning becomes network traffic the moment it needs to leave the model."
export const A_TAGS =
  "Every call it makes is a relationship: a tool, a task, a retrieval, a measurement."
export const A_ACT = "It has to be able to act. Reading is not operating."
export const A_VERIFY =
  "And it has to find out whether the action worked, from the system itself rather than from its own expectation."
export const A_NETWORK_CENTRIC =
  "Network-centric is not network-only. The network is where the relationships are visible."

/** The humans line. §29 — never a failure fallback. */
export const A_HUMANS =
  "Autonomy does not remove humans. It moves humans up the stack."

// ── Movement 7 · The autonomous enterprise ────────────────────────────

export const L_REVEAL = "Five things, in order, forever."
export const L_OBSERVE = "Observe — take in what is actually happening."
export const L_UNDERSTAND = "Understand — place it in the model of relationships."
export const L_DECIDE = "Decide — choose inside policy, against the commitment."
export const L_ACT = "Act — change the system, not a ticket about the system."
export const L_VERIFY = "Verify — confirm the effect, and feed it back in."
export const L_RUN =
  "That is the same loop the body runs to make one shot. It is the only loop there is."

export const Z_ENTERPRISE =
  "Running continuously, across the whole network, while people sleep."
export const Z_SCALE =
  "Neuron, brain, body, player, team, enterprise. One architecture, six scales."

/** §42 pause — THE MODEL's second meaning. */
export const Z_MODEL =
  "The model is not the thing that thinks. The model is what it thinks about."

export const Z_HUMANS =
  "People are still here. Setting the commitments, setting the limits, handling the things that have never happened before."

/** §30 — the one line the show ends on. */
export const Z_CLOSE = "THE NETWORK BECOMES PART OF THE INTELLIGENCE."

export const Z_ONUG = "Thank you."
