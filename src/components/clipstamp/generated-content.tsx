"use client";

import { useClipstamp } from '@/contexts/clipstamp-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Captions, AudioLines } from 'lucide-react';

const GeneratedContent = () => {
  const { generatedCaption, generatedVoiceover } = useClipstamp();

  if (!generatedCaption && !generatedVoiceover) {
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
      </CardContent>
    </Card>
  );
};

export default GeneratedContent;
