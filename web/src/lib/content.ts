import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { getPayload } from 'payload';
import config from '@payload-config';

export interface PageContent {
  slug: string;
  url: string;
  title: string;
  description: string;
  ogImage: string;
  locale: string;
  headerHtml: string;
  footerHtml: string;
  mainHtml: string;
  images: string[];
  crawledAt?: string;
}

export interface PageIndex {
  slug: string;
  url: string;
  title: string;
  locale: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');

async function getPageFromJson(slug: string): Promise<PageContent | null> {
  try {
    const file = path.join(CONTENT_DIR, `${slug}.json`);
    const raw = await readFile(file, 'utf8');
    return JSON.parse(raw) as PageContent;
  } catch {
    return null;
  }
}

async function getPageFromPayload(slug: string): Promise<PageContent | null> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });

    const doc = result.docs[0];
    if (!doc) return null;

    return {
      slug: doc.slug as string,
      url: (doc.sourceUrl as string) || '',
      title: typeof doc.title === 'string' ? doc.title : String(doc.title ?? ''),
      description: (doc.description as string) || '',
      ogImage: (doc.ogImage as string) || '',
      locale: (doc.locale as string) || 'vi',
      headerHtml: (doc.headerHtml as string) || '',
      footerHtml: (doc.footerHtml as string) || '',
      mainHtml: (doc.mainHtml as string) || '',
      images: (doc.images as string[]) || [],
    };
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  const fromCms = await getPageFromPayload(slug);
  if (fromCms) return fromCms;
  return getPageFromJson(slug);
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'pages',
      limit: 500,
      depth: 0,
      select: { slug: true },
    });
    if (result.docs.length > 0) {
      return result.docs.map((d) => d.slug as string);
    }
  } catch {}

  try {
    const files = await readdir(CONTENT_DIR);
    return files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  } catch {
    return [];
  }
}

export async function getPageIndex(): Promise<PageIndex[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'pages',
      limit: 500,
      depth: 0,
      select: { slug: true, title: true, sourceUrl: true, locale: true },
    });
    if (result.docs.length > 0) {
      return result.docs.map((d) => ({
        slug: d.slug as string,
        url: (d.sourceUrl as string) || '',
        title: typeof d.title === 'string' ? d.title : String(d.title ?? ''),
        locale: (d.locale as string) || 'vi',
      }));
    }
  } catch {}

  try {
    const raw = await readFile(path.join(process.cwd(), 'content', 'index.json'), 'utf8');
    const data = JSON.parse(raw);
    return data.pages || [];
  } catch {
    return [];
  }
}

export function slugFromPath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return 'home';
  return segments.join('-');
}

export async function resolveSlug(segments: string[] | undefined): Promise<string | null> {
  const direct = slugFromPath(segments);
  const page = await getPageBySlug(direct);
  if (page) return direct;

  const allSlugs = await getAllSlugs();
  const joined = segments?.join('/') || '';

  const match = allSlugs.find((s) => {
    const normalized = s.replace(/--id-\d+$/, '').replace(/-/g, '/');
    return normalized === joined || s === joined.replace(/\//g, '-');
  });
  return match || null;
}
