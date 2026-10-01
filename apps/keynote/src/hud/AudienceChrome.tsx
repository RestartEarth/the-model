import { GAGE_ATTR, INSCRIPTIONS } from "../beats/script";
import {
  GAGE_RETURN_ATTR,
  GAGE_RETURN_KICKER,
  SIG_1037,
  SIG_SHORTCUT,
  SIG_SITUATION,
} from "../content/copy";
import type { Beat } from "../stage/types";

export function AudienceChrome({ beat }: { beat: Beat }) {
  const w = beat.world;

  if (w.showQuote) {
    const returned = w.verified;
    const onGage = returned || w.somaGage;
    return (
      <div className="audience center">
        {onGage && (
          <p className="audience-kicker">{returned ? GAGE_RETURN_KICKER : "Sun Microsystems"}</p>
        )}
        <p className="audience-quote">{beat.line}</p>
        {onGage && (
          <p className="audience-attr">{returned ? GAGE_RETURN_ATTR : GAGE_ATTR}</p>
        )}
      </div>
    );
  }

  if (w.showTitle) {
    return (
      <div className="audience center">
        <p className="audience-title">{beat.line === "THE MODEL" || w.showTitle ? "THE MODEL" : beat.line}</p>
        {w.showSubtitle && <p className="audience-sub">The Network Is the Computer</p>}
      </div>
    );
  }

  if (w.showInscriptions && beat.id === "inscriptions") {
    return (
      <div className="audience">
        <div className="inscriptions">
          {INSCRIPTIONS.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  if (w.crossOutShortcut) {
    return (
      <div className="audience center">
        <p className="audience-kicker">The dangerous shortcut</p>
        <p className="audience-signature audience-strike">{SIG_SHORTCUT}</p>
        {beat.line !== SIG_SHORTCUT && (
          <p className="audience-signature">{beat.line}</p>
        )}
      </div>
    );
  }

  if (w.showSignature && beat.line) {
    return (
      <div className="audience">
        {beat.line === SIG_1037 && (
          <p className="audience-kicker">{SIG_SITUATION}</p>
        )}
        <p className="audience-signature">{beat.line}</p>
      </div>
    );
  }

  if (!beat.line) return null;

  return (
    <div className="audience">
      <p className="audience-line">{beat.line}</p>
    </div>
  );
}
