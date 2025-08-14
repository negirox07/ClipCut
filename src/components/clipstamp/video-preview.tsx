"use client";

import { useClipstamp } from '@/contexts/clipstamp-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film } from 'lucide-react';
import Image from 'next/image';

const VideoPreview = () => {
  const { videoId, embedUrl, logoPreview } = useClipstamp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          {videoId && embedUrl ? (
            <>
              <iframe
                key={embedUrl} // Re-renders iframe when URL changes
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
              {logoPreview && (
                 <div className="absolute top-4 right-4 w-24 h-24 p-2 bg-black/20 rounded-md">
                    <Image
                        src={logoPreview}
                        alt="Logo Preview"
                        layout="fill"
                        objectFit="contain"
                    />
                 </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <Film className="mx-auto h-12 w-12" />
              <p>Your video will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPreview;
