/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Trophy,
  Library,
  Info
} from 'lucide-react';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  librarianLevels, 
  teacherLevels, 
  principalLevels, 
  fourPillars,
  TaxonomyLevel 
} from './data/taxonomies';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Role = 'librarian' | 'teacher' | 'principal';
type PillarId = 'mik' | 'reading' | 'culture' | 'democracy';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [activePillar, setActivePillar] = useState<PillarId | null>(null);
  const [scores, setScores] = useState<Record<Role, number>>({
    librarian: 0,
    teacher: 0,
    principal: 0
  });
  const [bingoStates, setBingoStates] = useState<Record<PillarId, boolean[]>>({
    mik: new Array(16).fill(false),
    reading: new Array(16).fill(false),
    culture: new Array(16).fill(false),
    democracy: new Array(16).fill(false)
  });
  const [schoolName, setSchoolName] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);

  const handleLevelClick = (role: Role, level: number) => {
    setScores(prev => ({ ...prev, [role]: level }));
  };

  const toggleBingoItem = (pillarId: PillarId, index: number) => {
    setBingoStates(prev => {
      const newState = [...prev[pillarId]];
      newState[index] = !newState[index];
      return { ...prev, [pillarId]: newState };
    });
  };

  const getPillarProgress = (pillarId: PillarId) => {
    const checkedCount = bingoStates[pillarId].filter(Boolean).length;
    return (checkedCount / 16) * 100;
  };

  const downloadPDF = async () => {
    if (exportRef.current) {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: '#f8fafc',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`biblioteksresan-${schoolName || 'skola'}.pdf`);
    }
  };

  const getLevelsByRole = (r: Role) => {
    switch (r) {
      case 'librarian': return librarianLevels;
      case 'teacher': return teacherLevels;
      case 'principal': return principalLevels;
    }
  };

  const getRoleTitle = (r: Role) => {
    switch (r) {
      case 'librarian': return 'Bibliotekariens roll';
      case 'teacher': return 'Lärarens samverkan';
      case 'principal': return 'Rektorns ledarskap';
    }
  };

  const getRoleIcon = (r: Role) => {
    switch (r) {
      case 'librarian': return <Library className="w-6 h-6" />;
      case 'teacher': return <Users className="w-6 h-6" />;
      case 'principal': return <GraduationCap className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Biblioteksresan</h1>
              <p className="text-sm text-slate-500 font-medium">Hur långt har vi kommit?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Skolans namn..." 
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Role Selection */}
        {!role && !activePillar ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {(['librarian', 'teacher', 'principal'] as Role[]).map((r) => (
              <motion.button
                key={r}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r)}
                className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:border-indigo-100"
              >
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  {getRoleIcon(r)}
                </div>
                <h3 className="text-xl font-bold">{getRoleTitle(r)}</h3>
                <p className="text-sm text-slate-500">Baserat på Loertschers taxonomi.</p>
                <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm">
                  Börja resan <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            ))}
          </div>
        ) : role ? (
          <div className="space-y-8">
            <button 
              onClick={() => setRole(null)}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Tillbaka till översikt
            </button>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
              <div className="bg-indigo-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  {getRoleIcon(role)}
                  <h2 className="text-2xl font-bold">{getRoleTitle(role)}</h2>
                </div>
                <p className="text-indigo-100 opacity-90">Klicka på den nivå som bäst beskriver er nuvarande verksamhet.</p>
              </div>

              <div className="p-4 md:p-8">
                <div className="space-y-3">
                  {getLevelsByRole(role).map((item) => (
                    <motion.div
                      key={item.level}
                      initial={false}
                      animate={{
                        backgroundColor: scores[role] >= item.level ? '#f5f3ff' : '#ffffff',
                        borderColor: scores[role] >= item.level ? '#c4b5fd' : '#e2e8f0'
                      }}
                      onClick={() => handleLevelClick(role, item.level)}
                      className={cn(
                        "p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 group",
                        scores[role] === item.level ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors",
                        scores[role] >= item.level ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                      )}>
                        {item.level}
                      </div>
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-bold text-lg mb-1",
                          scores[role] >= item.level ? "text-indigo-900" : "text-slate-700"
                        )}>
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                      </div>
                      {scores[role] >= item.level && (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600 shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activePillar ? (
          <div className="space-y-8">
            <button 
              onClick={() => setActivePillar(null)}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Tillbaka till översikt
            </button>

            {(() => {
              const pillar = fourPillars.find(p => p.id === activePillar)!;
              return (
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
                  <div className="bg-emerald-600 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{pillar.title} – Bingo</h2>
                        <p className="text-emerald-100 opacity-90">{pillar.question}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-48 h-3 bg-emerald-800 rounded-full relative overflow-hidden border border-emerald-700">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getPillarProgress(activePillar)}%` }}
                            className="h-full bg-white"
                          />
                          {/* Markers for quarters */}
                          <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                            <div className="w-px h-full bg-emerald-900/30" />
                            <div className="w-px h-full bg-emerald-900/30" />
                            <div className="w-px h-full bg-emerald-900/30" />
                          </div>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-70">Framsteg (fjärdedelar)</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-8 bg-slate-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {pillar.bingoItems?.map((text, idx) => (
                        <motion.div
                          key={idx}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleBingoItem(activePillar, idx)}
                          className={cn(
                            "aspect-square p-4 rounded-2xl border-2 flex items-center justify-center text-center text-xs md:text-sm font-bold cursor-pointer transition-all shadow-sm",
                            bingoStates[activePillar][idx]
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-200"
                              : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"
                          )}
                        >
                          {text}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : null}

        {/* Four Pillars Selection (Only visible on main overview) */}
        {!role && !activePillar && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Skolbibliotekspraktiker</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fourPillars.map((pillar) => (
                <div 
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id as PillarId)}
                  className={cn(
                    "p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 group",
                    getPillarProgress(pillar.id as PillarId) > 0
                      ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                      : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                    getPillarProgress(pillar.id as PillarId) > 0 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}>
                    {getPillarProgress(pillar.id as PillarId) === 100 ? <CheckCircle2 className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={cn(
                        "font-bold text-lg",
                        getPillarProgress(pillar.id as PillarId) > 0 ? "text-emerald-900" : "text-slate-700"
                      )}>
                        {pillar.title}
                      </h4>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getPillarProgress(pillar.id as PillarId)}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Summary / Export Area */}
        {!role && !activePillar && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Skolbibliotekets nuläge</h2>
              <button 
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-6 py-2.5 text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" /> Exportera PDF
              </button>
            </div>

            <div 
              ref={exportRef}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden"
              style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
            >
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-50" style={{ backgroundColor: '#eef2ff' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-50" style={{ backgroundColor: '#ecfdf5' }} />

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-black mb-2" style={{ color: '#0f172a' }}>
                    {schoolName || 'Skolans namn - fyll i högst upp'}
                  </h3>
                  <p className="font-bold uppercase tracking-widest text-xs" style={{ color: '#4f46e5' }}>Biblioteksresan Status</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {(['librarian', 'teacher', 'principal'] as Role[]).map((r) => (
                    <div key={r} className="p-6 rounded-3xl border text-center" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                      <div className="mb-3 flex justify-center" style={{ color: '#4f46e5' }}>{getRoleIcon(r)}</div>
                      <h4 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>{getRoleTitle(r)}</h4>
                      <div className="text-4xl font-black" style={{ color: '#0f172a' }}>Nivå {scores[r]}</div>
                      <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e2e8f0' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(scores[r] / (r === 'librarian' ? 11 : 8)) * 100}%` }}
                          className="h-full"
                          style={{ backgroundColor: '#4f46e5' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-8" style={{ borderTopColor: '#f1f5f9' }}>
                  <h4 className="text-center text-sm font-bold uppercase tracking-widest mb-6" style={{ color: '#94a3b8' }}>Skolbibliotekspraktiker (Bingo-framsteg)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fourPillars.map((p) => (
                      <div key={p.id} className="text-center">
                        <div 
                          className="w-full h-2 rounded-full overflow-hidden mb-2"
                          style={{ 
                            backgroundColor: '#f1f5f9',
                            opacity: getPillarProgress(p.id as PillarId) > 0 ? 1 : 0.3 
                          }}
                        >
                          <div 
                            className="h-full" 
                            style={{ 
                              width: `${getPillarProgress(p.id as PillarId)}%`,
                              backgroundColor: '#10b981'
                            }}
                          />
                        </div>
                        <div className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>{p.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-tighter" style={{ color: '#94a3b8' }}>
                    <Info className="w-3 h-3" /> Baserat på David Loertschers taxonomier för skolbibliotek
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-4 py-12 text-center border-t border-slate-200 mt-12">
        <p className="text-slate-400 text-sm">
          Ett verktyg för att visualisera och utveckla skolbibliotekets pedagogiska roll.
        </p>
      </footer>
    </div>
  );
}
