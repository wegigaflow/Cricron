// User interface definition
export interface User {
  username: string;
  isAuthenticated: boolean;
  lastLogin?: Date;
}

// Authentication context type definition
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Login form data interface
export interface LoginFormData {
  username: string;
  password: string;
}

// API response interfaces
export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}