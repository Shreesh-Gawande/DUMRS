import React, { useState } from 'react';
import { UserCircle, Heart, FileText, ChevronLeft, ChevronRight, Pen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState(() => localStorage.getItem('userRole'));
  const location = useLocation();
  
  const menuItems = [
    {
      id: 'profile',
      icon: <UserCircle size={22} />,
      label: 'Profile'
    },
    {
      id: 'medical-info',
      icon: <Heart size={22} />,
      label: 'Medical Info'
    },
    {
      id: 'records',
      icon: <FileText size={22} />,
      label: 'Records'
    }
  ];

  if(userRole === 'doctor') {
    menuItems.push({
      id: 'add-record',
      icon: <Pen size={22} />,
      label: 'Add Records'
    });
  }

  return (
    <aside className={`
      h-screen
      ${isCollapsed ? 'w-16' : 'w-64'}
      transition-all duration-300 ease-in-out
      bg-white
      border-r border-gray-100
      flex flex-col
      sticky
      top-0
    `}>
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center px-4 border-b border-gray-50">
        <Link to='/dashboard'>
        <img
          src="/api/placeholder/120/40"
          alt="DUMRS-ICON"
          className={`
            ${isCollapsed ? 'w-8' : 'w-32'}
            transition-all duration-300
            object-contain
          `}
        />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 pt-6">
        {menuItems.map(item => {
          const isActive = location.pathname === `/${item.id}`;
          
          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`
                w-full
                flex items-center
                ${isCollapsed ? 'justify-center px-2' : 'justify-start px-6'}
                py-3.5
                transition-all duration-200
                ${isActive 
                  ? 'text-blue-600 bg-blue-50/60'
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${isActive && !isCollapsed && 'border-r-4 border-blue-600'}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`
                ${isActive ? 'text-blue-600' : 'text-gray-400'}
              `}>
                {item.icon}
              </span>
              
              <span className={`
                ml-3
                text-sm
                font-medium
                ${isCollapsed ? 'hidden' : 'block'}
                transition-all duration-200
              `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          absolute -right-3 top-24
          w-6 h-6
          bg-white
          border border-gray-200
          rounded-full
          flex items-center justify-center
          text-gray-400
          hover:text-gray-600
          shadow-sm
          transition-colors
        "
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;