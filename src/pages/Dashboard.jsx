import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DynamicGreeting from '../components/DynamicGreeting';
import FinancialCards from '../components/FinancialCards';
import AttendanceLogger from '../components/AttendanceLogger';
import EmployeeProgress from '../components/EmployeeProgress';
import TaskManager from '../components/TaskManager';
import CentralCalendar from '../components/CentralCalendar';
import EmployeeDirectory from '../components/EmployeeDirectory';
import HRSocialFeed from '../components/HRSocialFeed';
import ReportExporter from '../components/ReportExporter';

export default function Dashboard() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('overview');

  const sampleReportData = [
    { ID: 'EMP01', Name: 'Harshad Gawade', Role: 'Java Lead', Attendance: '95%' },
    { ID: 'EMP02', Name: 'Priya Sharma', Role: 'UI Designer', Attendance: '90%' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-12">
      <Header currentLang={lang} setLanguage={setLang} />

      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <DynamicGreeting userName="Harshad" />

          {/* Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <FinancialCards />
            </div>
            <div className="lg:col-span-1">
              <AttendanceLogger />
            </div>
          </div>

          {/* Progress & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeProgress />
            <TaskManager />
          </div>

          {/* Export Engine */}
          <ReportExporter data={sampleReportData} />

          {/* Directory & Management */}
          <EmployeeDirectory />

          {/* Schedules & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CentralCalendar />
            </div>
            <div className="lg:col-span-1">
              <HRSocialFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}