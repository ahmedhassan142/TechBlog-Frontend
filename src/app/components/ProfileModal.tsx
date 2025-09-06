'use client'
import { useState, useRef, useEffect } from 'react';
import { useProfile } from '../context/profileContext';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FiX, 
  FiUser, 
  FiMail, 
  FiLock, 
  FiCamera, 
  FiSave,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Avatar {
  _id: string;
  link: string;
}

const DEFAULT_AVATARS = [
  "avatar1.jpg",
  "avatar2.jpg",
  "avatar3.jpg",
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userDetails, refreshProfile } = useProfile();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("/default-avatar.jpg");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarCategories, setAvatarCategories] = useState<{
    name: string;
    avatars: Avatar[];
  }[]>([
    { name: "Default Avatars", avatars: [] },
    { name: "Your Avatars", avatars: [] }
  ]);

  // Initialize form data with user details
  useEffect(() => {
    if (userDetails) {
      setFormData({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        email: userDetails.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAvatar(userDetails.avatarLink || '');
      setSelectedAvatar(userDetails.avatarLink || "/default-avatar.jpg");
    }
  }, [userDetails]);

  // Custom Image component to handle external URLs
  const CustomImage = ({ src, alt, width, height, className, onError }: any) => {
    const [imgSrc, setImgSrc] = useState(src);
    
    const isExternal = src && src.startsWith('http');
    
    if (isExternal) {
      return (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={(e) => {
            setImgSrc("/default-avatar.jpg");
            onError && onError(e);
          }}
        />
      );
    }
    
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={(e) => {
          setImgSrc("/default-avatar.jpg");
          onError && onError(e);
        }}
      />
    );
  };

  // Fetch avatars on modal open
  // Fetch avatars on modal open
useEffect(() => {
  const fetchAvatars = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001';
      const response = await axios.get(
        `${API_BASE_URL}/api/avatar/all`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          withCredentials: true
        }
      );
      
      // Debug the response structure
      console.log('Avatar API response:', response.data);
      
      // Handle different response structures
      let avatars: Avatar[] = [];
      
      if (Array.isArray(response.data)) {
        // Response is directly an array
        avatars = response.data;
      } else if (response.data && Array.isArray(response.data.avatars)) {
        // Response has avatars array property
        avatars = response.data.avatars;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Response has success flag and data array
        avatars = response.data.data;
      } else {
        console.error('Unexpected avatar API response structure:', response.data);
        toast.error('Failed to load avatars: unexpected response format');
        return;
      }
      
      const defaultAvatars = avatars.filter((a: Avatar) => 
        DEFAULT_AVATARS.some(defaultAvatar => a.link.includes(defaultAvatar))
      );
      
      const userAvatars = avatars.filter((a: Avatar) => 
        !DEFAULT_AVATARS.some(defaultAvatar => a.link.includes(defaultAvatar))
      );
      
      setAvatarCategories([
        { name: "Default Avatars", avatars: defaultAvatars },
        { name: "Your Avatars", avatars: userAvatars }
      ]);
    } catch (error) {
      console.error('Failed to load avatars:', error);
      toast.error('Failed to load avatars');
    }
  };

  if (isOpen && token) {
    fetchAvatars();
  }
}, [isOpen, token]);
  // Reset scroll position when modal opens
  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setAvatar(avatarUrl);
    setShowAvatarModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      const errorMsg = 'New passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      const errorMsg = 'Current password is required to set a new password';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      const errorMsg = 'New password must be at least 6 characters';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001';
      
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(avatar && { avatarLink: avatar })
      };

      // Only include password fields if they're being changed
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/api/user/profile/update`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      const successMsg = response.data.message || 'Profile updated successfully!';
      setSuccess(successMsg);
      toast.success(successMsg);
      
      await refreshProfile();
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Close modal after successful update
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to update profile';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/90 backdrop-blur-lg rounded-xl w-full max-w-md border border-gray-700 shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
              Profile Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              disabled={loading}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div 
            ref={modalContentRef}
            className="p-6 overflow-y-auto flex-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="text-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-lg">
                    <CustomImage
                      src={selectedAvatar}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                    disabled={loading}
                  >
                    <FiCamera className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/30 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </motion.div>
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Change Password</h3>
                
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Enter current password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Select Avatar</h2>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {avatarCategories.map((category) => (
                <div key={category.name} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    {category.name}
                  </h3>
                  {category.avatars.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {category.avatars.map((avatar) => (
                        <motion.div
                          key={avatar._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square ${
                            selectedAvatar === avatar.link
                              ? 'ring-4 ring-blue-500'
                              : 'hover:ring-2 hover:ring-gray-500'
                          } transition-all`}
                          onClick={() => handleAvatarSelect(avatar.link)}
                        >
                          <CustomImage
                            src={avatar.link}
                            alt="Avatar"
                            width={120}
                            height={120}
                            className="object-cover w-full h-full"
                          />
                          {selectedAvatar === avatar.link && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                              </svg>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-700/30 rounded-xl">
                      No avatars available
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gray-700/50 px-6 py-4 flex justify-end">
              <motion.button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}