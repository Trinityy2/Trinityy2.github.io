// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role?: UserRole;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface UserProfile {
  id: number;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: MediaFile;
  website?: string;
  location?: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

// Authentication Types
export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
  refreshToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Content Types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  categories: Category[];
  tags: Tag[];
  featuredImage?: MediaFile;
  readingTime?: number;
  published: boolean;
  featured: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  technologies: Technology[];
  githubUrl?: string;
  liveUrl?: string;
  images: MediaFile[];
  featured: boolean;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export interface Technology {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  category: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Media and File Types
export interface MediaFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: MediaFormat[];
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: Pagination;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: Pagination;
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

// Error Types
export interface ApiError {
  status: number;
  name: string;
  message: string;
  details?: any;
}

// Contact and Communication Types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string;
}

// Analytics Types
export interface PageView {
  id: number;
  path: string;
  title: string;
  userAgent?: string;
  referrer?: string;
  timestamp: string;
}

export interface SiteStats {
  totalViews: number;
  uniqueVisitors: number;
  popularPages: Array<{
    path: string;
    views: number;
  }>;
  recentActivity: PageView[];
}

// Configuration Types
export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  authorEmail: string;
  socialLinks: SocialLink[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  features: {
    blog: boolean;
    projects: boolean;
    contact: boolean;
    newsletter: boolean;
    analytics: boolean;
  };
}

// Storage Types
export interface StorageConfig {
  provider: 'local' | 's3' | 'cloudflare_r2';
  baseUrl: string;
  basePath?: string;
  bucket?: string;
  region?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}