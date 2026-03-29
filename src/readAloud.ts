export function cancelReadAloud(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

export function speakLessonText(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  if (!text.trim()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.9
  u.pitch = 1.08
  const voices = window.speechSynthesis.getVoices()
  const en =
    voices.find((v) => v.lang.startsWith('en') && v.name.includes('Female')) ??
    voices.find((v) => v.lang.startsWith('en'))
  if (en) u.voice = en
  window.speechSynthesis.speak(u)
}

/** Browsers often load voices asynchronously */
export function primeSpeechVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}
