import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateProfileImage } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';
import ImageCropperModal from './ImageCropperModal';
import { Sparkles, LayoutDashboard, PlayCircle, LogOut, Camera, Trash2, X, User, Loader2, Crop, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);

    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
    if (!isImage) {
      setUploadError('Please select a JPG, JPEG, PNG, or WEBP image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageToCrop(event.target.result);
      setIsAvatarModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedDataUri) => {
    try {
      setIsUploading(true);
      setImageToCrop(null);
      const actionResult = await dispatch(updateProfileImage({ profileImage: croppedDataUri }));
      if (!updateProfileImage.fulfilled.match(actionResult)) {
        setUploadError(actionResult.payload || 'Failed to update profile photo.');
      }
    } catch (err) {
      console.error('Profile image update error:', err);
      setUploadError('Failed to save cropped photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);
    setUploadError(null);
    await dispatch(updateProfileImage({ profileImage: null }));
    setIsUploading(false);
    setIsAvatarModalOpen(false);
  };

  if (!isAuthenticated) return null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-2 border-blue-500 dark:border-slate-700 shadow-sm font-sans transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight font-baskerville">SmartPrep</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 block font-bold">Interview Practice Studio</span>
            </div>
          </Link>

          {/* Navigation Links & Theme Switcher */}
          <nav className="flex items-center space-x-3">
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all flex items-center space-x-1.5 text-xs font-bold"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all border-2 ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              <div className="p-1 rounded-lg border border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
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

            {/* Profile Avatar Button */}
            <div className="flex items-center space-x-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setUploadError(null);
                  setIsAvatarModalOpen(true);
                }}
                title="Manage Profile Photo & Crop"
                className="relative group focus:outline-none"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-blue-600 dark:border-blue-400 shadow-sm group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center border-2 border-blue-700 shadow-sm">
                    {userInitial}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-400 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </button>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold">{user?.targetRole || 'Candidate'}</span>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Profile Avatar Settings Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative animate-fadeIn text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <div className="p-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <span>Profile Avatar Settings</span>
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-500 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl">
                {uploadError}
              </div>
            )}

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
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{user?.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg, image/jpg, image/png, image/webp, image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="space-y-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Avatar...</span>
                  </>
                ) : (
                  <>
                    <Crop className="w-4 h-4" />
                    <span>Select Photo from Gallery & Crop</span>
                  </>
                )}
              </button>

              {user?.profileImage && (
                <button
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                  className="w-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-extrabold py-2.5 px-4 rounded-xl border-2 border-rose-400 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Profile Photo</span>
                </button>
              )}

              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropperModal
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
        />
      )}
    </>
  );
};

export default Navbar;
