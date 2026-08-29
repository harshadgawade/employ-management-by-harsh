import React from 'react';

export default function FinancialCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Users / Active Staff Card */}
      <div className="bg-purple-600 text-white p-6 rounded-3xl card-shadow flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase opacity-80 tracking-wider">Active Staff Count</span>
          <h3 className="text-3xl font-bold mt-2">15,420</h3>
        </div>
        <p className="text-xs mt-4 text-purple-200 font-medium">↑ +2.54% Increase since last month</p>
      </div>

      {/* Conversion / Efficiency Metric */}
      <div className="bg-amber-400 text-white p-6 rounded-3xl card-shadow flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase opacity-80 tracking-wider">Department Efficiency</span>
          <h3 className="text-3xl font-bold mt-2">28.9%</h3>
        </div>
        <p className="text-xs mt-4 text-amber-100 font-medium">↑ Optimal operational bandwidth</p>
      </div>

      {/* Total Salary Outlay KPI */}
      <div className="bg-rose-500 text-white p-6 rounded-3xl card-shadow flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase opacity-80 tracking-wider">Total Net Payroll Outlay</span>
          <h3 className="text-3xl font-bold mt-2">$24,500</h3>
        </div>
        <p className="text-xs mt-4 text-rose-100 font-medium">Current Month Net Allocation</p>
      </div>
    </div>
  );
}