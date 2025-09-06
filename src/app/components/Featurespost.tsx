"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiCalendar, FiArrowRight } from 'react-icons/fi';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  views: number;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
}

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4001/api/blogs/top-views?limit=4');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.data);
        } else {
          setError('Failed to fetch featured posts');
        }
      } catch (err) {
        setError('An error occurred while fetching posts');
        console.error('Error fetching featured posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  if (loading) {
    return (
      <section className="featured-posts-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="featured-posts-title text-3xl font-extrabold">Featured Posts</h2>
            <p className="featured-posts-subtitle mt-4 text-xl">Most popular articles on our blog</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="featured-post-card rounded-lg overflow-hidden">
                <div className="featured-posts-loading h-48"></div>
                <div className="p-6">
                  <div className="featured-posts-loading h-6 rounded mb-4"></div>
                  <div className="featured-posts-loading h-4 rounded mb-2"></div>
                  <div className="featured-posts-loading h-4 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-posts-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="featured-posts-error rounded-lg p-8 mb-6">
            <div className="text-red-400 text-lg mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button px-6 py-2 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="featured-posts-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="featured-posts-title text-3xl font-extrabold mb-4">Featured Posts</h2>
          <p className="featured-posts-subtitle text-xl">No featured posts available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-posts-section py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="featured-posts-title text-3xl font-extrabold">Featured Posts</h2>
          <p className="featured-posts-subtitle mt-4 text-xl">Most popular articles on our blog</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 featured-posts-grid">
          {posts.map((post) => (
            <article key={post._id} className="featured-post-card rounded-lg overflow-hidden group">
              <div className="relative h-48 w-full overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="featured-post-image object-cover"
                  />
                ) : (
                  <div className="featured-post-placeholder w-full h-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">Blog3D</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="featured-post-meta flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center">
                    <FiEye className="mr-1" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h3 className="featured-post-title text-xl font-semibold mb-3">
                  {post.title}
                </h3>
                
                <p className="featured-post-excerpt mb-4">
                  {post.excerpt || 'No excerpt available...'}
                </p>
                
                <Link
                  href={`/Blog/${post.slug}`}
                  className="featured-post-link inline-flex items-center font-medium"
                >
                  Read More
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="view-all-button inline-flex items-center px-6 py-3 text-white font-medium rounded-md"
          >
            View All Posts
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}