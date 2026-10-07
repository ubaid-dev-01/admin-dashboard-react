import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
  onSearch?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  title,
  onSearch 
}) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost"
          onClick={toggleSidebar}
          className="mr-2 md:hidden"
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
      
      {onSearch && (
        <div className="hidden md:block flex-1 max-w-lg px-6">
          <Input
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            icon={<Search size={18} />}
            fullWidth
          />
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          className="relative p-2"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="hidden md:flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
};