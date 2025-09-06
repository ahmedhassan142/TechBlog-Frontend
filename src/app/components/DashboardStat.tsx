"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiEdit, 
  FiFolder, 
  FiUsers, 
  FiEye, 
  FiHeart, 
  FiBarChart,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

interface DashboardStatsProps {
  refreshFlag: number;
}

interface Blog {
  _id: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
  views: number;
  likes: number;
}

interface Category {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  lastLogin: string;
}

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalCategories: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
  recentBlogs: Blog[];
  recentUsers: User[];
}

export default function DashboardStats({ refreshFlag }: DashboardStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0,
    totalLikes: 0,
    recentBlogs: [],
    recentUsers: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [blogsResponse, categoriesResponse, usersResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/blogs`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/user`)
        ]);

        const blogs = blogsResponse.data.data || [];
        const categories = categoriesResponse.data.data || [];
        const users = usersResponse.data.data || [];

        // Calculate statistics
        const publishedBlogs = blogs.filter((blog: Blog) => blog.status === 'published');
        const draftBlogs = blogs.filter((blog: Blog) => blog.status === 'draft');
        const totalViews = blogs.reduce((sum: number, blog: Blog) => sum + (blog.views || 0), 0);
        const totalLikes = blogs.reduce((sum: number, blog: Blog) => sum + (blog.likes || 0), 0);

        // Get recent blogs and users
        const recentBlogs = blogs
          .sort((a: Blog, b: Blog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        const recentUsers = users
          .sort((a: User, b: User) => new Date(b.lastLogin || b._id).getTime() - new Date(a.lastLogin || a._id).getTime())
          .slice(0, 5);

        setStats({
          totalBlogs: blogs.length,
          publishedBlogs: publishedBlogs.length,
          draftBlogs: draftBlogs.length,
          totalCategories: categories.length,
          totalUsers: users.length,
          totalViews,
          totalLikes,
          recentBlogs,
          recentUsers
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshFlag]);

  const StatCard = ({ title, value, icon, trend, onClick }: any) => (
    <div 
      className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-700 group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-400 text-sm font-medium">{title}</div>
        <div className="text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      {trend && (
        <div className="flex items-center text-xs font-medium">
          {trend.value > 0 ? (
            <FiTrendingUp className={`mr-1 ${trend.color}`} />
          ) : (
            <FiTrendingDown className={`mr-1 ${trend.color}`} />
          )}
          <span className={trend.color}>
            {Math.abs(trend.value)}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-800 rounded-xl"></div>
            <div className="h-80 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
      {/* Header with Timeframe Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Dashboard Overview</h2>
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'all'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          icon={<FiFileText className="w-5 h-5" />}
          trend={{ value: 12, label: 'this month', color: 'text-green-400' }}
        />
        
        <StatCard
          title="Published"
          value={stats.publishedBlogs}
          icon={<FiCheckCircle className="w-5 h-5" />}
          trend={{ value: 8, label: 'this week', color: 'text-green-400' }}
        />
        
        <StatCard
          title="Drafts"
          value={stats.draftBlogs}
          icon={<FiEdit className="w-5 h-5" />}
          trend={{ value: -3, label: 'this week', color: 'text-red-400' }}
        />
        
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<FiFolder className="w-5 h-5" />}
        />
        
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FiUsers className="w-5 h-5" />}
          trend={{ value: 5, label: 'this month', color: 'text-green-400' }}
        />
        
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={<FiEye className="w-5 h-5" />}
          trend={{ value: 15, label: 'this week', color: 'text-green-400' }}
        />
        
        <StatCard
          title="Total Likes"
          value={stats.totalLikes.toLocaleString()}
          icon={<FiHeart className="w-5 h-5" />}
          trend={{ value: 10, label: 'this week', color: 'text-green-400' }}
        />
        
        <StatCard
          title="Engagement Rate"
          value={`${stats.totalViews > 0 ? Math.round((stats.totalLikes / stats.totalViews) * 100) : 0}%`}
          icon={<FiBarChart className="w-5 h-5" />}
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FiFileText className="mr-2" />
            Recent Blog Posts
          </h3>
          {stats.recentBlogs.length > 0 ? (
            <div className="space-y-3">
              {stats.recentBlogs.map((blog) => (
                <div key={blog._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200 group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors duration-200">
                      {blog.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === 'published' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-3">
                     <span className="flex items-center">
  <FiEye className="mr-1" />
  {typeof blog.views === 'number' ? blog.views : 0}
</span>
<span className="flex items-center">
  <FiHeart className="mr-1" />
  {typeof blog.likes === 'number' ? blog.likes : 0}
</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No blog posts yet</p>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FiUsers className="mr-2" />
            Recent Users
          </h3>
          {stats.recentUsers.length > 0 ? (
            <div className="space-y-3">
            {stats.recentUsers.map((user) => (
  <div key={user._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200 group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors duration-200">
        {user.username || 'Unknown User'}
      </h4>
      <span className="text-xs text-gray-400 truncate max-w-[120px]">
        {typeof user.email === 'string' ? user.email : JSON.stringify(user.email)}
      </span>
    </div>
    <div className="flex items-center text-xs text-gray-400">
      <FiClock className="mr-1" />
      Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
    </div>
  </div>
))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No users yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FiBarChart className="mr-2" />
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.publishedBlogs}</div>
            <div className="text-sm text-gray-400">Active Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(stats.totalViews / Math.max(stats.publishedBlogs, 1))}
            </div>
            <div className="text-sm text-gray-400">Avg. Views/Post</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round((stats.totalLikes / Math.max(stats.totalViews, 1)) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Engagement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-sm text-gray-400">Registered Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}