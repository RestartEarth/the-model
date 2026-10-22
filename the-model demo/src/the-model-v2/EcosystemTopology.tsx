import { AI_NODES, AI_EDGES, FLOW_COLOR } from "./visuals/graph/aiNetwork"
import type { NodeKind } from "./visuals/graph/types"
import { KindMark } from "./visuals/world/KindMark"
import { Jet } from "./visuals/world/RouteSky"

const blue="#8abaff", green="#62d6ae", amber="#efb56c", violet="#ad91f4"
type Node = { id:string; label:string; x:number; y:number; kind:NodeKind }
type Edge = { a:string; b:string; tone:string; layer:"traffic"|"compute"|"code"|"sense" }
const names:Record<string,string>={
  gemini:"Provider model", flash:"Fast model", "llama-s":"Open model", gemma:"Domain model", "g-embed":"Embeddings",
  "wx:route":"Dispatch agent", "wx:package":"Shipment 01", "wx:shipper":"Customer",
  "wx:ride":"Handling limit", "wx:slot":"Arrival slot", "carrier:router":"Logistics co.",
  "carrier:agents":"Ops agents", "carrier:own":"Own model", "carrier:corpus":"Ops records",
  "wx:met":"Weather co.", "airline:router":"Airline partner", "wx:link-air":"Air / ground link",
}
// Retain the existing flight graph and its glyphs; widen its scope beneath it.
const nodes:Node[]=AI_NODES.map(n=>({...n,label:names[n.id]||n.label,y:220+(n.y-140)*.72}))
nodes.push(
  {id:"chip",label:"AI chips",x:135,y:706,kind:"gpu"},
  {id:"fabric",label:"Compute fabric",x:335,y:706,kind:"network"},
  {id:"host",label:"Serving cluster",x:535,y:706,kind:"cloud"},
  {id:"app-code",label:"Coordination code",x:795,y:706,kind:"app"},
  {id:"wan",label:"WAN / interconnect",x:1080,y:706,kind:"network"},
  {id:"observe",label:"Observability",x:1350,y:706,kind:"sensor"},
)
// Separate the partner columns so labels remain legible at projector scale.
for(const node of nodes) {
  if(["carrier:router","carrier:own","site:sorthub","site:ramp"].includes(node.id))node.x=1320
  if(["carrier:agents","carrier:corpus","site:gate","staff:dispatcher"].includes(node.id))node.x=1480
}
nodes.push(
  {id:"authority",label:"Route authority",x:740,y:602,kind:"security"},
  {id:"flight-system",label:"Flight system",x:900,y:602,kind:"app"},
)
const byId=new Map(nodes.map(n=>[n.id,n]))
const edges:Edge[]=AI_EDGES.map(e=>({a:e.a,b:e.b,tone:FLOW_COLOR[e.kind],layer:"traffic"}))
const add=(a:string,b:string,layer:Edge["layer"],tone:string)=>edges.push({a,b,layer,tone})
add("wx:route","authority","traffic",amber);add("authority","flight-system","traffic",amber);add("flight-system","wx:aircraft","traffic",blue)
add("chip","fabric","compute",amber);add("fabric","host","compute",amber)
for(const id of ["gemini","flash","llama-s","gemma","g-embed","infer"])add("host",id,"compute",amber)
for(const id of ["wx:route","tools","safety","link","wan"])add("app-code",id,"code",blue)
for(const id of ["carrier:router","airline:router","wx:met","wx:link-air","site:sorthub","flight-system"])add("wan",id,"code",blue)
for(const id of ["wx:accel","wx:monitor","wx:sensors","site:gate","wx:forecast","wan","infer","flight-system"])add(id,"observe","sense",green)
add("observe","app-code","sense",green);add("app-code","wx:route","sense",green)

const groups=[
  ["MODEL PROVIDER",65,175,160,330], ["SERVING",265,175,120,360],
  ["WEATHER CO.",460,175,220,245], ["LOGISTICS / DISPATCH",690,175,270,450],
  ["AIRCRAFT / SHIPMENT",975,175,300,450], ["PARTNERS / GROUND",1290,175,240,450],
] as const
const focusCode=new Set(["app-code","wan","wx:route","tools","safety","link","carrier:router","airline:router","wx:met","wx:link-air","site:sorthub","authority","flight-system"])
const focusSense=new Set(["observe","app-code","wx:route","wx:accel","wx:monitor","wx:sensors","site:gate","wx:forecast","wan","infer","flight-system"])

export function EcosystemTopology({phase}:{phase:number}) {
  const focus=phase===1 ? focusCode : focusSense
  const titles=["THE WORKLOAD SPANS COMPUTE AND CONNECTIONS","DESIGN CONNECTIVITY AROUND THE JOB","OBSERVE THE WORKLOAD. VERIFY THE OUTCOME."]
  const subtitles=["One job across companies, systems, and shared infrastructure.","Reach the right system. Carry context. Enforce limits. Handle failure.","Sense conditions → reason → coordinate action → observe the outcome."]
  return <g aria-label="Full aircraft AI ecosystem: chips, compute fabric, models, workload coordination, WAN, partners, and observability">
    <text x="75" y="65" fill={blue} fontSize="16" letterSpacing="3">{titles[phase]}</text>
    <text x="75" y="104" fill="#e0e9f1" fontSize="23">{subtitles[phase]}</text>
    <g transform="translate(75 140)" fontSize="14">
      {[ [amber,"Compute"],[blue,"Model / tool calls"],[violet,"Evidence"],[green,"Outcome / feedback"] ].map(([tone,label],i)=><g key={label} transform={`translate(${i*270} 0)`}><path d="M0 0H30" stroke={tone} strokeWidth="2"/><text x="40" y="5" fill="#aebfce">{label}</text></g>)}
    </g>
    <g className={phase===0 ? "v2-ecosystem-pullback" : undefined}>
      {groups.map(([label,x,y,w,h])=><g key={label}><rect x={x} y={y} width={w} height={h} rx="28" fill="none" stroke="#71879c" strokeOpacity=".24" strokeDasharray="4 10"/><text x={x+12} y={y+24} fontSize="12" fill="#94a8b8" letterSpacing="1.5">{label}</text></g>)}
      <rect x="65" y="654" width="1465" height="105" rx="26" fill="#132330" stroke="#71879c" strokeOpacity=".2"/>
      <text x="80" y="677" fontSize="12" fill="#94a8b8" letterSpacing="2">PROCESSING AT NODES · TRAFFIC BETWEEN THEM · FEEDBACK</text>
      {edges.map((e,i)=>{
        const a=byId.get(e.a)!,b=byId.get(e.b)!
        const selected=phase===0 ? e.layer==="compute" || e.layer==="code" : phase===1 ? e.layer==="code" : e.layer==="sense"
        const d=`M${a.x} ${a.y} Q${(a.x+b.x)/2} ${(a.y+b.y)/2-35-(i%4)*12} ${b.x} ${b.y}`
        return <g key={i} opacity={selected ? .85 : phase===0 ? .2 : .075}>
          <path d={d} fill="none" stroke={e.tone} strokeWidth={selected ? 1.8 : 1}/>
          {selected && <circle r="3" fill={e.tone} className="v2-traveler"><animateMotion dur={`${3+i%5}s`} repeatCount="indefinite" path={d}/></circle>}
        </g>
      })}
      {nodes.map(n=>{
        const active=phase===0 || focus.has(n.id), plane=n.id==="wx:aircraft"
        const tone=n.id==="observe" || (phase===2 && focus.has(n.id)) ? green : n.id==="chip" || n.id==="fabric" || n.id==="host" || plane ? amber : n.kind==="model" ? violet : blue
        return <g key={n.id} transform={`translate(${n.x} ${n.y})`} opacity={active||plane||n.id==="wx:package" ? 1 : .38}>
          {phase===0 && ["chip","host","infer","app-code","wx:route","wx:forecast"].includes(n.id) && <circle r="22" fill="none" stroke={tone} strokeWidth="2" strokeDasharray="4 4"><title>Processing for this job</title></circle>}
          {plane ? <Jet at={{x:0,y:0}} pitch={0} scale={.58} ink={amber} cargo={1} mind={0}/> : <><rect x="-16" y="-16" width="32" height="32" rx="7" fill="#142431" stroke={tone} strokeWidth="1.4"/><g transform="translate(-11 -11)" style={{color:tone}}><KindMark kind={n.kind}/></g></>}
          <text y="33" textAnchor="middle" fontSize="16" fill="#d9e4ed" stroke="#14202c" strokeWidth="4" paintOrder="stroke">{n.label}</text>
        </g>
      })}
    </g>
  </g>
}
