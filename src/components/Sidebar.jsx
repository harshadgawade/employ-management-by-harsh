import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menu = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance & Leaves' },
    { id: 'finance', label: 'Financial Analytics' },
    { id: 'directory', label: 'Employee Directory' },
    { id: 'events', label: 'Schedules & Events' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen p-4 hidden lg:block">
      <div className="space-y-1">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition ${
              activeTab === item.id 
                ? 'bg-purple-50 text-purple-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}