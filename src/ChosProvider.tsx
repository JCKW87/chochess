import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ChosSettingsContext } from './chosContext'
import {
  loadChosSettings,
  saveChosSettings,
  type ChosStoredSettings,
} from './progressStorage'
import {
  playLessonDone,
  playOops,
  playMove,
  playPieceLand,
  playSuccess,
  playTap,
} from './sounds'
import { cancelReadAloud, primeSpeechVoices } from './readAloud'

export function ChosProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<ChosStoredSettings>(() =>
    loadChosSettings(),
  )

  useEffect(() => {
    primeSpeechVoices()
  }, [])

  useEffect(() => {
    saveChosSettings(stored)
  }, [stored])

  const setSoundEffects = useCallback((v: boolean) => {
    setStored((s) => ({ ...s, soundEffects: v }))
  }, [])

  const setReadAloud = useCallback((v: boolean) => {
    setStored((s) => ({ ...s, readAloud: v }))
    if (!v) cancelReadAloud()
  }, [])

  const markLessonComplete = useCallback((lessonId: string) => {
    setStored((s) => {
      if (s.completedLessonIds.includes(lessonId)) return s
      return {
        ...s,
        completedLessonIds: [...s.completedLessonIds, lessonId],
      }
    })
  }, [])

  const isLessonComplete = useCallback(
    (lessonId: string) => stored.completedLessonIds.includes(lessonId),
    [stored.completedLessonIds],
  )

  const playTapSound = useCallback(() => {
    if (stored.soundEffects) playTap()
  }, [stored.soundEffects])

  const playMoveSound = useCallback(() => {
    if (stored.soundEffects) playMove()
  }, [stored.soundEffects])

  const playPieceLandSound = useCallback(() => {
    if (stored.soundEffects) playPieceLand()
  }, [stored.soundEffects])

  const playOopsSound = useCallback(() => {
    if (stored.soundEffects) playOops()
  }, [stored.soundEffects])

  const playSuccessSound = useCallback(() => {
    if (stored.soundEffects) playSuccess()
  }, [stored.soundEffects])

  const playLessonDoneSound = useCallback(() => {
    if (stored.soundEffects) playLessonDone()
  }, [stored.soundEffects])

  const value = useMemo(
    () => ({
      soundEffects: stored.soundEffects,
      readAloud: stored.readAloud,
      completedLessonIds: stored.completedLessonIds,
      setSoundEffects,
      setReadAloud,
      markLessonComplete,
      isLessonComplete,
      playTapSound,
      playMoveSound,
      playPieceLandSound,
      playOopsSound,
      playSuccessSound,
      playLessonDoneSound,
    }),
    [
      stored.soundEffects,
      stored.readAloud,
      stored.completedLessonIds,
      setSoundEffects,
      setReadAloud,
      markLessonComplete,
      isLessonComplete,
      playTapSound,
      playMoveSound,
      playPieceLandSound,
      playOopsSound,
      playSuccessSound,
      playLessonDoneSound,
    ],
  )

  return (
    <ChosSettingsContext.Provider value={value}>
      {children}
    </ChosSettingsContext.Provider>
  )
}
