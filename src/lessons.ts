import type { Arrow } from 'react-chessboard'

export type LessonStep = {
  title: string
  body: string[]
  /** Optional board position for this step (read-only unless practice handles interaction). */
  boardFen?: string
  arrows?: Arrow[]
}

export type PracticeConfig = {
  fen: string
  hint: string
  successMessage: string
  /** Lowercase piece letters: p, r, n, b, q, k — only these may be dragged (empty = all pieces). */
  onlyPieceTypes?: string[]
  /** Complete when a legal move ends on this square. */
  goalSquare?: string
  /** Complete after any single legal move (guided play). */
  completeOnAnyMove?: boolean
  /** Tactics: move must match one of these (from → to) to count as success. */
  solutionMoves?: { from: string; to: string }[]
  /** Tactics: success when the move checkmates the opponent. */
  successOnCheckmate?: boolean
}

export type LessonTrack = 'basics' | 'tactics'

export type Lesson = {
  id: string
  emoji: string
  title: string
  tagline: string
  steps: LessonStep[]
  practice: PracticeConfig | null
  /** Defaults to basics when omitted. */
  track?: LessonTrack
}

export const lessons: Lesson[] = [
  {
    id: 'welcome',
    emoji: '♟️',
    title: 'Welcome to chess',
    tagline: 'A fun game for two thinkers',
    steps: [
      {
        title: 'What is chess?',
        body: [
          'Chess is a game played on a square board. You and a friend each control an army of pieces.',
          'The goal is not to capture every piece. The goal is to catch the other king in a special way called checkmate. You will learn what that means soon!',
        ],
      },
      {
        title: 'Take your time',
        body: [
          'In this app, we go one small idea at a time. There is no timer and no grade—only puzzles and practice.',
          'When you see a board below, you can drag the pieces on the practice screens. On story screens, the board is just a picture to look at.',
        ],
        boardFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      },
    ],
    practice: {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      hint: 'Drag any piece you like. Put it back or try another move. This is just for exploring!',
      successMessage: 'Nice! You moved a piece on the real starting board.',
      completeOnAnyMove: true,
    },
  },
  {
    id: 'board',
    emoji: '🏁',
    title: 'The chessboard',
    tagline: 'Squares, ranks, and files',
    steps: [
      {
        title: '64 squares',
        body: [
          'The board has 8 rows and 8 columns. That makes 64 squares.',
          'Squares alternate between a light color and a dark color. Each square has a name so players can talk about the same spot.',
        ],
        boardFen: '8/8/8/8/8/8/8/8 w - - 0 1',
      },
      {
        title: 'Files and ranks',
        body: [
          'Columns are called files. They are named with letters a through h from left to right when you sit on the white side.',
          'Rows are called ranks. They are numbered 1 through 8. Rank 1 is where White starts; rank 8 is where Black starts.',
        ],
        boardFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      },
    ],
    practice: {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      hint: 'Try moving a pawn one square forward from the second rank (for example from e2 toward e3).',
      successMessage: 'Great! Pawns will be your next lesson in detail.',
      onlyPieceTypes: ['p'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'pawn',
    emoji: '🐣',
    title: 'The pawn',
    tagline: 'Small steps, big dreams',
    steps: [
      {
        title: 'How pawns move',
        body: [
          'Pawns move straight forward one square at a time.',
          'From its starting row, a pawn may choose to go forward one square or two squares—but only on that first move.',
        ],
        boardFen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
        arrows: [
          {
            startSquare: 'e2',
            endSquare: 'e3',
            color: 'rgba(46, 139, 87, 0.85)',
          },
        ],
      },
      {
        title: 'How pawns capture',
        body: [
          'Pawns do not capture straight ahead. They capture one square forward on a diagonal.',
          'That means a pawn attacks the two diagonal squares in front of it.',
        ],
        boardFen: '8/8/8/3p4/4P3/8/8/8 w - - 0 1',
        arrows: [
          {
            startSquare: 'e4',
            endSquare: 'd5',
            color: 'rgba(220, 90, 70, 0.85)',
          },
        ],
      },
    ],
    practice: {
      fen: '8/8/8/8/8/4P3/8/8 w - - 0 1',
      hint: 'Move the white pawn from e3 to e4 (one step forward).',
      successMessage: 'Perfect! One step forward is a legal pawn move.',
      onlyPieceTypes: ['p'],
      goalSquare: 'e4',
    },
  },
  {
    id: 'rook',
    emoji: '🏰',
    title: 'The rook',
    tagline: 'Straight as a train track',
    steps: [
      {
        title: 'Rook moves',
        body: [
          'The rook looks like a little castle tower. It moves in straight lines: up, down, left, or right.',
          'It can move as many empty squares as you want in one direction, then it stops. If an enemy piece is on a square, the rook can capture it and stop there.',
        ],
        boardFen: '8/8/8/3p4/8/3R4/8/8 w - - 0 1',
        arrows: [
          {
            startSquare: 'd3',
            endSquare: 'd8',
            color: 'rgba(70, 130, 180, 0.85)',
          },
        ],
      },
    ],
    practice: {
      fen: '8/8/8/8/8/8/3R4/8 w - - 0 1',
      hint: 'Slide the rook along a rank or file to any empty square.',
      successMessage: 'Rook power! Straight lines are your friend.',
      onlyPieceTypes: ['r'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'knight',
    emoji: '🐴',
    title: 'The knight',
    tagline: 'The only piece that jumps',
    steps: [
      {
        title: 'The L-shape',
        body: [
          'The knight moves in an “L”: two squares in one direction, then one square sideways.',
          'It is the only piece that can jump over other pieces. Think of it as hopping to a new square.',
        ],
        boardFen: '8/8/8/8/5N2/8/8/8 w - - 0 1',
        arrows: [
          {
            startSquare: 'f4',
            endSquare: 'e6',
            color: 'rgba(147, 112, 219, 0.9)',
          },
        ],
      },
    ],
    practice: {
      fen: '8/8/8/8/5N2/8/8/8 w - - 0 1',
      hint: 'Move the knight to any legal square. Knights love the center of the board later in a real game!',
      successMessage: 'Awesome! The knight’s jump takes practice—keep trying different squares.',
      onlyPieceTypes: ['n'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'bishop',
    emoji: '📐',
    title: 'The bishop',
    tagline: 'Diagonal zoom',
    steps: [
      {
        title: 'Bishop moves',
        body: [
          'The bishop moves diagonally any number of squares, like sliding on a slanted line.',
          'Each bishop stays on the same color squares for the whole game. One bishop lives on light squares, one on dark.',
        ],
        boardFen: '8/8/8/8/5B2/8/8/8 w - - 0 1',
        arrows: [
          {
            startSquare: 'f4',
            endSquare: 'c7',
            color: 'rgba(34, 139, 34, 0.85)',
          },
        ],
      },
    ],
    practice: {
      fen: '8/8/8/8/5B2/8/8/8 w - - 0 1',
      hint: 'Slide the bishop along a diagonal to another square.',
      successMessage: 'Smooth diagonal move!',
      onlyPieceTypes: ['b'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'queen',
    emoji: '👑',
    title: 'The queen',
    tagline: 'The strongest piece',
    steps: [
      {
        title: 'Queen moves',
        body: [
          'The queen combines rook and bishop. She can move straight or diagonal, any number of squares.',
          'She is the most powerful piece, so players try to keep her safe while she attacks.',
        ],
        boardFen: '8/8/8/3p4/8/8/3Q4/8 w - - 0 1',
      },
    ],
    practice: {
      fen: '8/8/8/8/8/8/3Q4/8 w - - 0 1',
      hint: 'Move the queen anywhere legal—straight or diagonal.',
      successMessage: 'Royal moves! The queen can reach many squares in one turn.',
      onlyPieceTypes: ['q'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'king',
    emoji: '🤴',
    title: 'The king',
    tagline: 'The piece you must protect',
    steps: [
      {
        title: 'King moves',
        body: [
          'The king moves one square in any direction: straight or diagonal.',
          'The whole game is about keeping your king safe. If an opponent attacks your king, that is called check—you must get out of check.',
        ],
        boardFen: '8/8/8/8/8/8/4K3/8 w - - 0 1',
      },
    ],
    practice: {
      fen: '8/8/8/8/8/8/4K3/8 w - - 0 1',
      hint: 'Walk the king one square in any direction.',
      successMessage: 'Good! The king is slow but never boring.',
      onlyPieceTypes: ['k'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'check',
    emoji: '⚠️',
    title: 'Check',
    tagline: 'The king is under attack',
    steps: [
      {
        title: 'What check means',
        body: [
          'Check means your king is being attacked by an enemy piece. You are not allowed to ignore it.',
          'You can get out of check by moving the king, blocking with another piece, or capturing the attacker.',
        ],
        boardFen: '4k3/8/8/8/8/8/4R3/4K3 b - - 0 1',
        arrows: [
          {
            startSquare: 'e2',
            endSquare: 'e8',
            color: 'rgba(220, 90, 70, 0.75)',
          },
        ],
      },
    ],
    practice: {
      fen: '4k3/8/8/8/8/8/4R3/4K3 b - - 0 1',
      hint: 'Black is in check. Move the black king to any safe square (try d7 or d8).',
      successMessage: 'You escaped check! In a real game, always notice when the king is attacked.',
      onlyPieceTypes: ['k'],
      completeOnAnyMove: true,
    },
  },
  {
    id: 'checkmate',
    emoji: '🎯',
    title: 'Checkmate',
    tagline: 'How the game ends',
    steps: [
      {
        title: 'Winning the game',
        body: [
          'Checkmate means the king is in check and there is no legal way to escape. The game ends right there!',
          'You do not capture the king—the game stops when checkmate happens.',
        ],
        boardFen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1',
      },
    ],
    practice: {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      hint: 'Play any legal moves you want. This is a normal start—explore how pieces develop.',
      successMessage: 'Every practice game makes you stronger. Soon you will spot checkmate patterns!',
      completeOnAnyMove: true,
    },
  },
  {
    id: 'castling',
    emoji: '🏰',
    title: 'Castling',
    tagline: 'A special king and rook move',
    steps: [
      {
        title: 'One move, two pieces',
        body: [
          'Castling is the only time you move two pieces in one turn. The king moves two squares toward a rook, and that rook jumps to the other side of the king.',
          'You can only castle if neither piece has moved yet, the squares between them are empty, and your king is not in check (and does not pass through check).',
        ],
        boardFen: '8/8/8/8/8/8/PPPPPPPP/R3KBNR w KQ - 0 1',
      },
    ],
    practice: {
      fen: '8/8/8/8/8/8/PPPPPPPP/R3KBNR w KQ - 0 1',
      hint: 'Try castling kingside: move the king from e1 to g1 in one drag. The rook should hop to f1 automatically in a real game; here, practice moving the king two steps!',
      successMessage: 'Castling takes rules practice—in apps and clubs, keep learning when it is allowed.',
      onlyPieceTypes: ['k'],
      goalSquare: 'g1',
    },
  },
  {
    id: 'recap',
    emoji: '🌟',
    title: 'You did it!',
    tagline: 'What you learned',
    steps: [
      {
        title: 'Pat on the back',
        body: [
          'You met every piece, learned how they move, and saw check, checkmate, and castling.',
          'Next steps in the real world: play friendly games, solve puzzles, and maybe join a school or online chess club.',
        ],
        boardFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      },
    ],
    practice: {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      hint: 'Free play! Move any piece and enjoy the board.',
      successMessage: 'Keep playing. Chess is a skill you build move by move.',
      completeOnAnyMove: true,
    },
  },
  {
    id: 'puzzle-rook-mate',
    emoji: '⚡',
    title: 'Puzzle: Rook checkmate',
    tagline: 'Mate in one move',
    track: 'tactics',
    steps: [
      {
        title: 'Find the winning move',
        body: [
          'White to play. The black king is on the edge, and your rook is ready to step up to the last row.',
          'Look for a move that attacks the king and leaves no escape. That is checkmate in one!',
        ],
        boardFen: '6k1/R7/6K1/8/8/8/8/8 w - - 0 1',
      },
    ],
    practice: {
      fen: '6k1/R7/6K1/8/8/8/8/8 w - - 0 1',
      hint: 'Slide the a-file rook to the eighth rank so it stares down the black king on g8.',
      successMessage: 'Checkmate! The rook covered the last escape squares.',
      successOnCheckmate: true,
    },
  },
  {
    id: 'puzzle-queen-mate',
    emoji: '👑',
    title: 'Puzzle: Queen checkmate',
    tagline: 'Mate in one move',
    track: 'tactics',
    steps: [
      {
        title: 'Queen power',
        body: [
          'The queen is the best attacker. Here White can deliver mate in a single move.',
          'Think about which square the queen can go to where the king cannot run away or capture safely.',
        ],
        boardFen: '7k/8/6K1/5Q2/8/8/8/8 w - - 0 1',
      },
    ],
    practice: {
      fen: '7k/8/6K1/5Q2/8/8/8/8 w - - 0 1',
      hint: 'The black king is on h8. Which square can your queen reach to say “checkmate”?',
      successMessage: 'Royal checkmate! The queen ruled the board.',
      successOnCheckmate: true,
    },
  },
  {
    id: 'puzzle-win-queen',
    emoji: '🎯',
    title: 'Puzzle: Win the queen',
    tagline: 'Capture the strongest piece',
    track: 'tactics',
    steps: [
      {
        title: 'Knight fork idea',
        body: [
          'Sometimes one piece can capture a much stronger piece. Here your knight can snap up Black’s queen.',
          'Knights move in an L-shape. Find the jump that lands on the square with the enemy queen.',
        ],
        boardFen: '6k1/3q4/8/4N3/8/6K1/8/8 w - - 0 1',
      },
    ],
    practice: {
      fen: '6k1/3q4/8/4N3/8/6K1/8/8 w - - 0 1',
      hint: 'Move the knight from e5 to the square where Black’s queen sits.',
      successMessage: 'You won the queen! That is a huge material win.',
      solutionMoves: [{ from: 'e5', to: 'd7' }],
    },
  },
  {
    id: 'puzzle-rook-ladder',
    emoji: '🪜',
    title: 'Puzzle: Rook on the seventh',
    tagline: 'Back rank finish',
    track: 'tactics',
    steps: [
      {
        title: 'Lift the rook',
        body: [
          'Two rooks can be very scary for a king stuck on the edge. Here one move on the back rank ends the game.',
          'Slide your rook so it attacks the king where it stands.',
        ],
        boardFen: '7k/8/6K1/R7/8/8/8/R7 w - - 0 1',
      },
    ],
    practice: {
      fen: '7k/8/6K1/R7/8/8/8/R7 w - - 0 1',
      hint: 'The a-file rook can reach the eighth rank. Which square on the back row is mate?',
      successMessage: 'Back rank mate! The king had nowhere to go.',
      solutionMoves: [{ from: 'a5', to: 'a8' }],
      successOnCheckmate: true,
    },
  },
]

export function lessonTrack(lesson: Lesson): LessonTrack {
  return lesson.track ?? 'basics'
}
