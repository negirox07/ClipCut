"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClippingTabContent from './clipping-tab-content';
import BrandingTabContent from './branding-tab-content';
import AiToolsTabContent from './ai-tools-tab-content';
import { Scissors, Palette, Sparkles } from 'lucide-react';

const ControlTabs = () => {
  return (
    <Tabs defaultValue="clipping" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="clipping">
          <Scissors className="w-4 h-4 mr-2" />
          Clipping
        </TabsTrigger>
        <TabsTrigger value="branding">
          <Palette className="w-4 h-4 mr-2" />
          Branding
        </TabsTrigger>
        <TabsTrigger value="ai-tools">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Tools
        </TabsTrigger>
      </TabsList>
      <TabsContent value="clipping" className="mt-6">
        <ClippingTabContent />
      </TabsContent>
      <TabsContent value="branding" className="mt-6">
        <BrandingTabContent />
      </TabsContent>
      <TabsContent value="ai-tools" className="mt-6">
        <AiToolsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default ControlTabs;
