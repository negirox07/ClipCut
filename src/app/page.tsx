"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { ClipstampContext, ClipstampContextType } from '@/contexts/clipstamp-context';
import Header from '@/components/clipstamp/header';
import VideoPreview from '@/components/clipstamp/video-preview';
import ControlTabs from '@/components/clipstamp/control-tabs';
import GeneratedContent from '@/components/clipstamp/generated-content';
import { useToast } from "@/hooks/use-toast";
import { generateCaption } from '@/ai/flows/generate-caption';
import { generateVoiceover } from '@/ai/flows/generate-voiceover';
import { getYoutubeVideoId } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';


export default function ClipStampPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 60]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [credits, setCredits] = useState('');
  const [captionDescription, setCaptionDescription] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [voiceoverScript, setVoiceoverScript] = useState('');
  const [generatedVoiceover, setGeneratedVoiceover] = useState<string | null>(null);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);
  const [previewTrigger, setPreviewTrigger] = useState(0);
  const [numberOfClips, setNumberOfClips] = useState(1);
  const [isGeneratingClips, setIsGeneratingClips] = useState(false);
  const [generatedClips, setGeneratedClips] = useState<string[]>([]);
  const [clipPrompt, setClipPrompt] = useState('A short, engaging clip from the video.');


  const { toast } = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    const id = getYoutubeVideoId(url);
    if (url && !id) {
        setVideoError('Please enter a valid YouTube URL.');
    } else {
        setVideoError('');
    }
    setVideoId(id);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateCaption = useCallback(async () => {
    if (!videoId || !captionDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a video URL and a description.",
      });
      return;
    }
    setIsGeneratingCaption(true);
    try {
      const result = await generateCaption({ videoLink: videoUrl, description: captionDescription });
      setGeneratedCaption(result.captions);
      toast({
        title: "Success",
        description: "Caption generated successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate caption.",
      });
    } finally {
      setIsGeneratingCaption(false);
    }
  }, [videoId, captionDescription, videoUrl, toast]);
  
  const handleGenerateVoiceover = useCallback(async () => {
    if (!voiceoverScript) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a script for the voiceover.",
      });
      return;
    }
    setIsGeneratingVoiceover(true);
    try {
      const result = await generateVoiceover({ script: voiceoverScript });
      setGeneratedVoiceover(result.media);
       toast({
        title: "Success",
        description: "Voiceover generated successfully!",
      });
    } catch (error) {
       console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate voiceover.",
      });
    } finally {
      setIsGeneratingVoiceover(false);
    }
  }, [voiceoverScript, toast]);

  const handleExportJson = () => {
    if (!videoId) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No video to export.",
        });
        return;
    }
    const data = {
      videoUrl,
      startTime: timeRange[0],
      endTime: timeRange[1],
      logo: logo?.name || null,
      credits,
      generatedCaption,
      voiceoverScript,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `clipstamp-${videoId}.json`;
    link.click();
    toast({
        title: "Success",
        description: "JSON data exported."
    });
  };

  const handleExportClip = useCallback(async () => {
    if (!videoUrl) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a valid YouTube URL.',
      });
      return;
    }

    setIsGeneratingClips(true);
    setGeneratedClips([]);
    toast({
      title: 'Generating Clip(s)',
      description: 'Your clip(s) are being generated. This might take a few moments.',
    });

    try {
      const formData = new FormData();
      formData.append('videoUrl', videoUrl);
      formData.append('startTime', String(timeRange[0]));
      formData.append('endTime', String(timeRange[1]));
      formData.append('numberOfClips', String(numberOfClips));
      if (logo) {
        formData.append('logo', logo);
      }
      formData.append('credits', credits);

      const response = await fetch('/api/clip', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate clips');
      }

      const { clips } = await response.json();
      setGeneratedClips(clips);

      toast({
        title: 'Success!',
        description: 'Your clip(s) have been generated.',
      });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Clips',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsGeneratingClips(false);
    }
  }, [videoUrl, timeRange, numberOfClips, logo, credits, toast]);


  const embedUrl = useMemo(() => {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?start=${timeRange[0]}&end=${timeRange[1]}&autoplay=1&key=${previewTrigger}`;
  }, [videoId, timeRange, previewTrigger]);


  const contextValue: ClipstampContextType = {
    videoUrl,
    setVideoUrl,
    videoError,
    videoId,
    setVideoId,
    handleUrlChange,
    timeRange,
    setTimeRange,
    logo,
    setLogo,
    logoPreview,
    setLogoPreview,
    handleLogoUpload,
    credits,
    setCredits,
    captionDescription,
    setCaptionDescription,
    generatedCaption,
    isGeneratingCaption,
    handleGenerateCaption,
    voiceoverScript,
    setVoiceoverScript,
    generatedVoiceover,
    isGeneratingVoiceover,
    handleGenerateVoiceover,
    handleExportJson,
    handleExportClip,
    embedUrl,
    triggerPreview: () => setPreviewTrigger(v => v + 1),
    numberOfClips,
    setNumberOfClips,
    isGeneratingClips,
    generatedClips,
    clipPrompt,
    setClipPrompt,
  };

  return (
    <ClipstampContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-8">
              <VideoPreview />
              <GeneratedContent />
            </div>
            <div className="lg:col-span-2">
              <ControlTabs />
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </ClipstampContext.Provider>
  );
}
