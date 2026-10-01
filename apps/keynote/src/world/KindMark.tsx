import type { CSSProperties } from "react";
import type { NodeKind } from "../graph/types";

/** Tiny geometric marks — UNI uses small glyphs, not 3D spheres. */
export function KindMark({ kind }: { kind: NodeKind }) {
  const s: CSSProperties = { fill: "none", stroke: "currentColor", strokeWidth: 1.2 };
  switch (kind) {
    case "gpu":
      return (
        <g transform="translate(5 5)">
          <rect x="0" y="0" width="4" height="4" rx="0.6" fill="currentColor" />
          <rect x="7" y="0" width="4" height="4" rx="0.6" fill="currentColor" />
          <rect x="0" y="7" width="4" height="4" rx="0.6" fill="currentColor" />
          <rect x="7" y="7" width="4" height="4" rx="0.6" fill="currentColor" />
        </g>
      );
    case "storage":
      return (
        <g transform="translate(5 6)">
          <rect x="0" y="0" width="12" height="3" rx="0.8" fill="currentColor" />
          <rect x="0" y="5" width="12" height="3" rx="0.8" fill="currentColor" />
          <rect x="0" y="10" width="12" height="3" rx="0.8" fill="currentColor" />
        </g>
      );
    case "network":
      return (
        <g transform="translate(5 5)">
          <path d="M6 1 L11 6 L6 11 L1 6 Z" style={s} />
        </g>
      );
    case "security":
      return (
        <g transform="translate(5 4)">
          <path d="M6 1 L11 3.5 V7.5 C11 10 8.5 12 6 13 C3.5 12 1 10 1 7.5 V3.5 Z" style={s} />
        </g>
      );
    case "cloud":
      return (
        <g transform="translate(4 7)">
          <circle cx="3" cy="5" r="2.2" fill="currentColor" />
          <circle cx="8" cy="3.5" r="2.6" fill="currentColor" />
          <circle cx="12.5" cy="5.2" r="2.1" fill="currentColor" />
        </g>
      );
    case "user":
      return (
        <g transform="translate(6 4)">
          <circle cx="5" cy="3.2" r="2.4" fill="currentColor" />
          <path d="M1 13 C1 9.8 3.2 8 5 8 C6.8 8 9 9.8 9 13" fill="currentColor" />
        </g>
      );
    case "app":
      return (
        <g transform="translate(6 6)">
          <rect x="0" y="0" width="10" height="10" rx="2" style={s} />
        </g>
      );
    case "identity":
      return (
        <g transform="translate(5 5)">
          <circle cx="6" cy="6" r="5" style={s} />
          <circle cx="6" cy="6" r="1.6" fill="currentColor" />
        </g>
      );
    case "device":
      return (
        <g transform="translate(5 4)">
          <rect x="1" y="0" width="10" height="12" rx="1.6" style={s} />
          <rect x="4" y="9" width="4" height="1.2" fill="currentColor" />
        </g>
      );
    case "agent":
      return (
        <g transform="translate(5 5)">
          <path d="M6 1 L11 6 L6 11 L1 6 Z" fill="currentColor" />
        </g>
      );
    default:
      return (
        <g transform="translate(6 6)">
          <rect x="0" y="0" width="10" height="10" rx="1.4" fill="currentColor" />
        </g>
      );
  }
}
