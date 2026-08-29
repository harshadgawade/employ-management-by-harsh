import React from 'react';

export default function EmployeeProgress() {
  const departmentData = [
    { name: 'Software Development (Java/Spring Boot)', progress: 85, completed: '42/50 Tasks' },
    { name: 'UI/UX & Modern Web Design', progress: 68, completed: '15/22 Tasks' },
    { name: 'Cloud Infrastructure & DevOps', progress: 92, completed: '23/25 Tasks' },
    { name: 'Quality Assurance & Automation', progress: 50, completed: '10/20 Tasks' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Department Work Completion</h3>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-xl">Real-time Sync</span>
      </div>

      <div className="space-y-4">
        {departmentData.map((dept, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-gray-800">{dept.name}</span>
              <span className="text-purple-600">{dept.completed} ({dept.progress}%)</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${dept.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}