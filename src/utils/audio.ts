// High-Volume Continuous Alarm & Notification Synthesizer using Web Audio API
// Loops continuously until the user acknowledges the order with "I KNOW ORDER".
// Zero external asset downloads - 100% reliable across mobile and desktop.

let audioContext: AudioContext | null = null;
let alarmIntervalId: any = null;
let isAlarmCurrentlyPlaying = false;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
};

// Play a single piercing high-attention alarm pulse
const playSingleAlarmPulse = (volume = 0.95) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // High piercing dual tone: siren ramping between 880Hz and 1450Hz
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.linearRampToValueAtTime(1450, now + 0.15);
    osc1.frequency.linearRampToValueAtTime(800, now + 0.35);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(660, now);
    osc2.frequency.linearRampToValueAtTime(1100, now + 0.15);
    osc2.frequency.linearRampToValueAtTime(620, now + 0.35);

    // High-volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.04);
    gainNode.gain.setValueAtTime(volume, now + 0.28);
    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.42);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);

    // Smartphone hardware vibration pattern (buzz-buzz)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([250, 100, 250]);
    }
  } catch (err) {
    console.warn('Alarm pulse error:', err);
  }
};

/**
 * Starts continuous, high-volume loud alarm for incoming orders.
 * Rings every 520ms in an infinite loop until stopContinuousOrderAlarm() is called.
 */
export const startContinuousOrderAlarm = () => {
  if (isAlarmCurrentlyPlaying) return;
  isAlarmCurrentlyPlaying = true;

  // Immediate sound
  playSingleAlarmPulse(0.95);

  // Loop continuously every 520ms
  alarmIntervalId = setInterval(() => {
    playSingleAlarmPulse(0.95);
  }, 520);
};

/**
 * Stops and mutes the continuous order alarm immediately.
 */
export const stopContinuousOrderAlarm = () => {
  isAlarmCurrentlyPlaying = false;
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
};

export const isAlarmActive = (): boolean => isAlarmCurrentlyPlaying;

// Single notification chime for ordinary events
export const playOrderNotificationSound = () => {
  startContinuousOrderAlarm();
};
