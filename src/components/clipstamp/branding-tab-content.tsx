"use client";

import React from 'react';
import { useClipstamp } from '@/contexts/clipstamp-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const BrandingTabContent = () => {
  const { logoPreview, handleLogoUpload, credits, setCredits } = useClipstamp();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Upload a logo to display in the corner of your video.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo Preview</Label>
            <div className="w-full h-32 rounded-md border border-dashed flex items-center justify-center bg-muted/50">
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo preview" width={100} height={100} className="object-contain max-h-full" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="mx-auto h-8 w-8" />
                  <p>Your logo will appear here</p>
                </div>
              )}
            </div>
          </div>
          <Input
            id="logo-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleLogoUpload}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Logo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
          <CardDescription>Add a credit line or link at the bottom of the video.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="credits">Credit Text</Label>
            <Input
              id="credits"
              placeholder="e.g., Edited by YourName"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandingTabContent;
