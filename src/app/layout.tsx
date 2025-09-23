// path: src/app/layout.tsx
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { ReactNode } from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import UnifiedNavigation from '@/components/UnifiedNavigation';

export const metadata: Metadata = {
  title: 'AI 아동발달 평가서 생성기',
  description:
    '2024 개정 표준보육과정 기반 전문가 수준의 아동발달 평가서를 AI로 간편하게 생성하세요',
  keywords: ['아동발달', '평가서', 'AI', '표준보육과정', '누리과정', '보육교사'],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <MantineProvider
          theme={{
            primaryColor: 'indigo',
            defaultRadius: 'md',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            headings: {
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            },
          }}
        >
          <Notifications position="top-right" zIndex={1000} />
          <UnifiedNavigation />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </MantineProvider>
        <Analytics />
      </body>
    </html>
  );
}
