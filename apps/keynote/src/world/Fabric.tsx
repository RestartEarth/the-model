import type { WorldState } from "../stage/types";
import { GageStill } from "./GageStill";
import { GraphView } from "./GraphView";
import { PacketLife } from "./PacketLife";
import { Soma } from "./Soma";
import { Starfield } from "./Starfield";

export function Fabric({ world }: { world: WorldState }) {
  const soma = world.shot === "soma";
  const packet = world.shot === "packet";
  const period = world.shot === "period";
  const gage = world.somaGage;
  const titleVoid = world.shot === "title";
  const modern = !soma && !gage && !period && !titleVoid && !packet;
  const portrait = (gage || period) && world.periodTech < 2 && !world.showTitle;

  return (
    <>
      <Starfield clearFace={portrait} />
      {modern && <GraphView world={world} />}
      {soma && !gage && <Soma world={world} />}
      {packet && <PacketLife world={world} />}
      {(gage || period) && <GageStill world={world} />}
      <div className="stage-vignette" />
    </>
  );
}
