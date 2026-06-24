import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cổng thông tin du lịch thành phố Đà Nẵng - Danang Fantasticity',
  description:
    'Đắm chìm trong một thành phố với thiên nhiên tuyệt đẹp, lễ hội đầy màu sắc, và các dịch vụ có giá trị.',
  icons: {
    icon: 'https://danangfantasticity.com/wp-content/uploads/2018/04/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/css/0-6_1l6ej4y--.css" />
        <link rel="stylesheet" href="/css/0a.v0xn~wx2i~.css" />
        <link rel="stylesheet" href="/css/0dx4r2zarx.dp.css" />
        <link rel="stylesheet" href="/css/11.8l55wey6qq.css" />
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
