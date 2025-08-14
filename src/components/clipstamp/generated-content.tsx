"use client";

import { useClipstamp } from '@/contexts/clipstamp-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Captions, AudioLines, Video } from 'lucide-react';

const GeneratedContent = () => {
  const { generatedCaption, generatedVoiceover, generatedClips, isGeneratingClips } = useClipstamp();

  const showCard = generatedCaption || generatedVoiceover || generatedClips.length > 0 || isGeneratingClips;

  if (!showCard) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <CardDescription>Review the content created by our AI tools.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {generatedCaption && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Captions className="w-4 h-4 text-primary" />
              Generated Caption
            </h3>
            <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
              {generatedCaption}
            </blockquote>
          </div>
        )}
        {generatedVoiceover && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AudioLines className="w-4 h-4 text-primary" />
              Generated Voiceover
            </h3>
            <audio controls src={generatedVoiceover} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        {(generatedClips.length > 0 || isGeneratingClips) && (
            <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    Generated Clips
                </h3>
                {isGeneratingClips && generatedClips.length === 0 && (
                    <div className="text-center text-muted-foreground">Generating clips...</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generatedClips.map((clip, index) => (
                        <div key={index} className="space-y-2">
                            <p className="text-xs font-medium">Clip {index + 1}</p>
                            <video controls src={clip} className="w-full rounded-md" />
                        </div>
                    ))}
                 </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedContent;
