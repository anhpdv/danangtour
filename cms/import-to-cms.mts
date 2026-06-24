import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { getPayload } from 'payload';
import config from '../src/payload.config.js';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');

async function importContent() {
  const payload = await getPayload({ config });
  const files = await readdir(CONTENT_DIR);
  let imported = 0;

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await readFile(path.join(CONTENT_DIR, file), 'utf8');
    const page = JSON.parse(raw);

    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    });

    const data = {
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      ogImage: page.ogImage || '',
      locale: page.locale || 'vi',
      mainHtml: page.mainHtml || '',
      headerHtml: page.headerHtml || '',
      footerHtml: page.footerHtml || '',
      sourceUrl: page.url,
      images: page.images || [],
      _status: 'published' as const,
    };

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data });
    } else {
      await payload.create({ collection: 'pages', data });
    }
    imported++;
    console.log(`Imported: ${page.slug}`);
  }

  const categories = [
    { name: 'Về Đà Nẵng', slug: 've-da-nang', wpId: 145 },
    { name: 'Xem và làm gì', slug: 'xem-va-lam-gi', wpId: 12877 },
    { name: 'Lễ hội & sự kiện', slug: 'le-hoi-su-kien', wpId: 12925 },
    { name: 'Ăn uống', slug: 'an-uong', wpId: 12933 },
    { name: 'Mua sắm', slug: 'mua-sam', wpId: 199 },
    { name: 'Khám phá', slug: 'kham-pha', wpId: 173 },
    { name: 'Nơi ở', slug: 'noi-o', wpId: 12951 },
    { name: 'Ưu đãi', slug: 'uu-dai', wpId: 175 },
    { name: 'Tin tức', slug: 'tin-tuc', wpId: 167 },
    { name: 'Thông tin cần thiết', slug: 'thong-tin-can-thiet', wpId: 1070 },
  ];

  for (const cat of categories) {
    const exists = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    if (exists.docs.length === 0) {
      await payload.create({ collection: 'categories', data: cat });
      console.log(`Category: ${cat.name}`);
    }
  }

  console.log(`\nDone: ${imported} pages imported to Payload CMS`);
  process.exit(0);
}

importContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
