import { create } from "zustand";

const SIZE_MAP = {
  sm: { height: 320, width: 480 },
  md: { height: 600, width: 800 },
  lg: { height: 720, width: 1280 },
  xl: { height: 1080, width: 1920 },
  "2xl": { height: 1440, width: 2160 },
};

const DEFAULT_SIZE: keyof typeof SIZE_MAP = "2xl";

export interface ImageQualityState {
  size: keyof typeof SIZE_MAP;
  height: number;
  width: number;
  resetSize: () => void;
  setSize: (size: keyof typeof SIZE_MAP) => void;
}

export const useImageQualityStore = create<ImageQualityState>((set) => ({
  size: DEFAULT_SIZE,
  height: SIZE_MAP[DEFAULT_SIZE].height,
  width: SIZE_MAP[DEFAULT_SIZE].width,
  resetSize: () =>
    set({
      size: DEFAULT_SIZE,
      height: SIZE_MAP[DEFAULT_SIZE].height,
      width: SIZE_MAP[DEFAULT_SIZE].width,
    }),
  setSize: (size) =>
    set({
      size: size,
      height: SIZE_MAP[size].height,
      width: SIZE_MAP[size].width,
    }),
}));
