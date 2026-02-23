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
  Info,
  School,
  Sparkles,
  Map
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
import { ActionPlan } from './components/ActionPlan';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Role = 'librarian' | 'teacher' | 'principal';
type PillarId = 'mik' | 'reading' | 'culture' | 'democracy';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [activePillar, setActivePillar] = useState<PillarId | null>(null);
  const [view, setView] = useState<'overview' | 'action-plan'>('overview');
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [nyckeltal, setNyckeltal] = useState({
    elever: '',
    planering: '',
    utlan: ''
  });
  const exportRef = useRef<HTMLDivElement>(null);

  // Persistence
  React.useEffect(() => {
    const savedScores = localStorage.getItem('scores');
    const savedBingo = localStorage.getItem('bingoStates');
    const savedName = localStorage.getItem('schoolName');
    const savedNyckeltal = localStorage.getItem('nyckeltal');

    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedBingo) setBingoStates(JSON.parse(savedBingo));
    if (savedName) setSchoolName(savedName);
    if (savedNyckeltal) setNyckeltal(JSON.parse(savedNyckeltal));
  }, []);

  React.useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

  React.useEffect(() => {
    localStorage.setItem('bingoStates', JSON.stringify(bingoStates));
  }, [bingoStates]);

  React.useEffect(() => {
    localStorage.setItem('schoolName', schoolName);
  }, [schoolName]);

  React.useEffect(() => {
    localStorage.setItem('nyckeltal', JSON.stringify(nyckeltal));
  }, [nyckeltal]);

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
      setIsGeneratingPDF(true);
      try {
        const canvas = await html2canvas(exportRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Page 1: Dashboard
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text(`Nulägesanalys - ${schoolName || 'Skola'}`, 20, 20);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`, 20, 27);

        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 20, 35, imgWidth, imgHeight);

        // Page 2: Action Plan
        pdf.addPage();
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text(`Handlingsplan för skolbiblioteksutveckling`, 20, 20);
        pdf.setFontSize(14);
        pdf.text(schoolName || '', 20, 28);

        let yPos = 45;

        // Get data from localStorage
        const savedAccepted = localStorage.getItem('acceptedMissions');
        const acceptedMissions = savedAccepted ? JSON.parse(savedAccepted) : [];

        // Prioriterade mål
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Prioriterade mål för läsåret', 20, yPos);
        yPos += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        if (acceptedMissions.length > 0) {
          acceptedMissions.forEach((m: any) => {
            const goalText = `Mål: ${m.text}`;
            const splitText = pdf.splitTextToSize(goalText, pageWidth - 40);
            pdf.text(splitText, 25, yPos);
            yPos += (splitText.length * 5) + 2;
          });
        } else {
          pdf.text('Inga prioriterade mål valda ännu.', 25, yPos);
          yPos += 10;
        }

        yPos += 10;

        // Rekommendationer
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Rekommenderade nästa steg (baserat på nuläge)', 20, yPos);
        yPos += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);

        const recommendations: any[] = [];
        fourPillars.forEach(pillar => {
          pillar.bingoItems.forEach((item, idx) => {
            const isChecked = bingoStates[pillar.id as PillarId][idx];
            const isAccepted = acceptedMissions.some((m: any) => m.id === item.id);
            if (!isChecked && !isAccepted) {
              const currentLevel = scores.principal || 1;
              if (currentLevel >= item.minLevel && currentLevel <= item.maxLevel) {
                recommendations.push(item);
              }
            }
          });
        });

        const selectedRecs = recommendations.sort(() => Math.random() - 0.5).slice(0, 3);
        
        if (selectedRecs.length > 0) {
          selectedRecs.forEach((r: any) => {
            const recText = `• ${r.text}`;
            const splitText = pdf.splitTextToSize(recText, pageWidth - 45);
            pdf.text(splitText, 25, yPos);
            yPos += (splitText.length * 5) + 2;
          });
        } else {
          pdf.text('Fortsätt arbeta enligt nuvarande plan.', 25, yPos);
          yPos += 10;
        }

        // Resource notice
        const eleverPerBibl = parseInt(nyckeltal.elever);
        if (!isNaN(eleverPerBibl) && eleverPerBibl > 400) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(150, 0, 0);
          const notice = `OBS: Antal elever per skolbibliotekarie (${eleverPerBibl}) överstiger rekommenderade nivåer. För att möjliggöra det pedagogiska uppdraget och likvärdighet rekommenderas en översyn av bemanningstätheten.`;
          const splitNotice = pdf.splitTextToSize(notice, pageWidth - 40);
          pdf.text(splitNotice, 20, pageHeight - 30);
        }

        pdf.save(`skolbiblioteksrapport-${schoolName || 'skola'}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsGeneratingPDF(false);
      }
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
      case 'librarian': return 'Skolbibliotekariens roll';
      case 'teacher': return 'Lärarens samverkan';
      case 'principal': return 'Rektors ansvar – hur långt har ledningen kommit?';
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Skolbiblioteksresan</h1>
              <p className="text-sm text-slate-500 font-medium">Hur långt har vi kommit?</p>
            </div>
          </div>

          {!role && !activePillar && (
            <nav className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setView('overview')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  view === 'overview' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Map className="w-4 h-4" /> Översikt
              </button>
              <button
                onClick={() => setView('action-plan')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  view === 'action-plan' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Sparkles className="w-4 h-4" /> Vägen framåt
              </button>
            </nav>
          )}

          <div className="flex flex-col items-end gap-1">
            <label htmlFor="school-name" className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mr-4">
              Ange skolans namn
            </label>
            <div className="relative group">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                id="school-name"
                type="text" 
                placeholder="Skriv här..." 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className={cn(
                  "bg-slate-100 border-2 border-transparent rounded-full pl-10 pr-6 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none w-full md:w-72 transition-all",
                  !schoolName && "animate-pulse border-indigo-200 shadow-sm shadow-indigo-100"
                )}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'action-plan' && !role && !activePillar ? (
          <ActionPlan 
            principalLevel={scores.principal} 
            bingoStates={bingoStates} 
          />
        ) : !role && !activePillar ? (
          <>
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
                  <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm">
                    Börja resan <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Nyckeltal Section */}
            <section className="mt-16 border-t border-slate-200 pt-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <Info className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Nyckeltal</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Antal elever per skolbibliotekarie</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={nyckeltal.elever}
                    onChange={(e) => setNyckeltal(prev => ({ ...prev, elever: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ange antal..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Timmar/vecka avsatt för planering</label>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    value={nyckeltal.planering}
                    onChange={(e) => setNyckeltal(prev => ({ ...prev, planering: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ange timmar..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Utlån 15 sep – 15 okt</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={nyckeltal.utlan}
                    onChange={(e) => setNyckeltal(prev => ({ ...prev, utlan: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ange antal utlån..."
                  />
                </div>
              </div>
            </section>
          </>
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
                        <h2 className="text-2xl font-bold mb-1">{pillar.title}</h2>
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
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-70">Framsteg</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-8 bg-slate-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {pillar.bingoItems?.map((item, idx) => (
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
                          {item.text}
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
            <p className="text-slate-500 text-sm mb-8 max-w-2xl">
              Under läsåret får elever vara delaktiga i olika lektioner och aktiviteter. Tillfällena är antingen planerade, genomförda och utvärderade:
              <br />• av skolbibliotekarien och lärare eller annan pedagogisk personal tillsammans
              <br />• av skolbibliotekarien tillsammans med en eller flera andra skolbibliotekarier
              <br />• av en enskild skolbibliotekarie
            </p>
            
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
          <section className="mt-20 border-t border-slate-200 pt-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-indigo-50 p-4 rounded-full text-indigo-600">
                <Download className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Färdig med din analys?</h3>
                <p className="text-slate-500 text-sm">
                  Generera en professionell PDF-rapport som kan användas som underlag för SKA-arbete, budgetmöten och ledningsgrupper.
                </p>
              </div>
              
              <button 
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className={cn(
                  "flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                  isGeneratingPDF && "animate-pulse"
                )}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Skapar rapport...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Generera PDF-rapport för ledningen
                  </>
                )}
              </button>
            </div>

            <div className="mt-16 opacity-0 pointer-events-none h-0 overflow-hidden">
              <div 
                ref={exportRef}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden"
                style={{ backgroundColor: '#ffffff', color: '#0f172a', width: '800px' }}
              >
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-50" style={{ backgroundColor: '#eef2ff' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-50" style={{ backgroundColor: '#ecfdf5' }} />

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-black mb-2" style={{ color: '#0f172a' }}>
                    {schoolName || 'Skolans namn - fyll i högst upp'}
                  </h3>
                  <p className="font-bold uppercase tracking-widest text-xs" style={{ color: '#4f46e5' }}>Skolbiblioteksresan Status</p>
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
                          animate={{ width: `${(scores[r] / (r === 'librarian' ? 11 : r === 'principal' ? 9 : 8)) * 100}%` }}
                          className="h-full"
                          style={{ backgroundColor: '#4f46e5' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-8" style={{ borderTopColor: '#f1f5f9' }}>
                  <h4 className="text-center text-sm font-bold uppercase tracking-widest mb-6" style={{ color: '#94a3b8' }}>Skolbibliotekspraktiker (Framsteg)</h4>
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

                {/* Nyckeltal in Export */}
                <div className="mt-12 border-t pt-8" style={{ borderTopColor: '#f1f5f9' }}>
                  <h4 className="text-center text-sm font-bold uppercase tracking-widest mb-6" style={{ color: '#94a3b8' }}>Nyckeltal</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-black" style={{ color: '#0f172a' }}>{nyckeltal.elever || '—'}</div>
                      <div className="text-[9px] font-bold uppercase leading-tight" style={{ color: '#94a3b8' }}>Elever / bibl.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black" style={{ color: '#0f172a' }}>{nyckeltal.planering || '—'}</div>
                      <div className="text-[9px] font-bold uppercase leading-tight" style={{ color: '#94a3b8' }}>Planering (h/v)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black" style={{ color: '#0f172a' }}>{nyckeltal.utlan || '—'}</div>
                      <div className="text-[9px] font-bold uppercase leading-tight" style={{ color: '#94a3b8' }}>Utlån (period)</div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-tighter" style={{ color: '#94a3b8' }}>
                    <Info className="w-3 h-3" /> Baserat på David Loertschers taxonomier för skolbibliotek
                  </div>
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
