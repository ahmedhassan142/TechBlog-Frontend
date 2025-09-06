// components/admin/BlogForm.tsx
"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// Check if we're in a browser environment where FileList is available
const isBrowser = typeof window !== 'undefined';

// Define Zod schema for blog validation
const blogSchema = z.object({
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  slug: z.string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(100, { message: "Slug must be less than 100 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" }),
  content: z.string()
    .min(5, { message: "Content must be at least 5 characters" })
    .max(10000, { message: "Content must be less than 10000 characters" }),
  excerpt: z.string()
    .max(200, { message: "Excerpt must be less than 200 characters" })
    .optional()
    .or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category" }),
  subcategory: z.string().optional().or(z.literal('')),
  tags: z.string()
    .max(200, { message: "Tags must be less than 200 characters" })
    .optional()
    .or(z.literal('')),
  featuredImage: isBrowser 
    ? z.instanceof(FileList)
        .optional()
        .refine((files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, {
          message: "Image must be less than 5MB"
        })
        .refine((files) => !files || files.length === 0 || [
          'image/jpeg', 
          'image/jpg', 
          'image/png', 
          'image/gif', 
          'image/webp'
        ].includes(files[0].type), {
          message: "Only JPEG, PNG, GIF, and WebP images are allowed"
        })
        .or(z.literal(''))
    : z.any() // Fallback for server-side rendering
});

// Infer TypeScript type from Zod schema
type BlogFormData = z.infer<typeof blogSchema>;

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

interface BlogFormProps {
  blog?: any;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function BlogForm({ blog, onCancel, onSuccess }: BlogFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    blog?.featuredImage || null
  );
  const [isSlugManual, setIsSlugManual] = useState(!!blog?.slug);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || '',
      slug: blog?.slug || '',
      content: blog?.content || '',
      excerpt: blog?.excerpt || '',
      category: blog?.category?._id || '',
      subcategory: blog?.subcategory?._id || '',
      tags: blog?.tags?.join(', ') || '',
    }
  });

  const selectedCategory = watch('category');
  const featuredImage = watch('featuredImage');
  const title = watch('title');
  const slug = watch('slug');

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/categories`);
        
        if (response.data && response.data.data) {
          setCategories(response.data.data || []);
        } else {
          console.error('Error fetching categories:', response.data?.message);
          setCategories([]);
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Update subcategories when category changes
    if (selectedCategory && categories && categories.length > 0) {
      // Find the selected category
      const selectedCat = categories.find(cat => cat._id === selectedCategory);
      
      if (selectedCat && selectedCat.subcategories && selectedCat.subcategories.length > 0) {
        // Set the available subcategories
        setAvailableSubcategories(selectedCat.subcategories || []);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
    }
    
    // Clear subcategory when category changes
    setValue('subcategory', '');
  }, [selectedCategory, categories, setValue]);

  useEffect(() => {
    // Generate slug from title when title changes and slug is not manually edited
    if (title && !isSlugManual && !blog) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setValue('slug', generatedSlug);
      trigger('slug');
    }
  }, [title, isSlugManual, setValue, trigger, blog]);

  useEffect(() => {
    // Generate image preview when featured image changes
    if (featuredImage && featuredImage.length > 0) {
      const file = featuredImage[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (blog?.featuredImage) {
      setImagePreview(blog.featuredImage);
    }
  }, [featuredImage, blog]);

  const handleFormSubmit = async (data: BlogFormData) => {
    try {
      setSubmitError(null);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug);
      formData.append('content', data.content);
      formData.append('excerpt', data.excerpt || '');
      formData.append('category', data.category);
      if (data.subcategory) formData.append('subcategory', data.subcategory);
      formData.append('tags', data.tags || '');
      
      if (data.featuredImage && data.featuredImage.length > 0) {
        formData.append('featuredImage', data.featuredImage[0]);
      }
      
      // Use axios to post the form data
      const response = await axios.post('http://localhost:4001/api/blogs/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Show success message or redirect
        alert('Blog post created successfully!');
      } else {
        setSubmitError(response.data.message || 'Failed to create blog post');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while submitting the form'
      );
    }
  };

  // Flatten categories for display in select (with indentation for hierarchy)
  const flattenCategories = (cats: Category[], level = 0): Category[] => {
    let result: Category[] = [];
    
    cats.forEach(cat => {
      result.push({
        ...cat,
        name: `${'— '.repeat(level)}${cat.name}`
      });
      
      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(flattenCategories(cat.subcategories as Category[], level + 1));
      }
    });
    
    return result;
  };

  const flattenedCategories = flattenCategories(categories);

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex justify-center items-center h-64">
        <div className="text-white">Loading categories...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
          {submitError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            {...register('title')}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
            Slug *
          </label>
          <input
            id="slug"
            {...register('slug')}
            onFocus={() => setIsSlugManual(true)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="URL-friendly identifier"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            This will be used in the URL. Only lowercase letters, numbers, and hyphens are allowed.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Category *
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a category</option>
            {flattenedCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-300 mb-1">
            Subcategory
          </label>
          <select
            id="subcategory"
            {...register('subcategory')}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={availableSubcategories.length === 0}
          >
            <option value="">Select a subcategory (optional)</option>
            {availableSubcategories.map((subcat) => (
              <option key={subcat._id} value={subcat._id}>
                {subcat.name}
              </option>
            ))}
          </select>
          {availableSubcategories.length === 0 && selectedCategory && (
            <p className="text-xs text-gray-400 mt-1">No subcategories available for this category</p>
          )}
          {errors.subcategory && (
            <p className="mt-1 text-sm text-red-400">{errors.subcategory.message}</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-1">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          {...register('excerpt')}
          rows={2}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter brief excerpt (optional)"
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-400">{errors.excerpt.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
          Content *
        </label>
        <textarea
          id="content"
          {...register('content')}
          rows={8}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Write your blog content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
          Tags
        </label>
        <input
          id="tags"
          {...register('tags')}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter tags separated by commas (optional)"
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-400">{errors.tags.message}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300 mb-1">
          Featured Image
        </label>
        <input
          type="file"
          id="featuredImage"
          {...register('featuredImage')}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        />
        {errors.featuredImage && (
          //@ts-ignore
          <p className="mt-1 text-sm text-red-400">{errors.featuredImage.message}</p>
        )}
        
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-2">Image Preview:</p>
            <img 
              src={imagePreview} 
              alt="Featured preview" 
              className="max-w-full h-auto max-h-48 rounded-md"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (blog ? 'Update' : 'Create')} Post
        </button>
      </div>
    </form>
  );
}