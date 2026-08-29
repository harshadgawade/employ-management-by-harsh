import React from 'react';

export default function ReportExporter({ data = [] }) {
  const downloadCSV = () => {
    if (!data.length) return;

    // Header and Rows conversion
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPDFPrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h4 className="font-bold text-gray-900 text-sm">Reports & Audits Engine</h4>
        <p className="text-xs text-gray-400">Generate instantly downloadable PDF audit slips or raw CSV datasets.</p>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={downloadCSV}
          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
        >
          📥 Download CSV Report
        </button>
        <button 
          onClick={triggerPDFPrint}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition shadow-md shadow-purple-100"
        >
          🖨️ Export / Print PDF
        </button>
      </div>
    </div>
  );
}