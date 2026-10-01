/**
 * Design tokens for THE MODEL.
 *
 * Color, type, and graph language are extracted from the Unified Network
 * Intelligence blast-radius prototype screenshot (near-black navy field,
 * starfield, dashed cluster rings, rounded-rect nodes, color-as-meaning).
 * UNI product source was not on disk; values were sampled from the screenshot
 * and the stated visual DNA. Motion is vendored from Metaism tokens.ts.
 *
 * Audience canvas stays cinema. These tokens must still rhyme with UNI so the
 * two can share a family later without merging apps now.
 */

import { motion as metaismMotion } from "../vendor/metaism/tokens.motion"

export const motion = metaismMotion

/** Sampled from UNI screenshot + stated DNA. */
export const color = {
  /** Field sampled at (25, 29, 38). */
  field: "#191D26",
  fieldDeep: "#12151C",
  /** Inspector rail sampled at (31, 35, 44). */
  rail: "#1F232C",
  railBorder: "#2A3140",
  star: "rgba(241, 245, 254, 0.22)",
  /** Primary type sampled near (241, 245, 254). */
  type: "#F1F5FE",
  /** Secondary / geo labels — muted blue-gray. */
  typeMuted: "#8B97A8",
  typeDim: "#5C6778",
  /** Thin edges. The computer lives here. */
  /** Lifted from #3A4456: the enterprise graph is read as relationships, not nodes. */
  edge: "#4C5A72",
  edgeActive: "#8B9FC2",
  ring: "#4A5568",
  /** Teal-green = healthy. Screenshot greens were crushed; DNA specified teal. */
  healthy: "#3ECF8E",
  healthyFill: "rgba(62, 207, 142, 0.14)",
  /** Red = incident / blast radius. Bright reds sampled near (232, 48, 56). */
  incident: "#E24B5A",
  incidentFill: "rgba(226, 75, 90, 0.16)",
  /**
   * Amber = at risk, not broken. The logistics disruption beat is weather
   * closing a hub — nobody's fault, nothing failed — so it deliberately does
   * not get incident red. Red stays reserved for a commitment actually missed.
   */
  warn: "#E8A04A",
  warnFill: "rgba(232, 160, 74, 0.16)",
  blast: "rgba(226, 75, 90, 0.20)",
  /** Cyan-blue = selection / focus. */
  focus: "#5BA8FF",
  focusFill: "rgba(91, 168, 255, 0.16)",
  /** Training / hot fabric — still in the teal family. */
  edgeHot: "#7EE0B0",
  lightning: "#D7ECFF",
  /** MCP = agent→domain (cyan family). A2A = agent↔agent (white). */
  mcp: "#5BA8FF",
  a2a: "#F1F5FE",
  /**
   * Prelude soma — same navy field, different framework.
   * Warm gold nerves vs UNI teal fabric. The computer still lives in the edges.
   */
  somaNerve: "#E8B86A",
  somaNerveFill: "rgba(232, 184, 106, 0.16)",
  /** Nerve sparks — electric cyan-white, thin, not gold. */
  somaSpark: "#D4E8F8",
  somaBlood: "#C45C58",
  somaBloodFill: "rgba(196, 92, 88, 0.14)",
  somaOrgan: "#D4A574",
  somaBody: "rgba(232, 184, 106, 0.22)",
  somaBone: "#8A7D6A",
  /** Offset filament layer — muscle, not a second skeleton. */
  somaMuscle: "#A89078",
  somaHormone: "#E0C48A",
  /** Radiant heat — red-orange, distinct from gold hormones/nerves. */
  somaThermal: "#E85A3C",
  /** Venous return — duskier than water-cycle blue. */
  somaVein: "#7A93A8",
  /** Lymph ducts — pale silver-green, slower than gold hormones. */
  somaLymph: "#B7C9BE",
  /** Prelude water — blue constellation, not gold nerves. */
  somaWater: "#5BA8FF",
  /** Plants / food packets — UNI healthy teal as a living pop. */
  somaFood: "#3ECF8E",
  /** Markets / trade — copper, distinct from mycelium gold. */
  somaTrade: "#E8A04A",
  /** Media of thought — violet, not water blue. */
  somaMedia: "#A78BFA",
  /** Invention transit — rose, cousin to media. */
  somaInvent: "#E07A8A",
  /** Printing-press packets of thought — ink, not later LLM token pulses. */
  somaInk: "#C4A06A",
} as const

export const type = {
  /** Geometric sans. UNI code not found; Inter is the closest Metaism face that is not the sacred-text serif. */
  family: '"Inter", "IBM Plex Sans", system-ui, sans-serif',
  quote: "clamp(28px, 4.4vw, 56px)",
  title: "clamp(42px, 8.5vw, 112px)",
  kicker: "11px",
  body: "15px",
  label: "11px",
  hud: "12px",
} as const

export const graph = {
  width: 1600,
  height: 900,
  node: 22,
  nodeRadius: 4,
  edgeWidth: 1.15,
  edgeWidthBus: 1.7,
  ringDash: "2.5 8",
} as const

export const z = {
  starfield: 0,
  graph: 1,
  audience: 2,
  hud: 3,
} as const
