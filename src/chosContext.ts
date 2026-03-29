import { createContext } from 'react'

export type ChosContextValue = {
  soundEffects: boolean
  readAloud: boolean
  completedLessonIds: string[]
  setSoundEffects: (v: boolean) => void
  setReadAloud: (v: boolean) => void
  markLessonComplete: (lessonId: string) => void
  isLessonComplete: (lessonId: string) => boolean
  playTapSound: () => void
  playMoveSound: () => void
  playOopsSound: () => void
  playSuccessSound: () => void
  playLessonDoneSound: () => void
}

export const ChosSettingsContext = createContext<ChosContextValue | null>(null)
