import { BaseService } from "./base-service";

export interface Category {
  id: number;
  name: string;
  image: string;
}

export class CategoryService extends BaseService {
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(this.getUrl("/categories"));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const response = await fetch(this.getUrl('/categories'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  static async updateCategory(category: Category): Promise<Category> {
    try {
      const response = await fetch(this.getUrl(`/categories/${category.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async deleteCategory(categoryId: number): Promise<void> {
    try {
      console.log(`Attempting to delete category with ID: ${categoryId}`);
      const response = await fetch(this.getUrl(`/categories/${categoryId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Failed to delete category: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Delete category error details:', errorData);
          
          // Check for specific error messages from the API
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (response.status === 400) {
            errorMessage = "This category cannot be deleted because it has associated products. Please remove or reassign all products in this category first.";
          } else if (response.status === 403) {
            errorMessage = "You don't have permission to delete this category. Only admin users can delete categories.";
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
