import React, { useState } from 'react';
import {
  Leaf,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  KeyRound,
  Loader2,
  Zap,
  Navigation,
  ShoppingBag,
  UtensilsCrossed,
  Recycle,
  BarChart3,
} from 'lucide-react';
import { loginUser, registerUser } from '../lib/api';
import { User } from '../types';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('sarah.chen@ecotrack.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Sarah Chen');
  const [role, setRole] = useState<'Individual' | 'Corporate Auditor' | 'Municipal Lead'>('Corporate Auditor');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email || !password) {
          setError('Please enter both email address and password.');
          setLoading(false);
          return;
        }
        const res = await loginUser(email, password);
        if (res.success && res.user) {
          setSuccessMsg(`Welcome back, ${res.user.name}!`);
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 600);
        } else {
          setError(res.error || 'Invalid credentials. Please check your email and password.');
        }
      } else if (mode === 'signup') {
        if (!fullName || !email || !password) {
          setError('Please complete all required fields.');
          setLoading(false);
          return;
        }
        const res = await registerUser(fullName, email, password, role);
        if (res.success && res.user) {
          setSuccessMsg(`Account created successfully! Welcome to EcoTrack, ${res.user.name}.`);
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 600);
        } else {
          setError(res.error || 'Failed to register account.');
        }
      } else if (mode === 'forgot') {
        if (!email) {
          setError('Please enter your account email address.');
          setLoading(false);
          return;
        }
        setSuccessMsg(`Password reset link has been dispatched to ${email}. Check your inbox!`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (demoUser: { email: string; name: string; avatar?: string }) => {
    setLoading(true);
    setError(null);
    setEmail(demoUser.email);
    setPassword('demopassword123');
    try {
      const res = await loginUser(demoUser.email, 'demopassword123');
      const userObj = res.user || {
        id: `u_${Date.now()}`,
        name: demoUser.name,
        email: demoUser.email,
        avatar: demoUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      };
      setSuccessMsg(`Signed in as ${userObj.name}`);
      setTimeout(() => {
        onLoginSuccess(userObj);
      }, 500);
    } catch (err) {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <Leaf className="w-7 h-7 text-slate-950 font-black" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                EcoTrack AI
              </span>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Carbon Intelligence Platform
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
              Sign in to manage your <span className="text-emerald-400 underline decoration-emerald-500/50">sustainability footprint</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Real-time carbon accounting, OCR power bill parsing, GPS mode classification, and predictive AI mitigation analytics.
            </p>
          </div>

          {/* Key Feature Bullets */}
          <div className="space-y-2.5 pt-2 hidden sm:block">
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-200">AI Power Bill OCR</p>
                <p className="text-slate-400">Automatic kWh extraction & grid emissions</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-200">GPS Location-Only Classifier</p>
                <p className="text-slate-400">Transit mode detection with Haversine math</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-200">30/60/90 Day Forecasts</p>
                <p className="text-slate-400">ML predictive models & certified audit reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'signup' && 'Create your EcoTrack account'}
              {mode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'signin' && 'Enter your credentials to access your carbon dashboard'}
              {mode === 'signup' && 'Join thousands tracking and offsetting daily emissions'}
              {mode === 'forgot' && 'Enter your account email to receive a recovery link'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Chen"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Type / Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Individual', 'Corporate Auditor', 'Municipal Lead'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                          role === r
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-emerald-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-emerald-400/80 font-mono">256-Bit SSL Encrypted</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Dashboard'}
                    {mode === 'signup' && 'Create Account & Launch'}
                    {mode === 'forgot' && 'Send Password Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          {mode !== 'forgot' && (
            <div className="space-y-4 pt-2">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800" />
                <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  Or One-Click Demo Login
                </span>
                <div className="flex-grow border-t border-slate-800" />
              </div>

              {/* Demo Fast Logins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    quickDemoLogin({
                      name: 'Sarah Chen',
                      email: 'sarah.chen@ecotrack.ai',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-colors flex items-center space-x-2.5"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                    alt="Sarah Chen"
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500"
                  />
                  <div>
                    <p className="font-bold text-slate-200 leading-none">Sarah Chen</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">Corporate Auditor</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    quickDemoLogin({
                      name: 'Alex Rivera',
                      email: 'alex.rivera@greenmail.org',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-colors flex items-center space-x-2.5"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                    alt="Alex Rivera"
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500"
                  />
                  <div>
                    <p className="font-bold text-slate-200 leading-none">Alex Rivera</p>
                    <p className="text-[10px] text-teal-400 mt-0.5">Eco Warrior Lead</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                onClick={() => setMode('signin')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
