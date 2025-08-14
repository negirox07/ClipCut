"use client";

import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export interface ClipstampContextType {
  videoUrl: string;
  setVideoUrl: Dispatch<SetStateAction<string>>;
  videoError: string;
  videoId: string | null;
  setVideoId: Dispatch<SetStateAction<string | null>>;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  timeRange: [number, number];
  setTimeRange: Dispatch<SetStateAction<[number, number]>>;
  logo: File | null;
  setLogo: Dispatch<SetStateAction<File | null>>;
  logoPreview: string | null;
  setLogoPreview: Dispatch<SetStateAction<string | null>>;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  credits: string;
  setCredits: Dispatch<SetStateAction<string>>;
  captionDescription: string;
  setCaptionDescription: Dispatch<SetStateAction<string>>;
  generatedCaption: string;
  isGeneratingCaption: boolean;
  handleGenerateCaption: () => Promise<void>;
  voiceoverScript: string;
  setVoiceoverScript: Dispatch<SetStateAction<string>>;
  generatedVoiceover: string | null;
  isGeneratingVoiceover: boolean;
  handleGenerateVoiceover: () => Promise<void>;
  handleExportJson: () => void;
  handleExportClip: () => Promise<void>;
  embedUrl: string | null;
  triggerPreview: () => void;
  numberOfClips: number;
  setNumberOfClips: Dispatch<SetStateAction<number>>;
  isGeneratingClips: boolean;
  generatedClips: string[];
}

export const ClipstampContext = createContext<ClipstampContextType | null>(null);

export const useClipstamp = (): ClipstampContextType => {
  const context = useContext(ClipstampContext);
  if (!context) {
    throw new Error('useClipstamp must be used within a ClipstampProvider');
  }
  return context;
};
