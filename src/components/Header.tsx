import React from 'react';
import { GraduationCap, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Assessment Portal</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="input pl-10 w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;