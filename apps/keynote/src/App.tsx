import { Fabric } from "./world/Fabric";
import { AudienceChrome } from "./hud/AudienceChrome";
import { useStage, useStageInput } from "./stage/input";

export default function App() {
  const snap = useStage();
  useStageInput();

  return (
    <main className="stage">
      <Fabric world={snap.beat.world} />
      <AudienceChrome beat={snap.beat} />
    </main>
  );
}
