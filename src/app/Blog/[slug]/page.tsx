"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/app/context/authContext';
import { useProfile } from '@/app/context/profileContext';
import { toast } from 'react-hot-toast';
import { Heart, MessageCircle, Send, Trash2, Eye, Clock, Calendar, User, ThumbsUp } from 'lucide-react';
import { getOrCreateGuestId, withSessionId } from '../../../utils/sessionid';

// Add the request interceptor
axios.interceptors.request.use(withSessionId);
interface CommentUser {
  userId?: string;
  guestId?: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  user: CommentUser;
  text: string;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  likes: number;
}

interface Like {
  _id: string;
  userId?: string;
  guestId?: string;
  createdAt: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  status: 'draft' | 'published';
  featuredImage: string;
  views: number;
  readTime: number;
  author: {
    name: string;
    avatar: string;
  };
  likes: Like[];
  comments: Comment[];
  allowAnonymous: boolean;
  requireApproval: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  approvedCommentCount: number;
}



// Add the request interceptor
axios.interceptors.request.use(withSessionId);
// Add request interceptor


export default function BlogPostPage() {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLikeLoading, setCommentLikeLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const params = useParams();
  const router = useRouter();
  
  // Use your auth context instead of NextAuth
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();
  const { userDetails, isLoading: profileLoading } = useProfile();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:4001/api/blogs/slug/${slug}`);
      
      if (response.data.success) {
        setBlog(response.data.data);
        
        // Increment views
        try {
          await axios.get(`http://localhost:4001/api/blogs/${response.data.data._id}/views`);
        } catch (viewError) {
          console.warn('Failed to increment views:', viewError);
        }
      } else {
        setError('Blog post not found');
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      setError(error.response?.data?.message || 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

const handleLike = async () => {
  if (!blog) return;

  try {
    setLikeLoading(true);
    
    // Get user details from context (already available at top level)
   
    
    console.log("Like attempt - Authenticated:", isAuthenticated);
    console.log("Like attempt - User ID:", userDetails?._id);
    console.log("Like attempt - Has token:", !!token);
    
    // Get or create guest ID for non-authenticated users
    const guestId = !isAuthenticated ? getOrCreateGuestId() : undefined;
    console.log("Like attempt - Guest ID:", guestId);
    
    // Prepare headers correctly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // For authenticated users: send Authorization header with Bearer token
    if (isAuthenticated && token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log("Setting Authorization header with token");
    } 
    // For non-authenticated users: send guest ID
    else if (guestId) {
      headers["x-session-id"] = guestId;
      console.log("Setting x-session-id header:", guestId);
    }
    
    console.log("Like attempt - Final headers:", headers);
    
    const response = await axios.post(
      `http://localhost:4001/api/blogs/${blog._id}/like`,
      {},
      { headers }
    );
    
    console.log("Like attempt - Response:", response.data);
    
    if (response.data.success) {
      // Update the blog with new likes
      setBlog(prev => {
        if (!prev) return null;
        
        if (response.data.data.liked) {
          // Add like
          return {
            ...prev,
            likes: [
              ...prev.likes, 
              { 
                _id: Date.now().toString(), 
                userId: isAuthenticated ? userDetails?._id : undefined, 
                guestId: !isAuthenticated ? guestId : undefined,
                createdAt: new Date().toISOString() 
              }
            ],
            likeCount: response.data.data.likeCount
          };
        } else {
          // Remove like
          return {
            ...prev,
            likes: prev.likes.filter(like => 
              (isAuthenticated && like.userId !== userDetails?._id) ||
              (!isAuthenticated && like.guestId !== guestId)
            ),
            likeCount: response.data.data.likeCount
          };
        }
      });
      
      toast.success(response.data.message);
    }
  } catch (error: any) {
    console.error('Like error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 400) {
      toast.error(error.response.data.message || 'Authentication issue. Please refresh the page.');
    } else {
      toast.error(error.response?.data?.message || 'Failed to like post');
    }
  } finally {
    setLikeLoading(false);
  }
};

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blog) return;
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    // For guests, validate name
    if (!isAuthenticated && !commentName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      setCommentLoading(true);
      const response = await axios.post(
        `http://localhost:4001/api/blogs/${blog._id}/comments`,
        isAuthenticated 
          ? { text: commentText }
          : { text: commentText, name: commentName, email: commentEmail }
      );
      
      if (response.data.success) {
        // Add the new comment to the blog
        setBlog(prev => prev ? {
          ...prev,
          comments: [...prev.comments, response.data.data],
          approvedCommentCount: response.data.data.isApproved 
            ? prev.approvedCommentCount + 1 
            : prev.approvedCommentCount
        } : null);
        
        setCommentText('');
        setCommentName('');
        setCommentEmail('');
        setShowCommentForm(false);
        
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.error('Comment error:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!blog) return;

    try {
       console.log("Like attempt - Authenticated:", isAuthenticated);
    console.log("Like attempt - User ID:", userDetails?._id);
    console.log("Like attempt - Has token:", !!token);
    
    // Get or create guest ID for non-authenticated users
    const guestId = !isAuthenticated ? getOrCreateGuestId() : undefined;
    console.log("Like attempt - Guest ID:", guestId);
    
    // Prepare headers correctly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // For authenticated users: send Authorization header with Bearer token
    if (isAuthenticated && token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log("Setting Authorization header with token");
    } 
    // For non-authenticated users: send guest ID
    else if (guestId) {
      headers["x-session-id"] = guestId;
      console.log("Setting x-session-id header:", guestId);
    }
    
    console.log("Like attempt - Final headers:", headers);
    
      setCommentLikeLoading(commentId);
      const response = await axios.post(
        `http://localhost:4001/api/blogs/${blog._id}/comments/${commentId}/like`,
         {},
      { headers }
      );
      
      if (response.data.success) {
        // Update the comment likes count
        setBlog(prev => prev ? {
          ...prev,
          comments: prev.comments.map(comment => 
            comment._id === commentId 
              ? { ...comment, likes: response.data.data.likes }
              : comment
          )
        } : null);
        
        toast.success('Comment liked!');
      }
    } catch (error: any) {
      console.error('Like comment error:', error);
      toast.error(error.response?.data?.message || 'Failed to like comment');
    } finally {
      setCommentLikeLoading(null);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!blog) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:4001/api/blogs/${blog._id}/comments/${commentId}`
      );
      
      if (response.data.success) {
        // Remove the comment from the blog
        setBlog(prev => prev ? {
          ...prev,
          comments: prev.comments.filter(comment => comment._id !== commentId),
          approvedCommentCount: prev.comments.find(c => c._id === commentId)?.isApproved
            ? prev.approvedCommentCount - 1
            : prev.approvedCommentCount
        } : null);
        
        toast.success('Comment deleted successfully');
      }
    } catch (error: any) {
      console.error('Delete comment error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const isLiked = blog && (
    (isAuthenticated && blog.likes.some(like => like.userId === userDetails?._id)) ||
    (!isAuthenticated && blog.likes.some(like => like.guestId === getOrCreateGuestId()))
  );

  const canComment = blog && (isAuthenticated || blog.allowAnonymous);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>{blog.title} | Blog3D</title>
        <meta name="description" content={blog.excerpt || blog.description} />
        <meta name="keywords" content={blog.tags.join(', ')} />
      </Head>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex space-x-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition duration-300">Home</Link>
          <span className="text-gray-600">/</span>
          <Link href="/blog" className="hover:text-white transition duration-300">Blog</Link>
          <span className="text-gray-600">/</span>
          {blog.category && (
            <>
              <Link href={`/category/${blog.category.slug}`} className="hover:text-white transition duration-300">
                {blog.category.name}
              </Link>
              <span className="text-gray-600">/</span>
            </>
          )}
          <span className="text-white truncate">{blog.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Image with 3D effect */}
        <div className="relative mb-8 group">
          <div className={`relative h-96 overflow-hidden rounded-2xl transform transition-all duration-700 ${imageLoaded ? 'scale-100' : 'scale-105'} group-hover:scale-105`}>
            {blog.featuredImage ? (
              <img 
                src={blog.featuredImage} 
                alt={blog.title}
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: imageLoaded ? 1 : 0 }}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center">
                <div className="text-white text-2xl font-bold transform rotate-45">Blog3D</div>
              </div>
            )}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
            )}
            {/* 3D Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
          </div>
          
          {/* Floating category badge */}
          {blog.category && (
            <div className="absolute top-6 left-6">
              <Link 
                href={`/category/${blog.category.slug}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {blog.category.name}
              </Link>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="space-y-8">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span>{blog.author?.name || 'Blog3D Author'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime || 5} min read</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>

            {/* Likes Count */}
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{blog.likeCount || 0}</span>
            </button>

            {/* Comments Count */}
            <div className="flex items-center space-x-1 text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>{blog.approvedCommentCount || 0}</span>
            </div>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500 transform hover:-translate-y-1 transition duration-300">
              <p className="text-xl text-gray-300 italic">{blog.excerpt}</p>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>

          {/* Like and Comment Buttons */}
          <div className="flex items-center justify-center space-x-6 py-8 border-t border-b border-gray-700">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex flex-col items-center space-y-1 transition-all ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              } ${likeLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{blog.likeCount || 0} Likes</span>
            </button>

            <button 
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-400 transition-all hover:scale-110"
            >
              <MessageCircle className="w-8 h-8" />
              <span className="text-sm">{blog.approvedCommentCount || 0} Comments</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Comments ({blog.approvedCommentCount || 0})
            </h3>

            {/* Comment Form */}
            {canComment && showCommentForm && (
              <form onSubmit={handleCommentSubmit} className="bg-gray-800 p-6 rounded-2xl">
                <div className="space-y-4">
                  {!isAuthenticated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!isAuthenticated}
                          disabled={commentLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={commentEmail}
                          onChange={(e) => setCommentEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={commentLoading}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Comment *
                    </label>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      required
                      disabled={commentLoading}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                      {blog.requireApproval ? 
                        'Your comment will be reviewed before publishing' : 
                        'Your comment will be published immediately'
                      }
                    </p>
                    <button
                      type="submit"
                      disabled={commentLoading || !commentText.trim() || (!isAuthenticated && !commentName.trim())}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span>{commentLoading ? 'Posting...' : 'Post Comment'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {!canComment && (
              <div className="bg-gray-800 p-6 rounded-2xl text-center">
                <p className="text-gray-400 mb-4">Comments are disabled for this post</p>
              </div>
            )}

            {!showCommentForm && canComment && (
              <button
                onClick={() => setShowCommentForm(true)}
                className="w-full py-4 bg-gray-800 text-gray-400 hover:text-white rounded-2xl transition duration-300 border border-dashed border-gray-600 hover:border-blue-500"
              >
                + Add a comment
              </button>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments && blog.comments.filter(c => c.isApproved).length > 0 ? (
                blog.comments
                  .filter(comment => comment.isApproved)
                  .map((comment) => (
                  <div key={comment._id} className="bg-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {comment.user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{comment.user.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {formatDateTime(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Delete button for comment owner or admin */}
                      {(isAuthenticated && userDetails?._id === comment.user.userId) && (
                        <button
                          onClick={() => handleCommentDelete(comment._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-4">{comment.text}</p>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCommentLike(comment._id)}
                        disabled={commentLikeLoading === comment._id}
                        className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{comment.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center transform hover:scale-105 transition duration-500">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Never Miss a Post
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Get the latest articles delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition duration-300"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium transform hover:-translate-y-1">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 transform rotate-45 mx-auto mb-4 hover:rotate-90 transition duration-300"></div>
            <h3 className="text-xl font-bold text-white mb-4">Blog3D</h3>
            <p className="text-gray-400 mb-6">Modern blogging platform for the next generation</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}