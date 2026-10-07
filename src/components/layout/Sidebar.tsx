import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  BarChart3,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

import { Button } from '../ui/Button';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/accounts', label: 'Accounts', icon: <Users size={20} /> },
  { path: '/sales', label: 'Sales', icon: <ShoppingCart size={20} /> },
  { path: '/purchases', label: 'Purchases', icon: <CreditCard size={20} /> },
  { path: '/summary', label: 'Summary', icon: <BarChart3 size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> }
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div 
      className={`
        h-screen flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        fixed z-10 top-0 left-0 
        md:relative
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <span className={`text-xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
            Admin Panel
          </span>
          <Button 
            variant="ghost" 
            onClick={toggleSidebar}
            className="p-1 h-8 w-8 ml-2 text-white hover:bg-gray-800 md:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={toggleSidebar}
          className={`p-1 h-8 w-8 text-white hover:bg-gray-800 hidden md:flex`}
        >
          <ChevronLeft 
            size={20} 
            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
          />
        </Button>
      </div>
      
      <nav className="flex-1 pt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-2.5 text-sm font-medium transition
              ${isActive 
                ? 'bg-blue-700 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className={`
            w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white
            ${isCollapsed ? 'justify-center px-0' : 'px-4'}
          `}
        >
          <LogOut size={20} />
          <span className={`ml-2 ${isCollapsed ? 'hidden' : 'block'}`}>
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
};