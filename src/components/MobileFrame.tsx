import React from 'react';
import { TabType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Home, ListOrdered, History, User, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentTab,
  onTabChange,
  children,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-0 sm:py-6 font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#030b0e]' : 'bg-slate-200'
    }`}>
      {/* Mobile Device Frame */}
      <div 
        id="mobile-phone-container"
        className={`w-full max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[92vh] sm:rounded-[36px] sm:border-[6px] shadow-2xl flex flex-col relative overflow-hidden transition-colors duration-300 ${
          isDark 
            ? 'bg-[#051419] sm:border-slate-800 text-slate-100 selection:bg-emerald-500 selection:text-white' 
            : 'bg-[#f8fafc] sm:border-slate-400 text-slate-900 selection:bg-emerald-600 selection:text-white'
        }`}
      >
        {/* Native Mobile Status Bar (Matches Screenshot) */}
        <div className={`pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-semibold select-none z-30 shrink-0 transition-colors duration-300 ${
          isDark ? 'bg-[#051419] text-slate-300' : 'bg-[#f8fafc] text-slate-700'
        }`}>
          <div className="flex items-center gap-1.5 font-medium">
            <span>10:01</span>
            <div className="flex items-center gap-1 text-[9px] opacity-70 ml-1">
              <span>●</span>
              <span>●</span>
            </div>
          </div>

          {/* Dynamic Island / Notch Speaker on mobile mock */}
          <div className={`w-16 h-4 rounded-full mx-auto hidden sm:block opacity-60 ${
            isDark ? 'bg-slate-900' : 'bg-slate-300'
          }`} />

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono tracking-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>4G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5 text-[10px] font-mono">
              <span>70</span>
              <Battery className={`w-4 h-4 ${isDark ? 'fill-slate-300' : 'fill-slate-700'}`} />
            </div>
          </div>
        </div>

        {/* Dynamic Main Body Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24 scrollbar-none relative">
          {children}
        </div>

        {/* Floating Capsule Bottom Navigation Bar (Matches uploaded design) */}
        <div className="absolute bottom-3 left-0 right-0 px-3 z-30 pointer-events-none flex justify-center">
          <div 
            id="floating-navigation-bar"
            className={`w-full max-w-sm backdrop-blur-xl border rounded-full py-1.5 px-2 flex items-center justify-around pointer-events-auto transition-all duration-300 ${
              isDark 
                ? 'bg-[#0e2129]/95 border-slate-700/60 shadow-[0_12px_36px_rgba(0,0,0,0.65)]' 
                : 'bg-white/95 border-slate-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.12)]'
            }`}
          >
            {/* Home */}
            <button
              id="nav-tab-home"
              onClick={() => onTabChange('home')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentTab === 'home'
                  ? isDark 
                    ? 'bg-[#1b3b47] text-amber-300 font-bold shadow-md' 
                    : 'bg-slate-900 text-amber-400 font-bold shadow-md'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className={`w-4 h-4 ${currentTab === 'home' ? 'stroke-[2.4] text-amber-400' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] tracking-wide">Home</span>
            </button>

            {/* Task (Bonanza Deals) */}
            <button
              id="nav-tab-task"
              onClick={() => onTabChange('task')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer relative ${
                currentTab === 'task'
                  ? isDark 
                    ? 'bg-[#1b3b47] text-amber-300 font-bold shadow-md' 
                    : 'bg-slate-900 text-amber-400 font-bold shadow-md'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListOrdered className={`w-4 h-4 ${currentTab === 'task' ? 'stroke-[2.4] text-amber-400' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] tracking-wide">Task</span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute -top-0.5 right-2" />
            </button>

            {/* Transaction (History) */}
            <button
              id="nav-tab-transaction"
              onClick={() => onTabChange('transaction')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentTab === 'transaction'
                  ? isDark 
                    ? 'bg-[#1b3b47] text-amber-300 font-bold shadow-md' 
                    : 'bg-slate-900 text-amber-400 font-bold shadow-md'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className={`w-4 h-4 ${currentTab === 'transaction' ? 'stroke-[2.4] text-amber-400' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] tracking-wide">History</span>
            </button>

            {/* Profile */}
            <button
              id="nav-tab-profile"
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentTab === 'profile'
                  ? isDark 
                    ? 'bg-[#1b3b47] text-amber-300 font-bold shadow-md' 
                    : 'bg-slate-900 text-amber-400 font-bold shadow-md'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className={`w-4 h-4 ${currentTab === 'profile' ? 'stroke-[2.4] text-amber-400' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] tracking-wide">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
