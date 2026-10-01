import type { WorldState } from "../stage/types"
import { GageStill } from "./GageStill"
import { GraphView } from "./GraphView"
import { PacketLife } from "./PacketLife"
import { Soma } from "./Soma"
import { Starfield } from "./Starfield"

/**
 * Picks the one world a beat is in. `somaGage` wins over `shot` because the
 * Gage still fades in on top of a soma beat that is still holding its own
 * visual underneath — that overlap is the hinge of the show, not a cut.
 */
export function Fabric({ world }: { world: WorldState }) {
  const gage = world.somaGage || world.shot === "gage"
  const soma = world.shot === "soma" && !gage
  const packet = world.shot === "packet"
  const titleVoid = world.shot === "title"
  const fabric = !soma && !gage && !titleVoid && !packet

  return (
    <>
      <Starfield clearFace={gage && !world.showTitle} />
      {fabric && <GraphView world={world} />}
      {soma && <Soma world={world} />}
      {packet && <PacketLife world={world} />}
      {gage && <GageStill world={world} />}
      <div className="stage-vignette" />
      {world.fadeToBlack && <div className="stage-blackout" />}
    </>
  )
}
