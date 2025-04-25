
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, PieChart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, route: '/' },
    { id: 'cookbook', label: 'Cookbook', icon: BookOpen, route: '/cookbook' },
    { id: 'calories', label: 'Calories', icon: PieChart, route: '/calories' },
    { id: 'profile', label: 'Profile', icon: User, route: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link 
            key={tab.id} 
            to={tab.route}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 rounded-lg",
              isActive ? "text-plateful-primary" : "text-gray-500"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className={cn(
              "h-6 w-6",
              isActive ? "text-plateful-primary" : "text-gray-500"
            )} />
            <span className="text-xs mt-1">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomTabs;
