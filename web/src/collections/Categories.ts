import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    description: 'Danh mục — thay thế WordPress Categories',
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'wpId', type: 'number', admin: { description: 'ID gốc từ WordPress (?id=)' } },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
    },
    { name: 'icon', type: 'upload', relationTo: 'media' },
  ],
};
