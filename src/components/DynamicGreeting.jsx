import React from 'react';

export default function DynamicGreeting({ userName = "HR Owner" }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {userName}! Welcome back. 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is what’s happening in your organization today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
          Export Audit Log
        </button>
        <button className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition">
          + Add New Staff
        </button>
      </div>
    </div>
  );
}