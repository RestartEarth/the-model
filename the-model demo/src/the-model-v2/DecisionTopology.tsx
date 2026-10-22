import { AI_NODES, AI_EDGES, FLOW_COLOR } from "./visuals/graph/aiNetwork"
import { KindMark } from "./visuals/world/KindMark"
import { Jet } from "./visuals/world/RouteSky"

const blue = "#8abaff", green = "#62d6ae", amber = "#efb56c", violet = "#ad91f4"
// V1 identities and dependencies, arranged once for every manual decision stop.
const positions: Record<string, [number, number]> = {
  "wx:jet": [130, 245], "wx:turb": [340, 245], "wx:rides": [130, 420],
  "wx:forecast": [340, 420], "wx:route": [735, 260],
  "wx:load": [560, 430], "wx:slot": [930, 430],
  "wx:ride": [560, 590], "wx:called": [930, 590], "wx:own": [735, 650],
  "wx:aircraft": [1280, 265], "wx:package": [1370, 630],
}
const nodes = AI_NODES.filter(n => positions[n.id])
const edges = AI_EDGES.filter(e => positions[e.a] && positions[e.b])
const names: Record<string,string> = {"wx:route":"Dispatch agent", "wx:package":"Shipment 01", "wx:slot":"Arrival slot", "wx:ride":"Handling limit"}
const focusByBeat: Record<number,string[]> = {
  30: ["wx:route","wx:forecast","wx:load","wx:slot","wx:ride","wx:aircraft","wx:package"],
  31: ["wx:route","wx:jet","wx:turb","wx:forecast","wx:rides"],
  32: ["wx:route","wx:forecast","wx:slot"],
  33: ["wx:route"], 34: ["wx:route"],
  35: ["wx:route","wx:turb","wx:forecast"],
  36: ["wx:route","wx:called","wx:forecast"],
  37: ["wx:route","wx:forecast","wx:load","wx:slot","wx:ride","wx:package"],
  40: Object.keys(positions),
}
const titles: Record<number,[string,string]> = {
  30: ["OPEN THE WORKLOAD", "One job: processing at nodes, traffic between them."],
  31: ["CHECK THE EVIDENCE", "A response must describe this route, now."],
  32: ["THE JOB HAS A DEADLINE", "Late evidence can leave no time to act."],
  33: ["IF THE ACKNOWLEDGMENT IS LOST", "Contingency: the receiver may already have accepted."],
  34: ["RECOVER THE SAME OPERATION", "Contingency: ask for the existing result using the same ID."],
  35: ["MANY JOBS / SHARED CAPACITY", "Protect the processing and exchanges this job depends on."],
  36: ["ACROSS AN EXTERNAL BOUNDARY", "Measure the exchange. Preserve the approval requirement."],
  37: ["FROM PROPOSAL TO COMMITMENT", "Evidence, approval, and acceptance are distinct events."],
  40: ["THE NETWORK BEHIND THE JOB", "The workload mapped onto its coordinated nodes."],
}

function Exchange({a,b,tone,active,dashed=false,bend=0}: {
  a:[number,number]; b:[number,number]; tone:string; active:boolean; dashed?:boolean; bend?:number
}) {
  const d=`M${a[0]} ${a[1]} Q${(a[0]+b[0])/2+bend} ${(a[1]+b[1])/2-65} ${b[0]} ${b[1]}`
  return <g opacity={active ? .8 : .07}>
    <path d={d} fill="none" stroke={tone} strokeWidth={active ? 2.2 : 1} strokeDasharray={dashed ? "6 8" : undefined}/>
    {active && !dashed && <circle r="4" fill={tone}><animateMotion dur="3.4s" repeatCount="indefinite" path={d}/></circle>}
  </g>
}

export function DecisionTopology({beat,phase}:{beat:number;phase:number}) {
  const focus=new Set(focusByBeat[beat])
  const failed=beat===31 && phase===0
  const commit=beat===37, approved=(commit && phase>=1)||beat===40, accepted=(commit && phase>=2)||beat===40
  const recovery=beat===33||beat===34
  const authorityActive=commit||beat===36||beat===40
  const receiptActive=commit||recovery||beat===40
  const status=accepted ? "Amendment 01 · accepted" : recovery ? "Contingency · amend-01" : "Candidate 01 · pending"
  return <g aria-label="Aircraft workload map: processing, exchanges, authority, and shipment">
    <text x="75" y="70" fill={blue} fontSize="15" letterSpacing="3">{titles[beat][0]}</text>
    <text x="75" y="108" fill="#e0e9f1" fontSize="23">{titles[beat][1]}</text>
    <text x="1160" y="65" fill={amber} fontSize="16">SHIPMENT TK–BOS / 01</text>
    <text x="1160" y="94" fill={accepted ? green : amber} fontSize="17">{status}</text>
    <text x="1160" y="122" fill={blue} fontSize="15">Arrival + handling remain the test</text>
    <g fill="none" stroke="#71879c" strokeOpacity=".25" strokeDasharray="5 12">
      <rect x="65" y="170" width="355" height="355" rx="55"/>
      <rect x="475" y="170" width="550" height="560" rx="65"/>
      <rect x="1100" y="170" width="410" height="560" rx="65"/>
    </g>
    <g fill="#8b9bab" fontSize="15" letterSpacing="4"><text x="100" y="200">WEATHER</text><text x="510" y="200">DISPATCH / MODELS</text><text x="1140" y="200">FLIGHT / SHIPMENT</text></g>
    {edges.map((e,i)=>{
      // Pending proposals must not look like instructions already executing.
      const aircraftEdge=e.a==='wx:aircraft'||e.b==='wx:aircraft'
      const active=focus.has(e.a)&&focus.has(e.b)
      return <Exchange key={i} a={positions[e.a]} b={positions[e.b]} tone={failed ? amber : FLOW_COLOR[e.kind]} active={active} dashed={aircraftEdge && beat!==40}/> 
    })}
    <Exchange a={[735,260]} b={[1120,450]} tone={approved ? green : amber} active={authorityActive} dashed={!approved}/>
    <Exchange a={[1120,450]} b={[1390,450]} tone={accepted ? green : amber} active={receiptActive} dashed={!accepted}/>
    {recovery && <Exchange a={[1390,450]} b={[735,260]} tone={beat===34 ? green : amber} active dashed={beat===33} bend={120}/>}
    {nodes.map(n=>{
      const [x,y]=positions[n.id], active=focus.has(n.id), aircraft=n.id==='wx:aircraft'
      const tone=n.id==='wx:route'||n.id==='wx:own' ? green : n.id==='wx:forecast' ? failed ? amber : violet : blue
      const detail=n.id==='wx:forecast' && beat===31 ? failed ? 'Expired · rejected' : 'Current · sufficient'
        :n.id==='wx:route' ? accepted ? 'Commitment recorded' : 'Proposal pending'
        :n.id==='wx:package' ? 'Arrival / shock limit'
        :n.id==='wx:load' && commit ? 'Capacity checked'
        :n.id==='wx:slot' && commit ? 'Window checked'
        :n.id==='wx:ride' && commit ? 'Limit checked' : ''
      return <g key={n.id} transform={`translate(${x} ${y})`} opacity={active||aircraft ? 1 : .24}>
        {aircraft ? <Jet at={{x:0,y:0}} pitch={0} scale={.85} ink={amber} cargo={1} mind={0}/> : <>
          {active && (beat===30 || beat===40) && ["wx:route","wx:forecast","wx:load","wx:slot","wx:own","wx:called"].includes(n.id) && <circle r="26" fill="none" stroke={tone} strokeWidth="2" strokeDasharray="5 5"><title>Processing for this job</title></circle>}
          <rect x="-19" y="-19" width="38" height="38" rx="8" fill="#152536" stroke={tone} strokeWidth="1.6"/>
          <g transform="translate(-11 -11)" style={{color:tone}}><KindMark kind={n.kind}/></g>
        </>}
        <text y="46" textAnchor="middle" fill="#dfe8f2" fontSize="19">{names[n.id]||n.label}</text>
        {detail && <text y="69" textAnchor="middle" fill={failed && n.id==='wx:forecast' ? amber : tone} fontSize="14">{detail}</text>}
      </g>
    })}
    {[[1120,'Route authority',approved ? 'Approval recorded' : 'Approval required',authorityActive], [1390,'Flight system',accepted ? 'Amendment accepted' : recovery ? 'Operation: amend-01' : 'No commitment yet',receiptActive]].map(([x,label,detail,active])=><g key={String(label)} transform={`translate(${x} 450)`} opacity={active ? 1 : .25}>
      <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#152536" stroke={accepted||approved&&x===1120 ? green : amber}/>
      <text y="7" textAnchor="middle" fill={green} fontSize="23">{x===1120 ? approved ? '✓' : '?' : '↔'}</text>
      <text y="45" textAnchor="middle" fill="#e0e9f1" fontSize="19">{label}</text>
      <text y="69" textAnchor="middle" fill={amber} fontSize="14">{detail}</text>
    </g>)}
    {beat===32 && <g><path d="M90 600H390" stroke={amber} strokeWidth="3"/><path d="M355 587V613" stroke={amber} strokeWidth="2"/><text x="90" y="640" fill={amber} fontSize="19">Deadline → hold / escalate</text></g>}
    {recovery && <text x="85" y="600" fill={beat===34 ? green : amber} fontSize="19">{beat===33 ? 'No acknowledgment ≠ no action' : 'Same ID · no second commitment'}</text>}
    {beat===35 && <g>{[0,1,2,3].map(i=><g key={i}><Jet at={{x:110+i*85,y:590}} pitch={0} scale={.28} ink={amber} cargo={0} mind={0}/><path d={`M${110+i*85} 575Q250 510 340 245`} stroke={amber} strokeOpacity=".3" fill="none"/></g>)}<text x="85" y="640" fill={amber} fontSize="18">Shared service · critical capacity reserved</text></g>}
    {beat===36 && <g><rect x="850" y="548" width="160" height="120" rx="20" fill="none" stroke={amber} strokeDasharray="6 6"/><text x="85" y="600" fill={amber} fontSize="18">External response ≠ permission to act</text></g>}
    {beat===40 && <text x="85" y="635" fill={green} fontSize="20">Evidence → decision → action → result</text>}
    <text x="85" y="710" fill="#8b9bab" fontSize="13">{beat===40 ? 'Processing at nodes · traffic on paths · observed outcome' : beat===30 ? 'Node rings: processing · bright paths: exchanges · dashed paths: pending' : 'Bright paths: current focus · dashed paths: pending exchanges'}</text>
  </g>
}
