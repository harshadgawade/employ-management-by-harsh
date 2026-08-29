import React from 'react';

export default function Header({ currentLang, setLanguage }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">HR Console</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <a href="#home" className="text-purple-600 font-semibold">Home</a>
          <a href="#info" className="hover:text-purple-600 transition">Info</a>
          <a href="#contact" className="hover:text-purple-600 transition">Contact</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <select 
          value={currentLang} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="en">English</option>
          <option value="hi">Hindi (हिंदी)</option>
          <option value="mr">Marathi (मराठी)</option>
        </select>

        {/* Global Search */}
        <input 
          type="text" 
          placeholder="Search employees, tasks..." 
          className="hidden sm:block bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-64"
        />
      </div>
    </header>
  );
}