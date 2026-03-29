import { useCallback, useId, useMemo, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, type Move, type Square } from 'chess.js'
import type {
  Arrow,
  SquareHandlerArgs,
  SquareRenderer,
} from 'react-chessboard'

type TeachBoardProps = {
  fen: string
  interactive: boolean
  onlyPieceTypes?: string[]
  goalSquare?: string
  completeOnAnyMove?: boolean
  solutionMoves?: { from: string; to: string }[]
  successOnCheckmate?: boolean
  onSuccess?: () => void
  onMoveAccepted?: () => void
  onPieceLanded?: () => void
  onMoveRejected?: () => void
  arrows?: Arrow[]
  showNotation?: boolean
}

function useStableBoardDomId(): string {
  const reactId = useId()
  return useMemo(() => {
    const safe = reactId.replace(/[^a-zA-Z0-9]/g, '')
    return `choscb${safe || 'board'}`
  }, [reactId])
}

type MoveRules = {
  onlyPieceTypes?: string[]
  goalSquare?: string
  completeOnAnyMove?: boolean
  solutionMoves?: { from: string; to: string }[]
  successOnCheckmate?: boolean
}

function tryApplyMove(
  fen: string,
  from: Square,
  to: Square,
  rules: MoveRules,
):
  | {
      ok: true
      nextFen: string
      move: Move
      fireSuccess: boolean
    }
  | { ok: false } {
  const game = new Chess(fen)
  const pieceAtSource = game.get(from)
  if (!pieceAtSource) return { ok: false }

  if (
    rules.onlyPieceTypes?.length &&
    !rules.onlyPieceTypes.includes(pieceAtSource.type)
  ) {
    return { ok: false }
  }

  let move: Move
  try {
    move = game.move({ from, to, promotion: 'q' })
  } catch {
    return { ok: false }
  }

  const hasSolutionFilter =
    Array.isArray(rules.solutionMoves) && rules.solutionMoves.length > 0
  if (hasSolutionFilter) {
    const matches = rules.solutionMoves!.some(
      (s) => s.from === move.from && s.to === move.to,
    )
    if (!matches) {
      game.undo()
      return { ok: false }
    }
  }

  if (rules.successOnCheckmate && !game.isCheckmate()) {
    game.undo()
    return { ok: false }
  }

  const hitsGoal = rules.goalSquare ? move.to === rules.goalSquare : false
  const normalSuccess =
    Boolean(rules.completeOnAnyMove) ||
    (Boolean(rules.goalSquare) && hitsGoal)
  const puzzleOnly =
    (hasSolutionFilter || Boolean(rules.successOnCheckmate)) &&
    !rules.completeOnAnyMove &&
    !rules.goalSquare
  const fireSuccess = normalSuccess || puzzleOnly

  return {
    ok: true,
    nextFen: game.fen(),
    move,
    fireSuccess,
  }
}

export function TeachBoard({
  fen,
  interactive,
  onlyPieceTypes,
  goalSquare,
  completeOnAnyMove,
  solutionMoves,
  successOnCheckmate,
  onSuccess,
  onMoveAccepted,
  onPieceLanded,
  onMoveRejected,
  arrows = [],
  showNotation = true,
}: TeachBoardProps) {
  const boardDomId = useStableBoardDomId()
  const [position, setPosition] = useState(fen)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  const rules = useMemo<MoveRules>(
    () => ({
      onlyPieceTypes,
      goalSquare,
      completeOnAnyMove,
      solutionMoves,
      successOnCheckmate,
    }),
    [
      onlyPieceTypes,
      goalSquare,
      completeOnAnyMove,
      solutionMoves,
      successOnCheckmate,
    ],
  )

  const legalDests = useMemo(() => {
    if (!interactive || !selectedSquare) return new Set<string>()
    const game = new Chess(position)
    const piece = game.get(selectedSquare)
    if (!piece || piece.color !== game.turn()) return new Set<string>()
    return new Set(
      game.moves({ square: selectedSquare, verbose: true }).map((m) => m.to),
    )
  }, [interactive, position, selectedSquare])

  const squareRenderer = useMemo<SquareRenderer | undefined>(() => {
    if (!interactive) return undefined

    const Renderer: SquareRenderer = ({ square, children }) => {
      const isSel = selectedSquare !== null && square === selectedSquare
      const isLeg = legalDests.has(square)
      if (!isSel && !isLeg) {
        return <>{children}</>
      }
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {children}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 30,
              pointerEvents: 'none',
              backgroundColor: isSel
                ? 'rgba(241, 196, 15, 0.58)'
                : 'rgba(46, 204, 113, 0.58)',
              boxShadow: isSel
                ? 'inset 0 0 0 4px rgba(180, 100, 20, 1)'
                : 'inset 0 0 0 4px rgba(15, 110, 55, 1)',
            }}
          />
        </div>
      )
    }

    return Renderer
  }, [interactive, legalDests, selectedSquare])

  const handleSquareClick = useCallback(
    ({ square }: SquareHandlerArgs) => {
      if (!interactive) return
      const sq = square as Square
      const game = new Chess(position)

      if (selectedSquare === null) {
        const pc = game.get(sq)
        if (!pc) return
        if (pc.color !== game.turn()) {
          onMoveRejected?.()
          return
        }
        if (
          onlyPieceTypes?.length &&
          !onlyPieceTypes.includes(pc.type)
        ) {
          onMoveRejected?.()
          return
        }
        setSelectedSquare(sq)
        return
      }

      if (selectedSquare === sq) {
        setSelectedSquare(null)
        return
      }

      const result = tryApplyMove(position, selectedSquare, sq, rules)
      if (result.ok) {
        setPosition(result.nextFen)
        setSelectedSquare(null)
        onMoveAccepted?.()
        onPieceLanded?.()
        if (result.fireSuccess) onSuccess?.()
        return
      }

      const clicked = game.get(sq)
      if (clicked && clicked.color === game.turn()) {
        if (
          !onlyPieceTypes?.length ||
          onlyPieceTypes.includes(clicked.type)
        ) {
          setSelectedSquare(sq)
          return
        }
      }

      onMoveRejected?.()
      setSelectedSquare(null)
    },
    [
      interactive,
      onlyPieceTypes,
      onMoveAccepted,
      onMoveRejected,
      onPieceLanded,
      onSuccess,
      position,
      rules,
      selectedSquare,
    ],
  )

  return (
    <div className="teach-board-wrap">
      <Chessboard
        options={{
          id: boardDomId,
          position,
          boardOrientation: 'white',
          allowDragging: false,
          showAnimations: false,
          squareRenderer: interactive ? squareRenderer : undefined,
          onSquareClick: interactive ? handleSquareClick : undefined,
          onPieceDrop: undefined,
          arrows,
          showNotation,
          boardStyle: {
            borderRadius: 12,
            boxShadow: '0 8px 28px rgba(25, 40, 65, 0.12)',
          },
          lightSquareStyle: { backgroundColor: '#f0e6d8' },
          darkSquareStyle: { backgroundColor: '#c9a87c' },
        }}
      />
    </div>
  )
}
