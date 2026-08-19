import React, { useEffect, useState } from 'react';
import { getSession, onAuthStateChange, signIn, signUp } from '../lib/backend';
import { RefreshCw } from 'lucide-react';

export const AuthGate: React.FC<{ children: (session: any) => React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(undefined); // undefined = still checking
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSession().then(setSession);
    const { data: listener } = onAuthStateChange(setSession);
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = isSignUp ? await signUp(email, password) : await signIn(email, password);
      if (authError) setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051115]">
        <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051115] p-4">
        <div className="w-full max-w-sm bg-[#071920] border border-slate-700/60 rounded-3xl p-6 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-1">VTU Hub</h1>
          <p className="text-xs text-slate-400 mb-6">{isSignUp ? 'Create your account' : 'Sign in to continue'}</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                id="auth-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0b242c] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                id="auth-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0b242c] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition disabled:opacity-60"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <button
            id="auth-toggle-mode"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-xs text-slate-400 hover:text-emerald-400 mt-4"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children(session)}</>;
};
