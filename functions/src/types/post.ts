import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: number | Timestamp | null;
  updatedAt: number | Timestamp | null;
  banner: string;
  caption: string;
  category: Array<Option>;
  tags: Array<Option>;
  publishedAt?: number | Timestamp | null;
  firstPublishedAt?: number | Timestamp | null;
  scheduledAt?: number | Timestamp | null;
  archivedAt?: number | Timestamp | null;
  status: PostStatus;
  meta: Meta;
}

export interface PostInput {
  title: string;
  content: string;
  author: string;
  banner: string;
  caption: string;
  category: Array<Option>;
  tags: Array<Option>;
  scheduledAt?: string | null;
  status: PostStatus;
  meta: Meta;
}

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface Meta {
  slug: string;
  title?: string;
  url: string;
  author: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  publishedAt?: number | Timestamp | null;
  updatedAt?: number | Timestamp | null;
  keywords?: Array<string>;
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
  createdAt: admin.firestore.Timestamp | null;
  updatedAt: admin.firestore.Timestamp | null;
  banner: string;
  caption: string;
  category: Array<Option>;
  tags: Array<Option>;
  publishedAt?: admin.firestore.Timestamp | null;
  firstPublishedAt?: admin.firestore.Timestamp | null;
  scheduledAt?: admin.firestore.Timestamp | null;
  archivedAt?: admin.firestore.Timestamp | null;
  status: PostStatus;
  meta: MetaAPI;
}

export interface MetaAPI {
  slug: string;
  title?: string;
  url: string;
  author: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  publishedAt?: admin.firestore.Timestamp | null;
  updatedAt?: admin.firestore.Timestamp | null;
}
