import React, { useState } from 'react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Release Monthly Payroll Slips', priority: 'High', completed: false, tag: 'Finance' },
    { id: 2, text: 'Approve Pending Casual Leaves', priority: 'Medium', completed: true, tag: 'HR Ops' },
    { id: 3, text: 'Update Security Policy Docs', priority: 'Low', completed: false, tag: 'Compliance' },
    { id: 4, text: 'Conduct Quarter All-Hands Meeting', priority: 'High', completed: false, tag: 'Executive' }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const getBadgeColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-100 text-rose-600';
      case 'Medium': return 'bg-amber-100 text-amber-600';
      case 'Low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">HR Task Management Checklist</h3>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            className="p-3.5 border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => {}}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span className={`text-xs font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.text}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-semibold">{task.tag}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getBadgeColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}