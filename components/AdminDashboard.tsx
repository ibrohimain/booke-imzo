
import React, { useState, useMemo } from 'react';
import { BookSubmission, SubmissionStatus } from '../types';
import { CheckCircle, XCircle, FileText, Search, Download, Layers, Trash2, Globe } from 'lucide-react';
import { DocumentTemplate } from './DocumentTemplate';

interface AdminDashboardProps {
  submissions: BookSubmission[];
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}

type Period = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ submissions, onUpdateStatus, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [selectedSub, setSelectedSub] = useState<BookSubmission | null>(null);
  const [docType, setDocType] = useState<'ref' | 'consent' | 'both' | null>(null);

  const filtered = useMemo(() => {
    const now = new Date();
    return submissions.filter(s => {
      const subDate = new Date(s.submittedAt);
      const matchesPeriod = period === 'all' || 
        (period === 'daily' && subDate.toDateString() === now.toDateString()) ||
        (period === 'weekly' && subDate >= new Date(now.getTime() - 7 * 86400000)) ||
        (period === 'monthly' && subDate.getMonth() === now.getMonth()) ||
        (period === 'yearly' && subDate.getFullYear() === now.getFullYear());
      
      const matchesSearch = s.fullName.toLowerCase().includes(filter.toLowerCase()) || 
        s.department.toLowerCase().includes(filter.toLowerCase()) ||
        s.institution.toLowerCase().includes(filter.toLowerCase()) ||
        (s.books && s.books.some(b => b.title.toLowerCase().includes(filter.toLowerCase())));

      return matchesPeriod && matchesSearch;
    });
  }, [submissions, period, filter]);

  const handlePrint = (sub: BookSubmission, type: 'ref' | 'consent' | 'both') => {
    setSelectedSub(sub);
    setDocType(type);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${name} ning arizasini bazadan butunlay o'chirib tashlamoqchimisiz?`)) {
      onDelete(id);
    }
  };

  const exportToExcel = () => {
    const headers = ["F.I.Sh", "Muassasa", "Kafedra", "Lavozim", "Kitoblar Soni", "Holati", "Sana"];
    const rows = filtered.map(s => [
      `"${s.fullName}"`, `"${s.institution}"`, `"${s.department}"`, `"${s.position}"`, s.books?.length || 0,
      s.status === SubmissionStatus.RECEIVED ? "Qabul" : "Kutilmoqda",
      new Date(s.submittedAt).toLocaleDateString()
    ]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv' }));
    link.download = `ARM_Hisobot_${period}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <h2 className="text-xl font-black text-slate-800">Admin Panel</h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['all', 'daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {p === 'all' ? 'Barchasi' : p === 'daily' ? 'Bugun' : p === 'weekly' ? 'Hafta' : p === 'monthly' ? 'Oy' : 'Yil'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-grow lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input type="text" placeholder="Qidiruv..." value={filter} onChange={e => setFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <button onClick={exportToExcel} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 shadow-sm">
            <Download className="h-4 w-4" /> <span>Eksport</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Foydalanuvchi</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Muassasa & Bo'lim</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Kitoblar</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Holati</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{sub.fullName}</span>
                      {sub.isExternal && <Globe className="h-3.5 w-3.5 text-blue-500" title="Tashqi foydalanuvchi" />}
                    </div>
                    <div className="text-xs text-slate-400">{sub.position}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-blue-900">{sub.institution}</div>
                    <div className="text-xs text-slate-500">{sub.department}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-xs">{(sub.books?.length || 0)} ta</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${sub.status === SubmissionStatus.RECEIVED ? 'bg-green-100 text-green-800' : sub.status === SubmissionStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-800'}`}>
                      {sub.status === SubmissionStatus.RECEIVED ? 'Qabul qilindi' : sub.status === SubmissionStatus.PENDING ? 'Kutilmoqda' : 'Rad etildi'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      {sub.status === SubmissionStatus.PENDING && (
                        <>
                          <button onClick={() => onUpdateStatus(sub.id, SubmissionStatus.RECEIVED)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Qabul qilish"><CheckCircle className="h-5 w-5" /></button>
                          <button onClick={() => onUpdateStatus(sub.id, SubmissionStatus.REJECTED)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rad etish"><XCircle className="h-5 w-5" /></button>
                        </>
                      )}
                      {sub.status === SubmissionStatus.RECEIVED && (
                        <div className="flex gap-1">
                          <button onClick={() => handlePrint(sub, 'both')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-xs font-black shadow-md">
                            <Layers className="h-3.5 w-3.5" /> <span>Hujjatlar</span>
                          </button>
                        </div>
                      )}
                      <button 
                        onClick={() => handleDelete(sub.id, sub.fullName)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1" 
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(selectedSub && docType) && (
        <div className="print-only">
          {(docType === 'ref' || docType === 'both') && (
            <div className="w-full h-full flex items-center justify-center">
              <DocumentTemplate type="ref" submission={selectedSub} />
            </div>
          )}
          {docType === 'both' && <div className="page-break"></div>}
          {(docType === 'consent' || docType === 'both') && (
            <div className="w-full h-full flex items-center justify-center">
              <DocumentTemplate type="consent" submission={selectedSub} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
