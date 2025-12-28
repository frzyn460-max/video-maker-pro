// ============================================
// Media Store - مدیریت فایل‌های مدیا
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import storageService from '../services/storageService';
import { 
  fileToBase64, 
  validateFile, 
  getFileType, 
  generateId 
} from '../utils/helpers';
import { MEDIA_TYPES } from '../utils/constants';

const useMediaStore = create(
  devtools(
    (set, get) => ({
      // ============================================
      // State
      // ============================================
      bgImage: null,
      bgVideo: null,
      audio: null,
      bgType: null,
      
      // لیست فایل‌های آپلود شده
      uploadedMedia: [],
      
      // وضعیت آپلود
      isUploading: false,
      uploadProgress: 0,
      
      // تنظیمات پس‌زمینه
      bgSettings: {
        opacity: 50,
        blur: 10,
      },
      
      // تنظیمات صدا
      audioSettings: {
        volume: 100,
        loop: true,
        fadeIn: false,
        fadeOut: false,
      },
      
      // Audio Player State
      audioPlaying: false,
      audioCurrentTime: 0,
      audioDuration: 0,
      
      error: null,

      // ============================================
      // آپلود تصویر پس‌زمینه
      // ============================================
      uploadBackgroundImage: async (file) => {
        set({ isUploading: true, error: null, uploadProgress: 0 });
        
        try {
          // اعتبارسنجی
          const validation = validateFile(file, MEDIA_TYPES.IMAGE);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          // تبدیل به Base64
          set({ uploadProgress: 30 });
          const base64 = await fileToBase64(file);
          
          set({ uploadProgress: 70 });

          const media = {
            id: generateId(),
            type: MEDIA_TYPES.IMAGE,
            name: file.name,
            size: file.size,
            data: base64,
            uploadedAt: Date.now(),
          };

          set({
            bgImage: media,
            bgType: MEDIA_TYPES.IMAGE,
            bgVideo: null,
            uploadProgress: 100,
            isUploading: false,
          });

          // اضافه به لیست آپلود شده‌ها
          get().addToUploadedMedia(media);

          return media;
        } catch (error) {
          set({ 
            error: error.message, 
            isUploading: false,
            uploadProgress: 0,
          });
          throw error;
        }
      },

      // ============================================
      // آپلود ویدیو پس‌زمینه
      // ============================================
      uploadBackgroundVideo: async (file) => {
        set({ isUploading: true, error: null, uploadProgress: 0 });
        
        try {
          const validation = validateFile(file, MEDIA_TYPES.VIDEO);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          set({ uploadProgress: 30 });
          const base64 = await fileToBase64(file);
          
          set({ uploadProgress: 70 });

          const media = {
            id: generateId(),
            type: MEDIA_TYPES.VIDEO,
            name: file.name,
            size: file.size,
            data: base64,
            uploadedAt: Date.now(),
          };

          set({
            bgVideo: media,
            bgType: MEDIA_TYPES.VIDEO,
            bgImage: null,
            uploadProgress: 100,
            isUploading: false,
          });

          get().addToUploadedMedia(media);

          return media;
        } catch (error) {
          set({ 
            error: error.message, 
            isUploading: false,
            uploadProgress: 0,
          });
          throw error;
        }
      },

      // ============================================
      // آپلود فایل صوتی
      // ============================================
      uploadAudio: async (file) => {
        set({ isUploading: true, error: null, uploadProgress: 0 });
        
        try {
          const validation = validateFile(file, MEDIA_TYPES.AUDIO);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          set({ uploadProgress: 30 });
          const base64 = await fileToBase64(file);
          
          set({ uploadProgress: 70 });

          const media = {
            id: generateId(),
            type: MEDIA_TYPES.AUDIO,
            name: file.name,
            size: file.size,
            data: base64,
            uploadedAt: Date.now(),
          };

          set({
            audio: media,
            uploadProgress: 100,
            isUploading: false,
          });

          get().addToUploadedMedia(media);

          return media;
        } catch (error) {
          set({ 
            error: error.message, 
            isUploading: false,
            uploadProgress: 0,
          });
          throw error;
        }
      },

      // ============================================
      // حذف پس‌زمینه
      // ============================================
      removeBackground: () => {
        set({
          bgImage: null,
          bgVideo: null,
          bgType: null,
        });
      },

      // ============================================
      // حذف صدا
      // ============================================
      removeAudio: () => {
        set({
          audio: null,
          audioPlaying: false,
          audioCurrentTime: 0,
          audioDuration: 0,
        });
      },

      // ============================================
      // تنظیمات پس‌زمینه
      // ============================================
      updateBgSettings: (updates) => {
        set((state) => ({
          bgSettings: { ...state.bgSettings, ...updates },
        }));
      },

      setBgOpacity: (opacity) => {
        set((state) => ({
          bgSettings: { ...state.bgSettings, opacity },
        }));
      },

      setBgBlur: (blur) => {
        set((state) => ({
          bgSettings: { ...state.bgSettings, blur },
        }));
      },

      // ============================================
      // تنظیمات صدا
      // ============================================
      updateAudioSettings: (updates) => {
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...updates },
        }));
      },

      setVolume: (volume) => {
        set((state) => ({
          audioSettings: { ...state.audioSettings, volume },
        }));
      },

      toggleLoop: () => {
        set((state) => ({
          audioSettings: {
            ...state.audioSettings,
            loop: !state.audioSettings.loop,
          },
        }));
      },

      // ============================================
      // کنترل Audio Player
      // ============================================
      toggleAudioPlayback: () => {
        set((state) => ({
          audioPlaying: !state.audioPlaying,
        }));
      },

      setAudioPlaying: (playing) => {
        set({ audioPlaying: playing });
      },

      setAudioCurrentTime: (time) => {
        set({ audioCurrentTime: time });
      },

      setAudioDuration: (duration) => {
        set({ audioDuration: duration });
      },

      seekAudio: (time) => {
        const { audioDuration } = get();
        set({ 
          audioCurrentTime: Math.max(0, Math.min(time, audioDuration)) 
        });
      },

      // ============================================
      // مدیریت فایل‌های آپلود شده
      // ============================================
      addToUploadedMedia: (media) => {
        set((state) => ({
          uploadedMedia: [media, ...state.uploadedMedia],
        }));
      },

      removeFromUploadedMedia: (id) => {
        set((state) => ({
          uploadedMedia: state.uploadedMedia.filter((m) => m.id !== id),
        }));
      },

      clearUploadedMedia: () => {
        set({ uploadedMedia: [] });
      },

      // ============================================
      // استفاده از فایل آپلود شده
      // ============================================
      useUploadedMedia: (mediaId) => {
        const { uploadedMedia } = get();
        const media = uploadedMedia.find((m) => m.id === mediaId);
        
        if (!media) return;

        switch (media.type) {
          case MEDIA_TYPES.IMAGE:
            set({
              bgImage: media,
              bgType: MEDIA_TYPES.IMAGE,
              bgVideo: null,
            });
            break;
          case MEDIA_TYPES.VIDEO:
            set({
              bgVideo: media,
              bgType: MEDIA_TYPES.VIDEO,
              bgImage: null,
            });
            break;
          case MEDIA_TYPES.AUDIO:
            set({ audio: media });
            break;
          default:
            break;
        }
      },

      // ============================================
      // ذخیره و بارگذاری از پروژه
      // ============================================
      saveMediaToProject: async (projectId) => {
        const { bgImage, bgVideo, audio, bgSettings, audioSettings } = get();
        
        const mediaData = {
          bgImage,
          bgVideo,
          audio,
          bgSettings,
          audioSettings,
        };

        // اینجا می‌تونیم با storageService ذخیره کنیم
        return mediaData;
      },

      loadMediaFromProject: (mediaData) => {
        if (!mediaData) return;

        set({
          bgImage: mediaData.bgImage || null,
          bgVideo: mediaData.bgVideo || null,
          audio: mediaData.audio || null,
          bgType: mediaData.bgImage 
            ? MEDIA_TYPES.IMAGE 
            : mediaData.bgVideo 
            ? MEDIA_TYPES.VIDEO 
            : null,
          bgSettings: mediaData.bgSettings || {
            opacity: 50,
            blur: 10,
          },
          audioSettings: mediaData.audioSettings || {
            volume: 100,
            loop: true,
            fadeIn: false,
            fadeOut: false,
          },
        });
      },

      // ============================================
      // آمار
      // ============================================
      getMediaStats: () => {
        const { bgImage, bgVideo, audio, uploadedMedia } = get();
        
        let totalSize = 0;
        if (bgImage) totalSize += bgImage.size;
        if (bgVideo) totalSize += bgVideo.size;
        if (audio) totalSize += audio.size;

        return {
          hasBackground: !!(bgImage || bgVideo),
          hasAudio: !!audio,
          totalFiles: uploadedMedia.length,
          totalSize,
        };
      },

      // ============================================
      // Export State
      // ============================================
      exportMediaState: () => {
        const { 
          bgImage, 
          bgVideo, 
          audio, 
          bgSettings, 
          audioSettings 
        } = get();
        
        return {
          bgImage,
          bgVideo,
          audio,
          bgSettings,
          audioSettings,
        };
      },

      // ============================================
      // ریست
      // ============================================
      clearError: () => {
        set({ error: null });
      },

      resetMedia: () => {
        set({
          bgImage: null,
          bgVideo: null,
          audio: null,
          bgType: null,
          uploadedMedia: [],
          isUploading: false,
          uploadProgress: 0,
          bgSettings: {
            opacity: 50,
            blur: 10,
          },
          audioSettings: {
            volume: 100,
            loop: true,
            fadeIn: false,
            fadeOut: false,
          },
          audioPlaying: false,
          audioCurrentTime: 0,
          audioDuration: 0,
          error: null,
        });
      },
    }),
    { name: 'MediaStore' }
  )
);

export default useMediaStore;