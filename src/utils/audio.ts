// Audio effects generator using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTacticalBeep(freq = 880, type: OscillatorType = 'sine', duration = 0.08, vol = 0.08) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors if blocked by browser policy
  }
}

export function playDispatchChirp() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(520, now);
    osc1.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(780, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(1560, now + 0.18);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.22);
  } catch (e) {}
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTacticalBeep(freq, 'sine', 0.12, 0.06);
      }, idx * 60);
    });
  } catch (e) {}
}

export function playHighPriorityAlert() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    // Ascending arpeggio with celebratory harmonic resonance
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTacticalBeep(freq, 'triangle', 0.14, 0.08);
      }, idx * 75);
    });
  } catch (e) {}
}

export function playErrorAlarm() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);

    // Second buzz
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const now2 = ctx.currentTime;
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(200, now2);
        osc2.frequency.linearRampToValueAtTime(130, now2 + 0.25);
        gain2.gain.setValueAtTime(0.09, now2);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now2 + 0.28);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now2);
        osc2.stop(now2 + 0.28);
      } catch (e) {}
    }, 150);
  } catch (e) {}
}

export function speakAgentTTS(text: string, voicePitch = 1.0, voiceRate = 1.1) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = voicePitch;
    utterance.rate = voiceRate;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  } catch (e) {}
}

// 4D Saiyan Ki & Combat Sound Effects
export function playInstantTransmissionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {}
}

export function playKiChargeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(740, now + 0.5);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  } catch (e) {}
}

export function playKamehamehaSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Wave 1: Ascending beam charge
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.4);
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Wave 2: Explosive blast release
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const now2 = ctx.currentTime;
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(600, now2);
        osc2.frequency.exponentialRampToValueAtTime(80, now2 + 0.5);
        gain2.gain.setValueAtTime(0.18, now2);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now2 + 0.55);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now2);
        osc2.stop(now2 + 0.55);
      } catch (e) {}
    }, 380);
  } catch (e) {}
}

// 3D Celestial Dragon Roar & Ki Breath Sound Effects
export function playDragonRoarSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sub-bass growl layer
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(85, now);
    subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.75);

    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.16, now + 0.2);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.8);

    // Resonant roar overtone layer
    const roarOsc = ctx.createOscillator();
    const roarGain = ctx.createGain();
    roarOsc.type = 'triangle';
    roarOsc.frequency.setValueAtTime(320, now);
    roarOsc.frequency.linearRampToValueAtTime(540, now + 0.3);
    roarOsc.frequency.exponentialRampToValueAtTime(110, now + 0.7);

    roarGain.gain.setValueAtTime(0.01, now);
    roarGain.gain.linearRampToValueAtTime(0.12, now + 0.25);
    roarGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    roarOsc.connect(roarGain);
    roarGain.connect(ctx.destination);
    roarOsc.start(now);
    roarOsc.stop(now + 0.75);
  } catch (e) {}
}

export function playDragonKiBreathSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.65);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  } catch (e) {}
}

// ==========================================================================
// Beautiful Girl Voice Synthesizer & Personas
// ==========================================================================

export interface VoicePersonaDef {
  id: string;
  name: string;
  title: string;
  description: string;
  pitch: number;
  rate: number;
  avatar: string;
  accent: string;
  greeting: string;
}

export const FEMALE_PERSONAS: VoicePersonaDef[] = [
  {
    id: 'celeste',
    name: 'Celeste',
    title: 'Harmonic Cyber Maiden',
    description: 'Ultra-clear, crystalline feminine timbre with melodic high notes and comforting warmth.',
    pitch: 1.25,
    rate: 1.02,
    avatar: '🌸',
    accent: 'US / Cyber Melodic',
    greeting: 'Hello! I am Celeste, your harmonic AI companion. How may I assist your mission today?'
  },
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'Ethereal AI Navigator & Show Host',
    description: 'Bright, energetic, natural feminine cadence optimized for market intelligence & live broadcasting.',
    pitch: 1.20,
    rate: 1.08,
    avatar: '✨',
    accent: 'UK / Crystal Clean',
    greeting: 'Welcome to the Omni live studio! I am Lyra. Let us explore the Dollar and Bitcoin markets together.'
  },
  {
    id: 'aria',
    name: 'Aria',
    title: 'Warm Celestial Companion',
    description: 'Soft-spoken, soothing, velvety feminine tone designed for relaxed strategic planning.',
    pitch: 1.15,
    rate: 0.98,
    avatar: '🌙',
    accent: 'Soft International',
    greeting: 'Greetings. Aria here. Whatever task you need across our system, I am ready to perform it for you.'
  },
  {
    id: 'sophia',
    name: 'Sophia',
    title: 'Executive Intelligence Specialist',
    description: 'Crisp, articulate, polished feminine voice with executive confidence and high clarity.',
    pitch: 1.18,
    rate: 1.05,
    avatar: '💎',
    accent: 'Executive English',
    greeting: 'Sophia at your service. All telemetry, bullion vaults, and satellite arrays are synchronized.'
  }
];

let activeSpeechUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeSpeechUtterance = null;
    } catch (e) {}
  }
}

export function speakBeautifulGirlVoice(
  text: string, 
  personaId = 'celeste', 
  onStart?: () => void, 
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();

    // Clean text of markdown backticks or json before speaking
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_~]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();

    if (!cleanText) return;

    const persona = FEMALE_PERSONAS.find(p => p.id === personaId) || FEMALE_PERSONAS[0];
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Filter available browser voices for natural feminine voices
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Priority feminine voice candidate names
      const femaleNames = [
        'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 
        'zira', 'jenny', 'aria', 'female', 'natural', 'woman',
        'google uk english female', 'google us english'
      ];

      const foundVoice = voices.find(v => {
        const vName = v.name.toLowerCase();
        return femaleNames.some(fn => vName.includes(fn));
      }) || voices.find(v => v.lang.startsWith('en'));

      if (foundVoice) {
        utterance.voice = foundVoice;
      }
    }

    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;
    utterance.volume = 0.95;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      activeSpeechUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      activeSpeechUtterance = null;
      if (onEnd) onEnd();
    };

    activeSpeechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onEnd) onEnd();
  }
}

export function playOmniGemChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Crystalline gem harmonic chime: E6 -> G#6 -> B6 -> E7
    const freqs = [1318.51, 1661.22, 1975.53, 2637.02];
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = ctx.currentTime;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        } catch (e) {}
      }, idx * 55);
    });
  } catch (e) {}
}

export function playCryptoTickSound(isUp = true) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isUp ? 980 : 440, now);
    osc.frequency.exponentialRampToValueAtTime(isUp ? 1320 : 330, now + 0.06);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}


