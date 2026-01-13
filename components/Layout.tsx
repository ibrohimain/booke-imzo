
import React from 'react';
import { ViewType } from '../types';
import { BookOpen, UserCheck, ShieldCheck, GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 text-white shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-blue-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">JizzPI</h1>
                <p className="text-xs text-blue-200 uppercase tracking-widest">Kafedra xodimlari portali</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setView('staff')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'staff' ? 'bg-white text-blue-900' : 'hover:bg-blue-800'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Kitob topshirish</span>
              </button>
              <button
                onClick={() => setView('admin')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'admin' ? 'bg-white text-blue-900' : 'hover:bg-blue-800'
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="font-medium">Admin Panel</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Jizzax Politexnika Instituti. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
};
