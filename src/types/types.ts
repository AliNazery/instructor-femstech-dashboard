export type Course = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  language: string;
  level: string;
  price?: number;
  is_published: boolean;
  published_at?: string | null;
  category_name: string;
};


export type Assignment = {
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  expiration_date: string;
};


export type Student = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string; 
  bio?: string;
  avatar_url: string;
  phone: string;
  address: string;
  status: "active" | "inactive" | "suspended";
};