let audioCtx: AudioContext | null = null

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext()
    } catch {
      return null
    }
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

function tone(
  frequency: number,
  durationSec: number,
  volume = 0.06,
  type: OscillatorType = 'sine',
) {
  const c = ctx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, c.currentTime)
  gain.gain.setValueAtTime(volume, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + durationSec)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + durationSec)
}

export function playTap() {
  tone(520, 0.04, 0.05)
}

export function playMove() {
  tone(380, 0.06, 0.055, 'triangle')
}

export function playOops() {
  const c = ctx()
  if (!c) return
  tone(180, 0.12, 0.07, 'sawtooth')
  setTimeout(() => tone(140, 0.1, 0.05, 'sawtooth'), 70)
}

export function playSuccess() {
  const c = ctx()
  if (!c) return
  tone(523, 0.08, 0.06)
  setTimeout(() => tone(659, 0.1, 0.06), 80)
  setTimeout(() => tone(784, 0.14, 0.065), 170)
}

export function playLessonDone() {
  const c = ctx()
  if (!c) return
  tone(392, 0.1, 0.055)
  setTimeout(() => tone(494, 0.1, 0.055), 100)
  setTimeout(() => tone(587, 0.16, 0.06), 200)
}
