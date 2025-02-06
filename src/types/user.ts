export interface User {
  uid: string;
  email: string;
  isAuthenticated: boolean;
  lastLogin: Date;
  role: 'admin' | 'user';
}

export interface UserDocument {
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin: Date;
  status: 'active' | 'inactive';
  displayName?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}