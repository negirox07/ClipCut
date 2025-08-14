"use client";

import React from 'react';
import { useClipstamp } from '@/contexts/clipstamp-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Download, Scissors, Link2, Play } from 'lucide-react';
import { formatTime } from '@/lib/utils';

const ClippingTabContent = () => {
  const {
    videoUrl,
    handleUrlChange,
    videoError,
    videoId,
    timeRange,
    setTimeRange,
    handleExportJson,
    handleExportClip,
    triggerPreview,
  } = useClipstamp();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Source</CardTitle>
          <CardDescription>Paste a link to a YouTube video to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="video-url">YouTube URL</Label>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <Input
                id="video-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={handleUrlChange}
                className={videoError ? 'border-destructive' : ''}
              />
            </div>
            {videoError && <p className="text-sm text-destructive">{videoError}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clip Time</CardTitle>
          <CardDescription>Select the start and end times for your clip.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Slider
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as [number, number])}
              max={3600} // Default to 1 hour, should be updated based on video length
              step={1}
              disabled={!videoId}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Start: {formatTime(timeRange[0])}</span>
              <span>End: {formatTime(timeRange[1])}</span>
            </div>
          </div>
           <Button onClick={triggerPreview} disabled={!videoId} variant="outline" size="sm">
            <Play className="mr-2 h-4 w-4" />
            Preview Clip
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Download your clipped video or project data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={handleExportClip} disabled={!videoId}>
            <Scissors className="mr-2 h-4 w-4" />
            Export Clip
          </Button>
          <Button variant="outline" onClick={handleExportJson} disabled={!videoId}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClippingTabContent;
