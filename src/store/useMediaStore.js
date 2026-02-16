/* 
 * مسیر: /video-maker-pro/src/store/useMediaStore.js
 * ✨ نسخه کامل - مدیریت کامل مدیا با Waveform
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useMediaStore = create(
  subscribeWithSelector((set, get) => ({
    // ── Background media ──────────────────────────────────
    backgroundMedia: null,

    addBackgroundMedia: (media) => set({ backgroundMedia: media }),
    removeBackgroundMedia: () => set({ backgroundMedia: null }),

    // ── Audio track ───────────────────────────────────────
    audioTrack: null,
    audioElement: null,       // HTMLAudioElement در حافظه
    audioPlaying: false,
    audioCurrentTime: 0,
    audioDuration: 0,
    audioVolume: 70,
    audioMuted: false,
    audioWaveform: [],        // داده‌های waveform

    setAudioTrack: (track) => set({ audioTrack: track }),
    removeAudioTrack: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      set({
        audioTrack: null,
        audioElement: null,
        audioPlaying: false,
        audioCurrentTime: 0,
        audioDuration: 0,
        audioWaveform: [],
      });
    },

    setAudioElement: (el) => set({ audioElement: el }),
    setAudioPlaying: (p) => set({ audioPlaying: p }),
    setAudioCurrentTime: (t) => set({ audioCurrentTime: t }),
    setAudioDuration: (d) => set({ audioDuration: d }),
    setAudioVolume: (v) => {
      const { audioElement } = get();
      if (audioElement) audioElement.volume = v / 100;
      set({ audioVolume: v });
    },
    setAudioMuted: (m) => {
      const { audioElement } = get();
      if (audioElement) audioElement.muted = m;
      set({ audioMuted: m });
    },

    toggleAudioPlay: () => {
      const { audioElement, audioPlaying } = get();
      if (!audioElement) return;
      if (audioPlaying) {
        audioElement.pause();
        set({ audioPlaying: false });
      } else {
        audioElement.play().catch(() => {});
        set({ audioPlaying: true });
      }
    },

    seekAudio: (time) => {
      const { audioElement } = get();
      if (!audioElement) return;
      audioElement.currentTime = time;
      set({ audioCurrentTime: time });
    },

    // Waveform data از AudioContext
    generateWaveform: async (url) => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(buf);
        const raw = decoded.getChannelData(0);
        const samples = 80;
        const blockSize = Math.floor(raw.length / samples);
        const waveform = Array.from({ length: samples }, (_, i) => {
          const start = i * blockSize;
          let sum = 0;
          for (let j = start; j < start + blockSize; j++) {
            sum += Math.abs(raw[j] || 0);
          }
          return Math.min(1, (sum / blockSize) * 3);
        });
        set({ audioWaveform: waveform });
        ctx.close();
      } catch {
        set({ audioWaveform: [] });
      }
    },

    // ── Extra media (overlays, watermarks) ───────────────
    overlays: [],

    addOverlay: (overlay) => {
      set(state => ({
        overlays: [...state.overlays, { id: Date.now().toString(), ...overlay }],
      }));
    },

    removeOverlay: (id) => {
      set(state => ({ overlays: state.overlays.filter(o => o.id !== id) }));
    },
  }))
);

export default useMediaStore;