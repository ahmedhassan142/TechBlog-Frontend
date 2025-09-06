"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// Define Zod schema for category validation
const categorySchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9\s\-&]+$/, { 
      message: "Name can only contain letters, numbers, spaces, hyphens, and ampersands" 
    }),
  slug: z.string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9\-]+$/, { 
      message: "Slug can only contain lowercase letters, numbers, and hyphens" 
    }),
  parentslug: z.string().optional().or(z.literal('')),
  filters: z.array(z.string()).optional().default([])
});

// Infer TypeScript type from Zod schema
type CategoryFormData = z.infer<typeof categorySchema>;

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

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersInput, setFiltersInput] = useState(category?.filters?.join(', ') || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CategoryFormData>({
    //@ts-ignore
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      parentslug: category?.parentslug || '',
      filters: category?.filters || [],
    }
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/categories`);
        setCategories(response.data.data || []);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedParentSlug = watch('parentslug');

  // Filter out the current category from parent options
  const availableParents = categories.filter(cat => 
    !category || cat._id !== category._id
  );

  // Flatten categories for dropdown (including subcategories)
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

  const handleFormSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (category) {
        // Update existing category
        const response = await axios.patch(`http://localhost:4001/api/categories/${category._id}`, data);
        console.log('Category updated:', response.data);
      } else {
        // Create new category
        const response = await axios.post('http://localhost:4001/api/categories/add', data);
        console.log('Category created:', response.data);
      }
      
      onSubmit(data);
    } catch (error: any) {
      console.error('Error saving category:', error);
      
      if (error.response) {
        setError(error.response.data.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    
    if (confirm('Are you sure you want to delete this category? All subcategories will become top-level categories.')) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.delete(`http://localhost:4001/api/categories/${category._id}`);
        console.log('Category deleted:', response.data);
        
        // Call onCancel to close the form after successful deletion
        onCancel();
      } catch (error: any) {
        console.error('Error deleting category:', error);
        
        if (error.response) {
          setError(error.response.data.message || `Error: ${error.response.status}`);
        } else if (error.request) {
          setError('No response from server. Please check if the server is running.');
        } else {
          setError(error.message || 'An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Update filters array when input changes
  const handleFiltersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFiltersInput(value);
    const filtersArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setValue('filters', filtersArray);
  };

  return (
    //@ts-ignore
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        {category ? 'Edit Category' : 'Add New Category'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Category Name *
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter category name"
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
          Category Slug *
        </label>
        <input
          id="slug"
          {...register('slug')}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter category slug"
          disabled={loading}
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="parentslug" className="block text-sm font-medium text-gray-300 mb-1">
          Parent Category Slug
        </label>
        <select
          id="parentslug"
          {...register('parentslug')}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading || fetchLoading}
        >
          <option value="">None (Top Level Category)</option>
          {flattenedCategories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name} ({cat.slug})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Select a parent category to create a hierarchy.
        </p>
        {fetchLoading && (
          <p className="text-xs text-gray-400 mt-1">Loading categories...</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="filters" className="block text-sm font-medium text-gray-300 mb-1">
          Filters (comma separated)
        </label>
        <input
          id="filters"
          type="text"
          value={filtersInput}
          onChange={handleFiltersChange}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="filter1, filter2, filter3"
          disabled={loading}
        />
        <p className="text-xs text-gray-400 mt-1">
          Enter filters separated by commas.
        </p>
      </div>
      
      <div className="flex justify-end space-x-3">
        {category && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            disabled={loading}
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : (category ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}