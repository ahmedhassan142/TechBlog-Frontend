"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentslug: string;
  filters: string[];
  subcategories: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  parentslug: string;
  filters: string[];
  subcategories?: Subcategory[];
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  category: string;
  subcategory: string;
   featuredImage?: string;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
}

export default function CategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const categoryslug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch category details
      const categoryResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/categories/slug/${categoryslug}`);
      
      if (categoryResponse.data.success) {
        const categoryData = categoryResponse.data.data;
        setCategory(categoryData);
        
        // Fetch blog posts for this category using the provided API
        try {
          const blogResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/blogs/categories/${categoryslug}/blogs`
          );
          
          console.log('Blog API response:', blogResponse.data); // Debug log
          
          // Check the correct response structure
          if (blogResponse.data && blogResponse.data.success) {
            // Data is in blogResponse.data.data
            setBlogPosts(blogResponse.data.data || []);
          } else if (Array.isArray(blogResponse.data)) {
            // Fallback: if response is directly an array
            setBlogPosts(blogResponse.data);
          } else {
            console.warn('Unexpected blog response format:', blogResponse.data);
            setBlogPosts([]);
          }
        } catch (blogError: any) {
          console.warn('Error fetching blog posts:', blogError);
          // Continue even if blog posts fail to load
          setBlogPosts([]);
        }
      } else {
        setError('Category not found');
      }
    } catch (error: any) {
      console.error('Error fetching category:', error);
      setError(error.response?.data?.message || 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (categoryslug) {
      fetchCategoryData();
    }
  }, [categoryslug]); 

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate read time based on content length (fallback)
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading category...</p>
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
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
        <title>{category.name} | Blog3D</title>
        <meta name="description" content={`Explore ${category.name} articles and tutorials`} />
      </Head>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex space-x-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition duration-300">Home</Link>
          <span className="text-gray-600">/</span>
          <span className="text-white">{category.name}</span>
        </nav>
      </div>

      {/* Category Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            {category.name}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our latest articles and tutorials in {category.name}
          </p>
          {blogPosts.length > 0 && (
            <p className="text-gray-500 mt-2">
              {blogPosts.length} article{blogPosts.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </section>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-white mb-6">Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory._id}
                href={`/category/${category.slug}/${subcategory.slug}`}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition duration-300">
                  {subcategory.name}
                </h3>
                <p className="text-gray-400 mt-2">
                  Explore {subcategory.name} content
                </p>
                <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition duration-300">
                  <span>View Articles</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
          {blogPosts.length > 0 && (
            <span className="text-gray-400">{blogPosts.length} article{blogPosts.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const readTime = post.readTime || calculateReadTime(post.description || post.excerpt);
              const postDate = post.createdAt || post.updatedAt;
              
              return (
                <article key={post._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-700">
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-cyan-700 group-hover:scale-105 transition duration-300 flex items-center justify-center">
                      {post. featuredImage ? (
                        <img 
                          src={post. featuredImage} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-lg font-semibold">Blog3D</div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      {postDate && (
                        <>
                          <span>{formatDate(postDate)}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      <span>{readTime} min read</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt || post.description?.substring(0, 150)}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/Blog/${post.slug}`}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition duration-300 font-medium"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No articles found in this category yet.</div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6"></div>
            <p className="text-gray-500">Check back soon for new content!</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center border border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated with {category.name}
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Get the latest articles and tutorials delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-300 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 transform rotate-45 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-4">Blog3D</h3>
            <p className="text-gray-400 mb-6">Modern blogging platform for the next generation</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
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