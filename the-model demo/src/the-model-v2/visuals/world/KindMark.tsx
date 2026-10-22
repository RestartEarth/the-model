import type { CSSProperties } from "react"
import type { NodeKind } from "../graph/types"

/** Tiny geometric marks — UNI uses small glyphs, not 3D spheres. */
export function KindMark({ kind }: { kind: NodeKind }) {
  const s: CSSProperties = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
  }
  switch (kind) {
    case "gpu":
      return (
        <g transform="translate(5 5)">
          <rect x="0" y="0" width="4" height="4" rx="0.6" fill="currentColor" />
          <rect x="7" y="0" width="4" height="4" rx="0.6" fill="currentColor" />
          <rect x="0" y="7" width="4" height="4" rx="0.6" fill="currentColor" />
          <rect x="7" y="7" width="4" height="4" rx="0.6" fill="currentColor" />
        </g>
      )
    case "storage":
      return (
        <g transform="translate(5 6)">
          <rect
            x="0"
            y="0"
            width="12"
            height="3"
            rx="0.8"
            fill="currentColor"
          />
          <rect
            x="0"
            y="5"
            width="12"
            height="3"
            rx="0.8"
            fill="currentColor"
          />
          <rect
            x="0"
            y="10"
            width="12"
            height="3"
            rx="0.8"
            fill="currentColor"
          />
        </g>
      )
    case "network":
      return (
        <g transform="translate(5 5)">
          <path d="M6 1 L11 6 L6 11 L1 6 Z" style={s} />
        </g>
      )
    case "security":
      return (
        <g transform="translate(5 4)">
          <path
            d="M6 1 L11 3.5 V7.5 C11 10 8.5 12 6 13 C3.5 12 1 10 1 7.5 V3.5 Z"
            style={s}
          />
        </g>
      )
    case "cloud":
      return (
        <g transform="translate(4 7)">
          <circle cx="3" cy="5" r="2.2" fill="currentColor" />
          <circle cx="8" cy="3.5" r="2.6" fill="currentColor" />
          <circle cx="12.5" cy="5.2" r="2.1" fill="currentColor" />
        </g>
      )
    case "user":
      return (
        <g transform="translate(6 4)">
          <circle cx="5" cy="3.2" r="2.4" fill="currentColor" />
          <path
            d="M1 13 C1 9.8 3.2 8 5 8 C6.8 8 9 9.8 9 13"
            fill="currentColor"
          />
        </g>
      )
    case "app":
      return (
        <g transform="translate(6 6)">
          <rect x="0" y="0" width="10" height="10" rx="2" style={s} />
        </g>
      )
    case "identity":
      return (
        <g transform="translate(5 5)">
          <circle cx="6" cy="6" r="5" style={s} />
          <circle cx="6" cy="6" r="1.6" fill="currentColor" />
        </g>
      )
    case "device":
      return (
        <g transform="translate(5 4)">
          <rect x="1" y="0" width="10" height="12" rx="1.6" style={s} />
          <rect x="4" y="9" width="4" height="1.2" fill="currentColor" />
        </g>
      )
    case "agent":
      return (
        <g transform="translate(5 5)">
          <path d="M6 1 L11 6 L6 11 L1 6 Z" fill="currentColor" />
        </g>
      )
    /**
     * Logistics kinds. Kept to the same weight and 12px box as every other
     * mark so an aircraft is visibly just another node on the fabric — a
     * heavier or more illustrative glyph would make the physical world read
     * as a different diagram, which is exactly the opposite of the point.
     */
    case "aircraft":
      return (
        <g transform="translate(5 5)">
          <path d="M6 0.6 L7.1 5 L11.4 6.6 L7.1 6.6 L6.7 10 L5.3 10 L4.9 6.6 L0.6 6.6 L4.9 5 Z" fill="currentColor" />
        </g>
      )
    case "truck":
      return (
        <g transform="translate(4 7)">
          <rect x="0.4" y="0.4" width="7" height="5" rx="0.8" style={s} />
          <path d="M7.4 1.9 H10 L11.6 3.4 V5.4 H7.4 Z" style={s} />
          <circle cx="3" cy="6.6" r="1.1" fill="currentColor" />
          <circle cx="9.4" cy="6.6" r="1.1" fill="currentColor" />
        </g>
      )
    case "hub":
      return (
        <g transform="translate(5 5)">
          <circle cx="6" cy="6" r="2" fill="currentColor" />
          <path d="M6 6 L6 0.8 M6 6 L10.7 3.4 M6 6 L10.7 8.6 M6 6 L6 11.2 M6 6 L1.3 8.6 M6 6 L1.3 3.4" style={s} />
        </g>
      )
    case "warehouse":
      return (
        <g transform="translate(5 6)">
          <path d="M0.6 4 L6 0.8 L11.4 4 V10 H0.6 Z" style={s} />
          <rect x="4.2" y="6.2" width="3.6" height="3.8" fill="currentColor" />
        </g>
      )
    case "robot":
      return (
        <g transform="translate(5 5)">
          <rect x="2" y="3.4" width="8" height="6.6" rx="1.2" style={s} />
          <circle cx="4.6" cy="6.6" r="0.9" fill="currentColor" />
          <circle cx="7.4" cy="6.6" r="0.9" fill="currentColor" />
          <path d="M6 3.4 V1.2" style={s} />
          <circle cx="6" cy="0.8" r="0.9" fill="currentColor" />
        </g>
      )
    /** Concentric arcs — a thing that listens, not a thing that computes. */
    case "sensor":
      return (
        <g transform="translate(5 5)">
          <circle cx="6" cy="9.6" r="1.2" fill="currentColor" />
          <path d="M3.2 8.4 A3.6 3.6 0 0 1 8.8 8.4" style={s} />
          <path d="M1.2 6.4 A6.4 6.4 0 0 1 10.8 6.4" style={s} />
        </g>
      )
    /** Layered weights — deliberately the neural-network glyph, so the trained
     *  model visually quotes `soma-neural` when it appears in the enterprise. */
    case "model":
      return (
        <g transform="translate(4 5)">
          <path d="M1.4 2 L6 6 L1.4 10 M6 6 L11 2 M6 6 L11 10" style={s} />
          <circle cx="1.4" cy="2" r="1.1" fill="currentColor" />
          <circle cx="1.4" cy="10" r="1.1" fill="currentColor" />
          <circle cx="6" cy="6" r="1.2" fill="currentColor" />
          <circle cx="11" cy="2" r="1.1" fill="currentColor" />
          <circle cx="11" cy="10" r="1.1" fill="currentColor" />
        </g>
      )
    default:
      return (
        <g transform="translate(6 6)">
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            rx="1.4"
            fill="currentColor"
          />
        </g>
      )
  }
}
