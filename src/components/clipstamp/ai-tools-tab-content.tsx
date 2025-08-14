"use client";

import React from 'react';
import { useClipstamp } from '@/contexts/clipstamp-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

const AiToolsTabContent = () => {
  const {
    captionDescription,
    setCaptionDescription,
    handleGenerateCaption,
    isGeneratingCaption,
    voiceoverScript,
    setVoiceoverScript,
    handleGenerateVoiceover,
    isGeneratingVoiceover,
  } = useClipstamp();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Caption Generator
          </CardTitle>
          <CardDescription>
            Generate an engaging caption for your video clip based on a short description.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption-description">Video Description</Label>
            <Textarea
              id="caption-description"
              placeholder="e.g., A cat playing with a laser pointer."
              value={captionDescription}
              onChange={(e) => setCaptionDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateCaption} disabled={isGeneratingCaption || !captionDescription}>
            {isGeneratingCaption ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Caption
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Voiceover
          </CardTitle>
          <CardDescription>
            Create a voiceover from a script. This can replace the original audio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voiceover-script">Voiceover Script</Label>
            <Textarea
              id="voiceover-script"
              placeholder="Enter the script for the voiceover..."
              rows={5}
              value={voiceoverScript}
              onChange={(e) => setVoiceoverScript(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateVoiceover} disabled={isGeneratingVoiceover || !voiceoverScript}>
            {isGeneratingVoiceover ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Voiceover
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiToolsTabContent;
