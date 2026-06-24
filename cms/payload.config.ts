import path from 'path';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Danang Tour CMS',
    },
  },
  collections: [Users, Pages, Posts, Categories, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'danang-tour-dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./cms.db',
    },
  }),
  sharp,
  localization: {
    locales: [
      { label: 'Tiếng Việt', code: 'vi' },
      { label: 'English', code: 'en' },
      { label: '日本語', code: 'ja' },
      { label: '한국어', code: 'ko' },
      { label: '中文', code: 'zh' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
});
