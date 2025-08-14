"use client";
import { Film } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">ClipStamp</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
