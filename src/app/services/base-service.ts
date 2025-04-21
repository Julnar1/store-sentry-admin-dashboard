export abstract class BaseService {
    protected static API_URL = "https://api.escuelajs.co/api/v1"; // Updated API URL
  
    protected static getUrl(path: string): string {
      return `${this.API_URL}${path}`;
    }
}