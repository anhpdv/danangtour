import type { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'updatedAt'],
    description: 'Bài viết — thay thế WordPress Posts',
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'sourceUrl', type: 'text', admin: { readOnly: true } },
    {
      name: 'legacyHtml',
      type: 'code',
      admin: { language: 'html', description: 'HTML gốc từ crawl (backup)' },
    },
  ],
};
