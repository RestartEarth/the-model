import { useEffect, useState } from "react";
import { color, type } from "../design/tokens";
import { askContracts, MORNING_QUERY } from "../graph/contracts";
import { nodeById } from "../graph/meridian";

const STEP_MS = 700;

export function Federation({ hold, reduced }: { hold: boolean; reduced: boolean }) {
  const answers = askContracts(MORNING_QUERY);
  const [revealed, setRevealed] = useState(hold || reduced ? answers.length : 0);

  useEffect(() => {
    if (hold || reduced) {
      setRevealed(answers.length);
      return;
    }
    setRevealed(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= answers.length) window.clearInterval(id);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [hold, reduced, answers.length]);

  return (
    <g className="federation">
      <text
        x={800}
        y={36}
        textAnchor="middle"
        fill={color.typeMuted}
        fontFamily={type.family}
        fontSize={11}
        letterSpacing="0.12em"
      >
        MCP ASK  ·  {MORNING_QUERY}
      </text>
      {answers.map((a, i) => {
        const on = i < revealed;
        const n = nodeById(a.nodeId);
        const ink = on ? color.focus : color.typeDim;
        return (
          <g key={a.domain} opacity={on ? 1 : 0.28}>
            {n && on && (
              <line
                x1={a.x + 36}
                y1={a.y + 20}
                x2={n.x}
                y2={n.y}
                stroke={color.focus}
                strokeWidth={0.8}
                strokeDasharray="2 6"
                opacity={0.45}
              />
            )}
            <rect
              x={a.x}
              y={a.y}
              width={72}
              height={18}
              rx={9}
              fill={color.rail}
              stroke={ink}
              strokeWidth={1}
            />
            <text
              x={a.x + 36}
              y={a.y + 13}
              textAnchor="middle"
              fill={ink}
              fontFamily={type.family}
              fontSize={9}
              letterSpacing="0.1em"
            >
              {a.label.toUpperCase()}
            </text>
            {on && (
              <text
                x={a.x}
                y={a.y + 34}
                fill={color.type}
                fontFamily={type.family}
                fontSize={9}
              >
                {a.answer}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
