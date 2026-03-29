import { useCallback, useId, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, type Square } from 'chess.js'
import type { Arrow } from 'react-chessboard'

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
  onMoveRejected?: () => void
  arrows?: Arrow[]
  showNotation?: boolean
}

function pieceTypeFromBoardPiece(pieceType: string): string {
  const letter = pieceType[1]
  return letter ? letter.toLowerCase() : ''
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
  onMoveRejected,
  arrows = [],
  showNotation = true,
}: TeachBoardProps) {
  const id = useId()
  const [position, setPosition] = useState(fen)

  const canDragPiece = useCallback(
    ({ piece }: { piece: { pieceType: string } }) => {
      if (!interactive) return false
      if (!onlyPieceTypes?.length) return true
      const t = pieceTypeFromBoardPiece(piece.pieceType)
      return onlyPieceTypes.includes(t)
    },
    [interactive, onlyPieceTypes],
  )

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string
      targetSquare: string | null
    }) => {
      if (!interactive || !targetSquare) return false

      const game = new Chess(position)
      let pieceAtSource
      try {
        pieceAtSource = game.get(sourceSquare as Square)
      } catch {
        return false
      }

      if (
        onlyPieceTypes?.length &&
        pieceAtSource &&
        !onlyPieceTypes.includes(pieceAtSource.type)
      ) {
        return false
      }

      let move
      try {
        move = game.move({
          from: sourceSquare as Square,
          to: targetSquare as Square,
          promotion: 'q',
        })
      } catch {
        onMoveRejected?.()
        return false
      }

      const hasSolutionFilter =
        Array.isArray(solutionMoves) && solutionMoves.length > 0
      if (hasSolutionFilter) {
        const matches = solutionMoves!.some(
          (s) => s.from === move.from && s.to === move.to,
        )
        if (!matches) {
          game.undo()
          onMoveRejected?.()
          return false
        }
      }

      if (successOnCheckmate && !game.isCheckmate()) {
        game.undo()
        onMoveRejected?.()
        return false
      }

      const nextFen = game.fen()
      setPosition(nextFen)
      onMoveAccepted?.()

      const hitsGoal = goalSquare ? move.to === goalSquare : false
      const normalSuccess =
        Boolean(completeOnAnyMove) ||
        (Boolean(goalSquare) && hitsGoal)
      const puzzleOnly =
        (hasSolutionFilter || Boolean(successOnCheckmate)) &&
        !completeOnAnyMove &&
        !goalSquare
      if (normalSuccess || puzzleOnly) {
        onSuccess?.()
      }

      return true
    },
    [
      completeOnAnyMove,
      goalSquare,
      interactive,
      onMoveAccepted,
      onMoveRejected,
      onSuccess,
      onlyPieceTypes,
      position,
      solutionMoves,
      successOnCheckmate,
    ],
  )

  return (
    <div className="teach-board-wrap">
      <Chessboard
        options={{
          id: `teach-${id}`,
          position,
          boardOrientation: 'white',
          allowDragging: interactive,
          canDragPiece,
          onPieceDrop,
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
