import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'locale', 'updatedAt'],
    description: 'Trang tĩnh — thay thế WordPress Pages',
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug, ví dụ: category-an-uong--id-12933' },
    },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'ogImage', type: 'text' },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'English', value: 'en' },
        { label: '日本語', value: 'ja' },
        { label: '한국어', value: 'ko' },
        { label: '中文', value: 'zh' },
      ],
      defaultValue: 'vi',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'mainHtml',
      type: 'code',
      admin: { language: 'html', description: 'Nội dung HTML chính (clone từ site gốc)' },
    },
    {
      name: 'headerHtml',
      type: 'code',
      admin: { language: 'html' },
    },
    {
      name: 'footerHtml',
      type: 'code',
      admin: { language: 'html' },
    },
    { name: 'sourceUrl', type: 'text', admin: { readOnly: true } },
    { name: 'images', type: 'json' },
  ],
};
