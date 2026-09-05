import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateProfileImage } from '../features/auth/authSlice';
import { Sparkles, LayoutDashboard, PlayCircle, LogOut, Camera, Trash2, X, User } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setIsUploading(true);
      await dispatch(updateProfileImage({ profileImage: base64Data }));
      setIsUploading(false);
      setIsAvatarModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);
    await dispatch(updateProfileImage({ profileImage: null }));
    setIsUploading(false);
    setIsAvatarModalOpen(false);
  };

  if (!isAuthenticated) return null;

  // Fallback initial
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-500 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo with Blue Border */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight font-baskerville">SmartPrep</span>
              <span className="text-xs text-blue-600 block font-bold">AI Interview Platform</span>
            </div>
          </Link>

          {/* Navigation Links & Controls */}
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
              <div className="p-1 rounded-md border border-white/40 bg-white/20 text-white">
                <PlayCircle className="w-3.5 h-3.5" />
              </div>
              <span>New Interview</span>
            </Link>

            {/* Profile Picture Avatar & User Info */}
            <div className="flex items-center space-x-3 pl-3 border-l-2 border-slate-200">
              {/* Profile Avatar Button */}
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                title="Manage Profile Photo"
                className="relative group focus:outline-none"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-blue-600 shadow-sm group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center border-2 border-blue-700 shadow-sm">
                    {userInitial}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-blue-600 rounded-full flex items-center justify-center text-blue-600">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </button>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</span>
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

      {/* Profile Avatar Management Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white border-2 border-blue-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <span>Profile Avatar Settings</span>
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Avatar Display */}
            <div className="flex flex-col items-center space-y-3 py-2">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-600 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white font-black text-4xl flex items-center justify-center border-4 border-blue-700 shadow-md">
                  {userInitial}
                </div>
              )}
              <div className="text-center">
                <h4 className="font-extrabold text-slate-900 text-base">{user?.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>{user?.profileImage ? 'Upload New Photo from Gallery' : 'Upload Photo from Gallery'}</span>
              </button>

              {user?.profileImage && (
                <button
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold py-2.5 px-4 rounded-xl border-2 border-rose-400 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Profile Photo</span>
                </button>
              )}

              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl border-2 border-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
