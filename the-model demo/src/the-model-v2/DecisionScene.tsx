import { useId } from "react"
import { Jet, Satellite, Dish } from "./visuals/world/RouteSky"
import { EcosystemTopology } from "./EcosystemTopology"
import { DecisionTopology } from "./DecisionTopology"

const blue = "#8abaff", green = "#62d6ae", amber = "#efb56c", muted = "#8b9bab"
type Props = { beat: number; phase: number }

function Node({ x, y, label, detail, tone = blue, icon = "dot" }: {
  x: number; y: number; label: string; detail?: string; tone?: string; icon?: string
}) {
  return <g transform={`translate(${x} ${y})`}>
    <circle r="25" fill="#152536" stroke={tone} strokeWidth="1.4" />
    <circle r="37" fill="none" stroke={tone} strokeOpacity=".12" />
    {icon === "plane" ? <path d="M-16 3 L-3 -2 L-3 -15 L2 -17 L5 -2 L18 3 L18 7 L4 5 L4 13 L9 16 L9 19 L0 16 L-8 19 L-8 16 L-3 13 L-3 5 L-16 7Z" fill={tone} transform="scale(.72)" />
      : icon === "person" ? <g fill="none" stroke={tone} strokeWidth="2"><circle cy="-7" r="5"/><path d="M-10 13 Q-10 0 0 0 Q10 0 10 13"/></g>
      : icon === "box" ? <g fill="none" stroke={tone} strokeWidth="1.6"><path d="M-10 -7L0 -12L10 -7V7L0 12L-10 7Z M-10 -7L0 -2L10 -7 M0 -2V12"/></g>
      : <><circle r="7" fill={tone} fillOpacity=".15" stroke={tone}/><circle r="2" fill={tone}/></>}
    <text y="61" textAnchor="middle" fill="#e0e9f1" fontSize="21">{label}</text>
    {detail && <text y="87" textAnchor="middle" fill={muted} fontSize="16">{detail}</text>}
  </g>
}

function Link({ d, tone = blue, dashed = false, animate = false, id }: {
  d: string; tone?: string; dashed?: boolean; animate?: boolean; id?: string
}) {
  return <g>
    <path id={id} d={d} fill="none" stroke={tone} strokeWidth="1.6" strokeOpacity=".5" strokeDasharray={dashed ? "7 8" : undefined}/>
    {animate && <circle r="4" fill={tone} className="v2-traveler"><animateMotion dur="3s" repeatCount="indefinite" path={d}/></circle>}
  </g>
}

function Chip({ x, y, text, tone = blue }: { x: number; y: number; text: string; tone?: string }) {
  return <g transform={`translate(${x} ${y})`}><rect x="-100" y="-18" width="200" height="36" rx="18" fill="#142331" stroke={tone} strokeOpacity=".4"/><text textAnchor="middle" y="6" fontSize="16" fill={tone}>{text}</text></g>
}

function Promise({ beat, phase = 0 }: { beat: number; phase?: number }) {
  const risk = beat >= 18 && beat <= 21
  const verified = beat > 38 || (beat === 38 && phase >= 2)
  return <g transform="translate(1190 75)">
    <text fill={muted} fontSize="14" letterSpacing="3">SHIPMENT TK–BOS / 01</text>
    <text y="34" fill="#e6eef4" fontSize="24">A promise to someone waiting.</text>
    <circle cx="5" cy="63" r="4" fill={risk ? amber : green}/>
    <text x="20" y="69" fontSize="16" fill={risk ? amber : green}>Arrival · {risk ? "at risk" : verified ? "on track" : "commitment held"}</text>
    <circle cx="5" cy="91" r="4" fill={verified ? green : blue}/>
    <text x="20" y="97" fontSize="16" fill={verified ? green : blue}>Handling · {verified ? "evidence received" : "shock limit applies"}</text>
  </g>
}

function Enterprise({ beat, phase }: Props) {
  const closed = beat >= 18 && beat <= 22
  const candidate = beat === 21 && phase === 0
  const reroute = beat === 22 || (beat === 21 && !candidate)
  const model = beat >= 23 && beat <= 26
  const nodes = [
    { x: 150, y: 380, label: "Tokyo", detail: "Shipment origin", icon: "box" },
    { x: 410, y: 285, label: "Aircraft", detail: "Capacity / schedule", icon: "plane" },
    { x: 730, y: 350, label: "Pacific gateway", detail: closed ? "OPERATIONALLY CLOSED" : "Receiving window", tone: closed ? amber : blue },
    { x: 1050, y: 300, label: "Receiving hub", detail: "Sort window" },
    { x: 1380, y: 390, label: "Boston", detail: "Customer commitment", icon: "box" },
  ]
  const paths = ["M150 380 Q255 250 410 285", "M410 285 Q575 255 730 350", "M730 350 Q880 245 1050 300", "M1050 300 Q1250 300 1380 390"]
  return <>
    <text x="75" y="105" fill={muted} fontSize="15" letterSpacing="4">{model ? "THE ENTERPRISE MODEL" : "ONE JOURNEY / MANY DEPENDENCIES"}</text>
    {beat >= 17 && <Promise beat={beat}/>}
    <ellipse cx="790" cy="370" rx="650" ry="185" fill="none" stroke="#536c85" strokeOpacity=".12"/>
    {paths.map((d,i)=><Link key={d} d={d} tone={closed && i===1 ? amber : blue} dashed={closed && i===1} animate={!closed || i!==1}/>) }
    {nodes.map((node,i)=><g key={node.label} opacity={beat === 15 && phase < i ? .08 : 1} className="v2-reveal">{node.icon === "plane" ? <><Jet at={{x:node.x,y:node.y}} pitch={0} scale={.75} ink={amber} cargo={1} mind={0}/><text x={node.x} y={node.y+61} textAnchor="middle" fill="#e0e9f1" fontSize="21">Our aircraft</text><text x={node.x} y={node.y+87} textAnchor="middle" fill={muted} fontSize="16">Shipment TK–BOS / 01</text></> : <Node {...node}/>}</g>)}
    {beat >= 16 && <>
      <Link d="M410 285 Q390 440 540 550" tone={green} animate={beat===16 || beat===21 || beat===25}/>
      <Link d="M1050 300 Q1030 470 900 550" tone={green} animate={beat===25}/>
      <Link d="M540 550 Q715 495 900 550" tone={green}/>
      <Node x={540} y={550} label="Dispatcher" detail="Judgment / authority" icon="person" tone={green}/>
      <Node x={900} y={550} label="Operations systems" detail="Current state / execution" tone={green}/>
    </>}
    {closed && <><Chip x={730} y={215} text="Technical health · healthy" tone={green}/><path d="M710 330L750 370M750 330L710 370" stroke={amber} strokeWidth="2"/></>}
    {(candidate || reroute) && <>
      <Link d="M410 285 Q710 50 1050 300" tone={candidate ? amber : green} dashed={candidate} animate={!candidate}/>
      <Chip x={750} y={145} text={candidate ? "Candidate · awaiting capacity" : "Alternative confirmed"} tone={candidate ? amber : green}/>
    </>}
    {beat === 20 && <g fill={amber} fontSize="17"><text x="480" y="235">Missed connection</text><text x="840" y="240">Changed sort window</text><text x="1220" y="285">Arrival at risk</text></g>}
    {model && <>
      <g fill={green} fontSize="17"><text x="240" y="265">carried by</text><text x="560" y="270">transfers through</text><text x="1190" y="320">due by</text></g>
      {beat >= 24 && <g><Chip x={400} y={170} text="FACT · capacity available"/><Chip x={740} y={170} text="PROMISE · arrival + handling" tone={green}/><Chip x={1080} y={170} text="AUTHORITY · scoped action" tone={amber}/></g>}
      {beat===25 && <><Chip x={460} y={460} text="Aircraft · current answer" tone={green}/><Chip x={1040} y={470} text="Hub · current answer" tone={green}/></>}
    </>}
    {beat===26 && <text x="800" y="460" textAnchor="middle" fill="#e8edf2" fontSize="58" letterSpacing="12" className="v2-title-reveal">THE MODEL</text>}
  </>
}

function Flight({ beat, phase }: Props) {
  const accepted = beat >= 38
  const executed = beat === 39 || (beat === 38 && phase >= 1)
  const measured = beat === 39 || (beat === 38 && phase >= 2)
  const proposed = beat >= 29
  return <>
    <text x="75" y="85" fill={muted} fontSize="15" letterSpacing="3">ONE AIRCRAFT / SHIPMENT TK–BOS / 01</text>
    <Promise beat={beat} phase={phase}/>
    <Satellite at={{x:260,y:190}} dim={.55}/><Satellite at={{x:1280,y:220}} dim={.55}/>
    <path d="M260 190L450 390M260 190L240 620M1280 220L1040 310M1280 220L1360 620" fill="none" stroke={blue} strokeOpacity=".14"/>
    {[0,1,2,3,4].map(i=><path key={i} d={`M70 ${280+i*62} Q450 ${220+i*62} 780 ${280+i*62} T1530 ${280+i*62}`} fill="none" stroke={amber} strokeOpacity=".16"/>)}
    <Link d="M100 440Q750 340 1490 440" tone={executed ? muted : blue}/>
    {proposed && <Link d="M450 390Q800 155 1420 390" tone={executed ? green : amber} dashed={!executed} animate={executed}/>}
    <Jet at={{x:450,y:390}} pitch={executed ? 8 : 0} scale={1.6} ink={amber} cargo={1} mind={.15}/>
    <Jet at={{x:1040,y:310}} pitch={0} scale={.8} ink={beat===28 ? amber : muted} cargo={0} mind={0}/>
    <Jet at={{x:1240,y:295}} pitch={0} scale={.6} ink={muted} cargo={0} mind={0} dim={.45}/>
    <text x="450" y="470" textAnchor="middle" fill="#e0e9f1" fontSize="23">Our aircraft · same shipment</text>
    <text x="450" y="500" textAnchor="middle" fill={executed ? green : blue} fontSize="18">{executed ? 'Route change reported by flight operations' : 'Flying the current approved route'}</text>
    <Dish at={{x:240,y:620}} dim={.7}/><Dish at={{x:1360,y:620}} dim={.7}/>
    <path d="M90 645H1510" stroke={muted} strokeOpacity=".2"/>
    <Node x={700} y={580} label="Dispatch agent" detail="Evaluate / request / submit" tone={green}/>
    <Node x={1080} y={580} label="Flight operations" detail="Authority / execution" icon="person" tone={green}/>
    <Link d="M700 580Q900 520 1080 580" tone={green} animate/>
    {beat===28 && <>
      <Chip x={680} y={230} text="Forecast · earlier"/>
      <Chip x={1040} y={230} text="Ride report · newer" tone={amber}/>
      <Link d="M1040 310Q930 435 700 580" tone={amber} animate/>
    </>}
    {beat===29 && <Chip x={850} y={210} text="Candidate · approval required" tone={amber}/>}
    {accepted && <>
      <Chip x={650} y={210} text="Amendment accepted" tone={green}/>
      <Chip x={890} y={210} text={executed ? "Execution reported" : "Awaiting execution"} tone={executed ? green : amber}/>
      <Chip x={1130} y={210} text={measured ? "Outcome evidence received" : "Awaiting measurements"} tone={measured ? green : amber}/>
      {measured && <Link d="M450 390Q570 510 700 580" tone={green} animate/>}
    </>}
  </>
}

function WholeSystem({ beat }: Props) {
  const labels = beat===40 ? ["Evidence", "Relationships", "Authorized action", "Observed outcome"] : ["Enterprise model", "Applications", "People + authority", "Operational evidence"]
  const points = [[430,280],[1100,280],[1100,520],[430,520]]
  return <>
    <text x="75" y="105" fill={muted} fontSize="15" letterSpacing="4">{beat===44 ? "A DECISION TO TAKE BACK TO YOUR TEAM" : "THE WHOLE DECISION PATH"}</text>
    <ellipse cx="780" cy="400" rx="540" ry="225" fill="none" stroke={blue} strokeOpacity=".1"/>
    <Node x={780} y={395} label={beat===43 ? "Coordinated operation" : "One business decision"} detail="Evidence / commitments / authority" tone={green} icon="box"/>
    {points.map(([x,y],i)=><g key={i}><Link d={`M780 395Q${x} 395 ${x} ${y}`} tone={i===2 ? amber : blue} animate/><Node x={x} y={y} label={labels[i]} tone={i===2 ? amber : blue} icon={i===2 ? "person" : "dot"}/></g>)}
    {beat===40 && <g fill={green} fontSize="17" letterSpacing="3"><text x="345" y="180">PERCEIVE</text><text x="1030" y="180">TRAVERSE</text><text x="340" y="650">VERIFY</text></g>}
    {beat===42 && <><Chip x={780} y={180} text="Delegate · intervene · suspend" tone={amber}/><Chip x={780} y={625} text="Exception → accountable person" tone={amber}/></>}
    {beat===43 && <><Chip x={780} y={180} text="Routine work within limits" tone={green}/><Chip x={780} y={625} text="Exception → human judgment" tone={amber}/></>}
    {beat===44 && <g fill={amber} fontSize="19"><text x="180" y="670">An answer is late.</text><text x="635" y="670">Permission is denied.</text><text x="1100" y="670">An acknowledgment is lost.</text></g>}
  </>
}

export function DecisionScene(props: Props) {
  const id=useId().replace(/:/g,"")
  return <svg className="v2-diagram" viewBox="0 0 1600 900" role="img" aria-label={`Illustrative decision scene ${props.beat}`}>
    <defs><radialGradient id={id}><stop stopColor="#203a50" stopOpacity=".6"/><stop offset="1" stopColor="#111923" stopOpacity="0"/></radialGradient></defs>
    <ellipse cx="800" cy="380" rx="790" ry="430" fill={`url(#${id})`}/>
    {props.beat===14 ? <>
      <text x="75" y="105" fill={muted} fontSize="15" letterSpacing="4">A REQUEST / A RESPONSE</text>
      <Node x={400} y={380} label="Agent" detail="Is the resource available?" tone={green}/>
      <Node x={1190} y={380} label="Source system" detail="Current, attributable answer"/>
      <Link d="M400 380Q800 90 1190 380" animate/>
      <Link d="M1190 380Q800 650 400 380" tone={green} animate/>
      <text x="800" y="210" textAnchor="middle" fill={blue} fontSize="22">Request</text><text x="800" y="565" textAnchor="middle" fill={green} fontSize="22">Answer + source + time</text>
    </> : props.beat<=26 ? <Enterprise {...props}/> : props.beat<=29 || props.beat===38 || props.beat===39 ? <Flight {...props}/> : props.beat<=37 || props.beat===40 ? <DecisionTopology {...props}/> : props.beat===41 ? <EcosystemTopology phase={props.phase}/> : <WholeSystem {...props}/>}
  </svg>
}
