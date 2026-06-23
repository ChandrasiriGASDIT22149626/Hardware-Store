import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, AlertCircleIcon, ShieldCheckIcon, GiftIcon, ThumbsUpIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; 
import type { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [shopSettings, setShopSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('system_settings').select('*').single();
        if (data) setShopSettings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    try {
      // Login Logic
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Fetch the real, Super Admin approved role from the protected profiles table
        const { data: profile } = await supabase.from('profiles').select('*').eq('email', data.user.email).single();
        
        const finalRole = profile?.role || data.user.user_metadata?.role || 'retail_user';
        const finalName = profile?.name || data.user.user_metadata?.full_name || 'Hardware Staff';
        
        const loggedInUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: finalName,
          role: finalRole, 
          avatar: profile?.avatar || data.user.email?.charAt(0).toUpperCase() || 'U'
        };
        onLogin(loggedInUser);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      
      {/* Left Branding Panel (Ash & Gold Theme) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#464646] flex-col justify-between p-12 relative overflow-hidden shadow-2xl z-10">
        {/* Decorative Gold Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#DAA520]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#DAA520]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5 shrink-0">
              <img 
                src={shopSettings?.logo_path || "./images/logo.png"} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-black text-2xl tracking-tight leading-none mb-1">
                {(shopSettings?.shop_name || 'MUTHUWADIGE HARDWARE').split(' ')[0] || ''}
              </span>
              <span className="text-[#DAA520] font-black text-2xl tracking-widest leading-none">
                {(shopSettings?.shop_name || 'MUTHUWADIGE HARDWARE').split(' ').slice(1).join(' ') || ''}
              </span>
            </div>
          </div>

          <h2 className="text-5xl font-black text-white leading-[1.1] mb-6">
            Your Trusted <br/> <span className="text-[#DAA520]">Hardware Partner</span> <br/> for Every Project.
          </h2>
          <p className="text-gray-300 text-lg font-medium max-w-md">
            Welcome to Muthuwadige Hardware. We offer premium building materials, tools, and outstanding services.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
             <div className="p-3 bg-[#DAA520]/20 rounded-xl"><ShieldCheckIcon className="text-[#DAA520] w-6 h-6" /></div>
             <div>
                <p className="text-white font-black text-sm">Premium Quality</p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">100% genuine products from leading brands</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
             <div className="p-3 bg-white/10 rounded-xl"><GiftIcon className="text-white w-6 h-6" /></div>
             <div>
                <p className="text-white font-black text-sm">Loyalty Program</p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">Earn reward points and enjoy exclusive discounts</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
             <div className="p-3 bg-white/10 rounded-xl"><ThumbsUpIcon className="text-white w-6 h-6" /></div>
             <div>
                <p className="text-white font-black text-sm">Customer First</p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">Helpful staff, fast delivery, and expert recommendations</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-in slide-in-from-right-8 duration-500">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
            
            <h1 className="text-3xl font-black text-[#464646] mb-2">
              Staff Login
            </h1>
            <p className="text-gray-500 mb-8 text-sm font-medium">
              Enter your credentials to access the ERP
            </p>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4 mb-6 text-sm font-bold animate-in slide-in-from-top-2">
                <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#DAA520] outline-none text-sm font-bold text-[#464646] bg-gray-50/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#DAA520] outline-none text-sm font-bold text-[#464646] pr-12 bg-gray-50/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#DAA520] transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#DAA520] hover:bg-[#B8860B] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#DAA520]/20 uppercase tracking-widest text-xs mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying Credentials...' : 'Secure Login'}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              🔒 SECURE LOCAL DATABASE ACTIVE
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}