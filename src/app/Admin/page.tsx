"use client"
import { useState } from 'react';
import Head from 'next/head';

import BlogForm from '../components/Blogform';
import DashboardStats from '../components/DashboardStat';
import BlogList from '../components/Bloglist';
import CategoryForm from '../components/Categoryform';

type AdminView = 'dashboard' | 'categories' | 'create-blog' | 'manage-blogs';

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleRefresh = () => {
    setRefreshFlag(prev => prev + 1);
  };

  const handleEditBlog = (blog: any) => {
    setSelectedBlog(blog);
    setActiveView('create-blog');
  };

  const handleBlogSubmit = () => {
    setSelectedBlog(null);
    setActiveView('manage-blogs');
    handleRefresh();
  };

  const handleCategoryUpdate = () => {
    handleRefresh();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardStats refreshFlag={refreshFlag} />;
      case 'categories':
        return <CategoryForm 
        //@ts-ignore
                 categories={categories} 
                 onSubmit={handleCategoryUpdate} 
                 onCancel={() => setActiveView('dashboard')} 
               />;
      case 'create-blog':
        return (
          <BlogForm 
            blog={selectedBlog}
            //@ts-ignore 
            onSubmit={handleBlogSubmit} 
            onCancel={() => setActiveView('manage-blogs')} 
          />
        );
      case 'manage-blogs':
        return <BlogList onEditBlog={handleEditBlog} refreshFlag={refreshFlag} />;
      default:
        return <DashboardStats refreshFlag={refreshFlag} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Admin Panel | Blog3D</title>
        <meta name="description" content="Admin panel for managing blog content and categories" />
      </Head>

      {/* Header */}
     
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-800 rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">Admin Navigation</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-300 ${
                  activeView === 'dashboard'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('categories')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-300 ${
                  activeView === 'categories'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Manage Categories
              </button>
              <button
                onClick={() => {
                  setSelectedBlog(null);
                  setActiveView('create-blog');
                }}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-300 ${
                  activeView === 'create-blog'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Create New Blog
              </button>
              <button
                onClick={() => setActiveView('manage-blogs')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-300 ${
                  activeView === 'manage-blogs'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Manage Blogs
              </button>
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 uppercase mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedBlog(null);
                    setActiveView('create-blog');
                  }}
                  className="w-full text-left px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-300"
                >
                  + New Blog Post
                </button>
                <button
                  onClick={() => setActiveView('categories')}
                  className="w-full text-left px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-300"
                >
                  + New Category
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* View Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white capitalize">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'categories' && 'Category Management'}
                {activeView === 'create-blog' && (selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post')}
                {activeView === 'manage-blogs' && 'Blog Management'}
              </h1>
              <p className="text-gray-400 mt-1">
                {activeView === 'dashboard' && 'Overview of your blog content and statistics'}
                {activeView === 'categories' && 'Create and manage categories and subcategories'}
                {activeView === 'create-blog' && 'Write and publish new blog content'}
                {activeView === 'manage-blogs' && 'Edit, publish, or delete existing blog posts'}
              </p>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}