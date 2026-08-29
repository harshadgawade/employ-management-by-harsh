import React, { useState, useEffect } from 'react';

export default function AttendanceLogger() {
  const [punchedIn, setPunchedIn] = useState(true);
  const [seconds, setSeconds] = useState(16320); // Initial 04h 32m

  useEffect(() => {
    let timer;
    if (punchedIn) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [punchedIn]);

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Time Enroll & Exit Logger</span>
        <span className={`w-2.5 h-2.5 rounded-full ${punchedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
      </div>

      <div className="my-4">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">{formatTime(seconds)}</span>
        <p className="text-xs text-gray-500 mt-1">
          {punchedIn ? 'Status: Active Session (Started 09:00 AM)' : 'Status: Punched Out / Off Duty'}
        </p>
      </div>

      {/* Attendance Visual Bar */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between text-[11px] text-gray-500 font-medium">
          <span>Present: 85%</span>
          <span>Late: 10%</span>
          <span>Absent: 5%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full flex overflow-hidden">
          <div className="bg-emerald-500 w-[85%]"></div>
          <div className="bg-amber-400 w-[10%]"></div>
          <div className="bg-rose-500 w-[5%]"></div>
        </div>
      </div>

      <button
        onClick={() => setPunchedIn(!punchedIn)}
        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition ${
          punchedIn 
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
        }`}
      >
        {punchedIn ? 'Exit / Punch Out' : 'Time Enroll / Punch In'}
      </button>
    </div>
  );
}