/**
 * Stand-in for uni-demo's `@/components/uni-logo`, which is work-owned and
 * cannot live in this repo. Same contract (a `className` that the title bar
 * uses to size it and fill its paths white), drawn as a neutral six-node
 * asterism so the standalone harness has a mark in the corner without
 * borrowing anyone's brand.
 *
 * Delete this file when building inside uni-demo — the import path already
 * resolves to the real component there.
 */
export function UniLogo({ className }: { className?: string }) {
  const r = 9
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return { x: 12 + Math.cos(a) * r, y: 12 + Math.sin(a) * r }
  })
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {nodes.map((n, i) => {
        const m = nodes[(i + 2) % 6]!
        return (
          <path
            key={i}
            d={`M ${n.x} ${n.y} L ${m.x} ${m.y}`}
            stroke="currentColor"
            strokeWidth={0.8}
            opacity={0.5}
            fill="none"
          />
        )
      })}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={1.9} fill="currentColor" />
      ))}
      <circle cx={12} cy={12} r={2.6} fill="currentColor" />
    </svg>
  )
}
