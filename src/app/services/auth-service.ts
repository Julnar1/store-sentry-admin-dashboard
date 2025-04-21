import { BaseService } from "./base-service";

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
    avatar: string;
  };
}

export class AuthService extends BaseService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(this.getUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return await response.json();
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }
}