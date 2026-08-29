import React, { useState, useEffect } from 'react';

export default function AnalyticsCards() {
  const [punchedIn, setPunchedIn] = useState(true);
  const [seconds, setSeconds] = useState(16320);

  useEffect(() => {
    let timer;
    if (punchedIn) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [punchedIn]);

  const formatDuration = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-purple-600 text-white p-6 rounded-3xl card-shadow">
        <span className="text-xs font-semibold uppercase opacity-80">Total Users</span>
        <h3 className="text-3xl font-bold mt-2">15,420</h3>
        <p className="text-xs mt-2 text-purple-200">↑ +2.54% vs last month</p>
      </div>

      <div className="bg-amber-400 text-white p-6 rounded-3xl card-shadow">
        <span className="text-xs font-semibold uppercase opacity-80">Conversion Rate</span>
        <h3 className="text-3xl font-bold mt-2">28.9%</h3>
        <p className="text-xs mt-2 text-amber-100">Department efficiency high</p>
      </div>

      <div className="bg-rose-500 text-white p-6 rounded-3xl card-shadow">
        <span className="text-xs font-semibold uppercase opacity-80">Total Salary Outlay</span>
        <h3 className="text-3xl font-bold mt-2">$24,500</h3>
        <p className="text-xs mt-2 text-rose-100">Monthly Net Payroll</p>
      </div>

      <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase">Enroll & Exit Logger</span>
          <span className={`w-2.5 h-2.5 rounded-full ${punchedIn ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
        </div>
        <div className="my-2">
          <span className="text-xl font-bold text-gray-900">{formatDuration(seconds)}</span>
          <p className="text-xs text-gray-500">{punchedIn ? 'Logged in at 09:00 AM' : 'Punched Out'}</p>
        </div>
        <button 
          onClick={() => setPunchedIn(!punchedIn)}
          className={`w-full py-2 font-semibold rounded-xl text-xs transition ${
            punchedIn ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          {punchedIn ? 'Exit / Punch Out' : 'Time Enroll / Punch In'}
        </button>
      </div>
    </div>
  );
}