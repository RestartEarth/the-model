import { useEffect, useState } from "react"
import { color, type } from "../design/tokens"
import { askContracts, MORNING_QUERY } from "../graph/contracts"
import { nodeById } from "../graph/enterprise"

const STEP_MS = 700

export function Federation({
  hold,
  reduced,
}: {
  hold: boolean
  reduced: boolean
}) {
  const answers = askContracts(MORNING_QUERY)
  const [revealedRaw, setRevealed] = useState(
    hold || reduced ? answers.length : 0
  )

  useEffect(() => {
    if (hold || reduced) return
    let i = 0
    const tick = () => setRevealed(i)
    tick()
    const id = window.setInterval(() => {
      i += 1
      tick()
      if (i >= answers.length) window.clearInterval(id)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [hold, reduced, answers.length])

  const revealed = hold || reduced ? answers.length : revealedRaw

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
        {MORNING_QUERY}
      </text>
      {answers.map((a, i) => {
        const on = i < revealed
        const n = nodeById(a.nodeId)
        const ink = on ? color.focus : color.typeDim
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
            {/*
              Answers run outward from the frame's centre line, so the ones
              on the right read right-to-left off their own chip instead of
              off the edge of the stage.
            */}
            {on && (
              <text
                x={a.x > 800 ? a.x + 72 : a.x}
                y={a.y + 34}
                textAnchor={a.x > 800 ? "end" : "start"}
                fill={color.type}
                fontFamily={type.family}
                fontSize={10}
              >
                {a.answer}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}
