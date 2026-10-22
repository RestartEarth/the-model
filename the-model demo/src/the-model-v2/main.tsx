import { useCallback, useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import script from "./script.json"
import { Fabric } from "./visuals/world/Fabric"
import { DecisionScene } from "./DecisionScene"
import { movementFor, movements, sceneFor } from "./scenes"
import "./visuals/stage.css"
import "./v2.css"

function initialBeat() {
  const value = Number(new URLSearchParams(location.search).get("beat") || 1)
  return Math.max(0, Math.min(script.length-1, Number.isFinite(value) ? Math.floor(value)-1 : 0))
}

function App() {
  const audience = new URLSearchParams(location.search).get("view") === "audience"
  const [presenter,setPresenter]=useState(new URLSearchParams(location.search).get("view") === "presenter")
  const audienceWindow=useRef<Window|null>(null)
  const [connected,setConnected]=useState(false)
  const [notice,setNotice]=useState("")
  const [blank,setBlank]=useState(false)
  const [fontSize,setFontSize]=useState(24)
  const [started,setStarted]=useState<number|null>(null)
  const [elapsed,setElapsed]=useState(0)
  const lastSeen=useRef(0)
  const current=useRef({index:0,blank:false})
  const notesPanel=useRef<HTMLDivElement>(null)

  const [index,setIndex]=useState(initialBeat)
  const [notes,setNotes]=useState(false)
  const [controls,setControls]=useState(new URLSearchParams(location.search).get("embed") !== "1" && !audience)
  const [scale,setScale]=useState(1)
  const host=useRef<HTMLDivElement>(null)
  const beat=script[index], number=index+1, scene=beat.scene
  const go=useCallback((n:number)=>{setIndex(Math.max(0,Math.min(script.length-1,n)))},[])

  current.current={index,blank}
  const openAudience=()=>{
    const url=new URL(location.href)
    url.searchParams.set("view","audience");url.searchParams.delete("embed")
    const opened=window.open(url.href,"model-v2-audience","popup=yes,width=1280,height=720,resizable=yes,scrollbars=no")
    opened?.focus()
    audienceWindow.current=opened
    setNotice(opened ? "Move the audience window to your external display, then press F there. Return here and click this window before using the clicker." : "The browser blocked the audience window. Allow pop-ups for this site, then try again.")
  }
  useEffect(()=>{
    if(!presenter && !audience)return
    const send=()=>audienceWindow.current?.postMessage({type:"model-v2-state",...current.current},location.origin)
    const receive=(e:MessageEvent)=>{
      if(e.origin!==location.origin)return
      if(audience && window.opener && e.source===window.opener && e.data?.type==="model-v2-state" && Number.isInteger(e.data.index)){
        go(e.data.index);setBlank(Boolean(e.data.blank));lastSeen.current=Date.now();setConnected(true)
      }
      if(presenter && e.source===audienceWindow.current){
        if(e.data?.type==="model-v2-ready"){lastSeen.current=Date.now();setConnected(true);send()}
        if(e.data?.type==="model-v2-command"){
          if(e.data.command==="next")go(current.current.index+1)
          if(e.data.command==="previous")go(current.current.index-1)
          if(e.data.command==="blank")setBlank(b=>!b)
          if(e.data.command==="home")go(0)
        }
      }
    }
    window.addEventListener("message",receive)
    const pulse=()=>{
      if(audience)window.opener?.postMessage({type:"model-v2-ready"},location.origin)
      else send()
      if(Date.now()-lastSeen.current>3500)setConnected(false)
    }
    pulse();const timer=window.setInterval(pulse,1000)
    return()=>{window.removeEventListener("message",receive);clearInterval(timer)}
  },[audience,presenter,go])
  useEffect(()=>{
    if(presenter)audienceWindow.current?.postMessage({type:"model-v2-state",index,blank},location.origin)
    notesPanel.current?.scrollTo(0,0)
  },[index,blank,presenter])
  useEffect(()=>{
    if(started===null)return
    const tick=()=>setElapsed(Math.floor((Date.now()-started)/1000))
    tick();const timer=window.setInterval(tick,1000);return()=>clearInterval(timer)
  },[started])
  const command=(action:"next"|"previous"|"blank"|"home")=>{
    if(audience){window.opener?.postMessage({type:"model-v2-command",command:action},location.origin);return}
    if(action==="next")go(index+1)
    if(action==="previous")go(index-1)
    if(action==="home")go(0)
    if(action==="blank")setBlank(b=>!b)
  }
  useEffect(()=>{
    const element=host.current!
    const observer=new ResizeObserver(()=>setScale(Math.min(element.clientWidth/1600,element.clientHeight/900)))
    observer.observe(element);return()=>observer.disconnect()
  },[])
  useEffect(()=>{
    const url=new URL(location.href);url.searchParams.set("beat",String(number));history.replaceState(null,"",url)
    window.parent.postMessage({type:"model-v2-beat",index,number},location.origin)
  },[index,number])
  useEffect(()=>{
    function key(e:KeyboardEvent) {
      if(e.metaKey||e.ctrlKey||e.altKey || (e.target instanceof HTMLElement && ["INPUT","SELECT","TEXTAREA"].includes(e.target.tagName)))return
      if(e.repeat || (e.target instanceof HTMLButtonElement && [" ","Enter"].includes(e.key)))return
      if(["ArrowRight"," ","Enter","PageDown","]"].includes(e.key)){e.preventDefault();command("next")}
      else if(["ArrowLeft","PageUp","["].includes(e.key)){e.preventDefault();command("previous")}
      else if(e.key==="Home"){e.preventDefault();command("home")}
      else if(e.key.toLowerCase()==="b" || e.key==="."){e.preventDefault();command("blank")}
      else if(audience && e.key.toLowerCase()!=="f")return
      else if(e.key.toLowerCase()==="n" && !presenter)setNotes(n=>!n)
      else if(e.key.toLowerCase()==="h" && !presenter){setControls(c=>!c);setNotes(false)}
      else if(e.key.toLowerCase()==="f"){
        if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen()
      }
      else if(/^[1-5]$/.test(e.key))go(movements[Number(e.key)-1].start-1)
    }
    function message(e:MessageEvent){if(e.origin===location.origin && e.source===window.parent && e.data?.type==="model-v2-go" && Number.isInteger(e.data.index))go(e.data.index)}
    window.addEventListener("keydown",key);window.addEventListener("message",message)
    return()=>{window.removeEventListener("keydown",key);window.removeEventListener("message",message)}
  },[index,go,audience,presenter])

  const photograph=beat.legacyScene==="gage"
  const close=scene>=46
  const legacy=Boolean(beat.legacyScene)
  const line=beat.line
  return <div className={`v2-app ${presenter ? "v2-presenter" : ""} ${audience ? "v2-audience" : ""} ${controls ? "with-controls" : ""} ${notes ? "with-notes" : ""}`}>
    {(controls || presenter) && !audience && <header className="v2-toolbar">
      <a className="v2-wordmark" href="the-model-v2.html">THE MODEL <span>{presenter ? "V2 · PRESENTER" : "V2 · REVIEW"}</span></a>
      <nav aria-label="Movements">{movements.map(m=><button key={m.start} className={movementFor(number)===m ? "active" : ""} onClick={()=>go(m.start-1)}>{m.title}</button>)}</nav>
      <a href="compare.html" target="_blank" rel="noreferrer">Compare V1 ↗</a>
      <button onClick={()=>{setPresenter(true);setControls(true);setNotes(false);const url=new URL(location.href);url.searchParams.set("view","presenter");history.replaceState(null,"",url)}}>Presenter view</button>
      {!presenter && <button onClick={()=>{setControls(false);setNotes(false)}} title="H to restore controls">Present</button>}
      {presenter && <button onClick={openAudience}>Open audience window ↗</button>}
    </header>}
    {presenter && <div className="v2-presenter-status"><span className={connected ? "connected" : ""}>{connected ? "Audience connected" : "Audience disconnected — open or reconnect the audience window"}</span><span>Elapsed {String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}</span><button onClick={()=>{setStarted(Date.now());setElapsed(0)}}>{started===null ? "Start timer" : "Reset timer"}</button><button aria-pressed={blank} onClick={()=>command("blank")}>{blank ? "Resume audience" : "Black out audience (B)"}</button></div>}
    {presenter && notice && <div className="v2-setup">{notice}</div>}
    <div className="v2-performance-body">
    <div className="v2-stage-host" ref={host} onClick={()=>command("next")} title="Click to advance">
      {blank && <div className="v2-blackout" aria-label="Audience blacked out"/>}
      <main className="v2-canvas the-model-stage" style={{transform:`translate(-50%,-50%) scale(${scale})`}} data-beat={beat.id} data-scene={scene} data-phase={beat.phase} aria-label={`Beat ${number}: ${beat.title}`}>
        <div className="v2-scene">
          {legacy ? <Fabric world={sceneFor(beat.legacyScene)}/> : !close && <DecisionScene beat={scene} phase={beat.phase}/>}
        </div>
        {scene>=15 && scene<=44 && <div className="v2-illustrative">ILLUSTRATIVE SCENARIO</div>}
        {!!line && <div className={`v2-caption ${photograph ? "quote" : ""} ${close ? "closing" : ""}`} key={beat.id}>
          <p>{line}</p>
          {photograph && <small>John Gage · 1984</small>}
        </div>}
        {photograph && <div className="v2-credit">Photograph: Joi Ito · 2008 · CC BY 2.0</div>}
      </main>
    </div>
    {presenter && <aside className="v2-presenter-notes" ref={notesPanel}>
      <div className="v2-note-heading"><span className="v2-eyebrow">SPEAKER NOTES · {number} / {script.length}</span><div><button aria-label="Smaller notes" onClick={()=>setFontSize(n=>Math.max(18,n-2))}>A−</button> <button aria-label="Larger notes" onClick={()=>setFontSize(n=>Math.min(40,n+2))}>A+</button></div></div>
      <h1>{beat.title}</h1><p className="v2-narration" style={{fontSize}}>{beat.narration}</p>
      <div className="v2-next-cue"><span className="v2-eyebrow">{index===script.length-1 ? "END OF PRESENTATION" : "NEXT CLICK"}</span><h2>{script[index+1]?.title || "Hold the final screen"}</h2><p>{script[index+1]?.narration}</p></div>
    </aside>}
    </div>
    {(controls || presenter) && !audience && <footer className="v2-footer">
      <button onClick={()=>command("previous")} disabled={index===0} aria-label="Previous beat">←</button>
      <select aria-label="Choose beat" value={index} onChange={e=>{go(Number(e.target.value));e.target.blur()}}>{script.map((b,i)=><option key={b.id} value={i}>{String(b.number).padStart(2,"0")} / {b.title}</option>)}</select>
      <button onClick={()=>command("next")} disabled={index===script.length-1} aria-label="Next beat">→</button>
      <span className="v2-count">{number} / {script.length}</span>
      <span className="v2-count">Click to advance</span>
      {!presenter && <button aria-pressed={notes} onClick={()=>setNotes(n=>!n)}>Speaker notes</button>}
      <span className="v2-keys">Click / Space / → next · ← back · B blackout · F fullscreen</span>
    </footer>}
    {notes && !audience && !presenter && <aside className="v2-notes"><div><span className="v2-eyebrow">NARRATION</span><p>{beat.narration}</p></div><div><span className="v2-eyebrow">REVIEW / VISUAL CHANGE</span><p>{beat.visualChange}</p><small>V1 reference: {beat.source}</small></div><button onClick={()=>setNotes(false)} aria-label="Close speaker notes">×</button></aside>}
  </div>
}

const root = createRoot(document.getElementById("root")!)
root.render(<App/> )
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount())
