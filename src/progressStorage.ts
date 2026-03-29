const STORAGE_KEY = 'chos-learn-chess-v1'

export type ChosStoredSettings = {
  version: 1
  completedLessonIds: string[]
  soundEffects: boolean
  readAloud: boolean
}

const defaultState: ChosStoredSettings = {
  version: 1,
  completedLessonIds: [],
  soundEffects: true,
  readAloud: false,
}

export function loadChosSettings(): ChosStoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as Partial<ChosStoredSettings>
    if (parsed.version !== 1) return { ...defaultState }
    return {
      version: 1,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds.filter((id) => typeof id === 'string')
        : [],
      soundEffects:
        typeof parsed.soundEffects === 'boolean'
          ? parsed.soundEffects
          : defaultState.soundEffects,
      readAloud:
        typeof parsed.readAloud === 'boolean'
          ? parsed.readAloud
          : defaultState.readAloud,
    }
  } catch {
    return { ...defaultState }
  }
}

export function saveChosSettings(state: ChosStoredSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota / private mode */
  }
}
