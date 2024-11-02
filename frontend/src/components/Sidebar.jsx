import React, { useState } from 'react';

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState('');

  const menuItems = [
    { 
      id: 'profile', 
      icon: <i className="fa-solid fa-user w-5 h-5" />, 
      label: 'Profile' 
    },
    { 
      id: 'chronic', 
      icon: <i className="fa-solid fa-heart-pulse w-5 h-5" />, 
      label: 'Chronic Info' 
    },
    { 
      id: 'records', 
      icon: <i className="fa-regular fa-file w-5 h-5" />, 
      label: 'Records' 
    }
  ];

  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
    console.log(`${buttonId} button clicked`);
  };

  return (
    <section className="h-screen w-1/6 flex flex-col m-2 bg-white">
      <div className="h-1/6 w-full flex justify-center items-center">
        <img 
          className="h-2/5 w-3/5 object-contain" 
          src="/api/placeholder/200/80"
          alt="DUMRS-ICON" 
        />
      </div>
      
      <div className="flex flex-col h-3/6 w-full justify-evenly items-center space-y-4">
        {menuItems.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`
              w-9/12 h-14 px-4
              flex items-center justify-center gap-2
              text-lg font-medium
              border-2 rounded-full
              transition-all duration-200
              ${activeButton === id 
                ? 'bg-purple-100 border-purple-500 text-purple-700' 
                : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
              }
            `}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Sidebar;