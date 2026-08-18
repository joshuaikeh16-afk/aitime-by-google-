import React from 'react';
import { Transaction } from '../types';
import { CheckCircle2, Copy, Download, Share2, X, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="receipt-modal-backdrop" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div 
        id="receipt-modal-content"
        className="w-full max-w-md bg-[#071a21] border border-slate-700/60 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#05141a]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm text-slate-200">Transaction Receipt</span>
          </div>
          <button 
            id="close-receipt-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200">
          {/* Status Header */}
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Automated Delivery Successful</p>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              ₦{transaction.amount.toLocaleString()}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{transaction.title}</p>
          </div>

          {/* Token Box if available (e.g. Electricity, Exam PINs) */}
          {transaction.token && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between text-xs text-amber-400 font-medium mb-1">
                <span>VENDED TOKEN / PIN</span>
                <button
                  id="copy-token-btn"
                  onClick={() => handleCopyToken(transaction.token!)}
                  className="flex items-center gap-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded text-amber-300 transition"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-base font-mono font-bold tracking-widest text-amber-200 break-all select-all">
                {transaction.token}
              </p>
            </div>
          )}

          {/* Details Table */}
          <div className="rounded-xl bg-[#0a232b] border border-slate-800/80 p-3.5 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Reference No.</span>
              <span className="font-mono text-slate-200 font-medium">{transaction.ref}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Recipient / Beneficiary</span>
              <span className="font-semibold text-slate-100">{transaction.recipient}</span>
            </div>
            {transaction.network && (
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Network Provider</span>
                <span className="font-semibold text-emerald-400">{transaction.network}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Payment Gateway</span>
              <span className="text-slate-200">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Date & Time</span>
              <span className="text-slate-200">{transaction.date} at {transaction.time}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Delivery Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <Zap className="w-3 h-3 fill-emerald-400" /> Instant Dispatched
              </span>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 py-1">
            VTU automated gateway • 100% Secure & Regulated
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-[#05141a] border-t border-slate-800 flex gap-2">
          <button
            id="share-receipt-btn"
            onClick={() => handleCopyToken(`VTU Receipt: ${transaction.title} of ₦${transaction.amount} to ${transaction.recipient}. Ref: ${transaction.ref}`)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 text-slate-200 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Receipt
          </button>
          <button
            id="download-receipt-btn"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold flex items-center justify-center gap-2 text-white shadow-lg shadow-emerald-900/30 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
