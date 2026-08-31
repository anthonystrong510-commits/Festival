import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ExternalLink, 
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Mail,
  UserCheck
} from 'lucide-react';
import { loginWithGoogle } from '../../lib/firebase';

interface AdminLoginProps {
  onExitAdmin: () => void;
  onDemoLoginSuccess: () => void;
}

export function AdminLogin({ onExitAdmin, onDemoLoginSuccess }: AdminLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      // Auth state change in KingAdminPortal will handle the authenticated user
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err?.message || 'Failed to sign in with Google. You can use 1-Click Demo Admin Login below.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] flex flex-col justify-between p-4 sm:p-6 text-[#3D3A30]">
      
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5 text-[#F0EBE0]" />
          </div>
          <div>
            <div className="font-serif italic font-bold text-lg text-[#3D3A30]">
              KingAdmin
            </div>
            <div className="text-[10px] uppercase font-bold text-[#8A8576] tracking-wider">
              Festival Operations Portal
            </div>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="text-xs font-bold text-[#5A5A40] hover:text-[#3D3A30] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2D6] bg-white hover:bg-[#FDFBF7] transition-colors"
        >
          <span>Return to Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl border border-[#E8E2D6] p-7 sm:p-9 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#5A5A40]/10 border border-[#5A5A40]/20 flex items-center justify-center text-[#5A5A40] mx-auto mb-3.5">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif italic font-bold text-[#3D3A30]">
              Admin Authentication
            </h1>
            <p className="text-xs text-[#8A8576] mt-1.5 leading-relaxed">
              Sign in to manage vendor applications, review attendees, configure SMTP email servers, and update schedules.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Primary Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#3D3A30] hover:bg-[#23231B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Sign in with Google Account'}</span>
            </button>

            {/* Quick Demo Access Button (Instant testing / evaluation) */}
            <button
              onClick={onDemoLoginSuccess}
              className="w-full py-3 px-4 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-[#F0EBE0]" />
              <span>Instant Demo Admin Access</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8E2D6] space-y-2 text-[11px] text-[#8A8576]">
            <div className="flex items-center gap-1.5 text-[#5A5A40] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Super Admin Email: muokltd@gmail.com</span>
            </div>
            <p>
              Firestore Security Rules strictly authorize admin email addresses to mutate applications, SMTP credentials, and templates.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#8A8576]">
        &copy; {new Date().getFullYear()} Community Festival &bull; Admin Security Gateway
      </div>

    </div>
  );
}
