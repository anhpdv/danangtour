import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClonedPage } from '@/components/ClonedPage';
import { getPageBySlug, getAllSlugs } from '@/lib/content';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function buildSlug(segments: string[] | undefined, id?: string): string {
  if (!segments || segments.length === 0) return 'home';
  const base = segments.join('-');
  return id ? `${base}--id-${id}` : base;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => {
    if (slug === 'home') return { slug: undefined };
    const idMatch = slug.match(/--id-(\d+)$/);
    const base = idMatch ? slug.replace(/--id-\d+$/, '') : slug;
    return { slug: base.split('-') };
  });
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const id = typeof sp.id === 'string' ? sp.id : undefined;
  const resolved = buildSlug(slug, id);
  const page = await getPageBySlug(resolved);
  if (!page) return { title: 'Not Found' };
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const id = typeof sp.id === 'string' ? sp.id : undefined;
  const resolved = buildSlug(slug, id);

  let page = await getPageBySlug(resolved);

  if (!page && slug) {
    const alt = slug.join('-');
    page = await getPageBySlug(alt);
  }

  if (!page) notFound();

  return (
    <ClonedPage
      headerHtml={page.headerHtml}
      mainHtml={page.mainHtml}
      footerHtml={page.footerHtml}
    />
  );
}
