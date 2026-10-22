import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import script from "./script.json"
import { BEATS } from "../the-model/beats/script"
import "./v2.css"

function Compare() {
  const [index,setIndex]=useState(0)
  const [ready,setReady]=useState(false)
  const [sourceId,setSourceId]=useState("open")
  const v1=useRef<HTMLIFrameElement>(null),v2=useRef<HTMLIFrameElement>(null)
  const beat=script[index]
  const ids=beat.source.split(/[,;]/).map(x=>x.trim()).filter(x=>BEATS.some(b=>b.id===x))
  function showOriginal(id:string) {
    const target=BEATS.findIndex(b=>b.id===id),w=v1.current?.contentWindow
    if(target<0||!w)return
    w.dispatchEvent(new KeyboardEvent("keydown",{key:"Home",bubbles:true}))
    for(let i=0;i<target;i++)w.dispatchEvent(new KeyboardEvent("keydown",{key:"]",bubbles:true}))
    setSourceId(id)
  }
  function go(n:number){const next=Math.max(0,Math.min(script.length-1,n));setIndex(next);v2.current?.contentWindow?.postMessage({type:"model-v2-go",index:next},location.origin)}
  useEffect(()=>{if(ready && ids.length)showOriginal(ids[0])},[index,ready]) // Source references intentionally follow the selected v2 beat.
  useEffect(()=>{
    function message(e:MessageEvent){if(e.origin===location.origin && e.source===v2.current?.contentWindow && e.data?.type==="model-v2-beat" && Number.isInteger(e.data.index) && e.data.index>=0 && e.data.index<script.length)setIndex(e.data.index)}
    window.addEventListener("message",message);return()=>window.removeEventListener("message",message)
  },[])
  useEffect(()=>{
    function key(e:KeyboardEvent){if(e.target instanceof HTMLElement && ["SELECT","INPUT","BUTTON"].includes(e.target.tagName))return;if(e.key==="ArrowRight"){e.preventDefault();go(index+1)}else if(e.key==="ArrowLeft"){e.preventDefault();go(index-1)}}
    window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)
  },[index])
  return <div className="compare-app">
    <header className="compare-header"><div><h1>THE MODEL <span style={{color:"#83cbb1"}}> / Compare</span></h1><p>V2 is a separate editorial build. Original source beats are mapped for review.</p></div>
      <div className="compare-controls"><button onClick={()=>go(index-1)} disabled={!index} aria-label="Previous comparison">←</button><select aria-label="Compare beat" value={index} onChange={e=>go(Number(e.target.value))}>{script.map((b,i)=><option key={b.id} value={i}>{b.number}. {b.title}</option>)}</select><button onClick={()=>go(index+1)} disabled={index===script.length-1} aria-label="Next comparison">→</button></div>
    </header>
    <div className="compare-grid">
      <section className="compare-panel"><header><span>VERSION 1 · CURRENT</span><a href="the-model.html" target="_blank" rel="noreferrer">Open full size ↗</a></header><iframe ref={v1} title="Version 1 current presentation" src="the-model.html" onLoad={()=>setReady(true)}/><div className="compare-reference"><span>Source scenes:</span>{ids.length ? ids.map(id=><button className={sourceId===id?"active":""} key={id} onClick={()=>showOriginal(id)}>{id}</button>) : <span>New scene — no direct V1 equivalent</span>}</div></section>
      <section className="compare-panel"><header><span>VERSION 2 · PROPOSED</span><a href={`the-model-v2.html?beat=${index+1}`} target="_blank" rel="noreferrer">Open full size ↗</a></header><iframe ref={v2} title="Version 2 proposed presentation" src="the-model-v2.html?embed=1"/><div className="compare-reference">{beat.number} / {script.length} · {beat.title}</div></section>
    </div>
    <div className="compare-copy"><section><span className="v2-eyebrow">PROPOSED NARRATION</span><h2>{beat.line || "Silent frame"}</h2><p>{beat.narration}</p></section><section><span className="v2-eyebrow">VISUAL CHANGE / EDITORIAL INTENT</span><p>{beat.visualChange}</p><p style={{fontSize:12}}>Source mapping: {beat.source}. When multiple original scenes map to one V2 beat, use the source-scene buttons above to inspect each.</p></section></div>
  </div>
}
const root = createRoot(document.getElementById("root")!)
root.render(<Compare/> )
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount())
