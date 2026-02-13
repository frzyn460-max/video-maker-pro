/* 
 * مسیر: /video-maker-pro/src/store/useMediaStore.js
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMediaStore = create(
  persist(
    (set, get) => ({
      // مدیا
      backgroundMedia: null,
      audioTrack: null,
      uploadedImages: [],
      uploadedVideos: [],
      uploadedAudios: [],

      // ✅ تنظیم پس‌زمینه (عکس یا ویدیو)
      setBackgroundMedia: (media) => set({ backgroundMedia: media }),

      // ✅ اضافه کردن پس‌زمینه (عکس یا ویدیو)
      addBackgroundMedia: (media) => set({ backgroundMedia: media }),

      // ✅ حذف پس‌زمینه
      removeBackgroundMedia: () => set({ backgroundMedia: null }),

      // ✅ تنظیم موسیقی
      setAudioTrack: (audio) => set({ audioTrack: audio }),

      // ✅ اضافه کردن موسیقی
      addAudioTrack: (audio) => set({ audioTrack: audio }),

      // ✅ حذف موسیقی
      removeAudioTrack: () => set({ audioTrack: null }),

      // ✅ اضافه کردن عکس به لیست
      addImage: (image) => set((state) => ({
        uploadedImages: [...state.uploadedImages, image]
      })),

      // ✅ اضافه کردن ویدیو به لیست
      addVideo: (video) => set((state) => ({
        uploadedVideos: [...state.uploadedVideos, video]
      })),

      // ✅ اضافه کردن موسیقی به لیست
      addAudio: (audio) => set((state) => ({
        uploadedAudios: [...state.uploadedAudios, audio]
      })),

      // ✅ حذف عکس
      removeImage: (id) => set((state) => ({
        uploadedImages: state.uploadedImages.filter(img => img.id !== id)
      })),

      // ✅ حذف ویدیو
      removeVideo: (id) => set((state) => ({
        uploadedVideos: state.uploadedVideos.filter(vid => vid.id !== id)
      })),

      // ✅ حذف موسیقی
      removeAudio: (id) => set((state) => ({
        uploadedAudios: state.uploadedAudios.filter(aud => aud.id !== id)
      })),

      // ✅ پاک کردن همه مدیا
      clearAllMedia: () => set({
        backgroundMedia: null,
        audioTrack: null,
        uploadedImages: [],
        uploadedVideos: [],
        uploadedAudios: []
      }),

      // ✅ دریافت حجم کل فایل‌ها
      getTotalSize: () => {
        const state = get();
        let totalSize = 0;

        if (state.backgroundMedia?.size) {
          totalSize += state.backgroundMedia.size;
        }

        if (state.audioTrack?.size) {
          totalSize += state.audioTrack.size;
        }

        state.uploadedImages.forEach(img => {
          if (img.size) totalSize += img.size;
        });

        state.uploadedVideos.forEach(vid => {
          if (vid.size) totalSize += vid.size;
        });

        state.uploadedAudios.forEach(aud => {
          if (aud.size) totalSize += aud.size;
        });

        return totalSize;
      }
    }),
    {
      name: 'media-storage',
      partialize: (state) => ({
        // فقط metadata ذخیره می‌شه، نه خود فایل‌ها
        backgroundMedia: state.backgroundMedia ? {
          type: state.backgroundMedia.type,
          name: state.backgroundMedia.name
        } : null
      })
    }
  )
);

export default useMediaStore;