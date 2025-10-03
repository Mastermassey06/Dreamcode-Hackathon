export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface WaterReport {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  category: 'pollution' | 'algae' | 'debris' | 'other';
  description: string;
  image_url?: string;
  created_at: string;
  status: 'pending' | 'verified' | 'resolved';
}

export interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  content: string;
  created_at: string;
}