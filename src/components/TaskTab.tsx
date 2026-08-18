import React, { useState } from 'react';
import { BonanzaDeal, RewardTask, ServiceType } from '../types';
import { BONANZA_DEALS, REWARD_TASKS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Gift, 
  Zap, 
  CheckCircle2, 
  Trophy, 
  Timer, 
  ChevronRight, 
  ArrowRight,
  RefreshCw,
  Coins
} from 'lucide-react';

interface TaskTabProps {
  onClaimDeal: (deal: BonanzaDeal) => void;
  onRewardClaimed: (amount: number, message: string) => void;
}

export const TaskTab: React.FC<TaskTabProps> = ({
  onClaimDeal,
  onRewardClaimed,
}) => {
  const { isDark } = useTheme();
  const [deals] = useState<BonanzaDeal[]>(BONANZA_DEALS);
  const [tasks, setTasks] = useState<RewardTask[]>(REWARD_TASKS);
  const [claimedDaily, setClaimedDaily] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState<boolean>(false);

  const handleClaimDailyCheckIn = () => {
    if (claimedDaily) return;
    setClaimedDaily(true);
    onRewardClaimed(50, 'Daily Login Bonus Claimed');
  };

  const handleClaimTask = (taskId: string, reward: number, title: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true, progress: t.maxProgress } : t))
    );
    onRewardClaimed(reward, `Completed: ${title}`);
  };

  const handleSpinWheel = () => {
    if (isSpinning || hasSpunToday) return;
    setIsSpinning(true);
    setSpinResult(null);

    const outcomes = [
      { text: '₦200 Instant Wallet Cash', amount: 200 },
      { text: '1GB Free MTN Data', amount: 265 },
      { text: '₦100 Electricity Discount', amount: 100 },
      { text: '500 Reward Points', amount: 50 },
    ];

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = outcomes[Math.floor(Math.random() * outcomes.length)];
      setSpinResult(chosen.text);
      setHasSpunToday(true);
      onRewardClaimed(chosen.amount, `Won: ${chosen.text}`);
    }, 2000);
  };

  return (
    <div id="task-tab-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="px-1 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Bonanza Deals & Tasks
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Exclusive discounts, mega sales & cash rewards
            </p>
          </div>
        </div>
      </div>

      {/* Daily Login Streak Reward Card */}
      <div 
        id="daily-streak-reward-card"
        className={`border rounded-2xl p-4 relative overflow-hidden transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-amber-600/25 via-emerald-700/20 to-teal-900/25 border-amber-500/30' 
            : 'bg-gradient-to-r from-amber-100 via-emerald-50 to-teal-50 border-amber-300 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold uppercase shadow-sm">
                Daily Streak Day 5
              </span>
              <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +₦50 Free
              </span>
            </div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Claim Daily Free Cash Bonus</h3>
            <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Keep a 7-day streak to unlock ₦1,000 jackpot bonus!</p>
          </div>

          <button
            id="claim-daily-bonus-btn"
            disabled={claimedDaily}
            onClick={handleClaimDailyCheckIn}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              claimedDaily
                ? isDark ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-300 text-black'
            }`}
          >
            {claimedDaily ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Claimed
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" /> Claim ₦50
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bonanza Mega Flash Deals */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mega Bonanza Flash Deals
            </h2>
          </div>
          <span className="text-[11px] text-amber-500 font-semibold flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 animate-spin" /> Ends Soon
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              id={`bonanza-deal-${deal.id}`}
              className={`border rounded-2xl p-3.5 space-y-3 transition relative overflow-hidden shadow-sm ${
                isDark 
                  ? 'bg-[#0a232b] border-slate-800/90 hover:border-emerald-500/40' 
                  : 'bg-white border-slate-200 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${deal.tagColor}`}>
                      {deal.tag}
                    </span>
                    <span className="text-[11px] text-emerald-500 font-bold">{deal.network} Network</span>
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{deal.title}</h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {deal.volume} • <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{deal.validity}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-[11px] line-through block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    ₦{deal.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-base font-extrabold text-amber-500">
                    ₦{deal.bonanzaPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar and time left */}
              <div className="space-y-1">
                <div className={`flex justify-between text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Sold: {deal.soldPercentage}%</span>
                  <span className="flex items-center gap-1 text-amber-500 font-mono">
                    <Clock className="w-3 h-3" /> {deal.timeLeft}
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#06181e]' : 'bg-slate-100'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" 
                    style={{ width: `${deal.soldPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`claim-deal-btn-${deal.id}`}
                onClick={() => onClaimDeal(deal)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Claim Bonanza Deal Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lucky Spin Wheel Section */}
      <div 
        id="lucky-spin-section"
        className={`border rounded-2xl p-4 text-center space-y-3 shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0a232b] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 text-amber-500">
          <Trophy className="w-5 h-5" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Spin & Win Wheel</h3>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Spin everyday to win instant wallet cash, data bundles, and bill discounts!
        </p>

        {spinResult && (
          <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-500 animate-in fade-in">
            🎉 Congratulations! You won: {spinResult}
          </div>
        )}

        <button
          id="spin-wheel-btn"
          disabled={isSpinning || hasSpunToday}
          onClick={handleSpinWheel}
          className={`py-3 px-6 rounded-xl text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer ${
            hasSpunToday
              ? isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 to-emerald-500 text-slate-950 font-extrabold hover:brightness-105 shadow-md'
          }`}
        >
          {isSpinning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              Spinning Lucky Reel...
            </>
          ) : hasSpunToday ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Spun Today (Come back tomorrow)
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Spin Now (Free Daily Chance)
            </>
          )}
        </button>
      </div>

      {/* Milestone Tasks Section */}
      <div className="space-y-2.5">
        <h2 className={`text-sm font-bold tracking-wide px-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Earn Rewards & Tasks
        </h2>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              id={`task-item-${task.id}`}
              className={`border rounded-2xl p-3.5 space-y-2.5 shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-[#0a232b] border-slate-800/80' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{task.title}</h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{task.description}</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                  +{task.rewardType === 'cash' ? `₦${task.reward}` : `${task.reward}GB Data`}
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className={`flex justify-between text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Progress</span>
                  <span>{task.progress}/{task.maxProgress}</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#06181e]' : 'bg-slate-100'}`}>
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                  />
                </div>
              </div>

              {/* Task Claim Button */}
              <button
                id={`claim-task-${task.id}`}
                disabled={task.completed || task.progress < task.maxProgress}
                onClick={() => handleClaimTask(task.id, task.reward, task.title)}
                className={`w-full py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  task.completed
                    ? isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : task.progress >= task.maxProgress
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-md'
                    : isDark ? 'bg-slate-800/60 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {task.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed
                  </>
                ) : task.progress >= task.maxProgress ? (
                  <>
                    <Gift className="w-3.5 h-3.5" /> Claim Reward
                  </>
                ) : (
                  'In Progress'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
