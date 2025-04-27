
import { User } from '@/types';

export interface ProfileData {
  id: string;
  name: string | null;
  role: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  avatar_url: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: {name?: string, email?: string, avatar_url?: string}) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
