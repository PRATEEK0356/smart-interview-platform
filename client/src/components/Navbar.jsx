import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateProfileImage } from '../features/auth/authSlice';
import { Sparkles, LayoutDashboard, PlayCircle, LogOut, Camera, Trash2, X, User, Loader2 } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Helper to downscale and compress any selected JPG/PNG/WEBP to 300x300 avatar JPEG
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to clean JPEG format with 0.85 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);

    // Accept jpg, jpeg, png, webp, and general image formats
    const isJpgOrImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
    if (!isJpgOrImage) {
      setUploadError('Please select a JPG, JPEG, PNG, or WEBP image file.');
      return;
    }

    try {
      setIsUploading(true);
      const compressedJpgBase64 = await compressImage(file);
      const actionResult = await dispatch(updateProfileImage({ profileImage: compressedJpgBase64 }));

      if (updateProfileImage.fulfilled.match(actionResult)) {
        setIsAvatarModalOpen(false);
      } else {
        setUploadError(actionResult.payload || 'Failed to upload JPG image.');
      }
    } catch (err) {
      console.error('Image compression error:', err);
      setUploadError('Failed to process JPG image file.');
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
      <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-500 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight font-baskerville">SmartPrep</span>
              <span className="text-xs text-blue-600 block font-bold">AI Interview Platform</span>
            </div>
          </Link>

          {/* Navigation Links */}
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

            {/* Profile Avatar Button */}
            <div className="flex items-center space-x-3 pl-3 border-l-2 border-slate-200">
              <button
                onClick={() => {
                  setUploadError(null);
                  setIsAvatarModalOpen(true);
                }}
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
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <span>Profile Photo Settings</span>
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-700 text-xs font-bold">
                {uploadError}
              </div>
            )}

            {/* Avatar Preview */}
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

            {/* Hidden File Input for JPG/JPEG/PNG */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg, image/jpg, image/png, image/webp, image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Controls */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Uploading JPG...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Upload JPG / Image from Gallery</span>
                  </>
                )}
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
