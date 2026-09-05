import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Sparkles, LayoutDashboard, PlayCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Blue Border */}
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">SmartPrep</span>
            <span className="text-xs text-blue-600 block font-bold">AI Interview Platform</span>
          </div>
        </Link>

        {/* Navigation Links with Blue Outlines */}
        <nav className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all border-2 ${
              location.pathname === '/dashboard'
                ? 'bg-blue-50 text-blue-600 border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            <div className="p-1 rounded-lg border border-blue-500 bg-blue-50 text-blue-600">
              <LayoutDashboard className="w-3.5 h-3.5" />
            </div>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/start"
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all border-2 ${
              location.pathname === '/start'
                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
            }`}
          >
            <div className="p-1 rounded-lg border border-white/40 bg-white/20 text-white">
              <PlayCircle className="w-3.5 h-3.5" />
            </div>
            <span>New Interview</span>
          </Link>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-3 pl-3 border-l-2 border-slate-200">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              <span className="text-xs text-blue-600 font-mono font-semibold">{user?.targetRole || 'Candidate'}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border-2 border-slate-200 hover:border-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
