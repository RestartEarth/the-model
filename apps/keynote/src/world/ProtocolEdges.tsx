import { color, type } from "../design/tokens";
import { A2A_HOPS, MCP_HOPS, nodeById } from "../graph/meridian";

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function ProtocolEdges({
  mode,
  verified,
  reduced,
  sessionBreak,
}: {
  mode: "mcp" | "a2a" | "both";
  verified: boolean;
  reduced: boolean;
  sessionBreak: boolean;
}) {
  const showMcp = mode === "mcp" || mode === "both";
  const showA2a = mode === "a2a" || mode === "both";
  const mcpInk = verified ? color.healthy : color.mcp;
  const a2aInk = verified ? color.healthy : color.a2a;

  return (
    <g className="protocol-edges">
      {showMcp &&
        MCP_HOPS.map((h) => {
          const a = nodeById(h.source);
          const b = nodeById(h.target);
          if (!a || !b) return null;
          const c = mid(a, b);
          const dead = sessionBreak && h.dies;
          const ink = dead ? color.incident : mcpInk;
          return (
            <g key={`mcp-${h.source}-${h.target}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={ink}
                strokeWidth={1.35}
                strokeDasharray="4 7"
                strokeLinecap="round"
                opacity={dead ? 0.45 : 0.8}
                className={reduced || dead ? undefined : "mcp-flow"}
              />
              <text
                x={c.x}
                y={c.y - 6}
                textAnchor="middle"
                fill={ink}
                fontFamily={type.family}
                fontSize={8}
                letterSpacing="0.12em"
              >
                {dead ? `${h.label}  TIMEOUT` : h.label}
              </text>
            </g>
          );
        })}
      {showA2a &&
        A2A_HOPS.map((h) => {
          const a = nodeById(h.source);
          const b = nodeById(h.target);
          if (!a || !b) return null;
          const c = mid(a, b);
          return (
            <g key={`a2a-${h.source}-${h.target}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={a2aInk}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.85}
                className={reduced ? undefined : "a2a-flow"}
              />
              <text
                x={c.x}
                y={c.y - 7}
                textAnchor="middle"
                fill={a2aInk}
                fontFamily={type.family}
                fontSize={8}
                letterSpacing="0.12em"
              >
                {h.label}
              </text>
            </g>
          );
        })}
    </g>
  );
}
