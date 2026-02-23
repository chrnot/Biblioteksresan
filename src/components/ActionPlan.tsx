import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fourPillars, Pillar, BingoItem } from '../data/taxonomies';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ActionPlanProps {
  principalLevel: number;
  bingoStates: Record<string, boolean[]>;
}

interface Mission extends BingoItem {
  pillarId: string;
  pillarTitle: string;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ principalLevel, bingoStates }) => {
  const [acceptedMissions, setAcceptedMissions] = useState<Mission[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedAccepted = localStorage.getItem('acceptedMissions');
    const savedCompleted = localStorage.getItem('completedMissions');
    if (savedAccepted) setAcceptedMissions(JSON.parse(savedAccepted));
    if (savedCompleted) setCompletedMissionIds(JSON.parse(savedCompleted));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('acceptedMissions', JSON.stringify(acceptedMissions));
  }, [acceptedMissions]);

  useEffect(() => {
    localStorage.setItem('completedMissions', JSON.stringify(completedMissionIds));
  }, [completedMissionIds]);

  // Recommendation Algorithm
  const recommendations = useMemo(() => {
    const allUnchecked: Mission[] = [];
    
    fourPillars.forEach(pillar => {
      pillar.bingoItems.forEach((item, idx) => {
        const isChecked = bingoStates[pillar.id][idx];
        const isAccepted = acceptedMissions.some(m => m.id === item.id);
        
        if (!isChecked && !isAccepted) {
          // Filter based on principal level
          // If level is 0 (not set), we show level 1-3 suggestions
          const currentLevel = principalLevel || 1;
          if (currentLevel >= item.minLevel && currentLevel <= item.maxLevel) {
            allUnchecked.push({
              ...item,
              pillarId: pillar.id,
              pillarTitle: pillar.title
            });
          }
        }
      });
    });

    // Shuffle and pick 3-5
    return allUnchecked
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [bingoStates, acceptedMissions, principalLevel]);

  const handleAcceptMission = (mission: Mission) => {
    setAcceptedMissions(prev => [...prev, mission]);
  };

  const handleToggleComplete = (missionId: string) => {
    setCompletedMissionIds(prev => {
      const isCompleting = !prev.includes(missionId);
      if (isCompleting) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7']
        });
        return [...prev, missionId];
      } else {
        return prev.filter(id => id !== missionId);
      }
    });
  };

  const handleRemoveMission = (missionId: string) => {
    setAcceptedMissions(prev => prev.filter(m => m.id !== missionId));
    setCompletedMissionIds(prev => prev.filter(id => id !== missionId));
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Vägen framåt
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Din Utvecklingsplan</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Baserat på din nuvarande nivå ({principalLevel || 0}) och dina framsteg har vi tagit fram nästa steg för att stärka skolbiblioteket.
        </p>
      </div>

      {/* Recommendations */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Rekommenderade nästa steg</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {recommendations.length > 0 ? (
              recommendations.map((mission) => (
                <motion.div
                  key={mission.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target className="w-16 h-16" />
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                        {mission.pillarTitle}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 mt-2 leading-tight">
                        {mission.text}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3" /> Nivå {mission.minLevel}-{mission.maxLevel}
                      </div>
                      <button
                        onClick={() => handleAcceptMission(mission)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all active:scale-95"
                      >
                        Acceptera uppdrag <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Inga fler rekommendationer just nu. Fortsätt kryssa i rutor eller ändra din nivå!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Active Plan */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Vår aktiva utvecklingsplan</h3>
          </div>
          <div className="text-sm font-bold text-slate-400">
            {completedMissionIds.length} / {acceptedMissions.length} KLARA
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {acceptedMissions.length > 0 ? (
              acceptedMissions.map((mission) => {
                const isCompleted = completedMissionIds.includes(mission.id);
                return (
                  <motion.div
                    key={mission.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff',
                      borderColor: isCompleted ? '#bbf7d0' : '#f1f5f9'
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "p-5 rounded-2xl border-2 flex items-center gap-4 transition-all group",
                      isCompleted ? "shadow-sm" : "hover:border-slate-200"
                    )}
                  >
                    <button
                      onClick={() => handleToggleComplete(mission.id)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                        isCompleted 
                          ? "bg-emerald-500 border-emerald-500 text-white scale-110" 
                          : "border-slate-200 text-transparent hover:border-emerald-400"
                      )}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1">
                      <p className={cn(
                        "font-bold transition-all",
                        isCompleted ? "text-emerald-900 line-through opacity-50" : "text-slate-700"
                      )}>
                        {mission.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {mission.pillarTitle}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemoveMission(mission.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all"
                    >
                      Ta bort
                    </button>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <p className="text-slate-400 font-medium">Inga aktiva uppdrag än. Acceptera ett uppdrag ovan för att börja!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
