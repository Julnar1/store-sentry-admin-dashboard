import { BaseService } from "./base-service";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: { 
    id: number;
    name?: string;
    image?:string;
  };
  categoryId?: number;
}
interface NewProduct extends Omit<Product, 'id'> {
    categoryId: number;
  }

export class ProductService extends BaseService {
    static async getProducts(limit: number = 0, offset: number = 0): Promise<Product[]> {
        try {
          const queryParams = limit > 0 ? `?limit=${limit}&offset=${offset}` : '';
          const response = await fetch(this.getUrl(`/products${queryParams}`));
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
      }
    
      static async getProductById(id: number): Promise<Product> {
        try {
          const response = await fetch(this.getUrl(`/products/${id}`));
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.error("Error fetching product by ID:", error);
          throw error;
        }
      }

      static async createProduct(product: NewProduct): Promise<Product> {
    try {
      const response = await fetch(this.getUrl('/products'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(product: Product): Promise<Product> {
    try {
      console.log('Updating product with data:', product);
      
      // Ensure we're sending the correct data format
      const productData = {
        ...product,
        categoryId: product.category.id
      };
      
      // Log the exact data being sent to the API
      console.log('Sending to API:', JSON.stringify(productData));
      
      const response = await fetch(this.getUrl(`/products/${product.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Update product error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
      }

      const updatedProduct = await response.json();
      console.log('Product updated successfully:', updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: number): Promise<void> {
    try {
      const response = await fetch(this.getUrl(`/products/${productId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}