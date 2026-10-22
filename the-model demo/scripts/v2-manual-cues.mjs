// Each entry is a presenter-controlled stop. No elapsed-time scene selection.
const legacy = (source, title, line, narration) => ({ legacyScene: source, source, title, line, narration })
const phase = (phase, title, line, narration) => ({ phase, title, line, narration })
export const manualCues = {
  1: [legacy('open', 'Before the first word', '', '(Silence.)')],
  2: [legacy('cosmos', 'The space between')],
  3: [
    legacy('atmosphere', 'The atmosphere', 'Heat moves. Conditions change.', 'The atmosphere carries heat and moisture between places. What happens in one region helps shape the conditions in another. The connections are part of how the system works.'),
    legacy('water', 'The water cycle', 'A change here becomes a condition somewhere else.', 'An ocean, a cloud, a mountain, a river. Each is recognizable on its own. Follow the movement between them and you begin to understand the system. What happens upstream changes what is possible downstream.'),
  ],
  4: [legacy('foodweb', 'Dependence')],
  5: [
    legacy('body', 'You arrived connected', 'You arrived connected.', 'You have a more personal example. Your body brings together systems with different jobs and different rhythms.'),
    legacy('body-structure', 'Structure and movement', 'Structure supports movement.', 'Bone and muscle work together to support you and move you. A movement depends on their coordination.'),
    legacy('body-circulation', 'Circulation', 'A working body needs a continuous supply.', 'Circulation supplies the tissues doing that work. Movement depends on resources reaching the places that need them.'),
    legacy('body-viscera', 'Specialized organs', 'Different jobs. A shared life.', 'Organs do specialized work. You experience their coordination as something ordinary: getting out of a chair, crossing a room, catching something before it falls.'),
    legacy('body-lymph', 'Regulation', 'Coordination runs at different rhythms.', 'Chemical signals help regulate what happens across these systems. Much of that coordination happens without your attention.'),
  ],
  6: [
    legacy('body-nerves', 'Sensing and response', 'Sensing connects to movement.', 'The nervous system connects sensing and movement. Information has to arrive and produce a response in time to matter.'),
    legacy('body-brain', 'Brain and body', 'An ongoing exchange with the world.', 'The brain participates in that ongoing exchange with the body and its surroundings.'),
    legacy('neural', 'Intelligence in operation', 'Sensing. Coordinating. Responding.', 'Seeing the wiring alone does not explain intelligence. But it reminds us that intelligence in action depends on information arriving, being used, and producing a response. A basketball shot makes that exchange visible.'),
  ],
  7: [
    legacy('senses', 'Contact with the situation', 'Useful knowledge meets the present situation.', 'The player senses the rim, the defender, his balance, and the feel of the ball. Practice gives him expectations. What he senses now lets him adjust them.'),
    legacy('shot-reveal', 'One ordinary shot', 'One person. One action.', 'Here is the same body on a basketball court, preparing to shoot.'),
    legacy('shot-perceive', 'Before the ball moves', 'The action begins before the ball moves.', 'Before release, the player is already using information about the court and his own position. Preparation is part of the action.'),
  ],
  8: [
    legacy('shot-motor', 'The release', '', 'Then he shoots. Once the ball is in the air, he cannot steer it. He can watch what happened, land, recover, and prepare for what comes next.'),
    legacy('shot-loop', 'The result comes back', 'Act. Observe the result. Adjust.', 'His intention does not tell him whether the shot went in. The result does. That distinction matters when a machine takes an action on our behalf.'),
  ],
  9: [
    legacy('team', 'Five capable people', 'Five players. A shared game.', 'Now give him four teammates. All five can be exceptional. They still need to coordinate.'),
    legacy('team-links', 'Available to one another', 'Capability depends on coordination.', 'A great shooter who never receives the ball is a person standing in a good spot. Their advantage comes from combining different views quickly enough to act together.'),
  ],
  10: [
    legacy('team-mind', 'Before the pass', 'A shared understanding of this game.', 'Before the pass, the players have expectations about one another. They are also reading what is happening now.'),
    legacy('team-mind-model', 'Two possibilities', 'Prepare for what could happen next.', 'If the shot goes up, someone needs to be ready for the rebound. If the defense closes that option, the play needs another one.'),
    legacy('team-mind-decide', 'This possession', 'Different actions fit together.', 'They need enough shared understanding to make their different actions fit together. And they have to update it as the defense moves.'),
  ],
  11: [
    legacy('team-signals', 'Let the play happen', '', 'The pass. The shot. And someone is already moving toward the rebound.'),
    legacy('team-model', 'The make', '', '(Let the result land.)'),
  ],
  12: [legacy('team-emergence', 'The team')],
  13: [
    legacy('gage-quote', 'The sentence', 'The network is the computer.', '(Let the room read the line.)'),
    legacy('gage', 'Gage'),
  ],
  14: [
    legacy('packet-layers', 'From thought to wire', 'A thought goes down through the layers and leaves as a pulse on a wire. Software is how we put our minds into systems.', 'A thought does not cross a room as a thought. It comes apart, goes down through the layers, and leaves as a pulse on a wire. That is also how we put a mind into a system: software. Give this a minute. You already know networking. This is the hinge between a mind and a wire.'),
    legacy('packet-open', 'Small pieces', 'We built it the way everything else here is built: small pieces, each finding their own way.', 'We did not invent a new shape when we built this. Small pieces, each able to move without holding the whole message. You have been looking at that since the first click.'),
    legacy('packet-path', 'The route is chosen in flight', 'Nobody plans the route. The route is chosen in flight.', 'The route is not booked before the first hop. Each piece chooses the next from what is live. Remember that. An aircraft is about to have to do the same thing, with a promise attached.'),
  ],
  15: [
    phase(0,'The shipment origin','Tokyo → Boston','Imagine a logistics company moving a shipment from Tokyo to Boston.'),
    phase(1,'The aircraft','One delivery depends on all of this.','An aircraft handles one part of the journey.'),
    phase(2,'The gateway','One delivery depends on all of this.','A gateway connects that flight to the next part of the journey.'),
    phase(3,'The receiving hub','One delivery depends on all of this.','A sorting hub has its own receiving window and schedule.'),
    phase(4,'The destination','One delivery depends on all of this.','A final delivery has to reach a door. The customer experiences the result of all of them working together.'),
  ],
  21: [
    phase(0,'Awaiting confirmation','Can this alternative still keep the promise?','She finds a possible alternative and asks for confirmation. One answer is late. She can keep investigating, but holds the commitment until she knows the alternative is available.'),
    phase(1,'The answer returns','Capacity confirmed. The receiving window still fits.','Then the answer arrives. Capacity is confirmed. The receiving window still fits. She has evidence she can use.'),
  ],
  30: [phase(0, "Open the workload", "One job creates a distributed workload.", "Now open up that job. The agent consults models, requests weather evidence, checks capacity and arrival windows, and seeks approval. It also needs acceptance from the system that records the amendment.\n\nAll the processing and traffic associated with carrying out the job is its workload. That includes reasoning, checks, retries, and feedback.\n\nMap that workload, and you see the nodes and connections that have to work together. Processing happens at the nodes. Exchanges carry the work between them.")],
  40: [phase(0, "The network behind the job", "This is the network behind the job.", "What looked like one job for one agent required coordinated work across all these nodes. This is the workload mapped onto the network.\n\nThe aircraft and shipment are the same ones we started with. Weather evidence, operational constraints, models, approval, and the system recording the amendment all participated. Flight operations and measurements then told us what actually happened.\n\nThe applications participated in the job. Their individual operations contributed to its workload. The connected system made the coordination possible.")],
  41: [
    phase(0, "The workload spans compute and connections", "The workload spans compute and connections.", "Pull back again. The same job draws on an ecosystem of companies and systems: weather providers, model providers, the logistics company, its airline partner, and the ground operation.\n\nUnder the models are serving clusters, compute fabrics, and chips. Between the companies are wide area networks and interconnects. Processing at the nodes and traffic between them together make up the workload.\n\nOne job can span many applications. Many jobs can share the same nodes and connections. This is the full system we are asking to behave intelligently."),
    phase(1, "Design connectivity around the job", "Design connectivity around the job.", "Designing the job means deciding which nodes can participate, what context they exchange, how long they can wait, and how they recover when an answer does not arrive. Who is allowed to act? Which systems must agree before the work can proceed?\n\nWe have to express those choices in the software coordinating the workload. Reachability, deadlines, retries, and authorization shape whether the agent can complete its job.\n\nThe network of exchanges is a core part of the intelligent system. Information has to reach the right place, in time for effective reasoning and coordinated action."),
    phase(2, "Observe the workload, verify the outcome", "Observe the workload. Verify the outcome.", "Build observability across the workload. Connect the processing and exchanges to the job they serve: which evidence was used, what conditions held, what action was authorized, and what the operation reports happened.\n\nThe aircraft’s measurements, the cargo monitor, the arrival report, and the health of the communication path all feed that picture. Completing a call does not establish that the job succeeded. Completing the agent’s route-change job does not by itself establish that the delivery promise was kept.\n\nThis is situational awareness: understanding the conditions in which a decision is made, then sensing and understanding its outcome. That feedback informs the next decision, within delegated limits. Which brings us to who sets those limits."),
  ],
  31: [
    phase(0,'Evidence rejected','Received does not mean usable.','Suppose the weather service returns an answer that is too old, or lacks coverage for the route. The request succeeded. The evidence requirement did not.'),
    phase(1,'Usable evidence received','Current evidence. Relevant coverage.','A replacement answer satisfies the requirement. Transport success alone cannot tell us whether we have enough evidence to proceed; the meaning of the response matters.'),
  ],
  37: [
    phase(0,'Required checks satisfied','Evidence current. Constraints satisfied.','The required evidence has arrived in time. The candidate fits the handling and arrival constraints. Approval is still required.'),
    phase(1,'Approval recorded','Action authorized.','The appropriate approval is present. The agent can submit the change within its delegated authority.'),
    phase(2,'Amendment accepted','One recorded commitment.','The receiving system records the change. The commitment has a traceable basis: the evidence, checks, permission, and accepted action.'),
  ],
  38: [
    phase(0,'Acceptance is one milestone','Accepted. Execution still to confirm.','An accepted instruction is one milestone. We still need to know what happened in the operation.'),
    phase(1,'Execution reported','The route change took effect.','The flight systems report that the route change took effect. We still need the evidence about its outcome.'),
    phase(2,'Outcome evidence received','The result comes from the operation.','What do the aircraft and cargo measurements report? Does the revised arrival protect the connection? Those answers come from the systems observing the work, not the agent’s expectation.'),
  ],
  45: [legacy('gage','The sentence returns')],
}

export const restoredNature = [
  legacy('mycelium','Beneath the forest','An exchange beneath the surface.','Fungal threads connect with plant roots. Sugars and mineral nutrients move through these partnerships. Much of the exchange supporting the forest happens beneath the surface, beyond what we can see by looking at the trees alone.'),
  legacy('photosynthesis','Light becomes food','Light, water, and carbon dioxide become a living resource.','A leaf uses light to turn water and carbon dioxide into sugars. Those sugars support the plant and become a resource for other living things. The next picture follows those dependencies through the food web.'),
]
