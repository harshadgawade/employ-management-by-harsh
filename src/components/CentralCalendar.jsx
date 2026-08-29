import React, { useState } from 'react';

export default function CentralCalendar() {
  const [viewMode, setViewMode] = useState('Month');

  const upcomingEvents = [
    { date: '05 Sep', title: 'Teachers & Learning Workshop', type: 'Event', tagColor: 'bg-purple-100 text-purple-600' },
    { date: '10 Sep', title: 'Ganesh Chaturthi / Regional Holiday', type: 'Holiday', tagColor: 'bg-rose-100 text-rose-600' },
    { date: '15 Sep', title: 'Q3 Department All-Hands Webinar', type: 'Webinar', tagColor: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h3 className="font-bold text-gray-900">Schedules & Central Calendar</h3>
          <p className="text-xs text-gray-400 mt-0.5">Corporate holidays, webinars, and team reviews</p>
        </div>

        {/* View Toggles */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {['Month', 'Week', 'Day'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === mode ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Grid Placeholder */}
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-700">
            <span>September 2026</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-white rounded-lg border border-gray-200">‹</button>
              <button className="px-2 py-1 bg-white rounded-lg border border-gray-200">›</button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 mb-2">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-700">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div 
                key={day} 
                className={`py-2 rounded-xl transition cursor-pointer ${
                  day === 10 ? 'bg-rose-500 text-white font-bold' :
                  day === 15 ? 'bg-purple-600 text-white font-bold' :
                  'hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays & Events Stream */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Upcoming Schedule</h4>
          {upcomingEvents.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</span>
                <p className="text-xs font-semibold text-gray-800">{item.title}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.tagColor}`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}