import Script from 'next/script';

interface ClonedPageProps {
  headerHtml?: string;
  mainHtml: string;
  footerHtml?: string;
}

export function ClonedPage({ headerHtml, mainHtml, footerHtml }: ClonedPageProps) {
  return (
    <>
      {headerHtml && (
        <div id="site-header" dangerouslySetInnerHTML={{ __html: headerHtml }} />
      )}
      <div id="site-main" dangerouslySetInnerHTML={{ __html: mainHtml }} />
      {footerHtml && (
        <div id="site-footer" dangerouslySetInnerHTML={{ __html: footerHtml }} />
      )}
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
