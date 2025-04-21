import { BaseService } from "./base-service";

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
  avatar: string;
}

export class UserService extends BaseService {
  static async getUsers(accessToken: string): Promise<User[]> {
    try {
      const response = await fetch(this.getUrl('/users'), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserProfile(accessToken: string): Promise<User> {
    try {
      const response = await fetch(this.getUrl('/auth/profile'), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}