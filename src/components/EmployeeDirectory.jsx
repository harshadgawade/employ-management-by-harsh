import React, { useState } from 'react';

export default function EmployeeDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const employees = [
    { id: 'EMP01', name: 'Harshad Gawade', role: 'Full Stack Java Lead', dept: 'Engineering', status: 'Active', salary: '$8,500' },
    { id: 'EMP02', name: 'Priya Sharma', role: 'UI/UX Visual Designer', dept: 'Design', status: 'Active', salary: '$6,200' },
    { id: 'EMP03', name: 'Aman Verma', role: 'DevOps & Docker Admin', dept: 'Engineering', status: 'On Leave', salary: '$7,100' },
    { id: 'EMP04', name: 'Neha Patel', role: 'HR Operations Manager', dept: 'HR & Management', status: 'Active', salary: '$6,800' }
  ];

  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-gray-900">Employee Directory & Payroll Processing</h3>
          <p className="text-xs text-gray-400 mt-0.5">Manage records, role assignments, and slip generation</p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">
            Export CSV
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition">
            Export PDF Reports
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Filter by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-purple-400 outline-none flex-1"
        />
        <select 
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none"
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="HR & Management">HR & Management</option>
        </select>
      </div>

      {/* Employee Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-2">ID</th>
              <th className="py-3 px-2">Employee</th>
              <th className="py-3 px-2">Department</th>
              <th className="py-3 px-2">Monthly Payout</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50/50 transition">
                <td className="py-3.5 px-2 font-bold text-purple-600">{emp.id}</td>
                <td className="py-3.5 px-2">
                  <p className="font-semibold text-gray-800">{emp.name}</p>
                  <p className="text-[10px] text-gray-400">{emp.role}</p>
                </td>
                <td className="py-3.5 px-2 text-gray-600 font-medium">{emp.dept}</td>
                <td className="py-3.5 px-2 font-bold text-gray-800">{emp.salary}</td>
                <td className="py-3.5 px-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    emp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <button className="text-purple-600 hover:text-purple-800 text-[11px] font-semibold underline">
                    Generate Slip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}