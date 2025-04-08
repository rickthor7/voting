
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Vote, 
  Award, 
  Calendar, 
  LogOut, 
  User, 
  BarChart 
} from 'lucide-react';
import { Button } from './ui/button';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link to={to} className="w-full">
    <div
      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-vote-primary text-white' 
          : 'hover:bg-vote-accent text-gray-700 hover:text-vote-primary'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2 mb-8">
          <Vote className="h-6 w-6 text-vote-primary" />
          <h1 className="text-xl font-bold text-vote-primary">PolyVote</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <NavItem
            to="/"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            active={location.pathname === '/'}
          />
          <NavItem
            to="/elections"
            icon={<Calendar className="h-5 w-5" />}
            label="Elections"
            active={location.pathname === '/elections'}
          />
          <NavItem
            to="/vote"
            icon={<Vote className="h-5 w-5" />}
            label="Vote Now"
            active={location.pathname === '/vote'}
          />
          <NavItem
            to="/results"
            icon={<BarChart className="h-5 w-5" />}
            label="Results"
            active={location.pathname === '/results'}
          />
          
          {isAdmin && (
            <NavItem
              to="/admin"
              icon={<Award className="h-5 w-5" />}
              label="Admin Panel"
              active={location.pathname === '/admin'}
            />
          )}
        </nav>

        {/* User info and logout */}
        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="flex items-center mb-4 space-x-3 px-3">
            <div className="w-8 h-8 rounded-full bg-vote-accent flex items-center justify-center">
              <User className="h-4 w-4 text-vote-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.getName()}</p>
              <p className="text-xs text-gray-500 truncate">{user?.getRole()}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
