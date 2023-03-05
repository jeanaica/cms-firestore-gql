import * as admin from 'firebase-admin';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  banner: string;
  category: Array<Option>;
  tags: Array<Option>;
  publishedAt?: number;
  scheduledAt?: number;
  archivedAt?: number;
  status: PostStatus;
  meta: Meta;
}

enum PostStatus {
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
}

export interface Meta {
  slug: string;
  author: string;
  publishedAt: number;
  url: string;
  image?: string;
  description?: string;
  title?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface PostAPI {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  banner: string;
  category: Array<Option>;
  tags: Array<Option>;
  publishedAt?: admin.firestore.Timestamp;
  scheduledAt?: admin.firestore.Timestamp;
  archivedAt?: admin.firestore.Timestamp;
  status: PostStatus;
  meta: MetaAPI;
}

export interface MetaAPI {
  slug: string;
  author: string;
  publishedAt: admin.firestore.Timestamp;
  url: string;
  image?: string;
  description?: string;
  title?: string;
}
