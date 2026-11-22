'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceState = 'idle' | 'recording' | 'thinking' | 'speaking';
export type SpeechLang = 'en-IN' | 'ta-IN';
export interface SpeakPayload { speech: string; lang: SpeechLang }

interface Options {
  lang: SpeechLang;                       // recognition language
  muted: boolean;
  ask: (text: string) => Promise<SpeakPayload>;
  onFinalTranscript?: (newFinalText: string) => void;
  onClearInput?: () => void;
}

function toSpeakable(text: string) {
  let t = text
    .replace(/[#*_~`>]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/₹\s?(\d+)/g, '$1 rupees')
    .replace(/^\s*[•\-]\s*/gm, '')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > 420) {
    const cut = t.slice(0, 420);
    const last = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('।'));
    t = last > 100 ? cut.slice(0, last + 1) : cut;
  }
  return t;
}

function chunkText(text: string) {
  const parts = text.match(/[^.!?।]+[.!?।]*/g) || [text];
  const out: string[] = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + p).length > 150 && cur) { out.push(cur.trim()); cur = p; }
    else cur += p;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function getVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const v = synth.getVoices();
    if (v.length) return resolve(v);
    const on = () => { synth.removeEventListener('voiceschanged', on); resolve(synth.getVoices()); };
    synth.addEventListener('voiceschanged', on);
    setTimeout(() => resolve(synth.getVoices()), 1500);
  });
}

/** Detect Chrome's SODA on-device recognition bug:
 *  speechstart fires but onresult never comes within SODA_TIMEOUT ms.
 *  Returns true if we are on a Chromium-based browser.
 */
function isChromium(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).chrome || /Chrome\/|Edg\//.test(navigator.userAgent);
}

// How long to wait after speechstart before flagging SODA silent failure
const SODA_TIMEOUT_MS = 6000;
// How long after last result to consider recognition stalled (SODA mid-session bug)
const RESULT_WATCHDOG_MS = 8000;

/* ══════════════════════════════════════════════════════════════════════════ */

export function useVoiceAgent({ lang, muted, ask, onFinalTranscript, onClearInput }: Options) {
  const [state, setState] = useState<VoiceState>('idle');
  const [interim, setInterim] = useState('');
  const [transcript, setTranscript] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const recRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsOkRef = useRef(true);
  const recordingRef = useRef(false);
  const intentionalStopRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  const committedRef = useRef('');
  const interimRef = useRef('');
  const recognitionErrorRef = useRef<string | null>(null);
  const runRef = useRef(0);

  // ── SODA silent-failure detection ─────────────────────────────────────────
  // Set when speechstart fires; cleared when first result arrives.
  const sodaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set after every result event; cleared on intentional stop.
  const resultWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Count consecutive SODA-style restarts so we don't loop forever.
  const sodaRetryRef = useRef(0);
  const MAX_SODA_RETRIES = 2;

  const langRef = useRef(lang);
  const mutedRef = useRef(muted);
  const askRef = useRef(ask);
  const onFinalRef = useRef(onFinalTranscript);
  const onClearRef = useRef(onClearInput);
  langRef.current = lang;
  mutedRef.current = muted;
  askRef.current = ask;
  onFinalRef.current = onFinalTranscript;
  onClearRef.current = onClearInput;

  const clearSodaTimers = () => {
    if (sodaTimerRef.current) { clearTimeout(sodaTimerRef.current); sodaTimerRef.current = null; }
    if (resultWatchdogRef.current) { clearTimeout(resultWatchdogRef.current); resultWatchdogRef.current = null; }
  };

  const stopAudio = () => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) getVoicesReady();
    return () => { try { recRef.current?.abort(); } catch {} stopAudio(); clearSodaTimers(); };
  }, []);

  /** Browser voice fallback */
  const browserSpeak = useCallback(async (text: string, speechLang: SpeechLang, run: number) => {
    const synth = window.speechSynthesis;
    if (!synth) { setState('idle'); return; }
    synth.cancel();
    const voices = await getVoicesReady();
    if (run !== runRef.current) return;

    let voice: SpeechSynthesisVoice | null = null;
    if (speechLang === 'en-IN') {
      voice =
        // 1. Explicit Indian English voices (Microsoft Heera, Ravi, Neerja, Prabhat, Google Indian English, Veena, Rishi)
        voices.find((v) => /en[-_]in/i.test(v.lang) && /india|indian|heera|ravi|neerja|prabhat|veena|rishi/i.test(v.name)) ||
        voices.find((v) => /en[-_]in/i.test(v.lang)) ||
        voices.find((v) => /india|indian/i.test(v.name)) ||
        voices.find((v) => /heera|ravi|neerja|prabhat|veena|rishi|kavya/i.test(v.name)) ||
        // 2. Soft, natural British/Commonwealth English if Indian voice not installed locally
        voices.find((v) => /en[-_]gb/i.test(v.lang) && /natural|neural|online/i.test(v.name)) ||
        voices.find((v) => /en[-_]gb/i.test(v.lang)) ||
        // 3. Fallback
        voices.find((v) => v.lang.startsWith('en')) ||
        null;
    } else {
      voice =
        voices.find((v) => /ta[-_]in/i.test(v.lang)) ||
        voices.find((v) => v.lang.startsWith('ta')) ||
        voices.find((v) => /tamil/i.test(v.name)) ||
        null;
    }

    const chunks = chunkText(text);
    setState('speaking');
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = voice?.lang || speechLang;
      if (voice) u.voice = voice;
      // Gentle, clear pace for Indian English
      u.rate = speechLang === 'en-IN' ? 0.93 : 1.0;
      u.pitch = 1.0;
      const last = i === chunks.length - 1;
      const end = () => { if (last && run === runRef.current) setState('idle'); };
      u.onend = end;
      u.onerror = (e: any) => { if (e?.error !== 'interrupted' && e?.error !== 'canceled') end(); };
      synth.speak(u);
    });
  }, []);

  /** Natural server voice first, browser voice if that is not available */
  const speak = useCallback(async (raw: string, speechLang: SpeechLang) => {
    const run = runRef.current;
    const text = toSpeakable(raw);
    if (!text || mutedRef.current) { setState('idle'); return; }
    setState('speaking');

    if (ttsOkRef.current) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang: speechLang }),
        });
        if (run !== runRef.current) return;
        if (res.ok) {
          const url = URL.createObjectURL(await res.blob());
          if (run !== runRef.current) { URL.revokeObjectURL(url); return; }
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => { URL.revokeObjectURL(url); if (run === runRef.current) setState('idle'); };
          audio.onerror = () => { URL.revokeObjectURL(url); if (run === runRef.current) browserSpeak(text, speechLang, run); };
          await audio.play();
          return;
        }
        if (res.status === 501) ttsOkRef.current = false;
      } catch { /* fall through to browser voice */ }
    }
    if (run === runRef.current) browserSpeak(text, speechLang, run);
  }, [browserSpeak]);

  const send = useCallback(async (text: string) => {
    const run = ++runRef.current;
    const clean = text.trim();
    if (!clean) {
      const recognitionError = recognitionErrorRef.current;
      recognitionErrorRef.current = null;
      setNotice(recognitionError || (langRef.current === 'en-IN'
        ? 'No speech was transcribed. If you spoke Tamil, choose தமிழ். Check microphone permission and try again.'
        : 'No speech was transcribed. Check microphone permission and try again.'));
      setState('idle');
      return;
    }
    recognitionErrorRef.current = null;
    setInterim(clean);
    setTranscript(clean);
    setState('thinking');
    let r: SpeakPayload;
    try { r = await askRef.current(clean); }
    catch { r = { speech: 'Sorry, something went wrong. Please try again.', lang: 'en-IN' }; }
    if (run !== runRef.current) return;
    speak(r.speech, r.lang);
  }, [speak]);

  const startSession = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setNotice('Mic speech is not supported here. Use Chrome or Edge, or type below.');
      recordingRef.current = false;
      setState('idle');
      return;
    }
    const rec = new SR();
    recRef.current = rec;
    rec.lang = langRef.current;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    // ── Track whether any result ever arrived this session ─────────────────
    let gotAnyResult = false;

    rec.onstart = () => {
      setState('recording');
      setNotice(null);
    };

    // ── SODA silent-failure: sound was detected but speech recognised ──────
    rec.onsoundstart = () => {
      // Start a timer — if no result arrives within SODA_TIMEOUT_MS, it's
      // the Chrome SODA bug (speechstart fired but onresult never fires).
      if (!sodaTimerRef.current && !gotAnyResult) {
        sodaTimerRef.current = setTimeout(() => {
          sodaTimerRef.current = null;
          if (!recordingRef.current || !isChromium()) return;

          if (sodaRetryRef.current < MAX_SODA_RETRIES) {
            // Silent restart: abort & reopen — sometimes clears the SODA lock
            sodaRetryRef.current++;
            try { recRef.current?.abort(); } catch {}
            setTimeout(() => {
              if (recordingRef.current && !intentionalStopRef.current) startSession();
            }, 400);
          } else {
            // Exhausted retries — tell the user about the Chrome SODA bug
            recordingRef.current = false;
            setState('idle');
            setNotice(
              "Chrome's speech recognition isn't returning results (known Chrome bug). " +
              'Fix: fully quit Chrome, delete "soda" entries from Chrome\'s Local State file, ' +
              'then restart Chrome. Or switch to Edge / type your question below.'
            );
          }
        }, SODA_TIMEOUT_MS);
      }
    };

    rec.onresult = (e: any) => {
      // ── First result clears the SODA timer — recognition is working ──────
      if (!gotAnyResult) {
        gotAnyResult = true;
        sodaRetryRef.current = 0;
        if (sodaTimerRef.current) { clearTimeout(sodaTimerRef.current); sodaTimerRef.current = null; }
      }

      // ── Reset result watchdog (detects mid-session SODA stall) ──────────
      if (resultWatchdogRef.current) clearTimeout(resultWatchdogRef.current);
      if (recordingRef.current && !intentionalStopRef.current) {
        resultWatchdogRef.current = setTimeout(() => {
          resultWatchdogRef.current = null;
          if (!recordingRef.current || intentionalStopRef.current) return;
          // Recognition has gone silent mid-session — restart it
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            try { recRef.current?.abort(); } catch {}
            setTimeout(() => {
              if (recordingRef.current && !intentionalStopRef.current) startSession();
            }, 300);
          }
        }, RESULT_WATCHDOG_MS);
      }

      let newlyFinalized = '';
      let currentInterim = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          newlyFinalized += t + ' ';
        } else {
          currentInterim += t;
        }
      }

      if (newlyFinalized || currentInterim) retryCountRef.current = 0;

      if (newlyFinalized.trim()) {
        const clean = newlyFinalized.trim();
        committedRef.current = (committedRef.current + ' ' + clean).trim();
        interimRef.current = '';
        if (onFinalRef.current) onFinalRef.current(clean);
      }

      interimRef.current = currentInterim.trim();
      setInterim(interimRef.current);
      setTranscript([committedRef.current, interimRef.current].filter(Boolean).join(' '));
    };

    rec.onerror = (e: any) => {
      const err = e?.error;
      clearSodaTimers();
      const fatal = (m: string) => {
        setNotice(m);
        intentionalStopRef.current = false;
        recordingRef.current = false;
        setState('idle');
      };
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        recognitionErrorRef.current = 'Microphone permission is blocked. Allow microphone access in your browser, then try again.';
        fatal('Mic permission blocked. Allow the microphone in the address bar.');
      } else if (err === 'audio-capture') {
        recognitionErrorRef.current = 'No microphone is available to the browser.';
        fatal('No microphone found.');
      } else if (err === 'language-not-supported') {
        recognitionErrorRef.current = 'The selected speech language is not supported by this browser. Try English mode.';
        fatal('This language is not supported by your browser mic. Try English mode.');
      } else if (err === 'network') {
        recognitionErrorRef.current = 'The browser speech service could not connect. Check your internet connection and try again in Chrome or Edge.';
        setNotice(recognitionErrorRef.current);
      } else if (err === 'no-speech') {
        recognitionErrorRef.current = langRef.current === 'en-IN'
          ? 'No speech was detected. If you spoke Tamil, choose தமிழ்.'
          : 'No speech was detected. Speak close to the microphone and try again.';
      }
    };

    rec.onend = () => {
      clearSodaTimers();
      setInterim('');

      // 1. Intentional user stop
      if (intentionalStopRef.current) {
        intentionalStopRef.current = false;
        recordingRef.current = false;
        const full = [committedRef.current, interimRef.current].filter(Boolean).join(' ').trim();
        committedRef.current = '';
        interimRef.current = '';
        if (onClearRef.current) onClearRef.current();
        send(full);
        return;
      }

      // 2. Browser unexpectedly ended the session while user was still recording
      if (recordingRef.current) {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => {
            if (recordingRef.current && !intentionalStopRef.current) startSession();
          }, 500);
        } else {
          recordingRef.current = false;
          const full = [committedRef.current, interimRef.current].filter(Boolean).join(' ').trim();
          committedRef.current = '';
          interimRef.current = '';
          if (full) {
            if (onClearRef.current) onClearRef.current();
            send(full);
          } else {
            setState('idle');
            setNotice(recognitionErrorRef.current || 'Microphone timed out. Tap the mic to speak again.');
          }
        }
      }
    };

    try {
      rec.start();
    } catch {
      setTimeout(() => {
        if (recordingRef.current && !intentionalStopRef.current) startSession();
      }, 500);
    }
  }, [send]);

  /** Tap 1: start recording */
  const startRecording = useCallback((initialText?: string) => {
    runRef.current++;
    stopAudio();
    clearSodaTimers();
    sodaRetryRef.current = 0;
    try { recRef.current?.abort(); } catch {}
    committedRef.current = initialText ? initialText.trim() : '';
    interimRef.current = '';
    intentionalStopRef.current = false;
    recordingRef.current = true;
    retryCountRef.current = 0;
    recognitionErrorRef.current = null;
    setNotice(null);
    setInterim('');
    setTranscript(committedRef.current);
    setState('recording');
    startSession();
  }, [startSession]);

  /** Tap 2: stop recording, then recognize + answer */
  const stopRecording = useCallback(() => {
    if (!recordingRef.current) return;
    intentionalStopRef.current = true;
    clearSodaTimers();
    setState('thinking');
    try {
      recRef.current?.stop();
    } catch {
      intentionalStopRef.current = false;
      recordingRef.current = false;
      setState('idle');
    }

    // Safety timeout in case browser onend event hangs
    const run = runRef.current;
    setTimeout(() => {
      if (intentionalStopRef.current && run === runRef.current) {
        intentionalStopRef.current = false;
        recordingRef.current = false;
        const full = [committedRef.current, interimRef.current].filter(Boolean).join(' ').trim();
        committedRef.current = '';
        interimRef.current = '';
        if (onClearRef.current) onClearRef.current();
        send(full);
      }
    }, 1800);
  }, [send]);

  /** Stop everything */
  const stop = useCallback(() => {
    runRef.current++;
    recordingRef.current = false;
    intentionalStopRef.current = false;
    clearSodaTimers();
    sodaRetryRef.current = 0;
    try { recRef.current?.abort(); } catch {}
    stopAudio();
    setState('idle');
    setInterim('');
    setTranscript('');
  }, []);

  /** Greeting without opening the mic */
  const say = useCallback((text: string, speechLang: SpeechLang = 'en-IN') => {
    runRef.current++;
    speak(text, speechLang);
  }, [speak]);

  /** Typed text or topic card: answer by voice */
  const submit = useCallback((text: string) => {
    try { recRef.current?.abort(); } catch {}
    recordingRef.current = false;
    stopAudio();
    send(text);
  }, [send]);

  return { state, interim, transcript, notice, setNotice, startRecording, stopRecording, stop, say, submit };
}
