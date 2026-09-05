import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../features/auth/authSlice';
import { Sparkles, User, Mail, Lock, Briefcase, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Full Stack Engineer',
  });

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      dispatch(signupUser(formData));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-white">
      <div className="w-full max-w-md space-y-8">
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Start mastering technical & behavioral interviews with AI evaluation
          </p>
        </div>

        {/* Form Card - White Background with Crisp Blue Border */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-start space-x-3 text-rose-700 font-bold text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Rivers"
                  className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex.developer@example.com"
                  className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
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

export default SignupPage;
