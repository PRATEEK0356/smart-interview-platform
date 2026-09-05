import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordApi, resetPasswordApi } from '../api/authApi';
import { Sparkles, Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError(null);
      const data = await forgotPasswordApi({ email });
      setSuccessMessage(data.message);
      if (data.otp) {
        setOtp(data.otp); // Auto-fill for convenience in test environment
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) return;

    try {
      setLoading(true);
      setError(null);
      const data = await resetPasswordApi({ email, otp, newPassword });
      setSuccessMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm mb-4">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reset Password</h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {step === 1
              ? 'Enter your registered email to receive a 6-digit OTP code'
              : 'Enter the 6-digit OTP sent to your email and your new password'}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-start space-x-3 text-rose-700 font-bold text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex items-start space-x-3 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Request OTP Form */
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending 6-Digit OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send 6-Digit OTP Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Verify OTP & Reset Password Form */
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Registered Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-slate-100 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-mono font-bold text-slate-900 tracking-widest placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !otp || !newPassword}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 font-extrabold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
