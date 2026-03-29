import { useCallback, useEffect, useMemo, useState } from 'react'
import { lessons, lessonTrack, type Lesson } from './lessons'
import { TeachBoard } from './TeachBoard'
import { ChosProvider } from './ChosProvider'
import { useChos } from './useChos'
import { cancelReadAloud, speakLessonText } from './readAloud'
import './App.css'

type Screen = { type: 'home' } | { type: 'lesson'; lessonId: string }

export default function App() {
  return (
    <ChosProvider>
      <AppContent />
    </ChosProvider>
  )
}

function AppContent() {
  const { playTapSound } = useChos()
  const [screen, setScreen] = useState<Screen>({ type: 'home' })

  const activeLesson = useMemo(() => {
    if (screen.type !== 'lesson') return null
    return lessons.find((l) => l.id === screen.lessonId) ?? null
  }, [screen])

  const openLesson = useCallback((lesson: Lesson) => {
    setScreen({ type: 'lesson', lessonId: lesson.id })
  }, [])

  const goHome = useCallback(() => {
    setScreen({ type: 'home' })
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <button
            type="button"
            className="logo-btn"
            onClick={() => {
              playTapSound()
              goHome()
            }}
            aria-label="Chos Learn Chess home"
          >
            <span className="logo-mark" aria-hidden>
              ♔
            </span>
            <span className="logo-text">Chos Learn Chess</span>
          </button>
          <SettingsToggles />
        </div>
        <p className="tagline">Learn chess one step at a time</p>
      </header>

      <main className="app-main">
        {screen.type === 'home' && <Home onPick={openLesson} />}
        {activeLesson && (
          <LessonFlow lesson={activeLesson} onHome={goHome} />
        )}
      </main>
    </div>
  )
}

function SettingsToggles() {
  const {
    soundEffects,
    readAloud,
    setSoundEffects,
    setReadAloud,
    playTapSound,
  } = useChos()

  return (
    <div className="settings-toggles" role="group" aria-label="Sound and voice">
      <button
        type="button"
        className={`toggle-chip ${soundEffects ? 'on' : ''}`}
        aria-pressed={soundEffects}
        onClick={() => {
          playTapSound()
          setSoundEffects(!soundEffects)
        }}
      >
        <span aria-hidden>🔊</span> Sounds
      </button>
      <button
        type="button"
        className={`toggle-chip ${readAloud ? 'on' : ''}`}
        aria-pressed={readAloud}
        onClick={() => {
          playTapSound()
          setReadAloud(!readAloud)
        }}
      >
        <span aria-hidden>🗣️</span> Read aloud
      </button>
    </div>
  )
}

function Home({ onPick }: { onPick: (l: Lesson) => void }) {
  const { isLessonComplete, playTapSound } = useChos()
  const basics = lessons.filter((l) => lessonTrack(l) === 'basics')
  const tactics = lessons.filter((l) => lessonTrack(l) === 'tactics')
  const doneCount = basics.filter((l) => isLessonComplete(l.id)).length

  return (
    <div className="home">
      <section className="hero-card">
        <h1>Hello, Zoey, Isaac & Lucas!</h1>
        <p>
          Thirteen basics lessons end with a mini-game that ties everything
          together, then you can try tactics puzzles. Your progress is saved on
          this device.
        </p>
        {doneCount > 0 && (
          <p className="progress-hint">
            You have finished {doneCount} of {basics.length} basics lessons.
            Keep going!
          </p>
        )}
      </section>

      <h2 className="section-title">Basics path</h2>
      <p className="section-blurb">
        Start here if you are new. Short stories, then a practice board.
      </p>
      <ul className="lesson-grid" role="list">
        {basics.map((lesson, index) => (
          <li key={lesson.id}>
            <button
              type="button"
              className="lesson-card"
              onClick={() => {
                playTapSound()
                onPick(lesson)
              }}
            >
              <span className="lesson-emoji" aria-hidden>
                {lesson.emoji}
              </span>
              <span className="lesson-num">Lesson {index + 1}</span>
              <span className="lesson-title">{lesson.title}</span>
              <span className="lesson-tag">{lesson.tagline}</span>
              {isLessonComplete(lesson.id) && (
                <span className="lesson-done-badge">Done</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="section-title section-title-spaced">Tactics puzzles</h2>
      <p className="section-blurb">
        Extra challenges: mate in one, win material, and more.
      </p>
      <ul className="lesson-grid" role="list">
        {tactics.map((lesson) => (
          <li key={lesson.id}>
            <button
              type="button"
              className="lesson-card lesson-card-puzzle"
              onClick={() => {
                playTapSound()
                onPick(lesson)
              }}
            >
              <span className="lesson-emoji" aria-hidden>
                {lesson.emoji}
              </span>
              <span className="lesson-num puzzle-label">Puzzle</span>
              <span className="lesson-title">{lesson.title}</span>
              <span className="lesson-tag">{lesson.tagline}</span>
              {isLessonComplete(lesson.id) && (
                <span className="lesson-done-badge">Solved</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type Phase = 'steps' | 'practice' | 'done'

function LessonFlow({
  lesson,
  onHome,
}: {
  lesson: Lesson
  onHome: () => void
}) {
  const {
    readAloud,
    playTapSound,
    playMoveSound,
    playPieceLandSound,
    playOopsSound,
    playSuccessSound,
    playLessonDoneSound,
    markLessonComplete,
  } = useChos()

  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('steps')
  const [practiceDone, setPracticeDone] = useState(false)
  const [boardNonce, setBoardNonce] = useState(0)

  const step = lesson.steps[stepIndex]
  const isLastStep = stepIndex >= lesson.steps.length - 1

  const resetLessonState = useCallback(() => {
    setStepIndex(0)
    setPhase('steps')
    setPracticeDone(false)
    setBoardNonce((n) => n + 1)
  }, [])

  const goNextStep = useCallback(() => {
    playTapSound()
    if (!isLastStep) {
      setStepIndex((i) => i + 1)
    } else {
      setPhase('practice')
      setPracticeDone(false)
      setBoardNonce((n) => n + 1)
    }
  }, [isLastStep, playTapSound])

  const goPrevStep = useCallback(() => {
    playTapSound()
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
    }
  }, [stepIndex, playTapSound])

  const lessonIndex = lessons.findIndex((l) => l.id === lesson.id) + 1

  useEffect(() => {
    if (!readAloud) {
      cancelReadAloud()
      return
    }
    const s = lesson.steps[stepIndex]
    let text = ''
    if (phase === 'steps' && s) {
      text = `${s.title}. ${s.body.join(' ')}`
    } else if (phase === 'practice' && lesson.practice) {
      text = `Practice time. ${lesson.practice.hint}`
    } else if (phase === 'done') {
      text =
        'Lesson complete! You can pick another lesson from the list, or replay this one.'
    }
    if (text) speakLessonText(text)
    return () => cancelReadAloud()
  }, [readAloud, phase, stepIndex, lesson.id, lesson.steps, lesson.practice])

  const finishLesson = useCallback(() => {
    playTapSound()
    playLessonDoneSound()
    markLessonComplete(lesson.id)
    setPhase('done')
  }, [
    lesson.id,
    markLessonComplete,
    playLessonDoneSound,
    playTapSound,
  ])

  return (
    <article className="lesson-flow">
      <div className="lesson-flow-top">
        <div className="lesson-flow-start">
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              playTapSound()
              onHome()
            }}
          >
            All lessons
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              playTapSound()
              resetLessonState()
            }}
          >
            Replay lesson
          </button>
        </div>
        <span className="progress-pill">
          Lesson {lessonIndex} of {lessons.length}
        </span>
      </div>

      <h2 className="lesson-heading">
        <span className="lesson-heading-emoji" aria-hidden>
          {lesson.emoji}
        </span>
        {lesson.title}
      </h2>
      <p className="lesson-sub">{lesson.tagline}</p>

      {phase === 'steps' && step && (
        <>
          <div className="step-card">
            <p className="step-meta">
              Step {stepIndex + 1} of {lesson.steps.length}
            </p>
            <h3>{step.title}</h3>
            {step.body.map((para, i) => (
              <p key={i} className="step-body">
                {para}
              </p>
            ))}
          </div>

          {step.boardFen && (
            <div className="board-panel demo">
              <TeachBoard
                key={`${lesson.id}-step-${stepIndex}-${boardNonce}`}
                fen={step.boardFen}
                interactive={false}
                arrows={step.arrows}
              />
            </div>
          )}

          <nav className="step-nav" aria-label="Lesson steps">
            <button
              type="button"
              className="btn secondary"
              onClick={goPrevStep}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            <button type="button" className="btn primary" onClick={goNextStep}>
              {isLastStep ? 'Try practice' : 'Next'}
            </button>
          </nav>
        </>
      )}

      {phase === 'practice' && lesson.practice && (
        <>
          <div className="step-card practice-intro">
            <h3>Practice time</h3>
            <p className="step-body">{lesson.practice.hint}</p>
            <p className="move-howto">
              Tap your piece to select it. On a phone or tablet,{' '}
              <strong>light dots</strong> show every square you can move to; tap
              one to go. With a mouse, point at a square:{' '}
              <strong>green</strong> means you can move there,{' '}
              <strong>red</strong> means not allowed. Tap the same piece again
              to cancel.
            </p>
          </div>

          <div className="board-panel">
            <TeachBoard
              key={`${lesson.id}-practice-${boardNonce}`}
              fen={lesson.practice.fen}
              interactive
              onlyPieceTypes={lesson.practice.onlyPieceTypes}
              goalSquare={lesson.practice.goalSquare}
              completeOnAnyMove={lesson.practice.completeOnAnyMove}
              solutionMoves={lesson.practice.solutionMoves}
              successOnCheckmate={lesson.practice.successOnCheckmate}
              onSuccess={() => {
                playSuccessSound()
                setPracticeDone(true)
              }}
              onMoveAccepted={playMoveSound}
              onPieceLanded={playPieceLandSound}
              onMoveRejected={playOopsSound}
            />
          </div>

          {practiceDone && (
            <div className="celebrate" role="status">
              <p>{lesson.practice.successMessage}</p>
            </div>
          )}

          <div className="practice-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                playTapSound()
                setPracticeDone(false)
                setBoardNonce((n) => n + 1)
              }}
            >
              Reset board
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={finishLesson}
            >
              Finish lesson
            </button>
          </div>
        </>
      )}

      {phase === 'practice' && !lesson.practice && (
        <p className="step-body">No practice for this lesson.</p>
      )}

      {phase === 'done' && (
        <div className="done-card">
          <h3>Lesson complete</h3>
          <p>
            {practiceDone
              ? 'You finished the practice. Great work!'
              : 'You can replay practice anytime from this lesson.'}
          </p>
          <div className="done-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                playTapSound()
                resetLessonState()
              }}
            >
              Replay lesson
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                playTapSound()
                onHome()
              }}
            >
              Choose another lesson
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
