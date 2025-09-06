"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiGrid, 
  FiMenu, 
  FiX,
  FiChevronDown,
  FiBook,
  FiHome,
  FiShield,
  FiLoader // Add the loader icon
} from 'react-icons/fi';
import { useAuth } from '../context/authContext';
import { useProfile } from '../context/profileContext';
import ProfileModal from './ProfileModal';
import LinkedListNavigation from './Linkedlist';

export type Category = {
  _id: string;
  name: string;
  slug: string;
  parentslug: string;
  filters: string[];
  subcategories: Subcategory[];
};

export type Subcategory = {
  _id: string;
  name: string;
  slug: string;
  parentslug: string;
  filters: string[];
  subcategories?: Subcategory[];
};

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add loading state for logout
  const { isAuthenticated, logout ,isAdmin} = useAuth();
  const { userDetails } = useProfile();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  // const isAdmin = userDetails?.email === 'ah770643@gmail.com';

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/categories');
        const data = await response.json();
        setAllCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen) {
        const profileElement = document.getElementById('profile-dropdown');
        if (profileElement && !profileElement.contains(event.target as Node)) {
          setIsProfileOpen(false);
        }
      }
      
      // Close category dropdown when clicking outside
      if (hoveredCategory && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen, hoveredCategory]);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start loading
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false); // Stop loading regardless of success/failure
    }
  };

  const handleSettingsClick = () => {
    setIsProfileModalOpen(true);
    setIsProfileOpen(false);
  };

  const handleCategoryHover = (categoryId: string) => {
    setHoveredCategory(categoryId);
  };

  const handleCategoryLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving to dropdown
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && dropdownRef.current && dropdownRef.current.contains(relatedTarget)) {
      return; // Don't hide if moving to dropdown
    }
    setHoveredCategory(null);
  };

  const handleDropdownLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving to category button
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('.category-item')) {
      return; // Don't hide if moving to category
    }
    setHoveredCategory(null);
  };

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transform rotate-45 group-hover:rotate-90 transition-transform duration-300 flex items-center justify-center">
                  <FiBook className="text-white text-lg transform -rotate-45" />
                </div>
                <span className="ml-2 text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  Blog3D
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-1">
                <Link 
                  href="/" 
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 group"
                >
                  <FiHome className="mr-1" />
                  Home
                </Link>
                
                {/* Categories with hover dropdowns */}
                <div className="flex items-center">
                  {allCategories.map((category) => (
                    <div 
                      key={category._id}
                      className="relative category-item"
                      onMouseEnter={() => handleCategoryHover(category._id)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      <Link 
                        href={`/Category/${category.slug}`} 
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300"
                      >
                        {category.name}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <FiChevronDown className="ml-1 h-3 w-3" />
                        )}
                      </Link>
                      
                      {/* Subcategories dropdown */}
                      {category.subcategories && category.subcategories.length > 0 && hoveredCategory === category._id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50"
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="py-1">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory._id}
                                href={`/Category/${subcategory.slug}`}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => setHoveredCategory(null)}
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
               
                  <Link 
                    href="/Dashboard" 
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300"
                  >
                    <FiGrid className="mr-1" />
                    Dashboard
                  </Link>
                

                {/* Admin Panel Link (only for specific admin email) */}
                {isAdmin && (
                  <Link 
                    href="/Admin" 
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 transition-all duration-300 group"
                    title="Admin Panel"
                  >
                    <FiShield className="mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Auth buttons / Profile */}
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex md:items-center">
                {isAuthenticated ? (
                  /* Profile dropdown */
                  <div className="relative" id="profile-dropdown">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 focus:outline-none"
                    >
                      {userDetails?.avatarLink ? (
                        <img
                          src={userDetails.avatarLink}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center border-2 border-gray-600">
                          <FiUser className="text-white text-sm" />
                        </div>
                      )}
                      {/* Show crown badge for admin */}
                      {isAdmin && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                          <FiShield className="w-3 h-3" />
                        </div>
                      )}
                      <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-xl py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">
                            {userDetails?.firstName || 'User'}
                            {isAdmin && (
                              <span className="ml-2 text-yellow-400" title="Admin">
                                <FiShield className="inline w-3 h-3" />
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {userDetails?.email}
                          </p>
                        </div>
                        
                        <button
                          onClick={handleSettingsClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        >
                          <FiSettings className="mr-3" />
                          Settings
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut} // Disable button during logout
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <FiLoader className="mr-3 animate-spin" />
                              Signing Out...
                            </>
                          ) : (
                            <>
                              <FiLogOut className="mr-3" />
                              Sign Out
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sign Up button for non-authenticated users */
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden -mr-2 flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors duration-300"
                >
                  {isMenuOpen ? (
                    <FiX className="block h-6 w-6" />
                  ) : (
                    <FiMenu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
              <Link 
                href="/" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHome className="mr-3" />
                Home
              </Link>
              
              {/* Mobile categories */}
              <div className="overflow-y-auto max-h-96">
                {allCategories.map((category) => (
                  <div key={category._id} className="border-b border-gray-700">
                    <Link 
                      href={`/Category/${category.slug}`} 
                      className="flex items-center px-4 py-3 hover:bg-gray-700 text-white transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="pl-8">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            href={`/Category/${subcategory.slug}`}
                            className="flex items-center px-4 py-2 hover:bg-gray-700 text-sm text-gray-300 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Admin Panel Link in mobile (only for specific admin email) */}
              {isAdmin && (
                <Link 
                  href="/Admin" 
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-yellow-400 hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiShield className="mr-3" />
                  Admin Panel
                </Link>
              )}

              
               
                  <Link 
                    href="/Dashboard" 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiGrid className="mr-3" />
                    Dashboard
                  </Link>
{isAuthenticated && ( 
   <>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FiSettings className="mr-3" />
                    Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut} // Disable button during logout
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <>
                        <FiLoader className="mr-3 animate-spin" />
                        Signing Out...
                      </>
                    ) : (
                      <>
                        <FiLogOut className="mr-3" />
                        Sign Out
                      </>
                    )}
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <Link
                  href="/register"
                  className="flex items-center justify-center w-full mt-4 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
     
    </>
  );
}